"use client";

import { IconShoppingCart, IconBolt, IconLock } from "@tabler/icons-react";
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
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-secondary text-muted-foreground border-2 border-border font-semibold text-sm hover:bg-secondary/80 transition-all duration-200"
      >
        <IconLock className="w-4 h-4" />
        Đăng nhập để mua hàng
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
