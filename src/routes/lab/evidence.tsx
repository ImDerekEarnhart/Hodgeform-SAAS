import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState, HashChip, PageHeader, errMessage, jsonStringField } from "@/components/lab/bits";
import { Badge } from "@/components/ui/badge";
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
import { createEvidence, listEvidence, verifyEvidence } from "@/lib/lab/api";
import { ELIGIBILITY_POLICY } from "@/lib/lab/eligibility";
import type { EvidenceOutcome, IndependenceLevel, SourceKind } from "@/lib/lab/types";
import { EVIDENCE_OUTCOMES, INDEPENDENCE_LEVELS, SOURCE_KINDS } from "@/lib/lab/types";

export const Route = createFileRoute("/lab/evidence")({ component: EvidencePage });

function EvidencePage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["evidence"], queryFn: () => listEvidence() });
  const [open, setOpen] = useState(false);
  const [sourceKind, setSourceKind] = useState<SourceKind>("DISCOVERY_RUN");
  const [domain, setDomain] = useState("");
  const [outcome, setOutcome] = useState<EvidenceOutcome>("inconclusive");
  const [independence, setIndependence] = useState<IndependenceLevel>("same_case");
  const [body, setBody] = useState("");
  const [verifyId, setVerifyId] = useState<string | null>(null);

  const create = useMutation({
    mutationFn: () =>
      createEvidence({
        data: {
          sourceKind,
          domain,
          outcome,
          independenceLevel: independence,
          body,
        },
      }),
    onSuccess: (r) => {
      toast.success("Receipt appended.");
      setOpen(false);
      setBody("");
      setDomain("");
      void qc.invalidateQueries({ queryKey: ["evidence"] });
      void qc.invalidateQueries({ queryKey: ["overview"] });
      setVerifyId(r.id);
    },
    onError: (e) => toast.error(errMessage(e)),
  });

  const verify = useMutation({
    mutationFn: (id: string) => verifyEvidence({ data: id }),
    onSuccess: (r) => {
      toast.success(r.matches ? "Receipt hash verified." : "Hash mismatch.");
    },
    onError: (e) => toast.error(errMessage(e)),
  });

  return (
    <div>
      <PageHeader
        kicker="Ledger"
        title="Evidence"
        description="Append-only receipts. Eligible only for the decision kinds their source adapter allows. No activation authority."
        actions={<Button onClick={() => setOpen(true)}>Record receipt</Button>}
      />

      {q.isPending ? (
        <div className="h-40 animate-pulse rounded-xl bg-secondary" />
      ) : q.isError ? (
        <EmptyState title="Could not load ledger" body={errMessage(q.error)} />
      ) : q.data.length === 0 ? (
        <EmptyState
          title="Empty ledger"
          body="Normalize an observation into an immutable receipt. Discovery-run evidence cannot authorize architecture or code review."
          action={<Button onClick={() => setOpen(true)}>Record receipt</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {q.data.map((r) => (
            <li key={r.id} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[11px] text-steel">{r.sourceKind}</p>
                <Badge variant={r.outcome === "artifact" || r.outcome === "refuted" ? "danger" : "steel"}>
                  {r.outcome}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-paper">{r.domain}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {jsonStringField(r.body, "note") ?? JSON.stringify(r.body)}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <HashChip value={r.receiptHash} />
                <span className="text-xs text-muted-foreground">
                  allowed: {r.eligibility.allowed.join(", ") || "none"}
                </span>
                <Button size="sm" variant="outline" onClick={() => verify.mutate(r.id)}>
                  Verify
                </Button>
              </div>
              {verifyId === r.id && verify.data ? (
                <p className="mt-2 font-mono text-[11px] text-steel">
                  {verify.data.matches ? "recomputed hash matches" : "recomputed hash diverges"}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Normalize a receipt</DialogTitle>
            <DialogDescription>
              Allowed for {sourceKind}: {ELIGIBILITY_POLICY[sourceKind].join(", ")}.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="sk">Source kind</Label>
              <select
                id="sk"
                className="flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm"
                value={sourceKind}
                onChange={(e) => setSourceKind(e.target.value as SourceKind)}
              >
                {SOURCE_KINDS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dom">Domain</Label>
              <Input id="dom" value={domain} onChange={(e) => setDomain(e.target.value)} required />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="out">Outcome</Label>
                <select
                  id="out"
                  className="flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm"
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value as EvidenceOutcome)}
                >
                  {EVIDENCE_OUTCOMES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ind">Independence</Label>
                <select
                  id="ind"
                  className="flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm"
                  value={independence}
                  onChange={(e) => setIndependence(e.target.value as IndependenceLevel)}
                >
                  {INDEPENDENCE_LEVELS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="body">Body</Label>
              <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} required />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={create.isPending}>
                Append receipt
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
