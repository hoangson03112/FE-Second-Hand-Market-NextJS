import * as React from "react";

import { cn } from "@/lib/utils";

export interface CurrencyProps {
  value: number;
  currency?: string;
  locale?: string;
  /** Render the grouped number without the currency symbol. */
  plain?: boolean;
  className?: string;
}

/**
 * Currency — inline formatted currency amount (VND by default).
 * For product pricing with discounts use {@link Price}.
 */
export function Currency({
  value,
  currency = "VND",
  locale = "vi-VN",
  plain,
  className,
}: CurrencyProps) {
  const text = plain
    ? new Intl.NumberFormat(locale).format(value)
    : new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);

  return <span className={cn("tabular-nums", className)}>{text}</span>;
}
