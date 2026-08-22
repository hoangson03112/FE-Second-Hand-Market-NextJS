import * as React from "react";

import { cn } from "@/lib/utils";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * One placeholder bone. Defaults to the project's editorial look
 * (2px corners, ink at 8%) — the same recipe feature-level skeletons use.
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      // `bg-muted` compiles to nothing here (no `--color-muted` token), which
      // left every skeleton invisible unless the caller passed its own colour.
      className={cn("animate-pulse rounded-[2px] bg-luxury-ink/8", className)}
      {...props}
    />
  );
}

interface CardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
}

export function CardSkeleton({
  rows = 3,
  className,
  ...props
}: CardSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-[2px] border border-luxury-ink/10 bg-white p-4",
        className
      )}
      {...props}
    >
      <Skeleton className="h-40 w-full" />
      <div className="mt-4 space-y-2.5">
        <Skeleton className="h-4 w-2/3" />
        {Array.from({ length: rows }).map((_, idx) => (
          <Skeleton key={idx} className="h-3 w-full" />
        ))}
      </div>
    </div>
  );
}

interface TableSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
  ...props
}: TableSkeletonProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white",
        className
      )}
      {...props}
    >
      <div
        className="grid gap-3 border-b border-luxury-ink/10 bg-charcoal-50 p-4"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: columns }).map((_, idx) => (
          <Skeleton key={idx} className="h-4 w-3/4" />
        ))}
      </div>
      <div className="space-y-3 p-4">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((__, colIdx) => (
              <Skeleton key={colIdx} className="h-3.5 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface GridSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** How many cards to lay out. */
  count?: number;
  /** Aspect ratio of the media area of each card. */
  aspect?: string;
  /** Column classes — override to match the real grid of the page. */
  columnsClassName?: string;
}

/**
 * Catalogue grid: the shape a product listing takes while its query resolves
 * (all products, search results, a category page).
 */
export function GridSkeleton({
  count = 8,
  aspect = "aspect-[3/4]",
  columnsClassName = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  className,
  ...props
}: GridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid gap-x-6 gap-y-12 sm:gap-x-8",
        columnsClassName,
        className
      )}
      {...props}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex flex-col space-y-4">
          <Skeleton className={cn("w-full rounded-none", aspect)} />
          <div className="space-y-3 pt-2">
            <Skeleton className="h-3 w-full rounded-none" />
            <Skeleton className="h-3 w-2/3 rounded-none" />
            <Skeleton className="mt-4 h-4 w-1/3 rounded-none" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface ListSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  /** Square media block on the left of each row. */
  withMedia?: boolean;
}

/**
 * Stacked record cards: the shape a list of orders / requests takes while its
 * query resolves.
 */
export function ListSkeleton({
  rows = 4,
  withMedia = true,
  className,
  ...props
}: ListSkeletonProps) {
  return (
    <div className={cn("space-y-5", className)} {...props}>
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-[2px] border border-luxury-ink/10 bg-white p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-3 w-40 max-w-[45%]" />
            <Skeleton className="h-6 w-24" />
          </div>

          <div className="mt-5 flex gap-4">
            {withMedia ? <Skeleton className="h-20 w-20 shrink-0" /> : null}
            <div className="flex-1 space-y-2.5">
              <Skeleton className="h-3.5 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
