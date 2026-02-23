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
    <div className="flex gap-3 mb-4">
      <button
        onClick={onBuyNow}
        disabled={actionLoading || isOutOfStock}
        className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {actionLoading ? "Đang xử lý..." : !account ? "Đăng nhập" : isOutOfStock ? "Hết hàng" : "Mua Ngay"}
      </button>
      {account && (
        <button
          onClick={onAddToCart}
          disabled={actionLoading || isOutOfStock}
          className="flex-1 border border-primary text-primary py-3 rounded-lg font-medium hover:bg-primary/5 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {actionLoading ? "Đang thêm..." : "Thêm Vào Giỏ"}
        </button>
      )}
    </div>
  );
}
