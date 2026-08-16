"use client";

import Link from "next/link";
import {
  IconArrowUpRight,
  IconCheck,
  IconHome,
  IconLoader2,
} from "@tabler/icons-react";
import { Eyebrow } from "@/features/order/components";
import { cn } from "@/lib/utils";

interface SuccessHeroProps {
  orderCode: string;
  orderId: string;
  showConfirmReceived: boolean;
  isConfirmingReceived: boolean;
  onConfirmReceived: () => void;
}

/**
 * The confirmation moment gets the dark ink treatment from the homepage CTA:
 * radial accent glow, fractal-noise grain, serif headline in ivory.
 */
export default function SuccessHero({
  orderCode,
  orderId,
  showConfirmReceived,
  isConfirmingReceived,
  onConfirmReceived,
}: SuccessHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[2px] bg-luxury-ink px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 80% 15%, color-mix(in srgb, var(--accent) 26%, transparent) 0%, transparent 60%), radial-gradient(ellipse 55% 50% at 8% 85%, color-mix(in srgb, var(--luxury-champagne) 18%, transparent) 0%, transparent 55%)",
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

      <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/50 bg-accent/15">
              <IconCheck className="h-4 w-4 text-accent" strokeWidth={2.5} />
            </span>
            <Eyebrow tone="dark">Đơn hàng đã được ghi nhận</Eyebrow>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-droid-serif), serif",
              fontWeight: 400,
              lineHeight: 1.06,
            }}
            className="mt-6 text-[clamp(2rem,4.5vw,3.25rem)] tracking-tight text-luxury-ivory"
          >
            Đặt hàng thành công.
            <span className="block text-taupe-200">
              Cảm ơn bạn đã tin chúng tôi.
            </span>
          </h1>

          <div className="mt-8 inline-flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-luxury-ivory/15 pt-6">
            <span className="text-2xs font-medium uppercase tracking-[0.15em] text-luxury-ivory/50">
              Mã đơn
            </span>
            <span
              style={{ fontFamily: "var(--font-droid-serif), serif" }}
              className="select-all text-lg tracking-wide text-luxury-ivory"
            >
              #{orderCode}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          {showConfirmReceived ? (
            <button
              type="button"
              onClick={onConfirmReceived}
              disabled={isConfirmingReceived}
              className={cn(
                "inline-flex h-12 items-center justify-center gap-2 rounded-[2px] border border-accent/60 bg-accent/15 px-7",
                "text-2xs font-medium uppercase tracking-[0.15em] text-taupe-200",
                "transition-all duration-300 hover:bg-accent/25 disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              {isConfirmingReceived ? (
                <IconLoader2 className="h-4 w-4 animate-spin" />
              ) : (
                <IconCheck className="h-4 w-4" />
              )}
              Đã nhận được hàng
            </button>
          ) : null}

          <Link
            href={`/orders/${orderId}`}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-[2px] bg-luxury-ivory px-7 text-[10px] font-bold uppercase tracking-[0.22em] text-luxury-ink transition-all duration-300 hover:bg-white"
          >
            Xem chi tiết đơn
            <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[2px] border border-luxury-ivory/25 px-7 text-[10px] font-bold uppercase tracking-[0.22em] text-luxury-ivory transition-all duration-300 hover:border-luxury-champagne/60 hover:text-luxury-champagne"
          >
            <IconHome className="h-4 w-4" />
            Trang chủ
          </Link>
        </div>
      </div>
    </section>
  );
}
