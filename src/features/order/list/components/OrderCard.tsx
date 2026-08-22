import {
  IconArrowUpRight,
  IconCircleCheck,
  IconCircleX,
  IconLoader2,
  IconMessage,
  IconRefresh,
  IconStar,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import type { Order } from "@/types/order";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format/price";
import { formatTimeAgo } from "@/utils/format/date";
import { getShippingMethodType } from "@/utils/format";
import { openChatWithOrder } from "@/utils/chat";
import { getAvatarUrl } from "@/utils";
import { getRefundStatusNotice } from "@/constants/orderStatus";
import {
  OrderStatusChip,
  microCaps,
  primaryActionSm,
  outlineActionSm,
  dangerActionSm,
} from "@/features/order/components";
import { AvatarOrInitials } from "@/components/ui/AvatarOrInitials";
import { getBuyerTodo, getOrderStage } from "../utils/orderStage";
import { OrderStageRail } from "./OrderStageRail";

interface OrderCardProps {
  order: Order;
  cancellingId: string | null;
  onCancel: (orderId: string) => void;
  confirmingId: string | null;
  onConfirmReceived: (orderId: string) => void;
  onOpenRefund: (orderId: string) => void;
}

/** One line per item: thumbnail, name, quantity, line total. */
function ProductRow({ item }: { item: Order["products"][number] }) {
  const product = item.productId;
  const name = product?.name || "Sản phẩm";
  const href = product?._id ? `/products/${product._id}/product` : null;
  const avatar =
    typeof product?.avatar === "string"
      ? product.avatar
      : product?.avatar?.url || "/images/product-placeholder.svg";
  const unitPrice = item.price || product?.price || 0;

  const thumbnail = (
    <Image
      src={avatar}
      alt={name}
      fill
      sizes="48px"
      className="object-cover transition-transform duration-700 ease-out group-hover/item:scale-105"
    />
  );
  const thumbClass =
    "relative h-12 w-12 shrink-0 overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-taupe-50";

  return (
    <div className="group/item flex items-center gap-3.5 py-3">
      {href ? (
        <Link
          href={href}
          className={cn(
            thumbClass,
            "transition-colors duration-300 hover:border-luxury-ink/30",
          )}
        >
          {thumbnail}
        </Link>
      ) : (
        <div className={thumbClass}>{thumbnail}</div>
      )}

      <div className="min-w-0 flex-1">
        {href ? (
          <Link
            href={href}
            className="line-clamp-1 text-sm font-medium leading-snug text-luxury-ink transition-colors hover:text-taupe-700"
          >
            {name}
          </Link>
        ) : (
          <p className="line-clamp-1 text-sm font-medium leading-snug text-luxury-ink">
            {name}
          </p>
        )}
        <p className={cn(microCaps, "mt-1.5 text-neutral-500")}>
          Số lượng ×{item.quantity}
        </p>
      </div>

      <span className="font-droid-serif shrink-0 tabular-nums text-sm text-luxury-ink">
        {formatPrice(unitPrice * (item.quantity || 1))}
      </span>
    </div>
  );
}

/**
 * One order, at scanning density.
 *
 * The address, shipping method and itemised totals that used to live here have
 * moved to the detail page where they belong — a list exists to answer "which
 * order is this, where is it, and does it need me", and every extra block pushed
 * the next order off the screen.
 */
export function OrderCard({
  order,
  cancellingId,
  onCancel,
  confirmingId,
  onConfirmReceived,
  onOpenRefund,
}: OrderCardProps) {
  const products = order.products ?? [];

  const isLocalPickup =
    getShippingMethodType(order.shippingMethod) === "local_pickup";
  const isCancelling = cancellingId === order._id;
  const isConfirming = confirmingId === order._id;

  const stage = getOrderStage(order);
  const todo = getBuyerTodo(order);

  /* With no todo, a refund still needs one line of "what is happening" — the
     title only, since the rail already shows how far along it is. */
  const refundNoticeTitle =
    !todo && stage?.flow === "refund"
      ? getRefundStatusNotice(order.status, "buyer")?.title
      : null;

  const canReview = order.status === "completed";
  const canRefund =
    !isLocalPickup &&
    (order.status === "delivered" || order.status === "completed");
  const canConfirmReceived = order.status === "delivered";
  const canCancel = order.status === "pending";
  const hasButtons = canReview || canRefund || canConfirmReceived || canCancel;

  return (
    <article className="overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white transition-all duration-500 hover:border-luxury-ink/25 hover:shadow-[0_12px_32px_color-mix(in_srgb,var(--luxury-ink)_6%,transparent)]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-luxury-ink/10 bg-cream-50/70 px-5 py-3.5 sm:px-6">
        <div className="flex min-w-0 items-baseline gap-3">
          <p className="font-droid-serif truncate text-sm tracking-wide text-luxury-ink">
            {order.ghnOrderCode ?? `#${order._id.slice(-8).toUpperCase()}`}
          </p>
          <span className="shrink-0 text-xs tabular-nums text-neutral-500">
            {formatTimeAgo(order.createdAt)}
          </span>
        </div>
        <OrderStatusChip status={order.status} />
      </header>

      <div className="px-5 sm:px-6">
        <div className="divide-y divide-luxury-ink/8 py-1.5">
          {products.map((item, index) => (
            <ProductRow key={item.productId?._id ?? index} item={item} />
          ))}
        </div>

        {/* Seller and grand total share one line, so the itemised list above
            does not push the card's summary out of view. */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-luxury-ink/8 py-3.5">
          {order.sellerId ? (
            <div className="flex min-w-0 items-center gap-2">
              <AvatarOrInitials
                avatar={
                  (order.sellerId as { avatar?: { url?: string } })?.avatar
                }
                fullName={order.sellerId.fullName}
                size={20}
                className="shrink-0"
              />
              <span className="truncate text-xs text-neutral-600">
                {order.sellerId.fullName || "—"}
              </span>
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
                      products: products.map((item) => ({
                        name: item.productId?.name || "Sản phẩm",
                        quantity: item.quantity,
                        price: item.price || item.productId?.price || 0,
                      })),
                      totalAmount: order.totalAmount,
                    },
                  )
                }
                className="shrink-0 rounded-[2px] p-1 text-luxury-ink/50 transition-colors hover:bg-cream-100 hover:text-luxury-ink"
              >
                <IconMessage className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <span />
          )}

          <div className="flex items-baseline gap-3">
            <span className={cn(microCaps, "text-neutral-500")}>Tổng cộng</span>
            <span className="font-droid-serif text-xl leading-none tabular-nums text-luxury-ink">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {stage ? (
        <div className="border-t border-luxury-ink/8 px-5 py-4 sm:px-6">
          <OrderStageRail stage={stage} />
        </div>
      ) : null}

      <div className="border-t border-luxury-ink/10 bg-cream-50/70 px-5 py-4 sm:px-6">
        {todo ? (
          <div className="mb-4 flex gap-3 rounded-[2px] border border-luxury-champagne/45 bg-cream-100/70 px-4 py-3">
            <span
              aria-hidden
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-luxury-champagne"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-luxury-ink">
                Việc cần làm · {todo.label}
              </p>
              {todo.hint ? (
                <p className="mt-1 text-xs leading-relaxed text-neutral-600">
                  {todo.hint}
                </p>
              ) : null}
            </div>
          </div>
        ) : refundNoticeTitle ? (
          <p className={cn(microCaps, "mb-4 text-neutral-500")}>
            {refundNoticeTitle}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href={`/orders/${order._id}`}
            className="group inline-flex items-center gap-2 text-2xs font-bold uppercase tracking-[0.22em] text-luxury-ink transition-colors hover:text-taupe-700"
          >
            Xem chi tiết
            <IconArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>

          {hasButtons ? (
            <div className="flex flex-wrap items-center gap-2.5">
              {canCancel ? (
                <button
                  type="button"
                  onClick={() => onCancel(order._id)}
                  disabled={isCancelling}
                  className={dangerActionSm}
                >
                  {isCancelling ? (
                    <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <IconCircleX className="h-3.5 w-3.5" />
                  )}
                  Hủy đơn
                </button>
              ) : null}

              {canRefund ? (
                <button
                  type="button"
                  onClick={() => onOpenRefund(order._id)}
                  className={outlineActionSm}
                >
                  <IconRefresh className="h-3.5 w-3.5" />
                  Yêu cầu hoàn
                </button>
              ) : null}

              {canReview ? (
                <Link
                  href={`/orders/${order._id}?review=1`}
                  className={primaryActionSm}
                >
                  <IconStar className="h-3.5 w-3.5" />
                  Đánh giá
                </Link>
              ) : null}

              {canConfirmReceived ? (
                <button
                  type="button"
                  onClick={() => onConfirmReceived(order._id)}
                  disabled={isConfirming}
                  className={primaryActionSm}
                >
                  {isConfirming ? (
                    <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <IconCircleCheck className="h-3.5 w-3.5" />
                  )}
                  Đã nhận hàng
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
