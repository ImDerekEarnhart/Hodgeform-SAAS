import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState, ExperimentBadge, HashChip, PageHeader, errMessage } from "@/components/lab/bits";
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
import {
  approveExperiment,
  createExperiment,
  freezeExperiment,
  listCases,
  listExperiments,
  recordExperiment,
  stageExperiment,
} from "@/lib/lab/api";
import { PHRASES } from "@/lib/lab/phrases";
import type { EvidenceOutcome } from "@/lib/lab/types";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/lab/experiments")({ component: ExperimentsPage });

function ExperimentsPage() {
  const user = useCurrentUser();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["experiments"], queryFn: () => listExperiments() });
  const cases = useQuery({ queryKey: ["cases"], queryFn: () => listCases() });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    caseId: "",
    scientificQuestion: "",
    claimScope: "",
    executionSpec: "",
    verifier: "",
    coverage: "",
    antiRescue: "Do not widen scope after seeing results.\nDo not drop failed checks.",
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [expHash, setExpHash] = useState("");
  const [manHash, setManHash] = useState("");
  const [rationale, setRationale] = useState("");
  const [confirm, setConfirm] = useState("");
  const [observation, setObservation] = useState("");
  const [outcome, setOutcome] = useState<EvidenceOutcome>("inconclusive");

  const actor = user?.displayName ?? user?.primaryEmail ?? "lab-owner";
  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ["experiments"] });
    void qc.invalidateQueries({ queryKey: ["overview"] });
    void qc.invalidateQueries({ queryKey: ["evidence"] });
  };

  const create = useMutation({
    mutationFn: () => createExperiment({ data: { ...form, createdBy: actor } }),
    onSuccess: () => {
      toast.success("Draft experiment created.");
      setOpen(false);
      invalidate();
    },
    onError: (e) => toast.error(errMessage(e)),
  });
  const freeze = useMutation({
    mutationFn: (id: string) => freezeExperiment({ data: { id, expectedExperimentHash: expHash } }),
    onSuccess: () => {
      toast.success("Experiment frozen.");
      invalidate();
    },
    onError: (e) => toast.error(errMessage(e)),
  });
  const stage = useMutation({
    mutationFn: (id: string) =>
      stageExperiment({ data: { id, expectedExperimentHash: expHash, submittedBy: actor } }),
    onSuccess: (r) => {
      toast.success("Staged. Execution remains blocked.");
      setManHash(r.manifestHash);
      invalidate();
    },
    onError: (e) => toast.error(errMessage(e)),
  });
  const approve = useMutation({
    mutationFn: (id: string) =>
      approveExperiment({
        data: {
          id,
          expectedExperimentHash: expHash,
          expectedManifestHash: manHash,
          reviewer: actor,
          rationale,
          confirmation: confirm,
        },
      }),
    onSuccess: () => {
      toast.success("Approved.");
      invalidate();
    },
    onError: (e) => toast.error(errMessage(e)),
  });
  const record = useMutation({
    mutationFn: (id: string) => recordExperiment({ data: { id, observation, outcome } }),
    onSuccess: () => {
      toast.success("Receipt recorded. No runtime was activated.");
      setObservation("");
      invalidate();
    },
    onError: (e) => toast.error(errMessage(e)),
  });

  const current = q.data?.find((e) => e.id === selected) ?? null;

  return (
    <div>
      <PageHeader
        kicker="Governed execution"
        title="Experiments"
        description="Freeze, stage, approve against both hashes. Recording writes a receipt. The lab does not run code."
        actions={<Button onClick={() => setOpen(true)}>New experiment</Button>}
      />

      {q.isPending ? (
        <div className="h-40 animate-pulse rounded-xl bg-secondary" />
      ) : q.isError ? (
        <EmptyState title="Could not load experiments" body={errMessage(q.error)} />
      ) : q.data.length === 0 ? (
        <EmptyState
          title="No experiments"
          body="Bind an experiment to a case, freeze the spec, stage a manifest, then approve both hashes."
          action={<Button onClick={() => setOpen(true)}>New experiment</Button>}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <ul className="space-y-3">
            {q.data.map((ex) => (
              <li key={ex.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(ex.id);
                    setExpHash(ex.experimentHash);
                    setManHash(ex.manifestHash ?? "");
                  }}
                  className="w-full rounded-xl bg-card p-5 text-left shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-lg text-paper">{ex.scientificQuestion}</h2>
                    <ExperimentBadge status={ex.status} />
                  </div>
                  <p className="mt-2 font-mono text-[11px] text-steel">{ex.id}</p>
                </button>
              </li>
            ))}
          </ul>

          {current ? (
            <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
              <h2 className="font-display text-xl text-paper">Review</h2>
              <p className="mt-2 text-sm text-muted-foreground">{current.scientificQuestion}</p>
              <div className="mt-4 space-y-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Experiment hash</p>
                  <HashChip value={current.experimentHash} className="mt-1" />
                </div>
                {current.manifestHash ? (
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Manifest hash</p>
                    <HashChip value={current.manifestHash} className="mt-1" />
                  </div>
                ) : null}
              </div>

              <div className="mt-5 space-y-3">
                {current.status === "draft" ? (
                  <Button
                    onClick={() => freeze.mutate(current.id)}
                    disabled={freeze.isPending}
                  >
                    Freeze
                  </Button>
                ) : null}
                {current.status === "frozen" ? (
                  <Button onClick={() => stage.mutate(current.id)} disabled={stage.isPending}>
                    Stage manifest
                  </Button>
                ) : null}
                {current.status === "staged" ? (
                  <form
                    className="space-y-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      approve.mutate(current.id);
                    }}
                  >
                    <p className="font-mono text-xs text-steel">{PHRASES.approveExperiment}</p>
                    <div className="space-y-1.5">
                      <Label htmlFor="eh">Expected experiment hash</Label>
                      <Input
                        id="eh"
                        className="font-mono text-xs"
                        value={expHash}
                        onChange={(e) => setExpHash(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="mh">Expected manifest hash</Label>
                      <Input
                        id="mh"
                        className="font-mono text-xs"
                        value={manHash}
                        onChange={(e) => setManHash(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="rat">Rationale</Label>
                      <Textarea id="rat" value={rationale} onChange={(e) => setRationale(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cf">Confirmation</Label>
                      <Input id="cf" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                    </div>
                    <Button type="submit" disabled={approve.isPending}>
                      Approve
                    </Button>
                  </form>
                ) : null}
                {current.status === "approved" ? (
                  <form
                    className="space-y-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      record.mutate(current.id);
                    }}
                  >
                    <p className="text-sm text-muted-foreground">
                      Record an observation receipt. Runtime stays off.
                    </p>
                    <Textarea
                      value={observation}
                      onChange={(e) => setObservation(e.target.value)}
                      placeholder="Observation"
                    />
                    <select
                      className="flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm"
                      value={outcome}
                      onChange={(e) => setOutcome(e.target.value as EvidenceOutcome)}
                    >
                      <option value="supported">supported</option>
                      <option value="refuted">refuted</option>
                      <option value="inconclusive">inconclusive</option>
                      <option value="artifact">artifact</option>
                    </select>
                    <Button type="submit" disabled={record.isPending}>
                      Record receipt
                    </Button>
                  </form>
                ) : null}
              </div>
            </section>
          ) : (
            <p className="text-sm text-muted-foreground">Select an experiment to review.</p>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Freeze an experiment spec</DialogTitle>
            <DialogDescription>Bind it to a case. Execution stays blocked until hash-bound approval.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="cid">Case</Label>
              <select
                id="cid"
                required
                className="flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm"
                value={form.caseId}
                onChange={(e) => setForm({ ...form, caseId: e.target.value })}
              >
                <option value="">Select a case</option>
                {cases.data?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            {(
              [
                ["scientificQuestion", "Scientific question"],
                ["claimScope", "Claim scope"],
                ["executionSpec", "Execution spec"],
                ["verifier", "Independent verifier"],
                ["coverage", "Falsification coverage"],
                ["antiRescue", "Anti-rescue rules (one per line)"],
              ] as const
            ).map(([k, label]) => (
              <div key={k} className="space-y-1.5">
                <Label htmlFor={k}>{label}</Label>
                <Textarea
                  id={k}
                  required
                  value={form[k]}
                  onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                />
              </div>
            ))}
            <DialogFooter>
              <Button type="submit" disabled={create.isPending || !form.caseId}>
                Create draft
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
