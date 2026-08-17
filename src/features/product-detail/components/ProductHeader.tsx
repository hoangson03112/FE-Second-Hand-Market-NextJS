"use client";

import { useMemo } from "react";
import {
  IconStar,
  IconChevronRight,
  IconStarFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import { ShareButton } from "@/features/product-detail/components";

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
  const shareUrl = useMemo(
    () => `/products/${productId}/${productSlug || "product"}`,
    [productId, productSlug],
  );

  return (
    <div className="flex flex-col border-b border-luxury-ink/10 pb-6 mb-2">
      {/* Header Top: Breadcrumb & Share */}
      <div className="flex items-center justify-between gap-4 mb-4">
        {(category || subcategory) && (
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-charcoal-400 uppercase flex-wrap"
          >
            <Link href="/" className="hover:text-luxury-ink transition-colors">
              Trang chủ
            </Link>
            {category && (
              <>
                <IconChevronRight className="h-3 w-3 text-taupe-300" />
                <Link
                  href={`/categories/${category._id}`}
                  className="hover:text-luxury-ink transition-colors"
                >
                  {category.name}
                </Link>
              </>
            )}
            {subcategory && (
              <>
                <IconChevronRight className="h-3 w-3 text-taupe-300" />
                <span className="text-luxury-ink">{subcategory.name}</span>
              </>
            )}
          </nav>
        )}

        <div className="flex-shrink-0 ml-auto">
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
      <h1
        className="text-3xl lg:text-4xl text-luxury-ink leading-[1.1] mb-5 tracking-tight"
        style={{ fontFamily: "var(--font-droid-serif), serif" }}
      >
        {name}
      </h1>

      {/* Rating Section */}
      <div className="flex items-center gap-4">
        {totalReviews > 0 ? (
          <>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) =>
                  i <= Math.round(averageRating) ? (
                    <IconStarFilled
                      key={i}
                      className="h-4 w-4 text-luxury-ink"
                    />
                  ) : (
                    <IconStar key={i} className="h-4 w-4 text-taupe-200" />
                  ),
                )}
              </div>
              <span className="ml-1 text-[11px] font-bold text-luxury-ink mt-0.5">
                {averageRating.toFixed(1)}
              </span>
            </div>

            <div className="h-3 w-[1px] bg-luxury-ink/20" />

            <span className="text-[11px] font-bold uppercase tracking-wide text-taupe-500 mt-0.5">
              {totalReviews.toLocaleString("vi-VN")} đánh giá
            </span>
          </>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-charcoal-400">
            <IconStar className="h-4 w-4" />
            <span>Chưa có đánh giá</span>
          </div>
        )}
      </div>
    </div>
  );
}
