"use client";

import { formatPrice } from "@/utils/format/price";
import { Button } from "@/components/shared";

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
              <span className="text-[11px] uppercase tracking-wide font-semibold text-luxury-ink hidden sm:inline mt-0.5">
                Chọn tất cả ({totalItemCount})
              </span>
              <span className="text-[11px] uppercase tracking-wide font-semibold text-luxury-ink sm:hidden mt-0.5">
                Tất cả
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-taupe-500 hidden sm:block">
                Tổng thanh toán ({selectedCount} sản phẩm):
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-taupe-500 sm:hidden">
                Tổng ({selectedCount}):
              </span>
              <span className="text-xl sm:text-2xl font-bold text-luxury-ink mt-1" style={{ fontFamily: "var(--font-droid-serif), serif" }}>
                {formatPrice(selectedSubtotal)}
              </span>
            </div>

            {canCheckout ? (
              <button
                type="button"
                onClick={onGoToCheckout}
                disabled={isBusy || isGoingToCheckout}
                className="bg-luxury-ink text-white hover:bg-luxury-ink/90 h-11 sm:h-12 px-6 sm:px-12 uppercase tracking-[0.2em] text-[11px] font-semibold rounded-[2px] disabled:opacity-70 whitespace-nowrap transition-colors"
              >
                {isGoingToCheckout ? "Đang xử lý..." : "Mua Hàng"}
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="h-11 sm:h-12 px-6 sm:px-12 bg-taupe-100 text-taupe-400 uppercase tracking-[0.2em] text-[11px] font-semibold rounded-[2px] cursor-not-allowed whitespace-nowrap"
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
