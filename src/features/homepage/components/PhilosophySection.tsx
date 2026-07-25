"use client";

import Link from "next/link";
import Image from "next/image";
import {
  IconArrowUpRight,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "../hooks";

const values = [
  {
    number: "01",
    tag: "Bền Vững",
    title: "Mua bán có trách nhiệm",
    description: "Kéo dài vòng đời sản phẩm, giảm thiểu lãng phí tài nguyên.",
    href: "/sell",
    type: "clean", // Thẻ kem tối giản
  },
  {
    number: "02",
    tag: "Minh Bạch",
    title: "Tin cậy & rõ ràng",
    description:
      "Thông tin xuất xứ, tình trạng và mức giá luôn công khai 100%.",
    href: "/products",
    type: "editorial", // Thẻ ảnh đốm tối theo style mẫu
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "03",
    tag: "Cộng Đồng",
    title: "Kết nối giá trị thực",
    description:
      "Nơi trao đổi đồ cũ thân thiện, tôn trọng và giữ lại giá trị sử dụng nguyên bản.",
    href: "/register",
    type: "clean-wide", // Thẻ rộng trải dài bên dưới
  },
];

export default function PhilosophySection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1, delay: 150 });

  return (
    <section className="border-t border-luxury-ink/6 bg-white/40 py-20 md:py-28">
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full max-w-9xl px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        )}
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-stretch">
          {/* CỘT TRÁI (5 Cols): Editorial Hero Story */}
          <div className="flex flex-col justify-between lg:col-span-5 py-2">
            <div
              className={cn(
                "transition-all duration-700 ease-out",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
              )}
              style={{ transitionDelay: "80ms" }}
            >
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-luxury-champagne/80" aria-hidden />
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-600">
                  Triết lí cốt lõi
                </p>
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-droid-serif), serif",
                  fontWeight: 400,
                  lineHeight: 1.08,
                }}
                className="mt-4 text-[clamp(1.75rem,3vw,2.5rem)] tracking-tight text-luxury-ink"
              >
                Mỗi món đồ cũ đều xứng đáng{" "}
                <span className="text-accent">một hành trình mới.</span>
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-neutral-700 md:text-base">
                Chúng tôi không chỉ trao đổi hàng hóa, mà cùng bạn kiến tạo lối
                sống tiêu dùng thông minh, bền vững và đầy cảm hứng.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {["Bền vững", "Minh bạch", "Thân thiện"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-neutral-200 bg-cream-50 px-3.5 py-1 text-xs font-medium text-neutral-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div
              className={cn(
                "mt-10 pt-4 transition-all duration-700 ease-out",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
              )}
              style={{ transitionDelay: "220ms" }}
            >
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 bg-luxury-ink px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800"
                style={{ borderRadius: "2px" }}
              >
                <span>Khám phá sản phẩm</span>
                <IconArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* CỘT PHẢI (7 Cols): Dynamic Cards Layout */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Clean Warm Surface */}
            <Link
              href={values[0].href}
              className={cn(
                "group relative flex flex-col justify-between border border-neutral-200 bg-cream-50 p-7 transition-all duration-700 ease-out hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_12px_32px_color-mix(in_srgb,var(--luxury-ink)_6%,transparent)]",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              )}
              style={{ transitionDelay: "180ms" }}
            >
              <div>
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    {values[0].tag}
                  </span>
                  <span className="font-ny text-xl italic text-luxury-ink/40 group-hover:text-taupe-700 transition-colors">
                    {values[0].number}
                  </span>
                </div>

                <h3
                  style={{ fontFamily: "var(--font-droid-serif), serif" }}
                  className="mt-5 text-xl font-normal text-luxury-ink"
                >
                  {values[0].title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                  {values[0].description}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-luxury-ink transition-colors group-hover:text-taupe-700">
                <span>Tìm hiểu thêm</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>

            {/* Card 2: Editorial Dark Photo Overlay (Lấy phong cách từ ảnh mẫu) */}
            <Link
              href={values[1].href}
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden bg-luxury-ink p-7 text-white transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-[0_16px_36px_color-mix(in_srgb,var(--luxury-ink)_20%,transparent)]",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              )}
              style={{ transitionDelay: "280ms" }}
            >
              {/* Background Photo */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={values[1].image!}
                  alt=""
                  fill
                  className="object-cover opacity-40 transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-ink via-luxury-ink/60 to-transparent" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
                    {values[1].tag}
                  </span>
                  <span className="font-ny text-xl italic text-white/40 group-hover:text-white transition-colors">
                    {values[1].number}
                  </span>
                </div>

                <div className="mt-5 h-px w-6 bg-luxury-champagne" />

                <h3
                  style={{ fontFamily: "var(--font-droid-serif), serif" }}
                  className="mt-3 text-xl font-normal text-white"
                >
                  {values[1].title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/70">
                  {values[1].description}
                </p>
              </div>

              <div className="relative z-10 mt-8 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors">
                <span>Tìm hiểu thêm</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>

            {/* Card 3: Horizontal Full-width Accent */}
            <Link
              href={values[2].href}
              className={cn(
                "group relative flex flex-col justify-between border border-neutral-200 bg-white p-7 md:col-span-2 transition-all duration-700 ease-out hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_12px_32px_color-mix(in_srgb,var(--luxury-ink)_6%,transparent)]",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              )}
              style={{ transitionDelay: "380ms" }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="max-w-md">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      {values[2].tag}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-taupe-700" />
                    <span className="font-ny text-sm italic text-neutral-600">
                      Giá trị {values[2].number}
                    </span>
                  </div>

                  <h3
                    style={{ fontFamily: "var(--font-droid-serif), serif" }}
                    className="mt-3 text-xl font-normal text-luxury-ink"
                  >
                    {values[2].title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                    {values[2].description}
                  </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-100 text-luxury-ink transition-all duration-300 group-hover:bg-luxury-ink group-hover:text-luxury-ivory">
                  <IconArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
