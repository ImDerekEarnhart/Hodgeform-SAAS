import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CaseBadge, EmptyState, PageHeader, errMessage } from "@/components/lab/bits";
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
import { createCase, listCases } from "@/lib/lab/api";

export const Route = createFileRoute("/lab/cases")({ component: CasesLayout });

function CasesLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/lab/cases") return <Outlet />;
  return <CasesPage />;
}

function CasesPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["cases"], queryFn: () => listCases() });
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [domain, setDomain] = useState("");

  const create = useMutation({
    mutationFn: () => createCase({ data: { name, goal, domainHint: domain } }),
    onSuccess: () => {
      toast.success("Case opened.");
      setOpen(false);
      setName("");
      setGoal("");
      setDomain("");
      void qc.invalidateQueries({ queryKey: ["cases"] });
      void qc.invalidateQueries({ queryKey: ["overview"] });
    },
    onError: (e) => toast.error(errMessage(e)),
  });

  return (
    <div>
      <PageHeader
        kicker="Research"
        title="Cases"
        description="Leave the goal blank for bounded open discovery. Claims derived from a case survive deletion."
        actions={<Button onClick={() => setOpen(true)}>Open a case</Button>}
      />

      {q.isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-secondary" />
          ))}
        </div>
      ) : q.isError ? (
        <EmptyState title="Could not load cases" body={errMessage(q.error)} />
      ) : q.data.length === 0 ? (
        <EmptyState
          title="No cases yet"
          body="Open a research case. A blank goal is a legitimate starting point — bounded open discovery, not a missing field."
          action={<Button onClick={() => setOpen(true)}>Open a case</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {q.data.map((c) => (
            <li key={c.id}>
              <Link
                to="/lab/cases/$caseId"
                params={{ caseId: c.id }}
                className="block rounded-xl bg-card p-5 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display text-xl text-paper">{c.name}</h2>
                  <CaseBadge status={c.status} />
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {c.goal || "Bounded open discovery — no goal registered."}
                </p>
                <p className="mt-3 font-mono text-[11px] text-steel">{c.id}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open a case</DialogTitle>
            <DialogDescription>
              A case is a durable research object. You can ingest, freeze a plan, and approve it later.
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
              <Label htmlFor="case-name">Name</Label>
              <Input id="case-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="case-goal">Goal (optional)</Label>
              <Textarea id="case-goal" value={goal} onChange={(e) => setGoal(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="case-domain">Domain hint</Label>
              <Input id="case-domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending ? "Opening…" : "Open case"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
