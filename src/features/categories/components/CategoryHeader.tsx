"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ICategory, ISubCategory } from "@/types/category";
import {
  IconChevronRight,
  IconHome,
  IconLayoutGrid,
} from "@tabler/icons-react";

interface CategoryHeaderProps {
  category?: ICategory;
  subCategory?: ISubCategory;
  breadcrumbs?: Array<{ label: string; href: string }>;
}

export default function CategoryHeader({
  category,
  subCategory,
}: CategoryHeaderProps) {
  const isSubCategoryView = !!subCategory;
  const title = subCategory?.name || category?.name || "Danh mục";
  const description = isSubCategoryView
    ? "Khám phá các món đồ cũ được tuyển chọn theo từng chuyên mục"
    : category
      ? `Tất cả sản phẩm trong danh mục ${category.name}`
      : "Khám phá sản phẩm";

  return (
    <header className="relative overflow-hidden border-b border-luxury-ink/10 bg-luxury-ivory">
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_right,_rgba(196,165,116,0.18),_transparent_48%)]" />
      <div className="absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -right-12 top-8 h-52 w-52 rounded-full bg-luxury-champagne/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-9xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-luxury-ink"
          >
            <IconHome className="h-3.5 w-3.5" />
            <span>Trang chủ</span>
          </Link>
          <IconChevronRight className="h-3 w-3 text-neutral-400" />
          <Link
            href="/categories"
            className="transition-colors hover:text-luxury-ink"
          >
            Danh mục
          </Link>
          {category && (
            <>
              <IconChevronRight className="h-3 w-3 text-neutral-400" />
              {isSubCategoryView ? (
                <Link
                  href={`/categories/${category.slug}`}
                  className="transition-colors hover:text-luxury-ink"
                >
                  {category.name}
                </Link>
              ) : (
                <span className="text-luxury-ink">{category.name}</span>
              )}
            </>
          )}
          {subCategory && (
            <>
              <IconChevronRight className="h-3 w-3 text-neutral-400" />
              <span className="text-luxury-ink">{subCategory.name}</span>
            </>
          )}
        </nav>

        <section className="relative overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white/80 px-5 py-6 shadow-[0_12px_28px_rgba(26,24,22,0.04)] backdrop-blur-sm sm:px-8 sm:py-8">
          <div className="absolute inset-y-0 right-0 hidden w-40 bg-gradient-to-l from-luxury-champagne/8 to-transparent lg:block" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              {isSubCategoryView && category && (
                <div className="mb-4 flex items-center gap-2">
                  <Link
                    href={`/categories/${category.slug}`}
                    className="inline-flex items-center gap-2 rounded-[2px] border border-luxury-ink/10 bg-cream-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600 transition-colors hover:border-luxury-ink/20 hover:text-luxury-ink"
                  >
                    <IconLayoutGrid className="h-3.5 w-3.5" />
                    {category.name}
                    <IconChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              )}

              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-8 bg-luxury-champagne/80" aria-hidden />
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-neutral-600">
                  {isSubCategoryView ? "Phân mục" : "Danh mục"}
                </p>
              </div>

              <h1 className="font-droid-serif text-[clamp(2.1rem,4vw,4rem)] leading-[0.96] tracking-tight text-luxury-ink">
                {title}
              </h1>
              <p className="mt-3 max-w-xl text-sm text-neutral-600 sm:text-base">
                {description}
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-[2px] border border-luxury-ink/10 bg-cream-50 px-4 py-3 text-left shadow-sm sm:px-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-[2px] border border-luxury-champagne/40 bg-white text-luxury-ink">
                <IconLayoutGrid className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">
                  Bộ sưu tập
                </p>
                <p className="mt-1 text-xl font-semibold text-luxury-ink">
                  {category?.subCategories?.length ? category.subCategories.length : 1}
                </p>
              </div>
            </div>
          </div>

          {category && category.subCategories && category.subCategories.length > 0 && (
            <div className="relative mt-7 flex flex-wrap gap-2.5">
              {!isSubCategoryView && (
                <Link
                  href={`/categories/${category.slug}`}
                  className="inline-flex items-center justify-center rounded-[2px] border border-luxury-ink bg-luxury-ink px-4 py-2 text-sm font-medium text-luxury-ivory shadow-[0_10px_24px_rgba(26,24,22,0.12)] transition-all hover:-translate-y-0.5"
                >
                  Tất cả
                </Link>
              )}

              {category.subCategories.map((sub) => {
                const isActive = subCategory?._id === sub._id;
                return (
                  <Link
                    key={sub._id}
                    href={`/categories/${category.slug}/sub/${sub.slug}`}
                    className={cn(
                      "inline-flex items-center justify-center rounded-[2px] border px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5",
                      isActive
                        ? "border-luxury-ink bg-luxury-ink text-luxury-ivory shadow-[0_10px_24px_rgba(26,24,22,0.12)]"
                        : "border-luxury-ink/10 bg-white text-neutral-600 hover:border-luxury-ink/25 hover:text-luxury-ink",
                    )}
                  >
                    {sub.name}
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </header>
  );
}
