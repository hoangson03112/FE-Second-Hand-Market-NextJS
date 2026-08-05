"use client";

import { formatPrice } from "@/utils/format/price";
import { Button } from "@/components/shared";

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
    <Button
      type="button"
      onClick={onClick}
      disabled={isSubmitting || isDisabled}
      fullWidth
      className="bg-luxury-ink text-white hover:bg-luxury-ink/90 rounded-[2px] disabled:opacity-40 uppercase tracking-[0.2em] text-[11px] font-semibold transition-colors h-14"
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center gap-3">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Đang xử lý...
        </span>
      ) : (
        `Đặt hàng - ${total > 0 ? formatPrice(total) : "0₫"}`
      )}
    </Button>
  );
}
