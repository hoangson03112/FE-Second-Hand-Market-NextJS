import Link from "next/link";
import { cn } from "@/lib/utils";

export type StatCardTone = "emerald" | "blue" | "amber" | "purple" | "rose" | "default";

interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  href?: string;
  tone?: StatCardTone;
  className?: string;
}

const TONE_STYLES: Record<
  StatCardTone,
  { iconBg: string; iconColor: string; badgeBg?: string }
> = {
  emerald: {
    iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    iconColor: "text-emerald-600",
  },
  blue: {
    iconBg: "bg-sky-50 text-sky-600 border border-sky-100",
    iconColor: "text-sky-600",
  },
  amber: {
    iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
    iconColor: "text-amber-600",
  },
  purple: {
    iconBg: "bg-purple-50 text-purple-600 border border-purple-100",
    iconColor: "text-purple-600",
  },
  rose: {
    iconBg: "bg-rose-50 text-rose-600 border border-rose-100",
    iconColor: "text-rose-600",
  },
  default: {
    iconBg: "bg-primary/8 text-primary border border-primary/15",
    iconColor: "text-primary",
  },
};

export default function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  href,
  tone = "default",
  className,
}: StatCardProps) {
  const toneStyle = TONE_STYLES[tone] || TONE_STYLES.default;

  const content = (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-primary/20 group relative overflow-hidden",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
            {title}
          </p>
          <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums">
            {value}
          </p>
          {sub != null && (
            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1 leading-snug">
              {sub}
            </p>
          )}
        </div>
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
            toneStyle.iconBg
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block group">
        {content}
      </Link>
    );
  }

  return content;
}
