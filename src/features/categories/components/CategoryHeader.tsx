"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ICategory, ISubCategory } from "@/types/category";
import { IconChevronRight, IconHome, IconLayoutGrid } from "@tabler/icons-react";

interface CategoryHeaderProps {
  category?: ICategory;
  subCategory?: ISubCategory;
  breadcrumbs?: Array<{ label: string; href: string }>;
}

export default function CategoryHeader({ category, subCategory }: CategoryHeaderProps) {
  const isSubCategoryView = !!subCategory;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-taupe-50 via-cream-50 to-white border-b border-taupe-200/80">
      {/* Decorative blobs */}
      <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-accent/5 blur-2xl pointer-events-none" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-taupe-400 mb-5">
          <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
            <IconHome className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <IconChevronRight className="w-3 h-3 text-taupe-300" />
          <Link href="/categories" className="hover:text-primary transition-colors">Danh mục</Link>
          {category && (
            <>
              <IconChevronRight className="w-3 h-3 text-taupe-300" />
              {isSubCategoryView ? (
                <Link href={`/categories/${category.slug}`} className="hover:text-primary transition-colors">
                  {category.name}
                </Link>
              ) : (
                <span className="text-taupe-700 font-medium">{category.name}</span>
              )}
            </>
          )}
          {subCategory && (
            <>
              <IconChevronRight className="w-3 h-3 text-taupe-300" />
              <span className="text-taupe-700 font-medium">{subCategory.name}</span>
            </>
          )}
        </nav>

        {/* Category badge */}
        {isSubCategoryView && category && (
          <div className="flex items-center gap-2 mb-3">
            <Link
              href={`/categories/${category.slug}`}
              className="inline-flex items-center gap-1.5 text-xs text-taupe-400 hover:text-primary transition-colors"
            >
              <IconLayoutGrid className="w-3.5 h-3.5" />
              <span>{category.name}</span>
              <IconChevronRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-taupe-900 mb-1.5 leading-[1.1] tracking-tight">
          {subCategory?.name || category?.name || "Danh mục"}
        </h1>
        <p className="text-sm text-taupe-400 mb-6">
          {isSubCategoryView
            ? `Khám phá tất cả sản phẩm trong danh mục này`
            : category
              ? `Tất cả sản phẩm trong danh mục ${category.name}`
              : "Khám phá sản phẩm"}
        </p>

        {/* Subcategory navigation chips */}
        {category && category.subCategories && category.subCategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {!isSubCategoryView && (
              <Link
                href={`/categories/${category.slug}`}
                className="px-4 py-1.5 rounded-full border-2 border-primary bg-primary text-primary-foreground text-sm font-semibold shadow-sm"
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
                    "px-4 py-1.5 rounded-full border-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card/70 text-muted-foreground hover:border-primary/60 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {sub.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
