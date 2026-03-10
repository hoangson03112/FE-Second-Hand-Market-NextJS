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
  hasPersonalDiscount 
}: ProductPriceProps) {
  return (
    <div className="bg-gradient-to-r from-taupe-50 to-cream-50 p-5 mb-3 border-2 border-border rounded-2xl shadow-md">
      {hasPersonalDiscount && originalPrice ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-medium text-primary">
              {formattedPrice || "Liên hệ"}
            </span>
            <span className="px-3 py-1 text-xs font-bold text-accent-foreground bg-accent rounded-lg shadow-md animate-pulse">
              GIÁ ĐẶC BIỆT
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg text-taupe-400 line-through">
              {formatPrice(originalPrice)}
            </span>
            <span className="text-sm font-semibold text-primary">
              Tiết kiệm {formatPrice(originalPrice - price)}
            </span>
          </div>
          <p className="text-xs text-taupe-500 mt-1 bg-secondary/60 border border-border rounded-lg px-3 py-2">
            🎉 Chỉ dành riêng cho bạn! Giá đặc biệt từ người bán
          </p>
        </div>
      ) : (
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-medium text-primary">
            {formattedPrice || "Liên hệ"}
          </span>
        </div>
      )}
    </div>
  );
}
