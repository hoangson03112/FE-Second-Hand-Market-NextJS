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

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({ status, size = "sm", className = "" }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const dotColor = DOT_COLORS[status] || "bg-neutral-400";

  const sizeClasses =
    size === "md"
      ? "px-4 py-2 text-sm font-semibold gap-2"
      : "px-3 py-1.5 text-xs font-semibold gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full border ${cfg.bgColor} ${cfg.color} ${sizeClasses} ${className}`}
    >
      <span className={`shrink-0 rounded-full ${dotColor} ${size === "md" ? "w-2 h-2" : "w-1.5 h-1.5"}`} />
      {cfg.label}
    </span>
  );
}
