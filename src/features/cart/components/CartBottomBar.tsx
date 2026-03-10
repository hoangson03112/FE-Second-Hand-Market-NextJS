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
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-card/95 backdrop-blur-lg border-t-2 border-border shadow-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                disabled={isBusy}
                className="w-4 h-4 border-2 border-taupe-300 rounded-md text-primary focus:ring-2 focus:ring-primary/50 cursor-pointer disabled:opacity-50 transition-all"
              />
              <span className="text-sm text-taupe-900 hidden sm:inline">
                Chọn tất cả ({totalItemCount})
              </span>
              <span className="text-xs text-taupe-900 sm:hidden">
                Tất cả
              </span>
            </label>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs text-taupe-600 hidden sm:block">
                Tổng thanh toán ({selectedCount} sản phẩm):
              </span>
              <span className="text-xs text-taupe-600 sm:hidden">
                Tổng ({selectedCount}):
              </span>
              <span className="text-lg sm:text-2xl font-medium text-primary">
                {formatPrice(selectedSubtotal)}
              </span>
            </div>

            {canCheckout ? (
              <button
                type="button"
                onClick={onGoToCheckout}
                disabled={isBusy || isGoingToCheckout}
                className="h-10 sm:h-11 px-6 sm:px-12 bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-bold uppercase tracking-wider rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isGoingToCheckout ? "Đang xử lý..." : "Mua Hàng"}
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="h-10 sm:h-11 px-6 sm:px-12 bg-taupe-200 text-taupe-400 text-sm font-semibold rounded-xl cursor-not-allowed whitespace-nowrap"
              >
                Mua Hàng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
