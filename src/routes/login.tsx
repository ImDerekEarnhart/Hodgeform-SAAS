import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { HodgeMark } from "@/components/hodge-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isPending) {
    return (
      <main className="grid min-h-dvh place-items-center bg-background">
        <div className="h-40 w-80 animate-pulse rounded-xl bg-secondary" />
      </main>
    );
  }
  if (user) return <Navigate to="/lab" />;

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0],
        });
        if (err) throw new Error(err.message ?? "Sign-up failed");
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) throw new Error(err.message ?? "Sign-in failed");
      }
      window.location.href = "/lab";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <HodgeMark className="size-7" />
          <span className="font-display text-xl text-paper">Hodgeform Lab</span>
        </Link>
        <div className="rounded-xl bg-card p-6 shadow-[var(--shadow-border)] sm:p-8">
          <h1 className="font-display text-2xl text-paper">
            {mode === "in" ? "Sign in" : "Create a lab"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your lab is private to this account. The origin tenant is never loaded in.
          </p>

          {authEnabled ? (
            <>
              <div className="mt-6 grid gap-2">
                {GROK_PROVIDERS.map((p) => (
                  <Button
                    key={p.providerId}
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => void signIn(p.providerId, { callbackURL: "/lab" })}
                  >
                    Continue with {p.label}
                  </Button>
                ))}
              </div>

              <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                or email
                <span className="h-px flex-1 bg-border" />
              </div>

              <form className="space-y-3" onSubmit={onEmail}>
                {mode === "up" ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                ) : null}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === "up" ? "new-password" : "current-password"}
                  />
                </div>
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Working…" : mode === "in" ? "Sign in" : "Create account"}
                </Button>
              </form>

              <button
                type="button"
                className="mt-4 w-full text-center text-sm text-muted-foreground underline-offset-4 hover:text-paper hover:underline"
                onClick={() => {
                  setMode(mode === "in" ? "up" : "in");
                  setError(null);
                }}
              >
                {mode === "in" ? "Need an account? Create a lab" : "Already have a lab? Sign in"}
              </button>
            </>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">Sign-in is disabled.</p>
          )}
        </div>
      </div>
    </main>
  );
}
