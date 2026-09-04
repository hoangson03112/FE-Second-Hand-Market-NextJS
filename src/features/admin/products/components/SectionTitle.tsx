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
      <div className="p-1 rounded-[2px] bg-cream-50 border border-luxury-ink/10">
        <Icon className="w-3.5 h-3.5 text-luxury-ink" />
      </div>
      <h3 className="text-2xs font-bold text-luxury-ink uppercase tracking-[0.14em]">
        {title}
      </h3>
      {count !== undefined && (
        <span className="ml-auto text-2xs font-bold text-neutral-500 bg-cream-50 border border-luxury-ink/10 px-2 py-0.5 rounded-[2px]">
          {count}
        </span>
      )}
    </div>
  );
}
