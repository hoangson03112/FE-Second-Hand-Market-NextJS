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
      className="btn-auth-primary w-full btn btn-lg py-3 font-medium rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center gap-2">
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
    </button>
  );
}
