"use client";

import { Star, ChevronRight } from "lucide-react";
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
    <div className="bg-cream-50 p-5 mb-3 border border-taupe-200">
      {/* Breadcrumb */}
      {(category || subcategory) && (
        <div className="flex items-center gap-2 text-xs text-taupe-400 mb-3 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          {category && (
            <>
              <ChevronRight className="h-3 w-3" />
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
              <ChevronRight className="h-3 w-3" />
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
      <div className="flex items-center gap-4 border-t border-taupe-100 pt-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(averageRating) ? "fill-primary text-primary" : "fill-taupe-200 text-taupe-200"}`}
              />
            ))}
          </div>
          <span className="text-primary font-medium underline text-sm">{averageRating}</span>
        </div>
        <div className="h-4 w-px bg-taupe-200"></div>
        <span className="text-taupe-600 text-sm">
          {totalReviews} <span className="text-taupe-400">Đánh Giá</span>
        </span>
      </div>
    </div>
  );
}
