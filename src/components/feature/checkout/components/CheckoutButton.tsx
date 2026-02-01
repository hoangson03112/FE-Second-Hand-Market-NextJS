"use client";

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
      onClick={onClick}
      disabled={isSubmitting || isDisabled}
      className="w-full btn btn-primary btn-lg py-4 text-lg font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Đang xử lý...
        </span>
      ) : (
        `Đặt hàng - ${total > 0 ? formatPrice(total) : "0₫"}`
      )}
    </button>
  );
}
