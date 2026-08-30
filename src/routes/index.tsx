import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HodgeMark } from "@/components/hodge-mark";
import { Button } from "@/components/ui/button";
import { ORIGIN_SNAPSHOT, STARTER_OPERATORS } from "@/lib/lab/catalog";
import { ELIGIBILITY_POLICY } from "@/lib/lab/eligibility";
import { authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/")({ component: Home });

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-11 w-28 animate-pulse rounded-md bg-secondary" />;
  }
  if (user) {
    return (
      <Button asChild>
        <Link to="/lab">Enter lab</Link>
      </Button>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" asChild>
        <Link to="/login">Sign in</Link>
      </Button>
      <Button asChild>
        <Link to="/login">Open a lab</Link>
      </Button>
    </div>
  );
}

function Home() {
  const { user, isPending } = useCurrentUserState();
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <HodgeMark className="size-7" />
          <span className="font-display text-lg tracking-tight">Hodgeform Lab</span>
        </Link>
        <AuthSlot />
      </header>

      <section className="lab-grid relative overflow-hidden border-y border-hairline">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-steel">
            Orbita {ORIGIN_SNAPSHOT.version} · tenant isolated
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-tight text-paper sm:text-6xl">
            A Hodgeform of your own.
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Not a window into the origin tenant. Each account is a sealed research
            lab: cases, discovery operators, hash-bound experiments, an append-only
            evidence ledger, and governed problem loops.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {isPending ? (
              <div className="h-12 w-40 animate-pulse rounded-md bg-secondary" />
            ) : user ? (
              <Button size="lg" asChild>
                <Link to="/lab">
                  Enter your lab <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button size="lg" asChild>
                <Link to="/login">
                  Open a lab <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}
            <Button size="lg" variant="outline" asChild>
              <a href="#model">Read the model</a>
            </Button>
          </div>
          {!authEnabled ? (
            <p className="mt-4 text-sm text-muted-foreground">Sign-in is disabled.</p>
          ) : null}
        </div>
      </section>

      <section id="model" className="mx-auto grid max-w-6xl gap-px bg-hairline px-0 sm:grid-cols-3">
        {[
          {
            k: "Tenancy",
            t: "Subject-bound, not shared",
            d: "Every row is scoped to the signed-in account. The origin lab is a public snapshot, never copied into yours.",
          },
          {
            k: "Review",
            t: "Hash-bound freeze",
            d: "Operators, plans, and experiments freeze only against the exact SHA-256 of canonical JSON plus a confirmation phrase.",
          },
          {
            k: "Activation",
            t: "Receipts, not runtime",
            d: "The lab records executor receipts. It does not deploy code, promote policy, or activate architecture.",
          },
        ].map((item) => (
          <article key={item.k} className="bg-background px-6 py-10 sm:px-8">
            <p className="text-xs uppercase tracking-[0.16em] text-steel">{item.k}</p>
            <h2 className="mt-3 font-display text-2xl text-paper">{item.t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.d}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs uppercase tracking-[0.16em] text-steel">Discovery genome</p>
        <h2 className="mt-2 font-display text-3xl text-paper">Seven families. Nothing proven on import.</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Starter operators arrive as review_needed. Freeze is a deliberate act
          against the current review hash.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {STARTER_OPERATORS.map((op) => (
            <li key={op.operatorKey} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
              <p className="font-mono text-[11px] text-steel">{op.operatorKey}</p>
              <h3 className="mt-1 font-display text-lg text-paper">{op.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{op.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-hairline bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-xs uppercase tracking-[0.16em] text-steel">Evidence ledger</p>
          <h2 className="mt-2 font-display text-3xl text-paper">Bounded evidence cannot become universal.</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Each receipt is append-only, hashed, and eligible only for the decision
            kinds its source adapter allows. Architecture, code, and policy
            promotion stay prohibited.
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead>
                <tr className="border-b border-hairline text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Source</th>
                  <th className="py-3 font-medium">Allowed decisions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(ELIGIBILITY_POLICY).map(([kind, allowed]) => (
                  <tr key={kind} className="border-b border-hairline/70">
                    <td className="py-3 pr-4 font-mono text-xs text-steel">{kind}</td>
                    <td className="py-3 text-muted-foreground">{allowed.join(" · ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs uppercase tracking-[0.16em] text-steel">Problem loops</p>
        <h2 className="mt-2 font-display text-3xl text-paper">One admissible next state.</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          LLM proposes. Orbita governs the transition. Artifacts are hash-chained.
          Repair never auto-activates.
        </p>
        <ol className="mt-8 flex flex-wrap gap-2">
          {ORIGIN_SNAPSHOT.loopStates.map((s, i) => (
            <li
              key={s}
              className="rounded-sm bg-secondary px-2.5 py-1.5 font-mono text-[11px] tracking-wide text-paper"
            >
              <span className="text-muted-foreground">{String(i + 1).padStart(2, "0")} </span>
              {s}
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-hairline">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-xs uppercase tracking-[0.16em] text-steel">Origin snapshot</p>
          <h2 className="mt-2 font-display text-3xl text-paper">Public face of Hodgeform. Read-only.</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            The origin lab is not imported into new accounts. This is the model
            your lab implements locally, under your tenancy.
          </p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Product", ORIGIN_SNAPSHOT.product],
              ["Genome", ORIGIN_SNAPSHOT.genome],
              ["Tenancy", ORIGIN_SNAPSHOT.tenancy],
              ["Tool execution", ORIGIN_SNAPSHOT.safety.toolExecution],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
                <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{k}</dt>
                <dd className="mt-1 font-mono text-sm text-paper">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <footer className="border-t border-hairline px-4 py-8 text-center text-xs text-muted-foreground">
        Hodgeform Lab · Orbita {ORIGIN_SNAPSHOT.version} · no runtime activation
      </footer>
    </div>
  );
}
