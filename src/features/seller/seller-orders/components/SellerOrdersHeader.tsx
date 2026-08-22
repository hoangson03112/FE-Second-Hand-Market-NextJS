"use client";

import Link from "next/link";
import { IconArrowLeft, IconArrowUpRight } from "@tabler/icons-react";
import { Eyebrow, microCaps } from "@/features/order/components";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format/price";

interface SellerOrdersHeaderProps {
  onBack: () => void;
  stats: {
    todayOrders: number;
    todayRevenue: number;
    pending: number;
    returnRequests: number;
  };
}

export default function SellerOrdersHeader({
  onBack,
  stats,
}: SellerOrdersHeaderProps) {
  /**
   * Editorial figures rather than dashboard stat cards: a micro-caps label over
   * a serif numeral, separated by hairlines — the gesture the homepage uses for
   * its section counts, so the seller queue reads as part of the storefront.
   */
  const figures: { label: string; value: string; attention?: boolean }[] = [
    { label: "Đơn hôm nay", value: String(stats.todayOrders) },
    { label: "Doanh thu hôm nay", value: formatPrice(stats.todayRevenue) },
    {
      label: "Chờ xác nhận",
      value: String(stats.pending),
      attention: stats.pending > 0,
    },
    {
      label: "Yêu cầu hoàn",
      value: String(stats.returnRequests),
      attention: stats.returnRequests > 0,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-9xl px-4 sm:px-6">
      <div className="flex flex-col gap-6 py-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={onBack}
            aria-label="Quay lại"
            className="-ml-2 mt-1 shrink-0 rounded-[2px] p-2 text-luxury-ink transition-colors hover:bg-taupe-50"
          >
            <IconArrowLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <Eyebrow>Kênh người bán</Eyebrow>
            <h1 className="font-droid-serif mt-2.5 text-[clamp(1.5rem,3vw,2rem)] leading-[1.1] tracking-tight text-luxury-ink">
              Quản lý đơn hàng
            </h1>
            <p className="mt-2.5 max-w-md text-sm leading-relaxed text-neutral-600">
              Theo dõi và xử lý đơn hàng mới từ người mua.
            </p>
            <Link
              href="/seller/payouts"
              className="group mt-4 inline-flex items-center gap-2 text-2xs font-bold uppercase tracking-[0.22em] text-luxury-ink transition-colors hover:text-taupe-700"
            >
              Đối soát doanh thu
              <IconArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-2 md:grid-cols-4">
          {figures.map((figure, index) => (
            <div
              key={figure.label}
              className={cn(
                "border-luxury-ink/10 px-4 py-3.5 md:px-5 md:py-0",
                "border-t md:border-t-0",
                index % 2 === 1
                  ? "border-l"
                  : index > 0
                    ? "md:border-l"
                    : undefined,
                index === figures.length - 1 && "md:pr-0",
              )}
            >
              <p className={cn(microCaps, "text-neutral-500")}>
                {figure.label}
              </p>
              <p
                className={cn(
                  "font-droid-serif",
                  "mt-2 text-xl leading-none tabular-nums sm:text-2xl",
                  figure.attention ? "text-taupe-700" : "text-luxury-ink",
                )}
              >
                {figure.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
