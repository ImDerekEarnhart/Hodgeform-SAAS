import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState, HashChip, OperatorBadge, PageHeader, errMessage } from "@/components/lab/bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { freezeOperator, getOperator } from "@/lib/lab/api";
import { PHRASES } from "@/lib/lab/phrases";

export const Route = createFileRoute("/lab/genome/$operatorId")({ component: OperatorDetail });

function OperatorDetail() {
  const { operatorId } = Route.useParams();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["operator", operatorId],
    queryFn: () => getOperator({ data: operatorId }),
  });
  const [hash, setHash] = useState("");
  const [phrase, setPhrase] = useState("");

  const freeze = useMutation({
    mutationFn: () =>
      freezeOperator({
        data: {
          id: operatorId,
          expectedReviewHash: hash || q.data?.reviewHash || "",
          confirmation: phrase,
        },
      }),
    onSuccess: () => {
      toast.success("Operator frozen.");
      void qc.invalidateQueries({ queryKey: ["operator", operatorId] });
      void qc.invalidateQueries({ queryKey: ["operators"] });
      void qc.invalidateQueries({ queryKey: ["overview"] });
    },
    onError: (e) => toast.error(errMessage(e)),
  });

  if (q.isPending) return <div className="h-48 animate-pulse rounded-xl bg-secondary" />;
  if (q.isError || !q.data) return <EmptyState title="Operator not found" body={errMessage(q.error)} />;
  const op = q.data;

  return (
    <div>
      <p className="mb-4 text-sm">
        <Link to="/lab/genome" className="text-muted-foreground hover:text-paper">
          Genome
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="font-mono text-xs text-steel">{op.operatorKey}</span>
      </p>
      <PageHeader
        kicker="operator"
        title={op.name}
        description={op.description}
        actions={<OperatorBadge status={op.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <h2 className="font-display text-xl text-paper">Contract</h2>
          <dl className="mt-4 space-y-4">
            {Object.entries(op.contract).map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase tracking-[0.14em] text-steel">{k.replaceAll("_", " ")}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <h2 className="font-display text-xl text-paper">Hashes</h2>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Contract hash</p>
              <HashChip value={op.contractHash} className="mt-1" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Review hash</p>
              <HashChip value={op.reviewHash} className="mt-1" />
            </div>
          </div>

          {op.status === "review_needed" ? (
            <form
              className="mt-6 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                freeze.mutate();
              }}
            >
              <p className="text-sm text-muted-foreground">
                Freeze requires the current review hash and the phrase:
              </p>
              <p className="font-mono text-xs text-steel">{PHRASES.freezeOperator}</p>
              <div className="space-y-1.5">
                <Label htmlFor="rh">Expected review hash</Label>
                <Input
                  id="rh"
                  className="font-mono text-xs"
                  value={hash || op.reviewHash}
                  onChange={(e) => setHash(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ph">Confirmation</Label>
                <Input id="ph" value={phrase} onChange={(e) => setPhrase(e.target.value)} />
              </div>
              <Button type="submit" disabled={freeze.isPending}>
                Freeze operator
              </Button>
            </form>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">This contract is frozen. It cannot be edited in place.</p>
          )}
        </section>
      </div>
    </div>
  );
}
