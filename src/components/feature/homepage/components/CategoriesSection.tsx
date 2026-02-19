"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "../hooks";
import useCategories from "@/hooks/useCategories";

interface Category {
  name: string;
  slug: string;
  icon: string;
  color: string;
}

interface CategoriesSectionProps {
  categories: Category[];
}

export default function CategoriesSection({
  categories: fallbackCategories,
}: CategoriesSectionProps) {
  const { data: apiCategories } = useCategories();
  const categories = apiCategories?.length
    ? apiCategories
    : fallbackCategories.map((c, i) => ({ _id: String(i), name: c.name, slug: c.slug, subCategories: [] }));
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="border-b-2 border-taupe-900 bg-taupe-800 py-16 md:py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 md:mb-20 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-lg">
            <p className="text-[10px] font-black tracking-[0.45em] uppercase text-taupe-300 mb-6">
              DANH MỤC
            </p>
            <h2
              className={cn(
                "text-[2.5rem] md:text-[3.25rem] lg:text-[4rem] font-black tracking-[-0.02em] text-cream-50 leading-[0.9]",
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
              "max-w-sm text-[15px] text-taupe-200 leading-relaxed font-normal",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}
            style={{ transition: "all 420ms ease-out 60ms" }}
          >
            Hàng ngàn sản phẩm đã qua sử dụng, được phân loại rõ ràng theo
            từng nhóm.
          </p>
        </div>

        {/* Category grid - Swiss list style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t-2 border-taupe-600">
          {categories.map((category, index) => (
            <Link
              key={"_id" in category ? category._id : index}
              href={`/categories/${category.slug}`}
              className={cn(
                "group flex items-center justify-between",
                "border-b-2 border-taupe-700 py-6 px-0 sm:px-6 first:pl-0",
                "sm:border-r-2 sm:border-b-0 border-taupe-700 last:border-r-0",
                "hover:bg-taupe-700/50 cursor-pointer",
                "transition-all duration-200",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{
                transition: `opacity 400ms ease-out ${isVisible ? index * 50 + 100 : 0}ms,
                             transform 400ms ease-out ${isVisible ? index * 50 + 100 : 0}ms,
                             background-color 200ms ease`,
              }}
            >
              <div className="flex items-center gap-5">
                <span className="text-[10px] font-black tracking-[0.25em] text-taupe-400 tabular-nums w-8 shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="h-8 w-[2px] bg-taupe-600 group-hover:bg-primary transition-colors" />
                <span className="text-[15px] md:text-[17px] font-bold text-taupe-100 group-hover:text-cream-50 transition-colors duration-200 uppercase tracking-tight">
                  {category.name}
                </span>
              </div>

              <span className="text-[11px] font-black tracking-[0.3em] uppercase text-taupe-400 group-hover:text-primary transition-colors duration-200">
                →
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
