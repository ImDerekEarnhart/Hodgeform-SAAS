import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState, PageHeader, errMessage } from "@/components/lab/bits";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getOverview, importStarterGenome, updateLab } from "@/lib/lab/api";

export const Route = createFileRoute("/lab/")({ component: LabHome });

function LabHome() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["overview"], queryFn: () => getOverview() });
  const [name, setName] = useState<string | null>(null);
  const [charter, setCharter] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: () =>
      updateLab({
        data: {
          name: name ?? q.data?.lab.name ?? "",
          charter: charter ?? q.data?.lab.charter ?? "",
        },
      }),
    onSuccess: () => {
      toast.success("Lab updated.");
      void qc.invalidateQueries({ queryKey: ["overview"] });
    },
    onError: (e) => toast.error(errMessage(e)),
  });

  const seed = useMutation({
    mutationFn: () => importStarterGenome(),
    onSuccess: (r) => {
      toast.success(r.imported ? `Imported ${r.imported} starter operators.` : "Starter genome already present.");
      void qc.invalidateQueries();
    },
    onError: (e) => toast.error(errMessage(e)),
  });

  if (q.isPending) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 animate-pulse rounded-md bg-secondary" />
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-secondary" />
          ))}
        </div>
      </div>
    );
  }
  if (q.isError || !q.data) {
    return <EmptyState title="Could not load lab" body={errMessage(q.error)} />;
  }

  const { lab, policy, counts } = q.data;
  const stats: { label: string; value: number; to: string }[] = [
    { label: "Cases", value: counts.cases, to: "/lab/cases" },
    { label: "Operators", value: counts.operators, to: "/lab/genome" },
    { label: "Frozen", value: counts.frozenOperators, to: "/lab/genome" },
    { label: "Evidence", value: counts.evidence, to: "/lab/evidence" },
    { label: "Pending review", value: counts.pendingApprovals, to: "/lab/experiments" },
    { label: "Open loops", value: counts.openLoops, to: "/lab/loops" },
    { label: "Claims", value: counts.claims, to: "/lab/claims" },
    { label: "Tournaments", value: counts.tournaments, to: "/lab/genome" },
  ];

  return (
    <div>
      <PageHeader
        kicker="Tenant"
        title={lab.name}
        description="This lab is bound to your signed-in subject. Origin-tenant cases are not loaded here."
        actions={
          counts.operators === 0 ? (
            <Button onClick={() => seed.mutate()} disabled={seed.isPending}>
              {seed.isPending ? "Importing…" : "Import starter genome"}
            </Button>
          ) : null
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="block">
            <Card className="transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]">
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{s.label}</p>
                <p className="mt-2 font-mono text-3xl tabular-nums text-paper">{s.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form
          className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <h2 className="font-display text-xl text-paper">Charter</h2>
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="lab-name">Lab name</Label>
              <Input
                id="lab-name"
                value={name ?? lab.name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="charter">Charter</Label>
              <Textarea
                id="charter"
                value={charter ?? lab.charter}
                onChange={(e) => setCharter(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>

        <aside className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <h2 className="font-display text-xl text-paper">Governance</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex justify-between gap-4">
              <span className="text-muted-foreground">Hash-bound approval</span>
              <span className="font-mono text-xs text-paper">
                {policy.requireHashBoundApproval ? "required" : "off"}
              </span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-muted-foreground">No activation</span>
              <span className="font-mono text-xs text-paper">
                {policy.noActivation ? "enforced" : "off"}
              </span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-muted-foreground">Held-out prediction</span>
              <span className="font-mono text-xs text-paper">
                {policy.requireHeldOutPrediction ? "required" : "off"}
              </span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-muted-foreground">Arch. review from evidence</span>
              <span className="font-mono text-xs text-paper">
                {policy.prohibitArchitectureReviewFromEvidence ? "prohibited" : "allowed"}
              </span>
            </li>
          </ul>
          <Button variant="outline" className="mt-5 w-full" asChild>
            <Link to="/lab/governance">Open governance</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
