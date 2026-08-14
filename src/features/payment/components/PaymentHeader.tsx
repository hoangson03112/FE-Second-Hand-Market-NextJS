import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { PaymentTimer } from "./PaymentTimer";

export interface PaymentHeaderProps {
  orderId: string | null;
  secondsLeft: number | null;
  isExpired: boolean;
  formatCountdown: (secondsLeft: number | null) => string;
}

/**
 * Dark ink hero carrying the countdown — the same panel treatment as the
 * homepage CTA, so the payment window reads as deliberate rather than alarming.
 */
export function PaymentHeader({
  orderId,
  secondsLeft,
  isExpired,
  formatCountdown,
}: PaymentHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-[2px] bg-luxury-ink px-6 py-10 sm:px-10 sm:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 82% 12%, color-mix(in srgb, var(--accent) 22%, transparent) 0%, transparent 60%), radial-gradient(ellipse 55% 50% at 8% 88%, color-mix(in srgb, var(--luxury-champagne) 18%, transparent) 0%, transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-luxury-ivory/60 transition-colors hover:text-luxury-ivory"
        >
          <IconArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Quay lại
        </Link>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <Eyebrow tone="dark">Chuyển khoản ngân hàng</Eyebrow>
            <h1
              style={{
                fontFamily: "var(--font-droid-serif), serif",
                fontWeight: 400,
                lineHeight: 1.08,
              }}
              className="mt-5 text-[clamp(1.85rem,4vw,2.85rem)] tracking-tight text-luxury-ivory"
            >
              Hoàn tất thanh toán
            </h1>

            {orderId ? (
              <div className="mt-7 inline-flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-luxury-ivory/15 pt-5">
                <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-luxury-ivory/50">
                  Mã đơn nội bộ
                </span>
                <span
                  style={{ fontFamily: "var(--font-droid-serif), serif" }}
                  className="select-all break-all text-sm tracking-wide text-luxury-ivory/90"
                >
                  {orderId}
                </span>
              </div>
            ) : null}
          </div>

          <div className="shrink-0">
            <PaymentTimer
              secondsLeft={secondsLeft}
              isExpired={isExpired}
              formatCountdown={formatCountdown}
              tone="dark"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
