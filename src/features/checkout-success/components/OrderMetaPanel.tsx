"use client";

import Link from "next/link";
import {
  IconArrowUpRight,
  IconCalendar,
  IconClockHour4,
  IconCreditCard,
  IconMapPin,
  IconUser,
} from "@tabler/icons-react";
import { Eyebrow } from "@/components/shared/Eyebrow";
import type { Order } from "@/types/order";

interface OrderMetaPanelProps {
  order: Order;
  orderId: string;
  isLocalPickup: boolean;
}

const serif = { fontFamily: "var(--font-droid-serif), serif" };

/** One labelled row: icon, micro-caps label, then the value block. */
function MetaRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof IconUser;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 px-5 py-5 sm:px-6">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-cream-50">
        <Icon className="h-4 w-4 text-luxury-ink" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">
          {label}
        </p>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}

export default function OrderMetaPanel({
  order,
  orderId,
  isLocalPickup,
}: OrderMetaPanelProps) {
  const addr = order.shippingAddress;
  const fullAddress = [
    addr?.specificAddress,
    addr?.ward,
    addr?.district,
    addr?.province,
  ]
    .filter(Boolean)
    .join(", ");

  const orderedAt = new Date(order.createdAt).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const expectedDelivery = order.expectedDeliveryTime
    ? new Date(order.expectedDeliveryTime).toLocaleDateString("vi-VN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
      })
    : null;

  const paymentLabel =
    order.paymentMethod === "bank_transfer"
      ? "Chuyển khoản ngân hàng"
      : isLocalPickup
        ? "Thanh toán khi gặp mặt"
        : "Thanh toán khi nhận hàng (COD)";

  return (
    <section className="overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white">
      <header className="border-b border-luxury-ink/10 px-5 py-5 sm:px-6">
        <Eyebrow>Thông tin đơn</Eyebrow>
        <h2
          style={serif}
          className="mt-3 text-lg tracking-tight text-luxury-ink"
        >
          Giao nhận &amp; liên hệ
        </h2>
      </header>

      <div className="divide-y divide-luxury-ink/8">
        {order.sellerId ? (
          <MetaRow icon={IconUser} label="Người bán">
            <Link
              href={`/seller/${order.sellerId._id}`}
              className="text-sm font-medium text-luxury-ink transition-colors hover:text-taupe-700"
            >
              {order.sellerId.fullName}
            </Link>
            {order.sellerId.phoneNumber ? (
              <p className="mt-1 text-xs tabular-nums text-neutral-600">
                {order.sellerId.phoneNumber}
              </p>
            ) : null}
          </MetaRow>
        ) : null}

        <MetaRow
          icon={IconMapPin}
          label={isLocalPickup ? "Thông tin liên hệ" : "Giao đến"}
        >
          {isLocalPickup ? (
            <p className="text-xs leading-relaxed text-neutral-600">
              Người bán và người mua tự thỏa thuận địa điểm gặp mặt.
            </p>
          ) : (
            <>
              <p className="text-sm font-medium text-luxury-ink">
                {addr?.fullName}
              </p>
              <p className="mt-1 text-xs tabular-nums text-neutral-600">
                {addr?.phoneNumber}
              </p>
              {fullAddress ? (
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                  {fullAddress}
                </p>
              ) : null}
            </>
          )}
        </MetaRow>

        <MetaRow icon={IconCreditCard} label="Phương thức thanh toán">
          <p className="text-sm font-medium text-luxury-ink">{paymentLabel}</p>
        </MetaRow>

        <MetaRow icon={IconCalendar} label="Thời gian đặt hàng">
          <p className="text-sm font-medium tabular-nums text-luxury-ink">
            {orderedAt}
          </p>
        </MetaRow>

        {expectedDelivery ? (
          <MetaRow icon={IconClockHour4} label="Dự kiến giao">
            <p className="text-sm font-medium text-luxury-ink">
              {expectedDelivery}
            </p>
          </MetaRow>
        ) : null}
      </div>

      <div className="border-t border-luxury-ink/10 bg-cream-50/70 px-5 py-5 sm:px-6">
        <Link
          href={`/orders/${orderId}`}
          className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-[2px] bg-luxury-ink px-6 text-[10px] font-bold uppercase tracking-[0.22em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800"
        >
          Xem chi tiết đơn hàng
          <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
