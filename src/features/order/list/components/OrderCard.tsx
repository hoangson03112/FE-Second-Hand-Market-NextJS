import {
  IconArrowUpRight,
  IconCircleCheck,
  IconCircleX,
  IconLoader2,
  IconMapPin,
  IconMessage,
  IconRefresh,
  IconStar,
  IconTruck,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import type { Order } from "@/types/order";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import { formatShippingMethod, getShippingMethodType } from "@/utils/format";
import { openChatWithOrder } from "@/utils/chat";
import { getAvatarUrl } from "@/utils";
import { getRefundStatusNotice } from "@/constants/orderStatus";
import { OrderStatusChip } from "@/features/order/components";
import { AvatarOrInitials } from "@/components/ui/AvatarOrInitials";

interface OrderCardProps {
  order: Order;
  cancellingId: string | null;
  onCancel: (orderId: string) => void;
  confirmingId: string | null;
  onConfirmReceived: (orderId: string) => void;
  onOpenRefund: (orderId: string) => void;
}

const REFUND_RETURN_TRACKING_STATUSES = new Set([
  "refund",
  "returning",
  "return_shipping",
  "returned",
  "refunded",
]);

const serif = { fontFamily: "var(--font-droid-serif), serif" };

const microCaps = "text-[10px] font-bold uppercase tracking-[0.22em]";

/** Ink-filled primary action. */
const primaryAction =
  "inline-flex h-10 items-center justify-center gap-2 rounded-[2px] bg-luxury-ink px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800 disabled:cursor-not-allowed disabled:opacity-40";

/** Hairline secondary action that fills with ink on hover. */
const outlineAction =
  "inline-flex h-10 items-center justify-center gap-2 rounded-[2px] border border-luxury-ink/15 px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-ink transition-all duration-300 hover:border-luxury-ink hover:bg-luxury-ink hover:text-luxury-ivory disabled:cursor-not-allowed disabled:opacity-40";

/** Destructive action stays in the warm blush ramp, never raw red. */
const dangerAction =
  "inline-flex h-10 items-center justify-center gap-2 rounded-[2px] border border-blush-300 px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-blush-700 transition-all duration-300 hover:bg-blush-50 disabled:cursor-not-allowed disabled:opacity-40";

function MoneyRow({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <span
        className={cn(
          microCaps,
          emphasis ? "text-luxury-ink" : "text-neutral-500",
        )}
      >
        {label}
      </span>
      <span
        style={serif}
        className={cn(
          "tabular-nums text-luxury-ink",
          emphasis ? "text-xl" : "text-sm",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function OrderCard({
  order,
  cancellingId,
  onCancel,
  confirmingId,
  onConfirmReceived,
  onOpenRefund,
}: OrderCardProps) {
  const isLocalPickup =
    getShippingMethodType(order.shippingMethod) === "local_pickup";
  const refundNotice = getRefundStatusNotice(order.status, "buyer");
  const showGhnReturnOnCard =
    Boolean(order.ghnReturnOrderCode) &&
    REFUND_RETURN_TRACKING_STATUSES.has(order.status);
  const refundNoticeClass =
    refundNotice?.tone === "success"
      ? "border-accent/35 bg-taupe-50"
      : refundNotice?.tone === "warning"
        ? "border-luxury-champagne/40 bg-cream-100/70"
        : "border-luxury-ink/12 bg-cream-50/70";

  const isCancelling = cancellingId === order._id;
  const isConfirming = confirmingId === order._id;

  return (
    <article className="overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white transition-all duration-500 hover:border-luxury-ink/25 hover:shadow-[0_12px_32px_color-mix(in_srgb,var(--luxury-ink)_6%,transparent)]">
      {/* Card header: code + date + status */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-luxury-ink/10 bg-cream-50/70 px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <p className={cn(microCaps, "text-neutral-500")}>
            {order.ghnOrderCode ? "Mã vận đơn GHN" : "Mã đơn nội bộ"}
          </p>
          <p
            style={serif}
            className="mt-2 truncate text-base tracking-wide text-luxury-ink"
          >
            {order.ghnOrderCode ?? `#${order._id.slice(-8).toUpperCase()}`}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <span className="hidden text-xs tabular-nums text-neutral-500 sm:inline">
            {format(order.createdAt)}
          </span>
          <OrderStatusChip status={order.status} />
        </div>
      </header>

      <div className="px-5 sm:px-6">
        {/* Products */}
        <div className="divide-y divide-luxury-ink/8">
          {order.products?.map((item, idx) => {
            const product = item.productId;
            const productHref = product?._id
              ? `/products/${product._id}/product`
              : null;
            const avatar =
              typeof product?.avatar === "string"
                ? product.avatar
                : product?.avatar?.url || "/placeholder.svg";
            const name = product?.name || "Sản phẩm";

            const thumbnail = (
              <Image
                src={avatar}
                alt={name}
                width={80}
                height={80}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/item:scale-105"
              />
            );

            return (
              <div key={idx} className="group/item flex gap-4 py-5">
                {productHref ? (
                  <Link
                    href={productHref}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-taupe-50 transition-colors duration-300 hover:border-luxury-ink/30"
                  >
                    {thumbnail}
                  </Link>
                ) : (
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-taupe-50">
                    {thumbnail}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  {productHref ? (
                    <Link
                      href={productHref}
                      className="line-clamp-2 text-sm font-medium leading-relaxed text-luxury-ink transition-colors hover:text-taupe-700"
                    >
                      {name}
                    </Link>
                  ) : (
                    <h3 className="line-clamp-2 text-sm font-medium leading-relaxed text-luxury-ink">
                      {name}
                    </h3>
                  )}
                  <div className="mt-3 flex items-baseline justify-between gap-4">
                    <span className={cn(microCaps, "text-neutral-500")}>
                      Số lượng ×{item.quantity}
                    </span>
                    <span
                      style={serif}
                      className="tabular-nums text-base text-luxury-ink"
                    >
                      {formatPrice(item.price || product?.price || 0)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Seller */}
        {order.sellerId ? (
          <div className="flex items-center justify-between gap-4 border-t border-luxury-ink/8 py-5">
            <div className="flex min-w-0 items-center gap-3">
              <AvatarOrInitials
                avatar={
                  (order.sellerId as { avatar?: { url?: string } })?.avatar
                }
                fullName={order.sellerId.fullName}
                size={32}
                className="shrink-0"
              />
              <div className="min-w-0">
                <p className={cn(microCaps, "text-neutral-500")}>Người bán</p>
                <p className="mt-1 truncate text-sm font-medium text-luxury-ink">
                  {order.sellerId.fullName || "—"}
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Liên hệ người bán"
              onClick={() =>
                openChatWithOrder(
                  {
                    _id: order.sellerId._id,
                    fullName: order.sellerId.fullName,
                    avatar:
                      getAvatarUrl(
                        (order.sellerId as { avatar?: { url?: string } })
                          ?.avatar,
                      ) ?? undefined,
                  },
                  {
                    _id: order._id,
                    status: order.status,
                    ghnOrderCode: order.ghnOrderCode,
                    products: order.products.map((item) => ({
                      name: item.productId?.name || "Sản phẩm",
                      quantity: item.quantity,
                      price: item.price || item.productId?.price || 0,
                    })),
                    totalAmount: order.totalAmount,
                  },
                )
              }
              className="shrink-0 rounded-[2px] border border-luxury-ink/15 p-2.5 text-luxury-ink transition-all duration-300 hover:border-luxury-ink hover:bg-luxury-ink hover:text-luxury-ivory"
            >
              <IconMessage className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        {/* Shipping address */}
        {order.shippingAddress ? (
          <div className="border-t border-luxury-ink/8 py-5">
            <div className="flex gap-4 rounded-[2px] border border-luxury-ink/10 bg-cream-50/60 px-4 py-4">
              <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-luxury-ink" />
              <div className="min-w-0 flex-1">
                <p className={cn(microCaps, "text-neutral-500")}>
                  Địa chỉ nhận hàng
                </p>
                <p className="mt-2 text-sm font-medium text-luxury-ink">
                  {order.shippingAddress.fullName}
                  <span aria-hidden className="mx-2 text-luxury-ink/25">
                    ·
                  </span>
                  <span className="tabular-nums">
                    {order.shippingAddress.phoneNumber}
                  </span>
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
                  {[
                    order.shippingAddress.specificAddress,
                    order.shippingAddress.ward,
                    order.shippingAddress.district,
                    order.shippingAddress.province,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Shipping method */}
        {order.shippingMethod ? (
          <div className="flex items-center gap-3 border-t border-luxury-ink/8 py-5">
            <IconTruck className="h-4 w-4 shrink-0 text-luxury-ink" />
            <span className={cn(microCaps, "text-neutral-500")}>
              Vận chuyển
            </span>
            <span className="ml-auto text-sm font-medium text-luxury-ink">
              {formatShippingMethod(order.shippingMethod)}
            </span>
          </div>
        ) : null}

        {/* Refund notices */}
        {refundNotice ? (
          <div
            className={cn(
              "mb-5 rounded-[2px] border px-4 py-3.5",
              refundNoticeClass,
            )}
          >
            <p className="text-xs font-bold text-luxury-ink">
              {refundNotice.title}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
              {refundNotice.description}
            </p>
          </div>
        ) : null}

        {showGhnReturnOnCard ? (
          <div className="mb-5 rounded-[2px] border border-luxury-ink/12 bg-cream-50/70 px-4 py-3.5">
            <p className={cn(microCaps, "text-neutral-500")}>
              Vận đơn hoàn trả GHN
            </p>
            <p
              style={serif}
              className="mt-2 text-sm tracking-wide text-luxury-ink"
            >
              {order.ghnReturnOrderCode}
            </p>
            {order.ghnReturnTrackingUrl?.trim() || order.ghnReturnOrderCode ? (
              <a
                href={
                  order.ghnReturnTrackingUrl?.trim() ||
                  `https://tracking.ghn.dev/?order_code=${order.ghnReturnOrderCode}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-ink transition-colors hover:text-taupe-700"
              >
                Theo dõi vận đơn hoàn
                <IconArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Footer: totals + actions */}
      <div className="border-t border-luxury-ink/10 bg-cream-50/70 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full space-y-3 lg:max-w-xs">
            <MoneyRow
              label="Tiền hàng"
              value={formatPrice(order.productAmount || 0)}
            />
            <MoneyRow
              label="Phí vận chuyển"
              value={formatPrice(order.shippingFee || 0)}
            />
            <div className="border-t border-luxury-ink/10 pt-3">
              <MoneyRow
                label="Tổng cộng"
                value={formatPrice(order.totalAmount)}
                emphasis
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            {order.status === "delivered" ? (
              <button
                type="button"
                onClick={() => onConfirmReceived(order._id)}
                disabled={isConfirming}
                className={primaryAction}
              >
                {isConfirming ? (
                  <IconLoader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <IconCircleCheck className="h-4 w-4" />
                )}
                Đã nhận hàng
              </button>
            ) : null}

            {!isLocalPickup &&
            (order.status === "delivered" || order.status === "completed") ? (
              <button
                type="button"
                onClick={() => onOpenRefund(order._id)}
                className={outlineAction}
              >
                <IconRefresh className="h-4 w-4" />
                Yêu cầu hoàn
              </button>
            ) : null}

            {order.status === "completed" ? (
              <Link
                href={`/orders/${order._id}?review=1`}
                className={outlineAction}
              >
                <IconStar className="h-4 w-4" />
                Đánh giá
              </Link>
            ) : null}

            {order.status === "pending" ? (
              <button
                type="button"
                onClick={() => onCancel(order._id)}
                disabled={isCancelling}
                className={dangerAction}
              >
                {isCancelling ? (
                  <IconLoader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <IconCircleX className="h-4 w-4" />
                )}
                Hủy đơn
              </button>
            ) : null}

            <Link
              href={`/orders/${order._id}`}
              className={cn(primaryAction, "group/btn")}
            >
              Xem chi tiết
              <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
