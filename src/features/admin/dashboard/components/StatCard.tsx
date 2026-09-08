import Link from "next/link";
import { cn } from "@/lib/utils";

export type StatCardTone =
  | "progress"
  | "settled"
  | "attention"
  | "failed"
  | "neutral";

interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  href?: string;
  tone?: StatCardTone;
  className?: string;
}

export default function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  href,
  className,
}: StatCardProps) {
  const content = (
    <div
      className={cn(
        "rounded-[2px] border border-luxury-ink/10 bg-white p-5 sm:p-6 transition-all duration-300 hover:border-luxury-ink/30 group relative overflow-hidden",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500 truncate">
            {title}
          </p>
          <p className="font-droid-serif mt-2.5 text-2xl sm:text-3xl text-luxury-ink tabular-nums leading-none">
            {value}
          </p>
          {sub != null && (
            <p className="mt-2 text-xs text-neutral-500 flex items-center gap-1 leading-snug">
              {sub}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-[2px] border border-luxury-ink/10 bg-cream-50 flex items-center justify-center shrink-0 text-luxury-ink transition-transform group-hover:scale-105">
          <Icon className="w-4 h-4" />
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
