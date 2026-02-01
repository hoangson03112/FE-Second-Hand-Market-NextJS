import { Clock } from "lucide-react";

export interface PaymentTimerProps {
  secondsLeft: number | null;
  isExpired: boolean;
  formatCountdown: (secondsLeft: number | null) => string;
}

export function PaymentTimer({
  secondsLeft,
  isExpired,
  formatCountdown,
}: PaymentTimerProps) {
  const isWarning =
    secondsLeft !== null && secondsLeft <= 300 && !isExpired;

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-xl px-5 py-4 border-2 transition-all ${
        isExpired
          ? "bg-red-50 border-red-200 shadow-lg shadow-red-100"
          : isWarning
            ? "bg-orange-50 border-orange-200 shadow-lg shadow-orange-100 animate-pulse"
            : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isExpired
            ? "bg-red-100"
            : isWarning
              ? "bg-orange-100"
              : "bg-blue-100"
        }`}
      >
        <Clock
          className={`h-5 w-5 ${
            isExpired
              ? "text-red-600"
              : isWarning
                ? "text-orange-600"
                : "text-blue-600"
          }`}
        />
      </div>
      <div>
        <p
          className={`text-xs font-medium ${
            isExpired
              ? "text-red-600"
              : isWarning
                ? "text-orange-600"
                : "text-muted-foreground"
          }`}
        >
          {isExpired ? "Đã hết hạn" : "Thời gian còn lại"}
        </p>
        <p
          className={`text-xl font-bold ${
            isExpired
              ? "text-red-600"
              : isWarning
                ? "text-orange-600"
                : "text-blue-600"
          }`}
        >
          {formatCountdown(secondsLeft)}
        </p>
      </div>
    </div>
  );
}
