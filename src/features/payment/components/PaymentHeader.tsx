import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { PaymentTimer } from "./PaymentTimer";

export interface PaymentHeaderProps {
  orderId: string | null;
  secondsLeft: number | null;
  isExpired: boolean;
  formatCountdown: (secondsLeft: number | null) => string;
}

export function PaymentHeader({
  orderId,
  secondsLeft,
  isExpired,
  formatCountdown,
}: PaymentHeaderProps) {
  return (
    <div className="mb-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-taupe-500 hover:text-taupe-900 mb-6 transition-colors"
      >
        <IconArrowLeft className="h-4 w-4" />
        Quay lại
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-taupe-900 mb-2">
            Thanh toán đơn hàng
          </h1>
          <p className="text-sm text-taupe-500">
            Mã đơn nội bộ:{" "}
            <span className="font-mono font-semibold text-taupe-900">
              {orderId}
            </span>
          </p>
        </div>
        <PaymentTimer
          secondsLeft={secondsLeft}
          isExpired={isExpired}
          formatCountdown={formatCountdown}
        />
      </div>
    </div>
  );
}