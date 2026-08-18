"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { IconArrowLeft } from "@tabler/icons-react";

import { usePrefersReducedMotion } from "@/features/homepage/hooks";

import { AUTH_PANEL_TAGS, type AuthHighlight } from "../constants";
import Image from "next/image";

const EASE = [0.22, 1, 0.36, 1] as const;

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
    /* Nền ink + hiệu ứng do AuthShell vẽ tràn viền — ở đây chỉ còn nội dung. */
    <div className="relative flex h-full flex-col justify-between py-14 pr-10 xl:py-16 xl:pr-16">
      <motion.div
        className="relative z-10 flex items-center justify-between gap-6"
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <Link href="/" className="shrink-0 group">
          <Image
            src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1784993079/Gemini_Generated_Image_rg4xa9rg4xa9rg4x_1_mtjahn.png"
            alt="Eco Market Logo"
            width={350}
            height={260}
            className="h-25 sm:h-25 sm:max-w-none object-contain max-w-[150px] w-auto brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity duration-200"
            priority
          />
          <span
            aria-hidden
            className="h-px w-8 translate-y-[-0.3rem] bg-luxury-champagne"
          />
        </Link>

        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-luxury-ivory/60 transition-colors hover:text-luxury-champagne"
        >
          <IconArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          Về trang chủ
        </Link>
      </motion.div>

      <div className="relative z-10 ">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-luxury-champagne/80" aria-hidden />
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-luxury-champagne">
              {eyebrow}
            </p>
          </div>

          <h2
            className="font-droid-serif mt-5 text-luxury-ivory"
            style={{
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
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-luxury-champagne/80">
                  {item.number}
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-ivory/60">
                    {item.tag}
                  </p>
                  <h3
                    className="font-droid-serif mt-2 text-lg font-normal text-luxury-ivory"
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
            className="inline-flex items-center gap-5 text-[10px] font-bold uppercase tracking-[0.28em] text-luxury-ivory/50"
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
