"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { IconArrowLeft } from "@tabler/icons-react";

import { usePrefersReducedMotion } from "@/features/homepage/hooks";

import { AUTH_PANEL_TAGS, type AuthHighlight } from "../constants";

const EASE = [0.22, 1, 0.36, 1] as const;

const NOISE_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

interface AuthEditorialPanelProps {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  highlights: AuthHighlight[];
}

export default function AuthEditorialPanel({
  eyebrow,
  title,
  description,
  highlights,
}: AuthEditorialPanelProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden bg-luxury-ink px-10 py-14 xl:px-16 xl:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 80% 15%, color-mix(in srgb, var(--accent) 25%, transparent) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 5% 85%, color-mix(in srgb, var(--luxury-champagne) 18%, transparent) 0%, transparent 50%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: NOISE_TEXTURE }}
      />

      <motion.div
        className="relative z-10 flex items-center justify-between gap-6"
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <Link
          href="/"
          className="group inline-flex items-baseline gap-3 text-luxury-ivory"
        >
          <span
            className="text-xl tracking-tight"
            style={{ fontFamily: "var(--font-droid-serif), serif" }}
          >
            Eco Market
          </span>
          <span
            aria-hidden
            className="h-px w-8 translate-y-[-0.35rem] bg-luxury-champagne/70 transition-all duration-500 group-hover:w-12 group-hover:bg-luxury-champagne"
          />
        </Link>

        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-luxury-ivory/60 transition-colors hover:text-luxury-champagne"
        >
          <IconArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          Về trang chủ
        </Link>
      </motion.div>

      <div className="relative z-10 py-14">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-luxury-champagne/80" aria-hidden />
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-luxury-champagne">
              {eyebrow}
            </p>
          </div>

          <h2
            className="mt-5 text-luxury-ivory"
            style={{
              fontFamily: "var(--font-droid-serif), serif",
              fontSize: "clamp(2.25rem, 3.4vw, 3.25rem)",
              fontWeight: 400,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </h2>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-luxury-ivory/70 md:text-base">
            {description}
          </p>
        </motion.div>

        <div className="mt-12 max-w-lg">
          {highlights.map((item, index) => (
            <motion.div
              key={item.number}
              className="border-t border-white/10 py-5"
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.2 + index * 0.1,
                ease: EASE,
              }}
            >
              <div className="flex items-baseline gap-5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-luxury-champagne/80">
                  {item.number}
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-luxury-ivory/60">
                    {item.tag}
                  </p>
                  <h3
                    className="mt-2 text-lg font-normal text-luxury-ivory"
                    style={{ fontFamily: "var(--font-droid-serif), serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-luxury-ivory/70">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        className="relative z-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-6"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
      >
        {AUTH_PANEL_TAGS.map((tag, index) => (
          <span
            key={tag}
            className="inline-flex items-center gap-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-luxury-ivory/50"
          >
            {tag}
            {index < AUTH_PANEL_TAGS.length - 1 ? (
              <span className="text-luxury-champagne/70" aria-hidden>
                ✦
              </span>
            ) : null}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
