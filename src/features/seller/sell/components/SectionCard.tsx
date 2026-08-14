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
      className={`rounded-2xl border-2 border-border bg-gradient-to-br from-cream-50 to-white shadow-sm overflow-hidden flex flex-col ${className}`}
    >
      <div className="flex items-center gap-2 px-3.5 py-3 bg-taupe-50/70 border-b-2 border-border shrink-0">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-primary" />
        </div>
        <h3 className="text-xs font-bold text-taupe-900 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="p-3.5 space-y-3 flex-1 min-h-0">{children}</div>
    </div>
  );
}
