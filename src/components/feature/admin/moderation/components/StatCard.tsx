import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export default function StatCard({ icon, title, children }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span className="text-xs font-medium">{title}</span>
      </div>
      {children}
    </div>
  );
}
