"use client";

import { Eyebrow, InkSurface, microCaps } from "@/features/order/components";
import { PaymentChip } from "@/features/seller/components";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format/price";
import { formatPaymentMethod } from "@/utils/format";
import type { Order } from "@/types/order";

interface SellerPaymentSummaryProps {
  order: Order;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <span className={cn(microCaps, "text-neutral-400")}>{label}</span>
      <span className="font-droid-serif tabular-nums text-sm text-cream-50">
        {value}
      </span>
    </div>
  );
}

/**
 * The one figure on the screen that carries weight, on the ink ground the
 * homepage CTA and the checkout total share.
 */
export function SellerPaymentSummary({ order }: SellerPaymentSummaryProps) {
  return (
    <InkSurface className="rounded-[2px]">
      <div className="px-5 py-6 sm:px-6">
        <Eyebrow tone="dark">Đối soát</Eyebrow>

        <div className="mt-5 space-y-3">
          <Row label="Tiền hàng" value={formatPrice(order.productAmount || 0)} />
          <Row
            label="Phí vận chuyển"
            value={formatPrice(order.shippingFee || 0)}
          />
          {(order.codFee ?? 0) > 0 ? (
            <Row label="Phí COD" value={formatPrice(order.codFee!)} />
          ) : null}
        </div>

        <div className="mt-5 flex items-end justify-between gap-6 border-t border-white/12 pt-5">
          <span className={cn(microCaps, "text-luxury-champagne")}>
            Tổng cộng
          </span>
          <span className="font-droid-serif text-2xl leading-none tabular-nums text-cream-50">
            {formatPrice(order.totalAmount)}
          </span>
        </div>

        <div className="mt-5 space-y-3 border-t border-white/12 pt-5">
          <div className="flex items-baseline justify-between gap-4">
            <span className={cn(microCaps, "shrink-0 text-neutral-400")}>
              Phương thức
            </span>
            <span className="text-right text-xs text-cream-50">
              {formatPaymentMethod(order.paymentMethod, {
                shippingMethod: order.shippingMethod,
              })}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className={cn(microCaps, "shrink-0 text-neutral-400")}>
              Trạng thái
            </span>
            <PaymentChip
              status={order.paymentStatus}
              variant="full"
              tone="dark"
            />
          </div>
        </div>
      </div>
    </InkSurface>
  );
}
