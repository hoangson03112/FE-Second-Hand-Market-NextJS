import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Thanh toán đơn hàng
          </h1>
          <p className="text-sm text-muted-foreground">
            Mã đơn hàng:{" "}
            <span className="font-mono font-semibold text-foreground">
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
