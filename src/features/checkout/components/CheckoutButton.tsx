"use client";

import { IconArrowUpRight } from "@tabler/icons-react";
import { formatPrice } from "@/utils/format/price";

interface CheckoutButtonProps {
  total: number;
  isSubmitting: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export default function CheckoutButton({
  total,
  isSubmitting,
  isDisabled,
  onClick,
}: CheckoutButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isSubmitting || isDisabled}
      className="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-[2px] bg-luxury-ink px-6 text-[11px] font-bold uppercase tracking-[0.22em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-luxury-ink"
    >
      {isSubmitting ? (
        <>
          <span className="h-3.5 w-3.5 animate-spin rounded-full border border-luxury-ivory/30 border-t-luxury-ivory" />
          Đang xử lý
        </>
      ) : (
        <>
          <span>Đặt hàng</span>
          <span aria-hidden className="h-3 w-px bg-luxury-champagne/60" />
          <span className="tabular-nums">
            {total > 0 ? formatPrice(total) : "0₫"}
          </span>
          <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </>
      )}
    </button>
  );
}
