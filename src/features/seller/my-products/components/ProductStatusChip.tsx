import { cn } from "@/lib/utils";
import { PRODUCT_STATUS_CONFIG } from "@/constants";
import type { ProductStatusFilter } from "@/types/product";



type Tone = "progress" | "settled" | "attention" | "failed" | "neutral";

const TONE_BY_STATUS: Record<ProductStatusFilter, Tone> = {
  pending: "neutral",
  under_review: "progress",
  review_requested: "attention",
  rejected: "failed",
  approved: "settled",
  active: "settled",
  inactive: "neutral",
  sold: "progress",
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

interface ProductStatusChipProps {
  status: ProductStatusFilter | string;
  className?: string;
}

export function ProductStatusChip({
  status,
  className,
}: ProductStatusChipProps) {
  const key =
    (status as ProductStatusFilter) in TONE_BY_STATUS
      ? (status as ProductStatusFilter)
      : "pending";
  const tone = TONE_BY_STATUS[key];
  const label = PRODUCT_STATUS_CONFIG[key]?.label ?? key;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-[2px] border px-2.5 py-1 text-2xs font-medium uppercase tracking-[0.15em]",
        CHIP_CLASSES[tone],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("h-1 w-1 shrink-0 rounded-full", DOT_CLASSES[tone])}
      />
      {label}
    </span>
  );
}
