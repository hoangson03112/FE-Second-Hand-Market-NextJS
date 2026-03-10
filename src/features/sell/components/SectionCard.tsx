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
      className={`rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col ${className}`}
    >
      <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/50 border-b border-border shrink-0">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-primary" />
        </div>
        <h3 className="text-xs font-semibold text-foreground">{title}</h3>
      </div>
      <div className="p-3 space-y-3 flex-1 min-h-0">{children}</div>
    </div>
  );
}
