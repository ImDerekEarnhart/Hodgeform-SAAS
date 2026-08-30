import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState, LoopBadge, PageHeader, errMessage } from "@/components/lab/bits";
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
import { createLoop, listLoops } from "@/lib/lab/api";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/lab/loops")({ component: LoopsLayout });

function LoopsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/lab/loops") return <Outlet />;
  return <LoopsPage />;
}

function LoopsPage() {
  const user = useCurrentUser();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["loops"], queryFn: () => listLoops() });
  const [open, setOpen] = useState(false);
  const [goal, setGoal] = useState("");
  const [criteria, setCriteria] = useState("");
  const [caps, setCaps] = useState("human-review\nreceipt-only");
  const [cycles, setCycles] = useState("3");

  const create = useMutation({
    mutationFn: () =>
      createLoop({
        data: {
          goal,
          successCriteria: criteria,
          allowedCapabilities: caps,
          maxCycles: Number(cycles),
          createdBy: user?.displayName ?? "lab-owner",
        },
      }),
    onSuccess: () => {
      toast.success("Loop frozen at GOAL.");
      setOpen(false);
      setGoal("");
      setCriteria("");
      void qc.invalidateQueries({ queryKey: ["loops"] });
      void qc.invalidateQueries({ queryKey: ["overview"] });
    },
    onError: (e) => toast.error(errMessage(e)),
  });

  return (
    <div>
      <PageHeader
        kicker="Governed problem solving"
        title="Loops"
        description="One admissible next state. Artifacts are hash-chained. Repair never auto-activates."
        actions={<Button onClick={() => setOpen(true)}>New loop</Button>}
      />

      {q.isPending ? (
        <div className="h-40 animate-pulse rounded-xl bg-secondary" />
      ) : q.isError ? (
        <EmptyState title="Could not load loops" body={errMessage(q.error)} />
      ) : q.data.length === 0 ? (
        <EmptyState
          title="No loops"
          body="Freeze an objective, success criteria, capabilities, and a retry budget. The first state is GOAL."
          action={<Button onClick={() => setOpen(true)}>New loop</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {q.data.map((loop) => (
            <li key={loop.id}>
              <Link
                to="/lab/loops/$loopId"
                params={{ loopId: loop.id }}
                className="block rounded-xl bg-card p-5 shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display text-xl text-paper">{loop.goal}</h2>
                  <LoopBadge state={loop.state} />
                </div>
                <p className="mt-2 font-mono text-[11px] text-steel">
                  cycle {loop.cycle}/{loop.maxCycles} · {loop.id}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Freeze a loop</DialogTitle>
            <DialogDescription>Charter is immutable after create. Advancing requires the previous event hash.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="goal">Goal</Label>
              <Textarea id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sc">Success criteria (one per line)</Label>
              <Textarea id="sc" value={criteria} onChange={(e) => setCriteria(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cap">Allowed capabilities</Label>
              <Textarea id="cap" value={caps} onChange={(e) => setCaps(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cy">Max cycles</Label>
              <Input id="cy" type="number" min={1} max={8} value={cycles} onChange={(e) => setCycles(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={create.isPending}>
                Create loop
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
