"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "../hooks";

interface Category {
  name: string;
  icon: string;
  color: string;
}

interface CategoriesSectionProps {
  categories: Category[];
}

export default function CategoriesSection({
  categories,
}: CategoriesSectionProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="border-b border-taupe-800 bg-taupe-900 py-16 md:py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 md:mb-16 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black tracking-[0.4em] uppercase text-taupe-300">
              DANH MỤC
            </p>
            <h2
              className={cn(
                "mt-4 text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.05]",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transition: "all 420ms ease-out" }}
            >
              Tìm đúng thứ
              <br />
              <span className="text-primary">bạn đang cần.</span>
            </h2>
          </div>

          <p
            className={cn(
              "max-w-xs text-sm text-taupe-200 leading-relaxed font-medium",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}
            style={{ transition: "all 420ms ease-out 60ms" }}
          >
            Hàng ngàn sản phẩm đã qua sử dụng, được phân loại rõ ràng theo
            từng nhóm.
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <div
              key={index}
              className={cn(
                "group flex items-center justify-between",
                "border-t border-taupe-800 py-5 px-1",
                "hover:border-taupe-600 cursor-pointer",
                "transition-colors duration-200",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{
                transition: `opacity 400ms ease-out ${isVisible ? index * 50 + 100 : 0}ms,
                             transform 400ms ease-out ${isVisible ? index * 50 + 100 : 0}ms,
                             border-color 200ms ease`,
              }}
            >
              <div className="flex items-baseline gap-4">
                <span className="text-[11px] font-black tracking-[0.2em] text-taupe-400 tabular-nums w-5 shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm md:text-base font-bold text-taupe-200 group-hover:text-white transition-colors duration-200">
                  {category.name}
                </span>
              </div>

              <span className="text-[11px] font-black tracking-[0.28em] uppercase text-taupe-300 group-hover:text-primary transition-colors duration-200">
                XEM →
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
