"use client";

import * as React from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  /** Show the numeric value next to the stars. */
  showValue?: boolean;
  /** Number of reviews, shown as "(N)". */
  count?: number;
  /** When provided (and not `readOnly`), the rating becomes interactive. */
  onChange?: (value: number) => void;
  readOnly?: boolean;
  className?: string;
}

const STAR_SIZE = { sm: "size-3.5", md: "size-4", lg: "size-5" } as const;

/**
 * Rating — star rating display (whole-star), optionally interactive via
 * `onChange`.
 */
export function Rating({
  value,
  max = 5,
  size = "md",
  showValue,
  count,
  onChange,
  readOnly,
  className,
}: RatingProps) {
  const [hover, setHover] = React.useState<number | null>(null);
  const interactive = !!onChange && !readOnly;
  const display = hover ?? value;

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="inline-flex items-center">
        {Array.from({ length: max }).map((_, index) => {
          const filled = index + 1 <= Math.round(display);
          return (
            <Star
              key={index}
              className={cn(
                STAR_SIZE[size],
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-muted-foreground/40",
                interactive && "cursor-pointer transition-colors"
              )}
              onMouseEnter={interactive ? () => setHover(index + 1) : undefined}
              onMouseLeave={interactive ? () => setHover(null) : undefined}
              onClick={interactive ? () => onChange?.(index + 1) : undefined}
            />
          );
        })}
      </span>
      {showValue && (
        <span className="text-sm font-medium text-foreground">{value.toFixed(1)}</span>
      )}
      {typeof count === "number" && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </span>
  );
}
