import { STATUS_CONFIG } from "@/constants/orderStatus";

const DOT_COLORS: Record<string, string> = {
  pending: "bg-primary/50",
  confirmed: "bg-primary/70",
  picked_up: "bg-primary/80",
  shipping: "bg-primary",
  out_for_delivery: "bg-primary",
  delivered: "bg-foreground/60",
  completed: "bg-foreground",
  failed: "bg-destructive",
  delivery_failed: "bg-destructive",
  returning: "bg-amber-500",
  return_shipping: "bg-amber-500",
  refund: "bg-orange-500",
  returned: "bg-emerald-500",
  cancelled: "bg-muted-foreground",
  refund_requested: "bg-orange-500",
  refund_approved: "bg-blue-500",
  refunded: "bg-violet-500",
  disputed: "bg-purple-500",
  processing: "bg-blue-500",
  bank_info_required: "bg-amber-600",
  approved: "bg-sky-500",
  rejected: "bg-destructive",
};

export type StatusTone = "success" | "warning" | "error" | "info" | "muted" | "default";

interface StatusBadgeProps {
  status?: string;
  size?: "sm" | "md";
  className?: string;
  tone?: StatusTone;
  dot?: boolean;
  children?: React.ReactNode;
}

const TONE_CLASSES: Record<StatusTone, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  error: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  muted: "bg-neutral-50 text-neutral-700 border-neutral-200",
  default: "bg-primary/10 text-primary border-primary/20",
};

export function StatusBadge({ status, size = "sm", className = "", tone, dot = true, children }: StatusBadgeProps) {
  if (tone && children) {
    const toneClass = TONE_CLASSES[tone] || TONE_CLASSES.default;
    return (
      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${toneClass} ${className}`}>
        {dot && <span className={`mr-1.5 h-1.5 w-1.5 rounded-full bg-current`} />}
        {children}
      </span>
    );
  }

  const cfg = STATUS_CONFIG[status || "pending"] || STATUS_CONFIG.pending;
  const dotColor = DOT_COLORS[status || "pending"] || "bg-neutral-400";

  const sizeClasses =
    size === "md"
      ? "px-4 py-2 text-sm font-semibold gap-2"
      : "px-3 py-1.5 text-xs font-semibold gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full border ${cfg.bgColor} ${cfg.color} ${sizeClasses} ${className}`}
    >
      {dot && <span className={`shrink-0 rounded-full ${dotColor} ${size === "md" ? "w-2 h-2" : "w-1.5 h-1.5"}`} />}
      {cfg.label}
    </span>
  );
}
