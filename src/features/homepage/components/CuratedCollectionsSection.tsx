"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { CURATED_COLLECTIONS } from "../constants";
import { useScrollReveal } from "../hooks";
import { IconArrowUpRight } from "@tabler/icons-react";

export default function CuratedCollectionsSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.08, delay: 140 });

  return (
    <section className=" py-16 md:py-20">
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full max-w-9xl px-4 sm:px-6 lg:px-8 transition-[opacity,transform] duration-700 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        )}
      >
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-foreground">
              Gợi ý chọn lọc
            </p>
            <h2
              style={{
                fontFamily: "var(--font-droid-serif), serif",
                fontWeight: 400,
                lineHeight: 1.05,
              }}
              className=" mt-2 text-sm font-semibold tracking-tight text-primary md:text-[2.6rem]"
            >
              Bộ sưu tập <span className="text-accent">nổi bật</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center text-xs uppercase font-medium text-foreground  hover:text-taupe-700"
          >
            Xem tất cả
            <IconArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {CURATED_COLLECTIONS.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "group relative overflow-hidden rounded-2xl bg-neutral-950 transition-all duration-700 ease-out",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
              style={{ transitionDelay: `${150 + index * 100}ms` }}
            >
              {/* Khung ảnh tỷ lệ chuẩn nghệ thuật (3:4) */}
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                {/* Ảnh nền với hiệu ứng Zoom chậm mượt mà */}
                <div
                  className="absolute inset-0 h-full w-full transition-transform duration-1000 ease-out group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${item.gradient})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                {/* Lớp phủ tối nhiều tầng tạo độ sâu ấn tượng */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />

                {/* Viền kính mờ tinh tế (Fine Glass Border) */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15 transition-all duration-500 group-hover:ring-amber-200/40" />

                {/* Nội dung chính */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-stone-100">
                  {/* Đường gạch trang trí tinh tế co giãn khi Hover */}
                  <div className="mb-3 h-[1px] w-8 bg-amber-200/70 transition-all duration-500 ease-out group-hover:w-14 group-hover:bg-amber-200" />

                  {/* Tiêu đề Serif sang trọng */}
                  <h3 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-stone-50 transition-transform duration-500 ease-out group-hover:-translate-y-1">
                    {item.title}
                  </h3>

                  {/* Mô tả ngắn */}
                  <p className="mt-2 line-clamp-2 text-xs md:text-sm font-light leading-relaxed text-stone-300/90 transition-transform duration-500 ease-out group-hover:-translate-y-1">
                    {item.description}
                  </p>

                  {/* Nút Call to Action đẳng cấp kèm mũi tên */}
                  <div className="mt-5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-amber-200/90 transition-transform duration-500 ease-out group-hover:-translate-y-1">
                    <span>Khám phá bộ sưu tập</span>
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
