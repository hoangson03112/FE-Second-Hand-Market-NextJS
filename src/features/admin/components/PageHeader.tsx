import * as React from "react";

import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned actions (buttons, etc.). */
  actions?: React.ReactNode;
  /** Optional breadcrumb rendered above the title. */
  breadcrumb?: React.ReactNode;
  /** Optional badge next to title */
  badge?: React.ReactNode;
  className?: string;
  /** Extra content rendered below the header row (e.g. tabs, a FilterBar). */
  children?: React.ReactNode;
}

/**
 * PageHeader — page-level header with title, description, breadcrumb slot and
 * right-aligned actions.
 */
export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  badge,
  className,
  children,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6 flex flex-col gap-4", className)}>
      {breadcrumb}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2 flex-wrap">
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
