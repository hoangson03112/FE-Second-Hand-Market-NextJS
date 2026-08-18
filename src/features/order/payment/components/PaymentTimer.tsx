import { IconClock } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface PaymentTimerProps {
  secondsLeft: number | null;
  isExpired: boolean;
  formatCountdown: (secondsLeft: number | null) => string;
  /** `dark` renders on the ink hero; `light` on an ivory surface. */
  tone?: "light" | "dark";
}

export function PaymentTimer({
  secondsLeft,
  isExpired,
  formatCountdown,
  tone = "light",
}: PaymentTimerProps) {
  const isWarning = secondsLeft !== null && secondsLeft <= 300 && !isExpired;
  const isDark = tone === "dark";

  const label = isExpired
    ? "Đã hết hạn"
    : isWarning
      ? "Sắp hết thời gian"
      : "Thời gian còn lại";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-4 rounded-[2px] border px-5 py-4 transition-colors duration-500",
        isDark
          ? isExpired
            ? "border-blush-400/50 bg-blush-500/10"
            : isWarning
              ? "border-luxury-champagne/60 bg-luxury-champagne/10"
              : "border-luxury-ivory/20 bg-luxury-ivory/5"
          : isExpired
            ? "border-blush-300 bg-blush-50"
            : isWarning
              ? "border-luxury-champagne/50 bg-cream-100"
              : "border-luxury-ink/12 bg-white",
      )}
    >
      <IconClock
        className={cn(
          "h-5 w-5 shrink-0",
          isExpired
            ? isDark
              ? "text-blush-300"
              : "text-blush-700"
            : isWarning
              ? "text-luxury-champagne"
              : isDark
                ? "text-luxury-ivory/60"
                : "text-neutral-500",
        )}
      />
      <div>
        <p
          className={cn(
            "text-[9px] font-bold uppercase tracking-[0.22em]",
            isExpired
              ? isDark
                ? "text-blush-300"
                : "text-blush-700"
              : isWarning
                ? "text-luxury-champagne"
                : isDark
                  ? "text-luxury-ivory/50"
                  : "text-neutral-500",
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            "font-droid-serif",
            "mt-1.5 text-2xl leading-none tabular-nums",
            isExpired
              ? isDark
                ? "text-blush-200"
                : "text-blush-800"
              : isDark
                ? "text-luxury-ivory"
                : "text-luxury-ink",
          )}
        >
          {formatCountdown(secondsLeft)}
        </p>
      </div>
    </div>
  );
}
