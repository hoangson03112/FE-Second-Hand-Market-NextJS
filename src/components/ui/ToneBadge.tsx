/**
 * A small pill that carries a semantic tone. Domain-free on purpose — it knows
 * nothing about orders; callers decide what the tone means.
 *
 * Named `ToneBadge` rather than `Badge` so it can never collide with a future
 * `npx shadcn add badge` (Windows filenames are case-insensitive).
 */

export type StatusTone =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "muted"
  | "default";

const TONE_CLASSES: Record<StatusTone, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  error: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  muted: "bg-neutral-50 text-neutral-700 border-neutral-200",
  default: "bg-primary/10 text-primary border-primary/20",
};

interface ToneBadgeProps {
  tone?: StatusTone;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function ToneBadge({
  tone = "default",
  dot = true,
  className = "",
  children,
}: ToneBadgeProps) {
  const toneClass = TONE_CLASSES[tone] || TONE_CLASSES.default;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold ${toneClass} ${className}`}
    >
      {dot && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
