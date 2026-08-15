"use client";

import {
  IconShoppingCart,
  IconBolt,
  IconLock,
  IconChevronRight,
} from "@tabler/icons-react";
import type { AccountInfo } from "@/types/auth";

interface ProductActionButtonsProps {
  actionLoading: boolean;
  isOutOfStock: boolean;
  onBuyNow: () => void;
  onAddToCart: () => void;
  account?: AccountInfo | null;
}

export default function ProductActionButtons({
  actionLoading,
  isOutOfStock,
  onBuyNow,
  onAddToCart,
  account,
}: ProductActionButtonsProps) {
  const disabled = actionLoading || isOutOfStock;

  if (!account) {
    return (
      <button
        onClick={onBuyNow}
        className="group w-full flex items-center justify-between rounded-[2px] border border-luxury-ink/10 bg-white px-5 py-4 text-left transition-all duration-200 hover:border-luxury-ink/30"
      >
        <span className="flex items-center gap-4">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-taupe-50/50 text-luxury-ink transition-colors group-hover:bg-taupe-50">
            <IconLock className="h-5 w-5" />
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-sm font-bold text-luxury-ink">
              Đăng nhập để mua hàng
            </span>
            <span className="text-xs text-charcoal-600">
              Mở giỏ hàng và đặt mua nhanh hơn
            </span>
          </span>
        </span>
        <IconChevronRight className="h-5 w-5 text-charcoal-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-luxury-ink" />
      </button>
    );
  }

  if (isOutOfStock) {
    return (
      <div className="w-full py-4 rounded-[2px] bg-taupe-50 text-taupe-400 border border-luxury-ink/10 font-bold text-[11px] uppercase tracking-[0.2em] text-center">
        Hết hàng
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-4">
      {/* Add to cart — secondary */}
      <button
        onClick={onAddToCart}
        disabled={disabled}
        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-[2px] bg-white border border-luxury-ink/20 text-luxury-ink font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-taupe-50 hover:border-luxury-ink/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <IconShoppingCart className="w-4 h-4 shrink-0" />
        {actionLoading ? "Đang thêm..." : "Thêm vào giỏ"}
      </button>

      {/* Buy now — primary CTA */}
      <button
        onClick={onBuyNow}
        disabled={disabled}
        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-[2px] bg-luxury-ink text-white font-bold text-[11px] uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-luxury-ink/90"
      >
        <IconBolt className="w-4 h-4 shrink-0" />
        {actionLoading ? "Đang xử lý..." : "Mua ngay"}
      </button>
    </div>
  );
}
