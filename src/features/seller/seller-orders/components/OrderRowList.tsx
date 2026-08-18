"use client";

import { cn } from "@/lib/utils";
import { microCaps } from "@/features/order/components";
import { getOrderStatusLabel } from "@/constants/orderStatus";
import { formatPrice } from "@/utils/format/price";
import { formatDateOnly } from "@/utils/format/date";
import type { Order } from "@/types/order";
import { getBuyerName } from "../utils/orderUtils";
import { REFUND_PHASE_SHORT_LABELS } from "../utils/refundPresentation";
import { PaymentChip } from "@/features/seller/components";

/** One grid template for the head and every row, so the columns cannot drift. */
const COLUMNS =
  "md:grid md:grid-cols-[1.15fr_0.8fr_1.15fr_0.6fr_1fr_0.7fr] md:items-center md:gap-4";

interface OrderRowListProps {
  orders: Order[];
  selectedOrderId: string | null;
  onSelect: (orderId: string) => void;
}

/**
 * The queue: a hairline register rather than a card grid. Rows stay dense enough
 * to scan a page of orders at once, and the selected row is marked with a
 * champagne rule instead of a tinted fill.
 */
export default function OrderRowList({
  orders,
  selectedOrderId,
  onSelect,
}: OrderRowListProps) {
  return (
    <div className="overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white">
      <div
        className={cn(
          "hidden border-b border-luxury-ink/10 bg-cream-50/70 px-5 py-3.5",
          COLUMNS,
        )}
      >
        {["Mã đơn", "Ngày tạo", "Người mua", "Số SP", "Tổng tiền", "Thanh toán"].map(
          (label) => (
            <span key={label} className={cn(microCaps, "text-neutral-500")}>
              {label}
            </span>
          ),
        )}
      </div>

      <div className="divide-y divide-luxury-ink/8">
        {orders.map((order) => {
          const productCount = order.products?.length ?? 0;
          const isSelected = selectedOrderId === order._id;
          const refundDoc =
            order.refundRequestId && typeof order.refundRequestId === "object"
              ? order.refundRequestId
              : null;
          const refundPhase =
            refundDoc && order.status === "refund"
              ? (REFUND_PHASE_SHORT_LABELS[refundDoc.status] ??
                refundDoc.status)
              : null;

          return (
            <button
              key={order._id}
              type="button"
              onClick={() => onSelect(order._id)}
              aria-current={isSelected ? "true" : undefined}
              className={cn(
                "group relative w-full px-5 py-4 text-left transition-colors duration-300",
                "focus-visible:outline-none focus-visible:bg-cream-50",
                isSelected ? "bg-cream-50/80" : "hover:bg-cream-50/50",
              )}
            >
              {/* Selection mark — a champagne rule down the leading edge */}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-0 left-0 w-[2px] transition-colors duration-300",
                  isSelected ? "bg-luxury-champagne" : "bg-transparent",
                )}
              />

              <div className={cn("flex flex-col gap-2 md:gap-0", COLUMNS)}>
                {/* Code + status */}
                <div className="flex items-center justify-between gap-3 md:block">
                  <p
                    className="font-droid-serif truncate text-sm tracking-wide text-luxury-ink"
                  >
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <span className="shrink-0 text-2xs font-bold uppercase tracking-[0.18em] text-neutral-500 md:mt-1.5 md:block">
                    {getOrderStatusLabel(order.status)}
                  </span>
                </div>

                <p className="hidden text-xs tabular-nums text-neutral-600 md:block">
                  {formatDateOnly(order.createdAt)}
                </p>

                <p className="truncate text-sm font-medium text-luxury-ink">
                  {getBuyerName(order)}
                </p>

                <p className="hidden text-xs tabular-nums text-neutral-600 md:block">
                  {productCount} SP
                </p>

                <div className="flex items-center justify-between gap-3 md:block">
                  <span
                    className="font-droid-serif text-base tabular-nums text-luxury-ink"
                  >
                    {formatPrice(order.totalAmount)}
                  </span>
                  <PaymentChip
                    status={order.paymentStatus}
                    className="md:hidden"
                  />
                </div>

                <div className="hidden md:flex md:justify-start">
                  <PaymentChip status={order.paymentStatus} />
                </div>
              </div>

              {/* Mobile-only meta line, and the refund phase on every breakpoint */}
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-xs tabular-nums text-neutral-500 md:hidden">
                  {formatDateOnly(order.createdAt)} · {productCount} SP
                </span>
                {refundPhase ? (
                  <span className="text-2xs font-bold uppercase tracking-[0.18em] text-taupe-700">
                    {refundPhase}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
