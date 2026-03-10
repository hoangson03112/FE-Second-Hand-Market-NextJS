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
            ? "bg-primary/8 border-primary/20 shadow-lg shadow-primary/10 animate-pulse"
            : "bg-secondary/60 border-border shadow-md"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isExpired
            ? "bg-destructive/10"
            : isWarning
              ? "bg-primary/10"
              : "bg-secondary"
        }`}
      >
        <IconClock
          className={`h-5 w-5 ${
            isExpired
              ? "text-destructive"
              : isWarning
                ? "text-primary"
                : "text-muted-foreground"
          }`}
        />
      </div>
      <div>
        <p
          className={`text-xs font-medium ${
            isExpired
              ? "text-destructive"
              : isWarning
                ? "text-primary"
                : "text-muted-foreground"
          }`}
        >
          {isExpired ? "Đã hết hạn" : "Thời gian còn lại"}
        </p>
        <p
          className={`text-xl font-bold ${
            isExpired
              ? "text-destructive"
              : isWarning
                ? "text-primary"
                : "text-foreground"
          }`}
        >
          {formatCountdown(secondsLeft)}
        </p>
      </div>
    </div>
  );
}
