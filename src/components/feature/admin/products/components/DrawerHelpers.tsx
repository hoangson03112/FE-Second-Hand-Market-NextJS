import React from "react";

export function SectionTitle({
  icon: Icon,
  title,
  count,
}: {
  icon: React.ElementType;
  title: string;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="p-1.5 rounded-lg bg-primary/10">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
        {title}
      </h3>
      {count !== undefined && (
        <span className="ml-auto text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}

export function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-border/40 last:border-0">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-xs font-medium text-foreground text-right">
        {String(value)}
      </span>
    </div>
  );
}
