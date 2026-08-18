"use client";

import { IconArrowUpRight, IconMapPin, IconUsers } from "@tabler/icons-react";
import { Panel, microCaps } from "@/features/order/components";
import { cn } from "@/lib/utils";
import { formatShippingMethod } from "@/utils/format";
import type { Order } from "@/types/order";

interface SellerShippingCardProps {
  order: Order;
  isLocalPickup: boolean;
}

/** Waybill code plus its tracking link — one row, serif code, micro-caps label. */
function WaybillRow({
  label,
  code,
  href,
}: {
  label: string;
  code: string;
  href: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[2px] border border-luxury-ink/10 bg-cream-50/60 px-4 py-3">
      <div className="min-w-0">
        <p className={cn(microCaps, "text-neutral-500")}>{label}</p>
        <p className="font-droid-serif mt-1.5 truncate text-sm tracking-wide text-luxury-ink">
          {code}
        </p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex shrink-0 items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.18em] text-luxury-ink transition-colors hover:text-taupe-700"
      >
        Theo dõi
        <IconArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

export function SellerShippingCard({
  order,
  isLocalPickup,
}: SellerShippingCardProps) {
  const addressLine =
    [
      order.shippingAddress?.specificAddress,
      order.shippingAddress?.ward,
      order.shippingAddress?.district,
      order.shippingAddress?.province,
    ]
      .filter(Boolean)
      .join(", ") || "—";

  return (
    <Panel
      eyebrow="Giao hàng"
      title={isLocalPickup ? "Trao hàng trực tiếp" : "Địa chỉ giao hàng"}
      aside={
        <span className="inline-flex shrink-0 items-center gap-2 rounded-[2px] border border-luxury-ink/12 bg-cream-50 px-2.5 py-1 text-2xs font-bold uppercase tracking-[0.18em] text-neutral-600">
          {isLocalPickup
            ? "Gặp mặt"
            : formatShippingMethod(order.shippingMethod)}
        </span>
      }
    >
      {isLocalPickup ? (
        <div className="flex gap-4 rounded-[2px] border border-luxury-champagne/45 bg-cream-100/70 px-4 py-4">
          <IconUsers className="mt-0.5 h-4 w-4 shrink-0 text-luxury-champagne" />
          <div>
            <p className="text-xs font-bold text-luxury-ink">
              Người mua tự đến lấy hàng
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
              Liên hệ người mua để thống nhất thời gian và địa điểm gặp mặt, sau
              đó xác nhận đã giao hàng.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 rounded-[2px] border border-luxury-ink/10 bg-cream-50/60 px-4 py-4">
          <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-luxury-ink" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-luxury-ink">
              {order.shippingAddress?.fullName || "—"}
              {order.shippingAddress?.phoneNumber ? (
                <>
                  <span aria-hidden className="mx-2 text-luxury-ink/25">
                    ·
                  </span>
                  <span className="tabular-nums">
                    {order.shippingAddress.phoneNumber}
                  </span>
                </>
              ) : null}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
              {addressLine}
            </p>
          </div>
        </div>
      )}

      {order.ghnOrderCode || order.ghnReturnOrderCode ? (
        <div className="mt-4 space-y-3 border-t border-luxury-ink/8 pt-4">
          {order.ghnOrderCode ? (
            <WaybillRow
              label="Vận đơn GHN"
              code={order.ghnOrderCode}
              href={`https://tracking.ghn.dev/?order_code=${order.ghnOrderCode}`}
            />
          ) : null}
          {order.ghnReturnOrderCode ? (
            <WaybillRow
              label="Vận đơn hoàn trả"
              code={order.ghnReturnOrderCode}
              href={
                order.ghnReturnTrackingUrl?.trim() ||
                `https://tracking.ghn.dev/?order_code=${order.ghnReturnOrderCode}`
              }
            />
          ) : null}
        </div>
      ) : null}
    </Panel>
  );
}
