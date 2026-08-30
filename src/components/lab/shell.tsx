import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bookmark,
  Files,
  FlaskConical,
  Hexagon,
  LayoutGrid,
  Menu,
  Repeat,
  Scale,
  ScrollText,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { HodgeMark } from "@/components/hodge-mark";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/lab", label: "Overview", icon: LayoutGrid, exact: true },
  { to: "/lab/cases", label: "Cases", icon: Files, exact: false },
  { to: "/lab/genome", label: "Genome", icon: Hexagon, exact: false },
  { to: "/lab/evidence", label: "Evidence", icon: ScrollText, exact: false },
  { to: "/lab/experiments", label: "Experiments", icon: FlaskConical, exact: false },
  { to: "/lab/loops", label: "Loops", icon: Repeat, exact: false },
  { to: "/lab/claims", label: "Claims", icon: Bookmark, exact: false },
  { to: "/lab/governance", label: "Governance", icon: Scale, exact: false },
] as const;

export function LabShell({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  if (isPending) {
    return (
      <div className="flex min-h-dvh bg-background">
        <aside className="hidden w-60 shrink-0 border-r border-hairline bg-card md:block" />
        <div className="flex-1 p-8">
          <div className="h-8 w-48 animate-pulse rounded-md bg-secondary" />
          <div className="mt-6 h-40 animate-pulse rounded-xl bg-secondary" />
        </div>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  const label = user.displayName ?? user.primaryEmail ?? "Account";

  const nav = (
    <nav className="flex flex-col gap-0.5">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={cn(
              "flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors",
              active ? "bg-secondary text-paper" : "text-muted-foreground hover:bg-secondary/70 hover:text-paper",
            )}
          >
            <Icon className="size-4" strokeWidth={1.75} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-hairline bg-card md:flex">
        <Link to="/" className="flex items-center gap-2.5 px-4 py-5">
          <HodgeMark className="size-7" />
          <span className="font-display text-lg tracking-tight text-paper">Hodgeform Lab</span>
        </Link>
        <div className="flex-1 px-3">{nav}</div>
        <div className="border-t border-hairline px-4 py-4">
          <p className="truncate text-sm text-paper">{label}</p>
          <p className="truncate font-mono text-[11px] text-muted-foreground">{user.id.slice(0, 16)}</p>
          <button
            type="button"
            disabled={signingOut}
            onClick={() => {
              setSigningOut(true);
              void signOut("/").catch(() => setSigningOut(false));
            }}
            className="mt-2 text-xs text-muted-foreground underline-offset-4 hover:text-paper hover:underline"
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-hairline px-4 py-3 md:hidden">
          <Link to="/" className="flex items-center gap-2">
            <HodgeMark className="size-6" />
            <span className="font-display text-base text-paper">Hodgeform Lab</span>
          </Link>
          <Button variant="ghost" size="icon" aria-label="Menu" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </Button>
        </header>

        {open ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-ink/70"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />
            <div className="relative flex h-full w-72 max-w-[85%] flex-col bg-card p-4 shadow-[var(--shadow-border)]">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-lg text-paper">Lab</span>
                <Button variant="ghost" size="icon" aria-label="Close" onClick={() => setOpen(false)}>
                  <X className="size-5" />
                </Button>
              </div>
              {nav}
              <div className="mt-auto border-t border-hairline pt-4">
                <p className="truncate text-sm">{label}</p>
                <button
                  type="button"
                  className="mt-2 text-xs text-muted-foreground underline-offset-4 hover:underline"
                  onClick={() => {
                    setSigningOut(true);
                    void signOut("/").catch(() => setSigningOut(false));
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
