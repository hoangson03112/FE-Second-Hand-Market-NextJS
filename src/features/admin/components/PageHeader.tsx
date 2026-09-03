import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  eyebrow = "Quản trị hệ thống",
  title,
  description,
  actions,
  breadcrumb,
  badge,
  className,
  children,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4", className)}>
      {breadcrumb}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-luxury-champagne/80" aria-hidden />
            <p className="text-2xs font-bold uppercase tracking-[0.28em] text-neutral-600">
              {eyebrow}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-droid-serif text-[clamp(1.5rem,3vw,2.15rem)] leading-[1.1] tracking-tight text-luxury-ink">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2.5 flex-wrap">
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
