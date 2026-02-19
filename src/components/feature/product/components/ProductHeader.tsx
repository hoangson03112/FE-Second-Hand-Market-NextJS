"use client";

import { Star, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ProductHeaderProps {
  name: string;
  averageRating: number;
  totalReviews: number;
  sellerName: string;
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
  sellerName,
  category,
  subcategory,
}: ProductHeaderProps) {
  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      {(category || subcategory) && (
        <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          {category && (
            <>
              <ChevronRight className="h-4 w-4" />
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
              <ChevronRight className="h-4 w-4" />
              <span className="text-neutral-900 font-medium">
                {subcategory.name}
              </span>
            </>
          )}
        </div>
      )}

      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        {name}
      </h1>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.floor(averageRating) ? "fill-accent text-accent" : "fill-border text-border"}`}
              />
            ))}
          </div>
          <span className="font-semibold text-foreground">{averageRating}</span>
          <span className="text-muted-foreground">
            ({totalReviews} đánh giá)
          </span>
        </div>
      </div>
    </div>
  );
}
