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
        "flex flex-col items-center justify-center text-center rounded-[2px] border border-dashed border-luxury-ink/15 bg-white",
        size === "sm" ? "px-4 py-8" : "px-6 py-14",
        className,
      )}
    >
      {icon && (
        <div
          className={cn(
            "mb-4 flex items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink",
            size === "sm" ? "size-10 [&_svg]:size-5" : "size-14 [&_svg]:size-6",
          )}
        >
          {icon}
        </div>
      )}
      <h3
        className={cn(
          "font-droid-serif font-bold text-luxury-ink",
          size === "sm" ? "text-base" : "text-lg",
        )}
      >
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 max-w-md text-xs leading-relaxed text-neutral-500">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
