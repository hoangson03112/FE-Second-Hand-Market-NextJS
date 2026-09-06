"use client";

import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "../hooks";

export default function LuxuryCtaSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2, delay: 100 });

  return (
    <section className="py-20 md:py-28">
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full max-w-9xl px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        )}
      >
        <div className="relative overflow-hidden rounded-[2px] bg-luxury-ink px-8 py-16 md:px-16 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_80%_60%_at_80%_20%,color-mix(in_srgb,var(--accent)_25%,transparent)_0%,transparent_55%),radial-gradient(ellipse_60%_50%_at_10%_80%,color-mix(in_srgb,var(--luxury-champagne)_18%,transparent)_0%,transparent_50%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.03] bg-noise-texture"
          />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-luxury-champagne">
              Bắt đầu hành trình
            </p>
            <h2
              className="font-droid-serif mt-5 text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.08] text-luxury-ivory"
            >
              Mua bán second-hand
              <span className="block text-taupe-200">
                theo cách sang trọng hơn.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-luxury-ivory/70 md:text-base">
              Tham gia cộng đồng nơi mỗi món đồ đều được tôn trọng, minh bạch và
              sẵn sàng cho vòng đời mới.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/products"
                className="rounded-[2px] group inline-flex min-w-[220px] items-center justify-center gap-2 bg-luxury-ivory px-8 py-4 text-xs font-bold uppercase tracking-[0.24em] text-luxury-ink transition-all duration-300 hover:bg-white"
              >
                Khám phá sản phẩm
                <IconArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/sell"
                className="rounded-[2px] inline-flex min-w-[220px] items-center justify-center border border-luxury-ivory/25 px-8 py-4 text-xs font-bold uppercase tracking-[0.24em] text-luxury-ivory transition-all duration-300 hover:border-luxury-champagne/60 hover:text-luxury-champagne"
              >
                Trở thành người bán
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
