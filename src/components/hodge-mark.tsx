import { cn } from "@/lib/utils";

export function HodgeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-paper", className)}
      fill="none"
      aria-hidden
    >
      <rect x="3.5" y="3.5" width="25" height="25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 22.5 L16 8.5 L24 22.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M11.2 16.8 H20.8" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="16" cy="16.8" r="1.15" fill="currentColor" />
    </svg>
  );
}
