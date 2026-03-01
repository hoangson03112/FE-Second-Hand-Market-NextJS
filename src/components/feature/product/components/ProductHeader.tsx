"use client";

import { IconStar, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";

interface ProductHeaderProps {
  name: string;
  averageRating: number;
  totalReviews: number;
  category?: {
    _id: string;
    name: string;
  };
  subcategory?: {
    _id: string;
    name: string;
  };
}

export default function ProductHeader({
  name,
  averageRating,
  totalReviews,
  category,
  subcategory,
}: ProductHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-cream-50 to-white p-5 mb-3 border-2 border-border rounded-2xl shadow-md">
      {/* Breadcrumb */}
      {(category || subcategory) && (
        <div className="flex items-center gap-2 text-xs text-taupe-400 mb-3 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          {category && (
            <>
              <IconChevronRight className="h-3 w-3" />
              <Link
                href={`/categories/${category._id}`}
                className="hover:text-primary transition-colors"
              >
                {category.name}
              </Link>
            </>
          )}
          {subcategory && (
            <>
              <IconChevronRight className="h-3 w-3" />
              <span className="text-taupe-700">
                {subcategory.name}
              </span>
            </>
          )}
        </div>
      )}

      <h1 className="text-xl md:text-2xl font-medium text-taupe-900 mb-3 leading-[1.1] tracking-tight">
        {name}
      </h1>
      <div className="flex items-center gap-4 border-t border-border pt-3">
        {totalReviews > 0 ? (
          <>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <IconStar
                    key={i}
                    className={`h-4 w-4 ${
                      i <= Math.round(averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-taupe-200 text-taupe-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-taupe-800 font-semibold text-sm">{averageRating.toFixed(1)}</span>
            </div>
            <div className="h-4 w-px bg-taupe-200"></div>
            <span className="text-taupe-500 text-sm">
              {totalReviews} đánh giá
            </span>
          </>
        ) : (
          <span className="text-taupe-400 text-sm">Chưa có đánh giá</span>
        )}
      </div>
    </div>
  );
}
