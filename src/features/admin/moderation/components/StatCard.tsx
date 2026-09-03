import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export default function StatCard({ icon, title, children }: StatCardProps) {
  return (
    <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-5 sm:p-6 flex flex-col justify-between">
      <div className="flex items-center gap-2.5 text-neutral-500 mb-3 border-b border-luxury-ink/8 pb-3">
        <div className="w-8 h-8 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink flex items-center justify-center shrink-0">
          {icon}
        </div>
        <span className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
          {title}
        </span>
      </div>
      <div>{children}</div>
    </div>
  );
}
