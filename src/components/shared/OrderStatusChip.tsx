import { getOrderStatusLabel } from "@/constants/orderStatus";
import { cn } from "@/lib/utils";

/**
 * Order status in the quiet-luxury language: a hairline 2px chip with a single
 * tonal dot, instead of the saturated pills used on the admin/seller screens.
 *
 * Kept separate from `StatusBadge` on purpose — that one is shared with admin
 * and seller surfaces whose look should not shift.
 */

type Tone = "progress" | "settled" | "attention" | "failed" | "neutral";

const TONE_BY_STATUS: Record<string, Tone> = {
  pending: "neutral",
  confirmed: "progress",
  picked_up: "progress",
  shipping: "progress",
  out_for_delivery: "progress",
  delivered: "progress",
  completed: "settled",
  refunded: "settled",
  returned: "settled",
  failed: "failed",
  delivery_failed: "failed",
  cancelled: "failed",
  rejected: "failed",
  refund: "attention",
  refund_requested: "attention",
  refund_approved: "attention",
  returning: "attention",
  return_shipping: "attention",
  disputed: "attention",
  processing: "attention",
  bank_info_required: "attention",
  approved: "attention",
};

const CHIP_CLASSES: Record<Tone, string> = {
  progress: "border-luxury-ink/20 bg-white text-luxury-ink",
  settled: "border-accent/35 bg-taupe-50 text-taupe-700",
  attention: "border-luxury-champagne/50 bg-cream-100 text-neutral-700",
  failed: "border-blush-300 bg-blush-50 text-blush-800",
  neutral: "border-luxury-ink/12 bg-cream-50 text-neutral-600",
};

const DOT_CLASSES: Record<Tone, string> = {
  progress: "bg-luxury-ink",
  settled: "bg-accent",
  attention: "bg-luxury-champagne",
  failed: "bg-blush-600",
  neutral: "bg-neutral-400",
};

interface OrderStatusChipProps {
  status?: string;
  className?: string;
}

export function OrderStatusChip({ status, className }: OrderStatusChipProps) {
  const tone = TONE_BY_STATUS[status ?? ""] ?? "neutral";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-[2px] border px-2.5 py-1 text-2xs font-bold uppercase tracking-[0.2em]",
        CHIP_CLASSES[tone],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("h-1 w-1 shrink-0 rounded-full", DOT_CLASSES[tone])}
      />
      {getOrderStatusLabel(status)}
    </span>
  );
}

export default OrderStatusChip;
