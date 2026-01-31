"use client";

import { formatPrice } from "@/utils/format/price";

interface CartBottomBarProps {
  allSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  selectedCount: number;
  selectedSubtotal: number;
  totalItemCount: number;
  isBusy: boolean;
  onGoToCheckout?: () => void | Promise<void>;
  isGoingToCheckout?: boolean;
}

export default function CartBottomBar({
  allSelected,
  onSelectAll,
  selectedCount,
  selectedSubtotal,
  totalItemCount,
  isBusy,
  onGoToCheckout,
  isGoingToCheckout = false,
}: CartBottomBarProps) {
  const canCheckout = selectedCount > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-ne border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <label className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
            disabled={isBusy}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer disabled:opacity-50"
          />
          <span className="text-sm font-medium text-foreground whitespace-nowrap">
            Chọn tất cả
          </span>
        </label>

        <div className="flex-1 min-w-0 flex flex-col items-end">
          <span className="text-xs text-muted-foreground">
            Tổng thanh toán ({selectedCount}/{totalItemCount} sản phẩm)
          </span>
          <span className="text-lg font-bold text-primary">
            {formatPrice(selectedSubtotal)}
          </span>
        </div>

        {canCheckout ? (
          <button
            type="button"
            onClick={onGoToCheckout}
            disabled={isBusy || isGoingToCheckout}
            className="flex-shrink-0 h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
          >
            {isGoingToCheckout ? "Đang chuyển..." : `Mua hàng (${selectedCount})`}
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="flex-shrink-0 h-11 px-6 rounded-xl bg-muted text-muted-foreground text-sm font-medium cursor-not-allowed"
          >
            Mua hàng
          </button>
        )}
      </div>
    </div>
  );
}
