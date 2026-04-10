"use client";

import { useMemo } from "react";
import { IconStar, IconChevronRight, IconStarFilled } from "@tabler/icons-react";
import Link from "next/link";
import ShareButton from "@/components/common/ShareButton";

interface ProductHeaderProps {
  name: string;
  averageRating: number;
  totalReviews: number;
  productId: string;
  productSlug?: string;
  productImage?: string;
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
  productId,
  productSlug,
  productImage,
  category,
  subcategory,
}: ProductHeaderProps) {
  // Keep SSR/CSR first render deterministic to avoid hydration mismatch.
  const shareUrl = useMemo(
    () => `/products/${productId}/${productSlug || "product"}`,
    [productId, productSlug],
  );

  return (
    <div className="relative bg-gradient-to-br from-cream-50 via-white to-cream-50/50 p-6 md:p-8 mb-4 border border-taupe-200 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -z-0" />
      
      <div className="relative z-10">
        {/* Header with Breadcrumb and Share Button */}
        <div className="flex items-start justify-between gap-4 mb-4">
          {/* Breadcrumb */}
          {(category || subcategory) && (
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-taupe-500 flex-wrap">
              <Link 
                href="/" 
                className="hover:text-primary hover:underline transition-all duration-200 font-medium"
              >
                Trang chủ
              </Link>
              {category && (
                <>
                  <IconChevronRight className="h-3.5 w-3.5 text-taupe-300" />
                  <Link
                    href={`/categories/${category._id}`}
                    className="hover:text-primary hover:underline transition-all duration-200 font-medium"
                  >
                    {category.name}
                  </Link>
                </>
              )}
              {subcategory && (
                <>
                  <IconChevronRight className="h-3.5 w-3.5 text-taupe-300" />
                  <span className="text-taupe-700 font-semibold">
                    {subcategory.name}
                  </span>
                </>
              )}
            </nav>
          )}

          {/* Share Button */}
          <div className="flex-shrink-0">
            <ShareButton
              shareData={{
                url: shareUrl,
                title: name,
                description: `Xem sản phẩm "${name}" - Mua bán đồ cũ chất lượng`,
                image: productImage,
              }}
            />
          </div>
        </div>

        {/* Product Name */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-taupe-900 mb-4 leading-tight tracking-tight">
          {name}
        </h1>

        {/* Rating Section */}
        <div className="flex items-center gap-4 pt-4 border-t border-taupe-200/60">
          {totalReviews > 0 ? (
            <>
              {/* Star Rating */}
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-taupe-200/50 shadow-sm">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <IconStarFilled
                      key={i}
                      className={`h-4 w-4 transition-all duration-200 ${
                        i <= Math.round(averageRating)
                          ? "text-primary/80 drop-shadow-sm"
                          : "text-taupe-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-taupe-900 font-bold text-base">
                  {averageRating.toFixed(1)}
                </span>
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-gradient-to-b from-transparent via-taupe-300 to-transparent" />

              {/* Review Count */}
              <div className="flex items-center gap-2">
                <span className="text-taupe-600 text-sm font-medium">
                  {totalReviews.toLocaleString('vi-VN')}
                </span>
                <span className="text-taupe-400 text-sm">
                  đánh giá
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 bg-taupe-50/80 backdrop-blur-sm px-4 py-2 rounded-full border border-taupe-200/50">
              <IconStar className="h-4 w-4 text-taupe-400" />
              <span className="text-taupe-500 text-sm font-medium">
                Chưa có đánh giá
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
