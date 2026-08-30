import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { EmptyState, HashChip, LoopBadge, PageHeader, errMessage } from "@/components/lab/bits";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { advanceLoop, getLoop, verifyLoop } from "@/lib/lab/api";
import { LOOP_STATE_LIST, STAGE_CONTRACTS, defaultArtifact } from "@/lib/lab/loops";
import type { JsonValue } from "@/lib/lab/types";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/lab/loops/$loopId")({ component: LoopDetail });

function LoopDetail() {
  const { loopId } = Route.useParams();
  const user = useCurrentUser();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["loop", loopId], queryFn: () => getLoop({ data: loopId }) });
  const [artifact, setArtifact] = useState<{ [key: string]: JsonValue }>({});

  useEffect(() => {
    if (q.data) setArtifact(defaultArtifact(q.data.state));
  }, [q.data?.id, q.data?.state]);

  const advance = useMutation({
    mutationFn: () =>
      advanceLoop({
        data: {
          id: loopId,
          expectedState: q.data!.state,
          expectedPreviousEventHash: q.data!.previousEventHash,
          artifact,
          actor: user?.displayName ?? "lab-owner",
        },
      }),
    onSuccess: (r) => {
      toast.success(`Advanced to ${r.nextState}.`);
      void qc.invalidateQueries({ queryKey: ["loop", loopId] });
      void qc.invalidateQueries({ queryKey: ["loops"] });
    },
    onError: (e) => toast.error(errMessage(e)),
  });

  const verify = useMutation({
    mutationFn: () => verifyLoop({ data: loopId }),
    onSuccess: (r) => {
      toast.success(r.intact ? `Chain intact · ${r.events} events` : r.issues.join(" "));
    },
    onError: (e) => toast.error(errMessage(e)),
  });

  if (q.isPending) return <div className="h-48 animate-pulse rounded-xl bg-secondary" />;
  if (q.isError || !q.data) return <EmptyState title="Loop not found" body={errMessage(q.error)} />;
  const loop = q.data;
  const contract = STAGE_CONTRACTS[loop.state];

  return (
    <div>
      <p className="mb-4 text-sm">
        <Link to="/lab/loops" className="text-muted-foreground hover:text-paper">
          Loops
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="font-mono text-xs text-steel">{loop.id}</span>
      </p>
      <PageHeader
        kicker={`cycle ${loop.cycle}/${loop.maxCycles}`}
        title={loop.goal}
        description={loop.successCriteria.join(" · ")}
        actions={
          <>
            <LoopBadge state={loop.state} />
            <Button variant="outline" onClick={() => verify.mutate()} disabled={verify.isPending}>
              Verify chain
            </Button>
          </>
        }
      />

      <ol className="mb-8 flex flex-wrap gap-1.5">
        {LOOP_STATE_LIST.map((s) => (
          <li
            key={s}
            className={
              s === loop.state
                ? "rounded-sm bg-primary px-2 py-1 font-mono text-[10px] text-primary-foreground"
                : "rounded-sm bg-secondary px-2 py-1 font-mono text-[10px] text-muted-foreground"
            }
          >
            {s}
          </li>
        ))}
      </ol>

      <div className="grid gap-6 lg:grid-cols-2">
        {loop.state !== "COMPLETED" && contract ? (
          <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
            <h2 className="font-display text-xl text-paper">Advance {loop.state}</h2>
            {contract.notes ? <p className="mt-2 text-sm text-muted-foreground">{contract.notes}</p> : null}
            <p className="mt-2 font-mono text-[11px] text-steel">
              previous {loop.previousEventHash}
            </p>
            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                advance.mutate();
              }}
            >
              {contract.required.map((key) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={key}>{key.replaceAll("_", " ")}</Label>
                  {key === "acknowledged" || key === "retry_authorized" ? (
                    <p className="text-sm text-muted-foreground">Will be submitted as true.</p>
                  ) : (
                    <Textarea
                      id={key}
                      value={String(artifact[key] ?? "")}
                      onChange={(e) => setArtifact({ ...artifact, [key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              <Button type="submit" disabled={advance.isPending}>
                Submit artifact
              </Button>
            </form>
          </section>
        ) : (
          <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
            <h2 className="font-display text-xl text-paper">Completed</h2>
            <p className="mt-2 text-sm text-muted-foreground">Terminal state. The chain is append-only.</p>
          </section>
        )}

        <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <h2 className="font-display text-xl text-paper">Event chain</h2>
          {loop.events.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No events yet. Head hash is genesis.</p>
          ) : (
            <ol className="mt-4 space-y-3">
              {loop.events.map((ev) => (
                <li key={ev.id} className="border-l border-hairline pl-3">
                  <p className="font-mono text-xs text-paper">
                    {ev.state} → {ev.nextState}
                  </p>
                  <HashChip value={ev.eventHash} className="mt-1" />
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
