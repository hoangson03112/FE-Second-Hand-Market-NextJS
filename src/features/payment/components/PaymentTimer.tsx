import { IconClock } from "@tabler/icons-react";

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
          ? "bg-destructive/8 border-destructive/20 shadow-lg shadow-destructive/10"
          : isWarning
            ? "bg-amber-50 border-amber-200 shadow-lg shadow-amber-100 animate-pulse"
            : "bg-sky-50 border-sky-200 shadow-md"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isExpired
            ? "bg-destructive/10"
            : isWarning
              ? "bg-amber-100"
              : "bg-sky-100"
        }`}
      >
        <IconClock
          className={`h-5 w-5 ${
            isExpired
              ? "text-destructive"
              : isWarning
                ? "text-amber-700"
                : "text-sky-700"
          }`}
        />
      </div>
      <div>
        <p
          className={`text-xs font-medium ${
            isExpired
              ? "text-destructive"
              : isWarning
                ? "text-amber-700"
                : "text-sky-700"
          }`}
        >
          {isExpired ? "Đã hết hạn" : "Thời gian còn lại"}
        </p>
        <p
          className={`text-xl font-bold ${
            isExpired
              ? "text-destructive"
              : isWarning
                ? "text-amber-800"
                : "text-sky-900"
          }`}
        >
          {formatCountdown(secondsLeft)}
        </p>
      </div>
    </div>
  );
}
