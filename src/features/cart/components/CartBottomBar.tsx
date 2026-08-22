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
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-luxury-ivory/95 backdrop-blur-lg border-t border-luxury-ink/10">
      <div className="max-w-9xl mx-auto px-3 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                disabled={isBusy}
                className="w-4 h-4 border border-luxury-ink/20 rounded-[2px] text-luxury-ink focus:ring-1 focus:ring-luxury-ink cursor-pointer disabled:opacity-50 transition-all"
              />
              <span className="text-sm tracking-wide font-medium text-luxury-ink hidden sm:inline mt-0.5">
                Chọn tất cả ({totalItemCount})
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs uppercase tracking-[0.13em] font-medium text-luxury-ink hidden sm:block">
                Tổng thanh toán ({selectedCount} sản phẩm):
              </span>
              <span className="text-2xs uppercase tracking-[0.15em] font-bold  sm:hidden">
                Tổng ({selectedCount}):
              </span>
              <span className="text-xl sm:text-2xl font-medium text-luxury-ink mt-1">
                {formatPrice(selectedSubtotal)}
              </span>
            </div>

            {canCheckout ? (
              <button
                type="button"
                onClick={onGoToCheckout}
                disabled={isBusy || isGoingToCheckout}
                className="group relative inline-flex items-center justify-center h-11 sm:h-12 px-6 sm:px-12 text-sm font-medium uppercase tracking-[0.1em] text-white bg-primary rounded-[2px] transition-all duration-300 hover:scale-[1.03]"
              >
                {isGoingToCheckout ? "Đang xử lý..." : "Mua Hàng"}
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="h-11 sm:h-12 px-6 sm:px-12 bg-charcoal-400 text-charcoal-50 uppercase tracking-[0.1em] text-sm font-bold rounded-[2px] cursor-not-allowed whitespace-nowrap"
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
