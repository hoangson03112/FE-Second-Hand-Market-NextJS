"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ICategory, ISubCategory } from "@/types/category";

interface CategoryHeaderProps {
  category?: ICategory;
  subCategory?: ISubCategory;
  breadcrumbs?: Array<{ label: string; href: string }>;
}

export default function CategoryHeader({ category, subCategory, breadcrumbs }: CategoryHeaderProps) {
  const displayName = subCategory?.name || category?.name || "Danh mục";
  const description = subCategory
    ? `Sản phẩm trong danh mục ${subCategory.name}`
    : category
      ? `Tất cả sản phẩm trong danh mục ${category.name}`
      : "Khám phá sản phẩm";

  return (
    <div className="bg-cream-50 py-10 md:py-12 border-b-2 border-taupe-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-taupe-400">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
              </li>
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-taupe-300">/</span>
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-taupe-900 font-medium">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-primary transition-colors">{crumb.label}</Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-taupe-400 mb-3">DANH MỤC</p>
        <h1 className="text-3xl md:text-4xl font-medium text-taupe-900 mb-2 leading-[1.1] tracking-tight">{displayName}</h1>
        <p className="text-base text-taupe-600 max-w-2xl">{description}</p>
        {category && category.subCategories && category.subCategories.length > 0 && !subCategory && (
          <div className="mt-6 flex flex-wrap gap-2">
            {category.subCategories.map((sub) => (
              <Link
                key={sub._id}
                href={`/categories/${category._id}/sub/${sub._id}`}
                className={cn(
                  "px-4 py-2 border-2 border-taupe-300 text-sm font-medium text-taupe-700",
                  "hover:border-primary hover:text-primary transition-all duration-200"
                )}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
