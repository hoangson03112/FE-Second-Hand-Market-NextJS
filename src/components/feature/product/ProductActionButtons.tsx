"use client";


interface ProductActionButtonsProps {
  actionLoading: boolean;
  isOutOfStock: boolean;
  onBuyNow: () => void;
  onAddToCart: () => void;
}

export default function ProductActionButtons({
    actionLoading,
  isOutOfStock,
  onBuyNow,
  onAddToCart,

}: ProductActionButtonsProps) {
  return (
    <div className="flex gap-4 mb-8">
      <button
        onClick={onBuyNow}
        disabled={actionLoading || isOutOfStock}
        className="flex-1 bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {actionLoading ? "Đang xử lý..." : isOutOfStock ? "Hết hàng" : "Mua Ngay"}
      </button>
      <button
        onClick={onAddToCart}
        disabled={actionLoading || isOutOfStock}
        className="flex-1 border-2 border-primary text-primary py-4 rounded-lg font-semibold text-lg hover:bg-primary/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {actionLoading ? "Đang thêm..." : "Thêm Vào Giỏ"}
      </button>

    </div>
  );
}

