

export type StatusTone =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "muted"
  | "default";

const TONE_CLASSES: Record<StatusTone, string> = {
  success: "bg-taupe-50 text-taupe-700 border-accent/35",
  warning: "bg-cream-100 text-neutral-700 border-luxury-champagne/50",
  error: "bg-blush-50 text-blush-700 border-blush-200",
  info: "bg-cream-50 text-luxury-ink border-luxury-ink/15",
  muted: "bg-taupe-50 text-neutral-600 border-luxury-ink/10",
  default: "bg-cream-50 text-luxury-ink border-luxury-ink/10",
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
      className={`inline-flex items-center rounded-[2px] border px-2 py-0.5 text-2xs font-bold uppercase tracking-[0.12em] ${toneClass} ${className}`}
    >
      {dot && <span className="mr-1.5 h-1.5 w-1.5 rounded-[1px] bg-current opacity-70" />}
      {children}
    </span>
  );
}
