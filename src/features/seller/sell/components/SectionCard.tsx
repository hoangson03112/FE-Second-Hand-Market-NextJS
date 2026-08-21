import type { ElementType, ReactNode } from "react";

interface SectionCardProps {
  icon: ElementType;
  title: string;
  children: ReactNode;
  className?: string;
}

export function SectionCard({
  icon: Icon,
  title,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white ${className}`}
    >
      <div className="flex shrink-0 items-center gap-3 border-b border-luxury-ink/10 bg-cream-50/70 px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-white">
          <Icon className="h-3.5 w-3.5 text-luxury-ink" />
        </div>
        <h3 className="text-2xs font-semibold uppercase tracking-[0.22em] text-luxury-ink">
          {title}
        </h3>
      </div>
      <div className="min-h-0 flex-1 space-y-4 p-4">{children}</div>
    </div>
  );
}
