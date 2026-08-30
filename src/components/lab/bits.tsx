import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  CaseStatus,
  EpistemicStatus,
  ExperimentStatus,
  JsonValue,
  LoopState,
  OperatorStatus,
  TournamentStatus,
} from "@/lib/lab/types";

export function jsonStringField(value: JsonValue, key: string): string | undefined {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const inner = value[key];
    if (typeof inner === "string") return inner;
  }
  return undefined;
}

export function shortHash(hash: string) {
  if (!hash) return "—";
  if (hash.length <= 18) return hash;
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`;
}

export function HashChip({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={cn(
        "hash-chip inline-flex max-w-full items-center truncate rounded-sm bg-secondary px-2 py-1 text-[11px] text-steel hover:text-paper",
        className,
      )}
      title={value}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {
          toast.error("Could not copy hash.");
        }
      }}
    >
      {copied ? "copied" : shortHash(value)}
    </button>
  );
}

export function CaseBadge({ status }: { status: CaseStatus }) {
  const variant =
    status === "approved" || status === "completed"
      ? "frozen"
      : status === "failed"
        ? "danger"
        : status === "plan_ready"
          ? "paper"
          : status === "ingested"
            ? "steel"
            : "default";
  return <Badge variant={variant}>{status.replace("_", " ")}</Badge>;
}

export function OperatorBadge({ status }: { status: OperatorStatus }) {
  return <Badge variant={status === "frozen" ? "frozen" : "warn"}>{status.replace("_", " ")}</Badge>;
}

export function ExperimentBadge({ status }: { status: ExperimentStatus }) {
  const variant =
    status === "approved" || status === "recorded"
      ? "frozen"
      : status === "failed"
        ? "danger"
        : status === "staged" || status === "frozen"
          ? "steel"
          : "default";
  return <Badge variant={variant}>{status}</Badge>;
}

export function LoopBadge({ state }: { state: LoopState }) {
  return <Badge variant={state === "COMPLETED" ? "frozen" : "steel"}>{state}</Badge>;
}

export function ClaimBadge({ status }: { status: EpistemicStatus }) {
  const variant =
    status === "FALSIFIED"
      ? "danger"
      : status === "PROVED_ON_PAPER" || status === "USE_NOW"
        ? "frozen"
        : status === "FINITE_SURVIVOR"
          ? "steel"
          : status === "SUPERSEDED"
            ? "default"
            : "warn";
  return <Badge variant={variant}>{status.replaceAll("_", " ")}</Badge>;
}

export function TournamentBadge({ status }: { status: TournamentStatus }) {
  return <Badge variant={status === "frozen" || status === "completed" ? "frozen" : "default"}>{status}</Badge>;
}

export function PageHeader({
  kicker,
  title,
  description,
  actions,
}: {
  kicker?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {kicker ? (
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-steel">{kicker}</p>
        ) : null}
        <h1 className="font-display text-3xl font-medium tracking-tight text-paper sm:text-4xl">{title}</h1>
        {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl bg-card px-6 py-14 text-center shadow-[var(--shadow-border)]">
      <h2 className="font-display text-xl text-paper">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function errMessage(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong.";
}
