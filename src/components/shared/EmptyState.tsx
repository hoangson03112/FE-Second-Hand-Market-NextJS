import * as React from "react";

import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}

/**
 * EmptyState — centered placeholder for empty/blank content areas.
 * Base for {@link NoData} and {@link ErrorState}.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  size = "md",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        size === "sm" ? "px-4 py-8" : "px-6 py-14",
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            "mb-4 flex items-center justify-center rounded-full bg-muted text-muted-foreground",
            size === "sm" ? "size-12 [&_svg]:size-6" : "size-16 [&_svg]:size-8"
          )}
        >
          {icon}
        </div>
      )}
      <h3 className={cn("font-semibold text-foreground", size === "sm" ? "text-base" : "text-lg")}>
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
