"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { IconArrowLeft } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/features/homepage/hooks";
import Image from "next/image";

const EASE = [0.22, 1, 0.36, 1] as const;

interface AuthShellProps {
  panel: React.ReactNode;
  children: React.ReactNode;

  size?: "narrow" | "wide";
}

export default function AuthShell({
  panel,
  children,
  size = "narrow",
}: AuthShellProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section className="relative  overflow-hidden bg-luxury-ivory">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_100%_-10%,var(--cream-50)_0%,var(--cream-100)_45%,var(--cream-200)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-taupe-200/25 blur-3xl animate-hero-glow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply bg-noise-texture"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 overflow-hidden bg-luxury-ink lg:block"
      >
        <div
          className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_80%_60%_at_80%_15%,color-mix(in_srgb,var(--accent)_25%,transparent)_0%,transparent_55%),radial-gradient(ellipse_60%_50%_at_5%_85%,color-mix(in_srgb,var(--luxury-champagne)_18%,transparent)_0%,transparent_50%)]"
        />
        <div
          className="absolute inset-0 opacity-[0.03] bg-noise-texture"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-9xl px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch lg:min-h-[calc(100svh_-_62px)] lg:grid-cols-2">
          <div className="hidden lg:block">{panel}</div>

          <div className="flex items-center justify-center py-16 lg:pl-14 xl:pl-20">
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
                <Link href="/" className="shrink-0 group">
                  <Image
                    src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1784993079/Gemini_Generated_Image_rg4xa9rg4xa9rg4x_1_mtjahn.png"
                    alt="Eco Market"
                    width={150}
                    height={110}
                    className="h-15 sm:h-15 w-auto max-w-[150px] sm:max-w-none object-contain transition-opacity duration-200 group-hover:opacity-70"
                    priority
                  />
                  <span
                    aria-hidden
                    className="h-px w-8 translate-y-[-0.3rem] bg-luxury-champagne"
                  />
                </Link>
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2 text-2xs font-bold uppercase tracking-[0.22em] text-neutral-500 transition-colors hover:text-luxury-ink"
                >
                  <IconArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                  Trang chủ
                </Link>
              </div>

              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
