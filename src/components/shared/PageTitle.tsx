import * as React from "react";

import { cn } from "@/lib/utils";

export interface PageTitleProps {
  children: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  as?: "h1" | "h2";
}

/**
 * PageTitle — a simple page title (with optional icon + subtitle). Lighter than
 * {@link PageHeader} when you just need a heading.
 */
export function PageTitle({
  children,
  subtitle,
  icon,
  className,
  as: Tag = "h1",
}: PageTitleProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <Tag className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
        {icon && <span className="text-primary [&_svg]:size-6">{icon}</span>}
        {children}
      </Tag>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
