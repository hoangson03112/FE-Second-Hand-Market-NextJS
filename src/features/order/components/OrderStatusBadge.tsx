import { STATUS_CONFIG } from "@/constants/orderStatus";

/**
 * Colour-coded pill for an order **or refund** status — both live in
 * `STATUS_CONFIG`. Domain-aware, hence it sits with the order feature rather
 * than in `components/ui`.
 *
 * For the quiet-luxury screens use `OrderStatusChip` instead; this one keeps
 * the saturated palette the admin and seller tables were built around.
 */

const DOT_COLORS: Record<string, string> = {
  pending: "bg-primary/50",
  confirmed: "bg-primary/70",
  picked_up: "bg-primary/80",
  shipping: "bg-primary",
  out_for_delivery: "bg-primary",
  delivered: "bg-foreground/60",
  completed: "bg-foreground",
  // `bg-destructive` / `bg-muted-foreground` compile to nothing in this token
  // set, so those dots used to be invisible.
  failed: "bg-blush-600",
  delivery_failed: "bg-blush-600",
  returning: "bg-amber-500",
  return_shipping: "bg-amber-500",
  refund: "bg-orange-500",
  returned: "bg-emerald-500",
  cancelled: "bg-neutral-400",
  refund_requested: "bg-orange-500",
  refund_approved: "bg-blue-500",
  refunded: "bg-violet-500",
  disputed: "bg-purple-500",
  processing: "bg-blue-500",
  bank_info_required: "bg-amber-600",
  approved: "bg-sky-500",
  rejected: "bg-blush-600",
};

interface OrderStatusBadgeProps {
  status?: string;
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

export function OrderStatusBadge({
  status,
  size = "sm",
  dot = true,
  className = "",
}: OrderStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status || "pending"] || STATUS_CONFIG.pending;
  const dotColor = DOT_COLORS[status || "pending"] || "bg-neutral-400";

  const sizeClasses =
    size === "md"
      ? "px-4 py-2 text-sm font-bold gap-2"
      : "px-3 py-1.5 text-xs font-bold gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full border ${cfg.bgColor} ${cfg.color} ${sizeClasses} ${className}`}
    >
      {dot && (
        <span
          className={`shrink-0 rounded-full ${dotColor} ${size === "md" ? "w-2 h-2" : "w-1.5 h-1.5"}`}
        />
      )}
      {cfg.label}
    </span>
  );
}
