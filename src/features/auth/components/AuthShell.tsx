"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { IconArrowLeft } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/features/homepage/hooks";
import Image from "next/image";

const EASE = [0.22, 1, 0.36, 1] as const;

const NOISE_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

interface AuthShellProps {
  panel: React.ReactNode;
  children: React.ReactNode;
  /**
   * Bề ngang cột form. "narrow" (mặc định) cho form một cột — login, verify.
   * "wide" cho register, vì lưới sm:grid-cols-2 của nó cần chỗ cho 2 field.
   */
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

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 overflow-hidden bg-luxury-ink lg:block"
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 80% 15%, color-mix(in srgb, var(--accent) 25%, transparent) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 5% 85%, color-mix(in srgb, var(--luxury-champagne) 18%, transparent) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: NOISE_TEXTURE }}
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
                  className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500 transition-colors hover:text-luxury-ink"
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
