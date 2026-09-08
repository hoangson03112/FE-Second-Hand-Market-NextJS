import { STATUS_CONFIG } from "@/constants/orderStatus";


const DOT_COLORS: Record<string, string> = {
  pending: "bg-neutral-400",
  confirmed: "bg-luxury-ink",
  picked_up: "bg-luxury-ink",
  shipping: "bg-luxury-ink",
  out_for_delivery: "bg-luxury-ink",
  delivered: "bg-luxury-ink",
  completed: "bg-accent",


  failed: "bg-blush-600",
  delivery_failed: "bg-blush-600",
  returning: "bg-luxury-champagne",
  return_shipping: "bg-luxury-champagne",
  refund: "bg-luxury-champagne",
  returned: "bg-accent",
  cancelled: "bg-blush-600",
  refund_requested: "bg-luxury-champagne",
  refund_approved: "bg-luxury-champagne",
  refunded: "bg-accent",
  disputed: "bg-blush-600",
  processing: "bg-luxury-champagne",
  bank_info_required: "bg-luxury-champagne",
  approved: "bg-luxury-champagne",
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
      className={`inline-flex items-center rounded-[2px] border ${cfg.bgColor} ${cfg.color} ${sizeClasses} ${className}`}
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
