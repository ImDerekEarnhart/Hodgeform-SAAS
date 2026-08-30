import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  EmptyState,
  HashChip,
  OperatorBadge,
  PageHeader,
  TournamentBadge,
  errMessage,
  jsonStringField,
} from "@/components/lab/bits";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  createOperator,
  createTournament,
  freezeTournament,
  importStarterGenome,
  listOperators,
  listTournaments,
} from "@/lib/lab/api";
import { PHRASES } from "@/lib/lab/phrases";

export const Route = createFileRoute("/lab/genome")({ component: GenomeLayout });

function GenomeLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/lab/genome") return <Outlet />;
  return <GenomePage />;
}

function GenomePage() {
  const qc = useQueryClient();
  const ops = useQuery({ queryKey: ["operators"], queryFn: () => listOperators() });
  const tours = useQuery({ queryKey: ["tournaments"], queryFn: () => listTournaments() });
  const [openOp, setOpenOp] = useState(false);
  const [openTour, setOpenTour] = useState(false);
  const [form, setForm] = useState({
    operatorKey: "",
    name: "",
    description: "",
    kill_switch: "",
    intervention: "",
    recovery_test: "",
    held_out_prediction: "",
  });
  const [tourName, setTourName] = useState("");
  const [tourTarget, setTourTarget] = useState("");
  const [freezeId, setFreezeId] = useState<string | null>(null);
  const [freezeHash, setFreezeHash] = useState("");
  const [freezePhrase, setFreezePhrase] = useState("");

  const seed = useMutation({
    mutationFn: () => importStarterGenome(),
    onSuccess: (r) => {
      toast.success(r.imported ? `Imported ${r.imported} operators.` : "Already imported.");
      void qc.invalidateQueries({ queryKey: ["operators"] });
      void qc.invalidateQueries({ queryKey: ["overview"] });
    },
    onError: (e) => toast.error(errMessage(e)),
  });

  const createOp = useMutation({
    mutationFn: () =>
      createOperator({
        data: {
          operatorKey: form.operatorKey,
          name: form.name,
          description: form.description,
          contract: {
            kill_switch: form.kill_switch,
            intervention: form.intervention,
            recovery_test: form.recovery_test,
            held_out_prediction: form.held_out_prediction,
          },
        },
      }),
    onSuccess: () => {
      toast.success("Operator created as review_needed.");
      setOpenOp(false);
      void qc.invalidateQueries({ queryKey: ["operators"] });
    },
    onError: (e) => toast.error(errMessage(e)),
  });

  const createTour = useMutation({
    mutationFn: () => createTournament({ data: { name: tourName, target: tourTarget } }),
    onSuccess: () => {
      toast.success("Draft tournament created.");
      setOpenTour(false);
      setTourName("");
      setTourTarget("");
      void qc.invalidateQueries({ queryKey: ["tournaments"] });
    },
    onError: (e) => toast.error(errMessage(e)),
  });

  const freeze = useMutation({
    mutationFn: () =>
      freezeTournament({
        data: {
          id: freezeId!,
          expectedReviewHash: freezeHash,
          confirmation: freezePhrase,
        },
      }),
    onSuccess: () => {
      toast.success("Tournament frozen.");
      setFreezeId(null);
      void qc.invalidateQueries({ queryKey: ["tournaments"] });
    },
    onError: (e) => toast.error(errMessage(e)),
  });

  return (
    <div>
      <PageHeader
        kicker="Discovery genome"
        title="Operators"
        description="Executable contracts stay review_needed until you freeze the exact review hash."
        actions={
          <>
            <Button variant="outline" onClick={() => seed.mutate()} disabled={seed.isPending}>
              Import starter genome
            </Button>
            <Button onClick={() => setOpenOp(true)}>New operator</Button>
          </>
        }
      />

      <Tabs defaultValue="operators">
        <TabsList>
          <TabsTrigger value="operators">Operators</TabsTrigger>
          <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
        </TabsList>
        <TabsContent value="operators">
          {ops.isPending ? (
            <div className="h-40 animate-pulse rounded-xl bg-secondary" />
          ) : ops.isError ? (
            <EmptyState title="Could not load operators" body={errMessage(ops.error)} />
          ) : ops.data.length === 0 ? (
            <EmptyState
              title="Empty genome"
              body="Import the seven cross-domain families, or write your own. Nothing is frozen or proven on import."
              action={
                <Button onClick={() => seed.mutate()} disabled={seed.isPending}>
                  Import starter genome
                </Button>
              }
            />
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {ops.data.map((op) => (
                <li key={op.id}>
                  <Link
                    to="/lab/genome/$operatorId"
                    params={{ operatorId: op.id }}
                    className="block h-full rounded-xl bg-card p-5 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-[11px] text-steel">{op.operatorKey}</p>
                        <h2 className="mt-1 font-display text-xl text-paper">{op.name}</h2>
                      </div>
                      <OperatorBadge status={op.status} />
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{op.description}</p>
                    <div className="mt-3">
                      <HashChip value={op.reviewHash} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
        <TabsContent value="tournaments">
          <div className="mb-4">
            <Button onClick={() => setOpenTour(true)}>New tournament</Button>
          </div>
          {tours.isPending ? (
            <div className="h-32 animate-pulse rounded-xl bg-secondary" />
          ) : tours.data && tours.data.length === 0 ? (
            <EmptyState
              title="No tournaments"
              body="Create a draft around one declared unseen target. Freeze requires the current manifest hash."
            />
          ) : (
            <ul className="space-y-3">
              {tours.data?.map((t) => (
                <li key={t.id} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-display text-xl text-paper">{t.name}</h2>
                    <TournamentBadge status={t.status} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Unseen target: {jsonStringField(t.target, "unseen") ?? "—"}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <HashChip value={t.manifestHash} />
                    {t.status === "draft" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setFreezeId(t.id);
                          setFreezeHash(t.manifestHash);
                          setFreezePhrase("");
                        }}
                      >
                        Freeze
                      </Button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={openOp} onOpenChange={setOpenOp}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New operator</DialogTitle>
            <DialogDescription>Created as review_needed. All four contract fields are required.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              createOp.mutate();
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="ok">Key</Label>
                <Input
                  id="ok"
                  className="font-mono text-xs"
                  value={form.operatorKey}
                  onChange={(e) => setForm({ ...form, operatorKey: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="on">Name</Label>
                <Input id="on" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="od">Description</Label>
              <Textarea id="od" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            {(["kill_switch", "intervention", "recovery_test", "held_out_prediction"] as const).map((k) => (
              <div key={k} className="space-y-1.5">
                <Label htmlFor={k}>{k.replaceAll("_", " ")}</Label>
                <Textarea id={k} required value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              </div>
            ))}
            <DialogFooter>
              <Button type="submit" disabled={createOp.isPending}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={openTour} onOpenChange={setOpenTour}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Draft tournament</DialogTitle>
            <DialogDescription>Blind discovery around one declared unseen target.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              createTour.mutate();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="tn">Name</Label>
              <Input id="tn" value={tourName} onChange={(e) => setTourName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tt">Unseen target</Label>
              <Textarea id="tt" value={tourTarget} onChange={(e) => setTourTarget(e.target.value)} required />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createTour.isPending}>
                Create draft
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(freezeId)} onOpenChange={(v) => !v && setFreezeId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Freeze tournament</DialogTitle>
            <DialogDescription>{PHRASES.freezeTournament}</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              freeze.mutate();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="th">Expected manifest hash</Label>
              <Input id="th" className="font-mono text-xs" value={freezeHash} onChange={(e) => setFreezeHash(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tp">Confirmation</Label>
              <Input id="tp" value={freezePhrase} onChange={(e) => setFreezePhrase(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={freeze.isPending}>
                Freeze
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
