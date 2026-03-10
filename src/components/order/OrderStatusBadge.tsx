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
  returned: "bg-accent",
  cancelled: "bg-muted-foreground",
  delivery_failed: "bg-destructive",
  returning: "bg-accent",
  refund_requested: "bg-accent/60",
  refund_approved: "bg-primary/60",
  refunded: "bg-muted-foreground",
};

interface OrderStatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function OrderStatusBadge({
  status,
  size = "sm",
  className = "",
}: OrderStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const dotColor = DOT_COLORS[status] ?? "bg-neutral-400";

  const sizeClasses =
    size === "lg"
      ? "px-4 py-2 text-sm font-semibold gap-2"
      : size === "md"
        ? "px-3.5 py-1.5 text-xs font-semibold gap-2"
        : "px-2.5 py-1 text-xs font-medium gap-1.5";

  const dotSize =
    size === "lg" ? "w-2 h-2" : size === "md" ? "w-1.5 h-1.5" : "w-1.5 h-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full border ${cfg.bgColor} ${cfg.color} ${sizeClasses} ${className}`}
    >
      <span className={`shrink-0 rounded-full ${dotColor} ${dotSize}`} />
      {cfg.label}
    </span>
  );
}
