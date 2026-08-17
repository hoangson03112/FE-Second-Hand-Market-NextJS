"use client";

import { formatPrice } from "@/utils/format/price";

interface ProductPriceProps {
  price: number;
  formattedPrice: string;
  originalPrice?: number | null;
  hasPersonalDiscount?: boolean;
}

export default function ProductPrice({
  price,
  formattedPrice,
  originalPrice,
  hasPersonalDiscount,
}: ProductPriceProps) {
  return (
    <div className="py-2 mb-2">
      {hasPersonalDiscount && originalPrice ? (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-4">
            <span className="text-4xl font-normal tracking-tight text-primary md:text-base group-hover:text-blush-600">
              {formattedPrice || "Liên hệ"}
            </span>
            <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-[0.2em] text-blush-600 bg-blush-50 border border-blush-200 rounded-[2px]">
              Giá đặc biệt
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs uppercase tracking-wide">
            <span className="text-taupe-400 line-through font-bold">
              {formatPrice(originalPrice)}
            </span>
            <span className="font-bold text-blush-600">
              Tiết kiệm {formatPrice(originalPrice - price)}
            </span>
          </div>
          <p className="text-[11px] text-taupe-600 mt-3 bg-taupe-50/50 border border-luxury-ink/10 rounded-[2px] px-4 py-3 leading-relaxed">
            🎉 Giá ưu đãi đặc biệt dành riêng cho tài khoản của bạn.
          </p>
        </div>
      ) : (
        <div className="flex items-baseline gap-4">
          <span className="text-3xl font-normal tracking-tight text-primary  group-hover:text-blush-600">
            {formattedPrice || "Liên hệ"}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm font-bold text-taupe-400 line-through uppercase tracking-wide">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
