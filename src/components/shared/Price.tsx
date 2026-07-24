import * as React from "react";

import { formatPrice, getDiscountStats } from "@/utils/format/price";
import { cn } from "@/lib/utils";

export interface PriceProps {
  value: number;
  /** Original (pre-discount) price — rendered struck-through when higher. */
  original?: number;
  /** Show the discount percentage badge when there is a discount. */
  showDiscount?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = { sm: "text-sm", md: "text-base", lg: "text-2xl" } as const;

/**
 * Price — formatted VND price with optional original price + discount badge.
 * Uses the shared `formatPrice` / `getDiscountStats` helpers.
 */
export function Price({
  value,
  original,
  showDiscount = true,
  size = "md",
  className,
}: PriceProps) {
  const hasDiscount = typeof original === "number" && original > value;
  const discountPercent = hasDiscount
    ? getDiscountStats(original as number, value).discountPercent
    : 0;

  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className={cn("font-bold text-foreground", SIZE_MAP[size])}>
        {formatPrice(value)}
      </span>
      {hasDiscount && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(original as number)}
        </span>
      )}
      {hasDiscount && showDiscount && discountPercent > 0 && (
        <span className="rounded-md bg-destructive/10 px-1.5 py-0.5 text-xs font-semibold text-destructive">
          -{discountPercent}%
        </span>
      )}
    </span>
  );
}
