"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { CURATED_COLLECTIONS } from "../constants";
import { useScrollReveal } from "../hooks";

export default function CuratedCollectionsSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.08, delay: 140 });

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg, #FCF8F2 0%, #F9F3EB 100%)",
      }}
      className="border-y border-taupe-200/60 py-16 md:py-20"
    >
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full max-w-9xl px-4 sm:px-6 lg:px-8 transition-[opacity,transform] duration-700 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}
      >
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-taupe-400">
              Gợi ý chọn lọc
            </p>
            <h2 className="font-ny mt-2 text-[2.2rem] font-semibold tracking-tight text-taupe-900 md:text-[2.6rem]">
              Bộ sưu tập nổi bật
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-taupe-500 transition-colors hover:text-taupe-700"
          >
            Xem tất cả +
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {CURATED_COLLECTIONS.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "group relative overflow-hidden rounded-lg border border-taupe-200/70 shadow-[0_10px_22px_rgba(0,0,0,0.14)] transition-transform duration-500 ease-out hover:-translate-y-0.5",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              )}
              style={{ transitionDelay: `${220 + index * 120}ms` }}
            >
              <div
                className="h-[300px] w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                style={{
                  backgroundImage: `url(${item.gradient})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="font-ny text-xl font-semibold leading-tight">{item.title}</h3>
                <p className="mt-1 text-xs text-white/80">{item.description}</p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85">
                  Bấm để khám phá
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
