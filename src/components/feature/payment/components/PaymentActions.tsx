import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export interface PaymentActionsProps {
  isExpired: boolean;
  isConfirmingPayment: boolean;
  onConfirmPayment: () => void;
}

export function PaymentActions({
  isExpired,
  isConfirmingPayment,
  onConfirmPayment,
}: PaymentActionsProps) {
  const disabled = isExpired || isConfirmingPayment;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Link href="/" className="flex-1 btn btn-outline py-3 text-center">
        Về trang chủ
      </Link>
      <button
        onClick={onConfirmPayment}
        disabled={disabled}
        className={`flex-1 btn py-3 transition-all ${
          disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "btn-primary"
        }`}
      >
        {isConfirmingPayment ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
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
          <span className="flex items-center justify-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Đã thanh toán
          </span>
        )}
      </button>
    </div>
  );
}
