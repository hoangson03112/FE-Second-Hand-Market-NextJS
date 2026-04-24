import * as React from "react";

import { cn } from "@/lib/utils";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
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
    <div className={cn("rounded-xl border border-border bg-card p-4", className)} {...props}>
      <Skeleton className="h-40 w-full rounded-lg" />
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
      className={cn("overflow-hidden rounded-xl border border-border", className)}
      {...props}
    >
      <div className="grid gap-3 border-b border-border bg-muted/40 p-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
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
