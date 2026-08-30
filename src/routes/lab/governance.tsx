import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { EmptyState, PageHeader, errMessage } from "@/components/lab/bits";
import { ELIGIBILITY_POLICY, DECISION_KINDS } from "@/lib/lab/eligibility";
import { PHRASES } from "@/lib/lab/phrases";
import { getOverview } from "@/lib/lab/api";
import { ORIGIN_SNAPSHOT } from "@/lib/lab/catalog";

export const Route = createFileRoute("/lab/governance")({ component: GovernancePage });

function GovernancePage() {
  const q = useQuery({ queryKey: ["overview"], queryFn: () => getOverview() });

  if (q.isPending) return <div className="h-40 animate-pulse rounded-xl bg-secondary" />;
  if (q.isError || !q.data) return <EmptyState title="Could not load policy" body={errMessage(q.error)} />;

  const { policy, lab } = q.data;

  return (
    <div>
      <PageHeader
        kicker="Policy"
        title="Governance"
        description="Fixed for this product surface. Policy is not auto-promoted from evidence."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <h2 className="font-display text-xl text-paper">{lab.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{lab.charter}</p>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Hash-bound approval</dt>
              <dd className="font-mono text-xs">{policy.requireHashBoundApproval ? "required" : "off"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Runtime activation</dt>
              <dd className="font-mono text-xs">{policy.noActivation ? "forbidden" : "allowed"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Held-out prediction</dt>
              <dd className="font-mono text-xs">{policy.requireHeldOutPrediction ? "required" : "off"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Architecture from evidence</dt>
              <dd className="font-mono text-xs">
                {policy.prohibitArchitectureReviewFromEvidence ? "prohibited" : "allowed"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <h2 className="font-display text-xl text-paper">Confirmation phrases</h2>
          <ul className="mt-4 space-y-3">
            {Object.entries(PHRASES).map(([k, v]) => (
              <li key={k}>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{k}</p>
                <p className="mt-1 font-mono text-xs text-steel">{v}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)] lg:col-span-2">
          <h2 className="font-display text-xl text-paper">Evidence eligibility</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Decision kinds not listed for a source are prohibited. {DECISION_KINDS.filter((d) =>
              !Object.values(ELIGIBILITY_POLICY).some((a) => a.includes(d)),
            ).join(", ") || "Architecture, code, policy, and semantic activation remain off the allow-list."}
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead>
                <tr className="border-b border-hairline text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Source</th>
                  <th className="py-2 font-medium">Allowed</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(ELIGIBILITY_POLICY).map(([k, v]) => (
                  <tr key={k} className="border-b border-hairline/70">
                    <td className="py-2 pr-4 font-mono text-xs text-steel">{k}</td>
                    <td className="py-2 text-muted-foreground">{v.join(" · ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)] lg:col-span-2">
          <h2 className="font-display text-xl text-paper">Model</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">LLM role</dt>
              <dd className="mt-1 font-mono text-sm">{ORIGIN_SNAPSHOT.safety.llmRole}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Orbita role</dt>
              <dd className="mt-1 font-mono text-sm">state_transition_and_evidence_governor</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Tool execution</dt>
              <dd className="mt-1 font-mono text-sm">{ORIGIN_SNAPSHOT.safety.toolExecution}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Tenancy</dt>
              <dd className="mt-1 font-mono text-sm">{ORIGIN_SNAPSHOT.tenancy}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
