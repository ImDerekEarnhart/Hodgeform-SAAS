import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CaseBadge, EmptyState, HashChip, PageHeader, errMessage } from "@/components/lab/bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  approvePlan,
  completeCase,
  deleteCase,
  getCase,
  ingestCase,
  writePlan,
} from "@/lib/lab/api";
import { PHRASES } from "@/lib/lab/phrases";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/lab/cases/$caseId")({ component: CaseDetail });

function CaseDetail() {
  const { caseId } = Route.useParams();
  const nav = useNavigate();
  const user = useCurrentUser();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["case", caseId], queryFn: () => getCase({ data: caseId }) });
  const [steps, setSteps] = useState("");
  const [falsifiers, setFalsifiers] = useState("");
  const [checks, setChecks] = useState("");
  const [confirm, setConfirm] = useState("");
  const [hashInput, setHashInput] = useState("");
  const [deletePhrase, setDeletePhrase] = useState("");

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ["case", caseId] });
    void qc.invalidateQueries({ queryKey: ["cases"] });
    void qc.invalidateQueries({ queryKey: ["overview"] });
  };

  const ingest = useMutation({
    mutationFn: () => ingestCase({ data: caseId }),
    onSuccess: () => {
      toast.success("Case ingested.");
      invalidate();
    },
    onError: (e) => toast.error(errMessage(e)),
  });
  const plan = useMutation({
    mutationFn: () =>
      writePlan({ data: { id: caseId, steps, falsifiers, successChecks: checks } }),
    onSuccess: (r) => {
      toast.success("Plan frozen.");
      setHashInput(r.planHash);
      invalidate();
    },
    onError: (e) => toast.error(errMessage(e)),
  });
  const approve = useMutation({
    mutationFn: () =>
      approvePlan({
        data: {
          id: caseId,
          expectedPlanHash: hashInput,
          confirmation: confirm,
          reviewer: user?.displayName ?? user?.primaryEmail ?? "lab-owner",
        },
      }),
    onSuccess: () => {
      toast.success("Plan approved.");
      invalidate();
    },
    onError: (e) => toast.error(errMessage(e)),
  });
  const complete = useMutation({
    mutationFn: () => completeCase({ data: caseId }),
    onSuccess: () => {
      toast.success("Case completed.");
      invalidate();
    },
    onError: (e) => toast.error(errMessage(e)),
  });
  const remove = useMutation({
    mutationFn: () => deleteCase({ data: { id: caseId, confirmation: deletePhrase } }),
    onSuccess: () => {
      toast.success("Case deleted. Derived claims remain.");
      void nav({ to: "/lab/cases" });
    },
    onError: (e) => toast.error(errMessage(e)),
  });

  if (q.isPending) return <div className="h-48 animate-pulse rounded-xl bg-secondary" />;
  if (q.isError || !q.data) return <EmptyState title="Case not found" body={errMessage(q.error)} />;

  const c = q.data;

  return (
    <div>
      <p className="mb-4 text-sm">
        <Link to="/lab/cases" className="text-muted-foreground hover:text-paper">
          Cases
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="font-mono text-xs text-steel">{c.id}</span>
      </p>
      <PageHeader
        kicker={c.domainHint ?? "case"}
        title={c.name}
        description={c.goal || "Bounded open discovery — no goal registered."}
        actions={<CaseBadge status={c.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <h2 className="font-display text-xl text-paper">Lifecycle</h2>
          <ol className="mt-4 space-y-2 font-mono text-xs text-muted-foreground">
            {["created", "ingested", "plan_ready", "approved", "completed"].map((s) => (
              <li key={s} className={s === c.status ? "text-paper" : ""}>
                {s === c.status ? "→ " : "  "}
                {s}
              </li>
            ))}
          </ol>
          <div className="mt-5 flex flex-wrap gap-2">
            {c.status === "created" ? (
              <Button onClick={() => ingest.mutate()} disabled={ingest.isPending}>
                Ingest
              </Button>
            ) : null}
            {c.status === "approved" ? (
              <Button onClick={() => complete.mutate()} disabled={complete.isPending}>
                Complete
              </Button>
            ) : null}
          </div>
        </section>

        {c.status === "ingested" || c.status === "plan_ready" ? (
          <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
            <h2 className="font-display text-xl text-paper">Freeze a plan</h2>
            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                plan.mutate();
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="steps">Steps</Label>
                <Textarea id="steps" value={steps} onChange={(e) => setSteps(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="falsifiers">Falsifiers</Label>
                <Textarea
                  id="falsifiers"
                  value={falsifiers}
                  onChange={(e) => setFalsifiers(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="checks">Success checks</Label>
                <Textarea id="checks" value={checks} onChange={(e) => setChecks(e.target.value)} required />
              </div>
              <Button type="submit" disabled={plan.isPending}>
                {plan.isPending ? "Hashing…" : "Write plan"}
              </Button>
            </form>
          </section>
        ) : null}

        {c.planHash ? (
          <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
            <h2 className="font-display text-xl text-paper">Hash-bound approval</h2>
            <p className="mt-2 text-sm text-muted-foreground">Approve only the exact frozen plan. Phrase:</p>
            <p className="mt-2 font-mono text-xs text-steel">{PHRASES.approvePlan}</p>
            <div className="mt-3">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Plan hash</p>
              <HashChip value={c.planHash} className="mt-1" />
            </div>
            {c.status === "plan_ready" ? (
              <form
                className="mt-4 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  approve.mutate();
                }}
              >
                <div className="space-y-1.5">
                  <Label htmlFor="ph">Expected plan hash</Label>
                  <Input
                    id="ph"
                    className="font-mono text-xs"
                    value={hashInput || c.planHash}
                    onChange={(e) => setHashInput(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pc">Confirmation</Label>
                  <Input id="pc" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                </div>
                <Button type="submit" disabled={approve.isPending}>
                  Approve plan
                </Button>
              </form>
            ) : null}
          </section>
        ) : null}

        <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)] lg:col-span-2">
          <h2 className="font-display text-xl text-paper">Delete</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Irreversible for the case. Type {PHRASES.deleteCase}. Derived claims remain in the ledger.
          </p>
          <form
            className="mt-4 flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              remove.mutate();
            }}
          >
            <Input
              value={deletePhrase}
              onChange={(e) => setDeletePhrase(e.target.value)}
              placeholder={PHRASES.deleteCase}
            />
            <Button type="submit" variant="destructive" disabled={remove.isPending}>
              Delete
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
