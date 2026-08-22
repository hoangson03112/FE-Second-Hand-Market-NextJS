"use client";

import { Eyebrow } from "@/features/order/components";
import { formatPrice } from "@/utils/format/price";
import type { Order } from "@/types/order";

interface PaymentBreakdownProps {
  order: Order;
  isLocalPickup: boolean;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
        {label}
      </span>
      <span className="font-droid-serif tabular-nums text-sm text-luxury-ink">
        {value}
      </span>
    </div>
  );
}

export default function PaymentBreakdown({
  order,
  isLocalPickup,
}: PaymentBreakdownProps) {
  return (
    <section className="overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white">
      <header className="border-b border-luxury-ink/10 px-5 py-5 sm:px-6">
        <Eyebrow>Thanh toán</Eyebrow>
        <h2

          className="font-droid-serif mt-3 text-lg tracking-tight text-luxury-ink"
        >
          Chi tiết khoản tiền
        </h2>
      </header>

      <div className="space-y-3.5 px-5 py-6 sm:px-6">
        <Row label="Tiền hàng" value={formatPrice(order.productAmount ?? 0)} />
        <Row
          label="Phí vận chuyển"
          value={
            isLocalPickup ? "Miễn phí" : formatPrice(order.shippingFee ?? 0)
          }
        />
      </div>

      <div className="flex items-baseline justify-between gap-4 border-t border-luxury-ink/10 bg-cream-50/70 px-5 py-5 sm:px-6">
        <span className="text-2xs font-bold uppercase tracking-[0.22em] text-luxury-ink">
          Tổng cộng
        </span>
        <span className="font-droid-serif tabular-nums text-xl text-luxury-ink">
          {formatPrice(order.totalAmount)}
        </span>
      </div>
    </section>
  );
}
