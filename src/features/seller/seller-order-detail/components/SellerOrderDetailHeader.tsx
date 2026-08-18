"use client";

import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import {
  Eyebrow,
  OrderStatusChip,
  microCaps,
} from "@/features/order/components";
import { PaymentChip } from "@/features/seller/components";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";

interface SellerOrderDetailHeaderProps {
  orderId: string;
  status: string;
  paymentStatus?: string;
  createdAt: string;
  totalAmount: number;
}

export function SellerOrderDetailHeader({
  orderId,
  status,
  paymentStatus,
  createdAt,
  totalAmount,
}: SellerOrderDetailHeaderProps) {
  return (
    <div className="mx-auto w-full max-w-9xl px-4 sm:px-6">
      <div className="flex flex-col gap-6 py-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="flex items-start gap-4">
          <Link
            href="/my/orders"
            aria-label="Quay lại danh sách đơn hàng"
            className="-ml-2 mt-1 shrink-0 rounded-[2px] p-2 text-luxury-ink transition-colors hover:bg-taupe-50"
          >
            <IconArrowLeft className="h-5 w-5" />
          </Link>

          <div className="min-w-0">
            <Eyebrow>Đơn hàng của shop</Eyebrow>
            <h1 className="font-droid-serif mt-2.5 text-[clamp(1.5rem,3vw,2rem)] leading-[1.1] tracking-wide text-luxury-ink">
              #{orderId.slice(-8).toUpperCase()}
            </h1>
            <p className="mt-2.5 text-xs tabular-nums text-neutral-500">
              Đặt lúc {format(createdAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-6 lg:justify-end lg:gap-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <OrderStatusChip status={status} />
            <PaymentChip status={paymentStatus} variant="full" />
          </div>

          <div className="lg:text-right">
            <p className={cn(microCaps, "text-neutral-500")}>Giá trị đơn</p>
            <p className="font-droid-serif mt-2 text-2xl leading-none tabular-nums text-luxury-ink">
              {formatPrice(totalAmount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
