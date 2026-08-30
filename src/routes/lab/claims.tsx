import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ClaimBadge, EmptyState, PageHeader, errMessage, jsonStringField } from "@/components/lab/bits";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addContradiction, createClaim, listClaims, listCases, supersedeClaim } from "@/lib/lab/api";
import { EPISTEMIC_STATUSES, type EpistemicStatus } from "@/lib/lab/types";

export const Route = createFileRoute("/lab/claims")({ component: ClaimsPage });

function ClaimsPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["claims"], queryFn: () => listClaims() });
  const cases = useQuery({ queryKey: ["cases"], queryFn: () => listCases() });
  const [open, setOpen] = useState(false);
  const [contraOpen, setContraOpen] = useState(false);
  const [key, setKey] = useState("");
  const [statement, setStatement] = useState("");
  const [status, setStatus] = useState<EpistemicStatus>("HYPOTHESIS");
  const [scope, setScope] = useState("this case only");
  const [caseId, setCaseId] = useState("");
  const [superId, setSuperId] = useState<string | null>(null);
  const [newStatement, setNewStatement] = useState("");
  const [rationale, setRationale] = useState("");
  const [claimA, setClaimA] = useState("");
  const [claimB, setClaimB] = useState("");
  const [contraRationale, setContraRationale] = useState("");

  const create = useMutation({
    mutationFn: () =>
      createClaim({
        data: { claimKey: key, statement, epistemicStatus: status, scope, caseId: caseId || null },
      }),
    onSuccess: () => {
      toast.success("Claim recorded.");
      setOpen(false);
      setKey("");
      setStatement("");
      void qc.invalidateQueries({ queryKey: ["claims"] });
      void qc.invalidateQueries({ queryKey: ["overview"] });
    },
    onError: (e) => toast.error(errMessage(e)),
  });

  const supersede = useMutation({
    mutationFn: () =>
      supersedeClaim({ data: { id: superId!, newStatement, rationale } }),
    onSuccess: () => {
      toast.success("Prior claim retained as SUPERSEDED.");
      setSuperId(null);
      void qc.invalidateQueries({ queryKey: ["claims"] });
    },
    onError: (e) => toast.error(errMessage(e)),
  });

  const contra = useMutation({
    mutationFn: () =>
      addContradiction({ data: { claimA, claimB, rationale: contraRationale } }),
    onSuccess: () => {
      toast.success("Contradiction recorded. Neither claim was erased.");
      setContraOpen(false);
      void qc.invalidateQueries({ queryKey: ["claims"] });
    },
    onError: (e) => toast.error(errMessage(e)),
  });

  return (
    <div>
      <PageHeader
        kicker="Epistemic ledger"
        title="Claims"
        description="Status is explicit. Contradictions are recorded, not resolved by deletion. Supersession keeps history."
        actions={
          <>
            <Button variant="outline" onClick={() => setContraOpen(true)}>
              Record contradiction
            </Button>
            <Button onClick={() => setOpen(true)}>New claim</Button>
          </>
        }
      />

      {q.isPending ? (
        <div className="h-40 animate-pulse rounded-xl bg-secondary" />
      ) : q.isError ? (
        <EmptyState title="Could not load claims" body={errMessage(q.error)} />
      ) : q.data.claims.length === 0 ? (
        <EmptyState
          title="No claims"
          body="A claim is a scoped statement with an epistemic status. Bounded evidence cannot become universal."
          action={<Button onClick={() => setOpen(true)}>New claim</Button>}
        />
      ) : (
        <>
          <ul className="space-y-3">
            {q.data.claims.map((c) => (
              <li key={c.id} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-[11px] text-steel">{c.claimKey}</p>
                  <ClaimBadge status={c.epistemicStatus} />
                </div>
                <p className="mt-2 text-sm text-paper">{c.statement}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  scope: {jsonStringField(c.scope, "text") ?? JSON.stringify(c.scope)}
                </p>
                {c.epistemicStatus !== "SUPERSEDED" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    onClick={() => {
                      setSuperId(c.id);
                      setNewStatement("");
                      setRationale("");
                    }}
                  >
                    Supersede
                  </Button>
                ) : (
                  <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                    superseded by {c.supersededBy}
                  </p>
                )}
              </li>
            ))}
          </ul>
          {q.data.contradictions.length > 0 ? (
            <section className="mt-8">
              <h2 className="font-display text-xl text-paper">Contradictions</h2>
              <ul className="mt-3 space-y-3">
                {q.data.contradictions.map((c) => (
                  <li key={c.id} className="rounded-xl bg-card p-4 text-sm shadow-[var(--shadow-border)]">
                    <p className="font-mono text-[11px] text-steel">
                      {c.claimA} ⊥ {c.claimB}
                    </p>
                    <p className="mt-1 text-muted-foreground">{c.rationale}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record a claim</DialogTitle>
            <DialogDescription>Scope is mandatory. Status is not inferred.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="ck">Key</Label>
                <Input id="ck" className="font-mono text-xs" value={key} onChange={(e) => setKey(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="st">Status</Label>
                <select
                  id="st"
                  className="flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EpistemicStatus)}
                >
                  {EPISTEMIC_STATUSES.filter((s) => s !== "SUPERSEDED").map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cs">Case (optional)</Label>
              <select
                id="cs"
                className="flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
              >
                <option value="">Unlinked</option>
                {cases.data?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stm">Statement</Label>
              <Textarea id="stm" value={statement} onChange={(e) => setStatement(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sc">Scope</Label>
              <Textarea id="sc" value={scope} onChange={(e) => setScope(e.target.value)} required />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={create.isPending}>
                Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(superId)} onOpenChange={(v) => !v && setSuperId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supersede claim</DialogTitle>
            <DialogDescription>The prior claim is retained with status SUPERSEDED.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              supersede.mutate();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="ns">New statement</Label>
              <Textarea id="ns" value={newStatement} onChange={(e) => setNewStatement(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ra">Rationale</Label>
              <Textarea id="ra" value={rationale} onChange={(e) => setRationale(e.target.value)} required />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={supersede.isPending}>
                Supersede
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={contraOpen} onOpenChange={setContraOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record a contradiction</DialogTitle>
            <DialogDescription>Neither claim is erased.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              contra.mutate();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="ca">Claim A</Label>
              <select
                id="ca"
                className="flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm"
                value={claimA}
                onChange={(e) => setClaimA(e.target.value)}
                required
              >
                <option value="">Select</option>
                {q.data?.claims.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.claimKey}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cb">Claim B</Label>
              <select
                id="cb"
                className="flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm"
                value={claimB}
                onChange={(e) => setClaimB(e.target.value)}
                required
              >
                <option value="">Select</option>
                {q.data?.claims.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.claimKey}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cr">Rationale</Label>
              <Textarea id="cr" value={contraRationale} onChange={(e) => setContraRationale(e.target.value)} required />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={contra.isPending}>
                Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
