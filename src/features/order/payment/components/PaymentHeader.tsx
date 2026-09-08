import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { Eyebrow } from "@/features/order/components";
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
    <section className="relative overflow-hidden rounded-[2px] bg-luxury-ink px-6 py-10 sm:px-10 sm:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_70%_60%_at_82%_12%,color-mix(in_srgb,var(--accent)_22%,transparent)_0%,transparent_60%),radial-gradient(ellipse_55%_50%_at_8%_88%,color-mix(in_srgb,var(--luxury-champagne)_18%,transparent)_0%,transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-noise-texture"
      />

      <div className="relative z-10">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-2xs font-bold uppercase tracking-[0.22em] text-luxury-ivory/60 transition-colors hover:text-luxury-ivory"
        >
          <IconArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Quay lại
        </Link>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <Eyebrow tone="dark">Chuyển khoản ngân hàng</Eyebrow>
            <h1
              className="font-droid-serif mt-5 text-[clamp(1.85rem,4vw,2.85rem)] font-normal leading-[1.08] tracking-tight text-luxury-ivory"
            >
              Hoàn tất thanh toán
            </h1>

            {orderId ? (
              <div className="mt-7 inline-flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-luxury-ivory/15 pt-5">
                <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-luxury-ivory/50">
                  Mã đơn nội bộ
                </span>
                <span className="font-droid-serif select-all break-all text-sm tracking-wide text-luxury-ivory/90">
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
