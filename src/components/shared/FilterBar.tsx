"use client";

import * as React from "react";
import { SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FilterBarProps {
  /** Filter controls (AppSelect, SearchInput, etc.). */
  children: React.ReactNode;
  title?: React.ReactNode;
  /** Number of active filters — shows a "clear" button when > 0. */
  activeCount?: number;
  onClear?: () => void;
  /** Extra content aligned to the right (e.g. a sort select or view toggle). */
  right?: React.ReactNode;
  className?: string;
}

/**
 * FilterBar — a responsive toolbar container for filter controls, with an
 * optional title and a "clear filters" action.
 */
export function FilterBar({
  children,
  title,
  activeCount,
  onClear,
  right,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {title && (
          <span className="mr-1 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <SlidersHorizontal className="size-4" />
            {title}
          </span>
        )}
        {children}
      </div>
      {(right || (!!activeCount && onClear)) && (
        <div className="flex items-center gap-2">
          {right}
          {!!activeCount && onClear && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
            >
              <X className="size-4 mr-2" />
              Xóa lọc ({activeCount})
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
