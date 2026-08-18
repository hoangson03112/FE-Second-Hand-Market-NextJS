"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { CURATED_COLLECTIONS } from "../constants";

import { useScrollReveal } from "../hooks";

import SectionHeader from "./SectionHeader";

export default function CuratedCollectionsSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.08, delay: 140 });

  return (
    <section className="py-20 md:py-28">
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full max-w-9xl px-4 sm:px-6 lg:px-8 transition-[opacity,transform] duration-700 ease-out",

          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        )}
      >
        <div
          className={cn(
            "transition-all duration-700 ease-out",

            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
          style={{ transitionDelay: "80ms" }}
        >
          <SectionHeader
            eyebrow="Gợi ý chọn lọc"
            title={
              <>
                Bộ sưu tập <span className="text-accent">được tuyển chọn</span>
              </>
            }
            action={{ label: "Xem tất cả", href: "/products" }}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {CURATED_COLLECTIONS.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "group relative overflow-hidden bg-luxury-ink transition-all duration-700 ease-out",

                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
              style={{
                transitionDelay: `${150 + index * 100}ms`,

                borderRadius: "2px",
              }}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <div
                  className="absolute inset-0 h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${item.gradient})`,

                    backgroundSize: "cover",

                    backgroundPosition: "center",
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5 transition-opacity duration-500 group-hover:from-black/95" />

                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 transition-all duration-500 group-hover:ring-luxury-champagne/35" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-cream-50">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-luxury-champagne/90">
                    Bộ sưu tập {String(index + 1).padStart(2, "0")}
                  </p>

                  <div className="mb-3 h-px w-8 bg-luxury-champagne/70 transition-all duration-500 ease-out group-hover:w-14 group-hover:bg-luxury-champagne" />

                  <h3
                    className="font-droid-serif text-2xl font-normal tracking-tight text-cream-50 transition-transform duration-500 ease-out group-hover:-translate-y-1 md:text-3xl"
                  >
                    {item.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-xs font-light leading-relaxed text-neutral-200/90 transition-transform duration-500 ease-out group-hover:-translate-y-1 md:text-sm">
                    {item.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-luxury-champagne/90 transition-transform duration-500 ease-out group-hover:-translate-y-1">
                    <span>Khám phá</span>

                    <svg
                      className="h-3.5 w-3.5 transition-transform duration-500 ease-out group-hover:translate-x-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
