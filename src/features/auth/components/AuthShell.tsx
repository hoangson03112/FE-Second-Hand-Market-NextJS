"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { IconArrowLeft } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/features/homepage/hooks";

const EASE = [0.22, 1, 0.36, 1] as const;

const NOISE_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

interface AuthShellProps {
  /** Dark editorial column, shown from `lg` up. */
  panel: React.ReactNode;
  /** Form column content. */
  children: React.ReactNode;
  /** Max width of the form column content. */
  size?: "narrow" | "wide";
}

export default function AuthShell({
  panel,
  children,
  size = "narrow",
}: AuthShellProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section className="relative w-full overflow-hidden bg-luxury-ivory">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 100% -10%, var(--cream-50) 0%, var(--cream-100) 45%, var(--cream-200) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-taupe-200/25 blur-3xl animate-hero-glow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{ backgroundImage: NOISE_TEXTURE }}
      />

      <div className="relative z-10 grid grid-cols-1 items-stretch lg:min-h-[calc(100svh_-_62px)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:block">{panel}</div>

        <div className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-14 lg:py-16 xl:px-20">
          <motion.div
            className={cn(
              "w-full",
              size === "wide" ? "max-w-xl" : "max-w-[26.5rem]",
            )}
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            <div className="mb-10 flex items-center justify-between gap-4 lg:hidden">
              <Link
                href="/"
                className="inline-flex items-baseline gap-3 text-luxury-ink"
              >
                <span
                  className="text-lg tracking-tight"
                  style={{ fontFamily: "var(--font-droid-serif), serif" }}
                >
                  Eco Market
                </span>
                <span
                  aria-hidden
                  className="h-px w-8 translate-y-[-0.3rem] bg-luxury-champagne"
                />
              </Link>
              <Link
                href="/"
                className="group inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500 transition-colors hover:text-luxury-ink"
              >
                <IconArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                Trang chủ
              </Link>
            </div>

            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
