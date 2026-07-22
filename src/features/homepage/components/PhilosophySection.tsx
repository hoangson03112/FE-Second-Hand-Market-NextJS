"use client";

import Link from "next/link";
import Image from "next/image";
import { IconArrowUpRight, IconLeaf, IconShieldCheck, IconUsers } from "@tabler/icons-react";
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
    description: "Thông tin xuất xứ, tình trạng và mức giá luôn công khai 100%.",
    href: "/products",
    type: "editorial", // Thẻ ảnh đốm tối theo style mẫu
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "03",
    tag: "Cộng Đồng",
    title: "Kết nối giá trị thực",
    description: "Nơi trao đổi đồ cũ thân thiện, tôn trọng và giữ lại giá trị sử dụng nguyên bản.",
    href: "/register",
    type: "clean-wide", // Thẻ rộng trải dài bên dưới
  },
];

export default function PhilosophySection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1, delay: 150 });

  return (
    <section className="py-20 md:py-28 bg-[#F8F6F0]">
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full max-w-9xl px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-stretch">
          
          {/* CỘT TRÁI (5 Cols): Editorial Hero Story */}
          <div className="flex flex-col justify-between lg:col-span-5 py-2">
            <div>
              {/* Kicker Subtitle */}
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-[#3F5E38]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B655B]">
                  Triết lý cốt lõi
                </span>
              </div>

              {/* Headline Typography Contrast */}
              <h2 className="font-ny mt-6 text-3xl font-normal leading-[1.18] tracking-tight text-[#1A1816] md:text-4xl lg:text-[2.75rem]">
                Mỗi món đồ cũ đều xứng đáng{" "}
                <span className="font-ny italic text-[#3F5E38] underline decoration-[#3F5E38]/20 underline-offset-8">
                  một hành trình mới.
                </span>
              </h2>

              <p className="mt-6 text-sm leading-relaxed text-[#5C564E] md:text-base">
                Chúng tôi không chỉ trao đổi hàng hóa, mà cùng bạn kiến tạo lối sống tiêu dùng thông minh, bền vững và đầy cảm hứng.
              </p>

              {/* Editorial Tag Pills */}
              <div className="mt-8 flex flex-wrap gap-2">
                {["Bền vững", "Minh bạch", "Thân thiện"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#E2DDD3] bg-[#FAF8F3] px-3.5 py-1 text-xs font-medium text-[#4A453E]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Button Link */}
            <div className="mt-10 pt-4">
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 rounded-full bg-[#1A1816] px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#F8F6F0] transition-all duration-300 hover:bg-[#3F5E38] hover:shadow-md"
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
              className="group relative flex flex-col justify-between rounded-2xl border border-[#E5E0D8] bg-[#FAF8F3] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#C8C2B5] hover:shadow-[0_12px_32px_rgba(26,24,22,0.06)]"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#EBE6DC] pb-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8C857B]">
                    {values[0].tag}
                  </span>
                  <span className="font-ny text-xl italic text-[#1A1816]/40 group-hover:text-[#3F5E38] transition-colors">
                    {values[0].number}
                  </span>
                </div>

                <h3 className="font-ny mt-5 text-xl font-normal text-[#1A1816]">
                  {values[0].title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#6B655B]">
                  {values[0].description}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1816] transition-colors group-hover:text-[#3F5E38]">
                <span>Tìm hiểu thêm</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </Link>

            {/* Card 2: Editorial Dark Photo Overlay (Lấy phong cách từ ảnh mẫu) */}
            <Link
              href={values[1].href}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#1A1816] p-7 text-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.2)]"
            >
              {/* Background Photo */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={values[1].image!}
                  alt=""
                  fill
                  className="object-cover opacity-40 transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1816] via-[#1A1816]/60 to-transparent" />
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

                {/* Accent Line màu vàng đất nhẹ */}
                <div className="mt-5 h-[2px] w-6 bg-[#D4A373]" />

                <h3 className="font-ny mt-3 text-xl font-normal text-white">
                  {values[1].title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/70">
                  {values[1].description}
                </p>
              </div>

              <div className="relative z-10 mt-8 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors">
                <span>Tìm hiểu thêm</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </Link>

            {/* Card 3: Horizontal Full-width Accent */}
            <Link
              href={values[2].href}
              className="group relative flex flex-col justify-between rounded-2xl border border-[#E5E0D8] bg-white p-7 md:col-span-2 transition-all duration-500 hover:-translate-y-1 hover:border-[#C8C2B5] hover:shadow-[0_12px_32px_rgba(26,24,22,0.06)]"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="max-w-md">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8C857B]">
                      {values[2].tag}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-[#3F5E38]" />
                    <span className="font-ny text-sm italic text-[#6B655B]">
                      Giá trị {values[2].number}
                    </span>
                  </div>

                  <h3 className="font-ny mt-3 text-xl font-normal text-[#1A1816]">
                    {values[2].title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#6B655B]">
                    {values[2].description}
                  </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F5F2EC] text-[#1A1816] transition-all duration-300 group-hover:bg-[#1A1816] group-hover:text-[#F8F6F0]">
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