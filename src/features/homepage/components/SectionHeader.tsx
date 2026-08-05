import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
  align?: "left" | "center";
}

export default function SectionHeader({
  eyebrow,
  title,
  action,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 md:mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn(align === "center" && "mx-auto max-w-3xl")}>
        <div
          className={cn(
            "flex items-center gap-3",
            align === "center" && "justify-center",
          )}
        >
          <span className="h-px w-8 bg-luxury-champagne/80" aria-hidden />
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-600">
            {eyebrow}
          </p>
        </div>
        <h2
          style={{
            fontFamily: "var(--font-droid-serif), serif",
            fontWeight: 400,
            lineHeight: 1.08,
          }}
          className="mt-4 text-[clamp(1.75rem,3.5vw,2.75rem)] tracking-tight text-luxury-ink"
        >
          {title}
        </h2>
      </div>

      {action ? (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-luxury-ink transition-colors hover:text-accent"
        >
          {action.label}
          <IconArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      ) : null}
    </div>
  );
}
