import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export default function StatCard({ icon, title, children }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div className="flex items-center gap-2.5 text-muted-foreground mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          {icon}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
      </div>
      <div>{children}</div>
    </div>
  );
}
