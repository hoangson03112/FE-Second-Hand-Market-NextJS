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
        className="pointer-events-none absolute inset-0 opacity-45 bg-[radial-gradient(ellipse_70%_60%_at_80%_15%,color-mix(in_srgb,var(--accent)_26%,transparent)_0%,transparent_60%),radial-gradient(ellipse_55%_50%_at_8%_85%,color-mix(in_srgb,var(--luxury-champagne)_18%,transparent)_0%,transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-noise-texture"
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
            className="font-droid-serif mt-6 text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.06] tracking-tight text-luxury-ivory"
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
            <span className="font-droid-serif select-all text-lg tracking-wide text-luxury-ivory">
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
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-[2px] bg-luxury-ivory px-7 text-2xs font-bold uppercase tracking-[0.22em] text-luxury-ink transition-all duration-300 hover:bg-white"
          >
            Xem chi tiết đơn
            <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[2px] border border-luxury-ivory/25 px-7 text-2xs font-bold uppercase tracking-[0.22em] text-luxury-ivory transition-all duration-300 hover:border-luxury-champagne/60 hover:text-luxury-champagne"
          >
            <IconHome className="h-4 w-4" />
            Trang chủ
          </Link>
        </div>
      </div>
    </section>
  );
}
