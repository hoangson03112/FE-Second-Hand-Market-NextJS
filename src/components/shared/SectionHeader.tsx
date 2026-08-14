import * as React from "react";

import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * SectionHeader — heading for a section within a page (smaller than PageHeader).
 */
export function SectionHeader({
  title,
  description,
  action,
  icon,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn("mb-4 flex items-center justify-between gap-3", className)}
    >
      <div className="flex items-center gap-2">
        {icon && (
          <span className="text-muted-foreground [&_svg]:size-5">{icon}</span>
        )}
        <div>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
