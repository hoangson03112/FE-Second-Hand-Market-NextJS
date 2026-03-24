"use client";

import { IconShoppingCart, IconBolt, IconLock, IconChevronRight } from "@tabler/icons-react";
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
        className="group w-full flex items-center justify-between rounded-2xl border border-taupe-300/80 bg-white px-4 py-3.5 text-left shadow-[0_8px_20px_rgba(60,42,24,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-taupe-500/70 hover:shadow-[0_12px_24px_rgba(60,42,24,0.12)]"
      >
        <span className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-taupe-300 bg-taupe-50 text-taupe-700 transition-colors group-hover:bg-taupe-100">
            <IconLock className="h-4 w-4" />
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold text-taupe-900">Đăng nhập để mua hàng</span>
            <span className="text-xs text-taupe-500">Mở giỏ hàng và đặt mua nhanh hơn</span>
          </span>
        </span>
        <IconChevronRight className="h-4 w-4 text-taupe-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-taupe-600" />
      </button>
    );
  }

  if (isOutOfStock) {
    return (
      <div className="w-full py-3.5 rounded-xl bg-secondary text-muted-foreground/70 border-2 border-border font-semibold text-sm text-center">
        Hết hàng
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-3">
      {/* Add to cart — secondary */}
      <button
        onClick={onAddToCart}
        disabled={disabled}
        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-card border-2 border-primary/30 text-primary font-semibold text-sm tracking-wide hover:bg-primary/5 hover:border-primary/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
      >
        <IconShoppingCart className="w-4 h-4 shrink-0" />
        {actionLoading ? "Đang thêm..." : "Thêm vào giỏ"}
      </button>

      {/* Buy now — primary CTA */}
      <button
        onClick={onBuyNow}
        disabled={disabled}
        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm tracking-wide overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] shadow-sm hover:shadow-md"
      >
        <IconBolt className="w-4 h-4 shrink-0" />
        {actionLoading ? "Đang xử lý..." : "Mua ngay"}
      </button>
    </div>
  );
}
