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
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 80% 20%, color-mix(in srgb, var(--accent) 25%, transparent) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 10% 80%, color-mix(in srgb, var(--luxury-champagne) 18%, transparent) 0%, transparent 50%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-luxury-champagne">
              Bắt đầu hành trình
            </p>
            <h2
              style={{
                fontFamily: "var(--font-droid-serif), serif",
                fontWeight: 400,
                lineHeight: 1.08,
              }}
              className="mt-5 text-[clamp(2rem,4.5vw,3.25rem)] text-luxury-ivory"
            >
              Mua bán second-hand
              <span className="block text-taupe-200">theo cách sang trọng hơn.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-luxury-ivory/70 md:text-base">
              Tham gia cộng đồng nơi mỗi món đồ đều được tôn trọng, minh bạch
              và sẵn sàng cho vòng đời mới.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/products"
                className="group inline-flex min-w-[220px] items-center justify-center gap-2 bg-luxury-ivory px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-luxury-ink transition-all duration-300 hover:bg-white"
                style={{ borderRadius: "2px" }}
              >
                Khám phá sản phẩm
                <IconArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/sell"
                className="inline-flex min-w-[220px] items-center justify-center border border-luxury-ivory/25 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-luxury-ivory transition-all duration-300 hover:border-luxury-champagne/60 hover:text-luxury-champagne"
                style={{ borderRadius: "2px" }}
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
