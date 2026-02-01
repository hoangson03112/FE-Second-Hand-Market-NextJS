"use client";

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
  return (
    <div className="flex gap-4 mb-8">
      <button
        onClick={onBuyNow}
        disabled={actionLoading || isOutOfStock}
        className="flex-1 bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {actionLoading ? "Đang xử lý..." : !account ? "Đăng nhập" : isOutOfStock ? "Hết hàng" : "Mua Ngay"}
      </button>
      {account && (
        <button
          onClick={onAddToCart}
          disabled={actionLoading || isOutOfStock}
          className="flex-1 border-2 border-primary text-primary py-4 rounded-lg font-semibold text-lg hover:bg-primary/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {actionLoading ? "Đang thêm..." : "Thêm Vào Giỏ"}
        </button>
      )}
    </div>
  );
}
