"use client";

import Link from "next/link";
import Image from "next/image";
import {
  IconArrowUpRight,
  IconCircleCheck,
  IconCircleX,
  IconCreditCard,
  IconLoader2,
  IconMapPin,
  IconTruck,
} from "@tabler/icons-react";
import {
  Eyebrow,
  InkSurface,
  OrderStatusChip,
  Panel,
  NOTICE_TONE_CLASS,
  dangerAction,
  microCaps,
  outlineAction,
  primaryAction,
  type NoticeTone,
} from "@/features/order/components";
import {
  getRefundStatusNotice,
  sellerDisplayStatusFromRefund,
} from "@/constants/orderStatus";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format/price";
import { format as formatDateTime } from "@/utils/format/date";
import { formatPaymentMethod, formatShippingMethod } from "@/utils/format";
import type { Order } from "@/types/order";
import {
  getBuyerEmail,
  getBuyerName,
  getBuyerPhone,
  getProductImage,
} from "../utils/orderUtils";
import {
  REFUND_REQUEST_STATUS_LABELS,
  getSellerRefundTodo,
} from "../utils/refundPresentation";
import { PaymentChip } from "@/features/seller/components";

/** Label/value pair used inside the light panels. */
function MetaRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span
        className={cn(
          microCaps,
          "flex shrink-0 items-center gap-2 text-neutral-500",
        )}
      >
        {Icon ? <Icon className="h-3.5 w-3.5 text-luxury-ink/50" /> : null}
        {label}
      </span>
      <span className="min-w-0 text-right text-sm text-luxury-ink">
        {value}
      </span>
    </div>
  );
}

/** Advisory block — tonal ground, never a saturated alert bar. */
function Notice({
  tone,
  title,
  description,
}: {
  tone: NoticeTone;
  title: string;
  description: string;
}) {
  return (
    <div
      className={cn("rounded-[2px] border px-4 py-3.5", NOTICE_TONE_CLASS[tone])}
    >
      <p className="text-xs font-bold text-luxury-ink">{title}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
        {description}
      </p>
    </div>
  );
}

interface OrderDetailPanelProps {
  order: Order | null;
  isUpdating: boolean;
  imageErrorMap: Record<string, boolean>;
  onImageError: (key: string) => void;
  onConfirmOrder: (orderId: string) => void;
  onCancelOrder: () => void;
  onApproveRefund: (orderId: string) => void;
  onRejectRefund: () => void;
  onConfirmReturn: (orderId: string) => void;
}

/**
 * The detail half of the queue. Every block is a `Panel` — the same white sheet
 * with hairline border and serif title used by checkout and order detail — and
 * the money lands on the ink surface, the one figure on the screen that carries
 * weight.
 */
export default function OrderDetailPanel({
  order,
  isUpdating,
  imageErrorMap,
  onImageError,
  onConfirmOrder,
  onCancelOrder,
  onApproveRefund,
  onRejectRefund,
  onConfirmReturn,
}: OrderDetailPanelProps) {
  if (!order) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-[2px] border border-dashed border-luxury-ink/15 bg-white px-6 text-center">
        <p className="max-w-[16rem] text-sm leading-relaxed text-neutral-600">
          Chọn một đơn hàng trong danh sách để xem chi tiết và xử lý.
        </p>
      </div>
    );
  }

  const products = order.products || [];
  const productAmount =
    order.productAmount ??
    products.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 0),
      0,
    );
  const shippingFee = order.totalShippingFee ?? order.shippingFee ?? 0;
  const grandTotal = order.totalAmount ?? productAmount + shippingFee;

  const refundRequest =
    order.refundRequestId && typeof order.refundRequestId === "object"
      ? order.refundRequestId
      : null;
  const refundRequestStatus = refundRequest?.status;

  const refundTodo = getSellerRefundTodo(order.status, refundRequestStatus);
  const refundNotice =
    refundRequestStatus === "rejected"
      ? {
          title: "Bạn đã từ chối yêu cầu hoàn tiền",
          description:
            "Buyer có thể khiếu nại lên admin. Bạn không cần thao tác duyệt thêm trên đơn này.",
          tone: "warning" as const,
        }
      : refundRequestStatus === "disputed"
        ? {
            title: "Khiếu nại đang được admin xem xét",
            description: "Vui lòng chờ quyết định từ quản trị viên.",
            tone: "warning" as const,
          }
        : getRefundStatusNotice(
            sellerDisplayStatusFromRefund(order.status, refundRequestStatus),
            "seller",
          );

  const canApproveRejectRefund =
    (order.status === "refund_requested" || order.status === "refund") &&
    (refundRequest == null || refundRequest.status === "pending");
  const canConfirmReturn =
    refundRequest?.status === "return_shipping" ||
    refundRequest?.status === "returning" ||
    order.status === "returning" ||
    order.status === "return_shipping";
  const isPending = order.status === "pending";

  const isRefundSettling =
    order.status === "returned" ||
    refundRequest?.status === "returned" ||
    refundRequest?.status === "processing" ||
    refundRequest?.status === "bank_info_required";

  const hasQuickAction = isPending || canApproveRejectRefund || canConfirmReturn;

  const addressLine =
    [
      order.shippingAddress?.specificAddress,
      order.shippingAddress?.ward,
      order.shippingAddress?.district,
      order.shippingAddress?.province,
    ]
      .filter((part) => Boolean(part && String(part).trim()))
      .join(", ") || "—";

  const spinnerOr = (Icon: React.ElementType) =>
    isUpdating ? (
      <IconLoader2 className="h-4 w-4 animate-spin" />
    ) : (
      <Icon className="h-4 w-4" />
    );

  return (
    <div className="space-y-5">
      {/* Identity */}
      <div className="rounded-[2px] border border-luxury-ink/10 bg-white px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <Eyebrow>Đơn đang chọn</Eyebrow>
            <p
              className="font-droid-serif mt-2.5 truncate text-xl tracking-wide text-luxury-ink"
            >
              #{order._id.slice(-8).toUpperCase()}
            </p>
            <p className="mt-2 text-xs tabular-nums text-neutral-500">
              Đặt lúc {formatDateTime(order.createdAt)}
            </p>
          </div>
          <OrderStatusChip status={order.status} />
        </div>

        {order.ghnOrderCode ? (
          <p className="mt-4 border-t border-luxury-ink/8 pt-4 text-xs text-neutral-500">
            Mã vận đơn GHN{" "}
            <span
              className="font-droid-serif ml-1 tracking-wide text-luxury-ink"
            >
              {order.ghnOrderCode}
            </span>
          </p>
        ) : null}
      </div>

      {/* What to do next */}
      {refundTodo ? (
        <Notice
          tone={refundTodo.tone}
          title={refundTodo.title}
          description={refundTodo.description}
        />
      ) : null}

      {hasQuickAction ? (
        <div className="flex flex-wrap gap-3">
          {isPending ? (
            <>
              <button
                type="button"
                onClick={() => onConfirmOrder(order._id)}
                disabled={isUpdating}
                className={cn(primaryAction, "flex-1")}
              >
                {spinnerOr(IconCircleCheck)}
                Xác nhận đơn
              </button>
              <button
                type="button"
                onClick={onCancelOrder}
                disabled={isUpdating}
                className={dangerAction}
              >
                <IconCircleX className="h-4 w-4" />
                Hủy đơn
              </button>
            </>
          ) : null}

          {canApproveRejectRefund ? (
            <>
              <button
                type="button"
                onClick={() => onApproveRefund(order._id)}
                disabled={isUpdating}
                className={cn(primaryAction, "flex-1")}
              >
                {spinnerOr(IconCircleCheck)}
                Chấp thuận hoàn
              </button>
              <button
                type="button"
                onClick={onRejectRefund}
                disabled={isUpdating}
                className={dangerAction}
              >
                <IconCircleX className="h-4 w-4" />
                Từ chối
              </button>
            </>
          ) : null}

          {canConfirmReturn ? (
            <button
              type="button"
              onClick={() => onConfirmReturn(order._id)}
              disabled={isUpdating}
              className={cn(primaryAction, "w-full")}
            >
              {spinnerOr(IconCircleCheck)}
              Xác nhận đã nhận lại hàng
            </button>
          ) : null}
        </div>
      ) : isRefundSettling ? (
        <Notice
          tone="warning"
          title="Đang chờ hệ thống"
          description={
            refundRequest?.status === "returned"
              ? "Bạn đã xác nhận nhận lại hàng. Hệ thống đang chờ bước hoàn tiền cho buyer."
              : "Hệ thống đang xử lý hoàn tiền cho buyer."
          }
        />
      ) : !refundTodo && !refundNotice ? (
        /* Only worth saying when nothing else on the panel is already telling
           the seller where the order stands. */
        <p
          className={cn(
            microCaps,
            "rounded-[2px] border border-luxury-ink/10 bg-cream-50/70 px-4 py-3.5 text-neutral-500",
          )}
        >
          Đơn hàng hiện không có thao tác nhanh
        </p>
      ) : null}

      {refundNotice ? (
        <Notice
          tone={refundNotice.tone}
          title={refundNotice.title}
          description={refundNotice.description}
        />
      ) : null}

      {/* Products */}
      <Panel
        eyebrow="Trong đơn"
        title={`${products.length} sản phẩm`}
        padding="flush"
      >
        <div className="divide-y divide-luxury-ink/8">
          {products.map((item, idx) => {
            const imageKey = `${order._id}-${idx}`;
            const productImage = getProductImage(
              item.productId,
              imageErrorMap,
              imageKey,
            );

            return (
              <div
                key={item.productId?._id || idx}
                className="flex gap-4 px-5 py-4 sm:px-6"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-taupe-50">
                  <Image
                    src={productImage}
                    alt={item.productId?.name || "Sản phẩm"}
                    fill
                    sizes="64px"
                    className="object-cover"
                    onError={() => onImageError(imageKey)}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium leading-relaxed text-luxury-ink">
                    {item.productId?.name || "Sản phẩm"}
                  </p>
                  <div className="mt-2.5 flex items-baseline justify-between gap-4">
                    <span className={cn(microCaps, "text-neutral-500")}>
                      ×{item.quantity} · {formatPrice(item.price)}
                    </span>
                    <span
                      className="font-droid-serif tabular-nums text-sm text-luxury-ink"
                    >
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Buyer */}
      <Panel eyebrow="Người mua" title={getBuyerName(order)}>
        <div className="space-y-3.5">
          <MetaRow label="Email" value={getBuyerEmail(order)} />
          <MetaRow
            label="Điện thoại"
            value={
              <span className="tabular-nums">{getBuyerPhone(order)}</span>
            }
          />
          <MetaRow
            label="Cập nhật"
            value={
              <span className="tabular-nums text-neutral-600">
                {formatDateTime(order.updatedAt)}
              </span>
            }
          />
        </div>
      </Panel>

      {/* Fulfilment */}
      <Panel eyebrow="Giao hàng" title="Địa chỉ nhận hàng">
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

        <div className="mt-4 space-y-3.5 border-t border-luxury-ink/8 pt-4">
          <MetaRow
            label="Vận chuyển"
            icon={IconTruck}
            value={formatShippingMethod(order.shippingMethod)}
          />
          <MetaRow
            label="Thanh toán"
            icon={IconCreditCard}
            value={formatPaymentMethod(order.paymentMethod, {
              shippingMethod: order.shippingMethod,
            })}
          />
        </div>
      </Panel>

      {/* Refund request detail */}
      {refundRequest ? (
        <Panel eyebrow="Hoàn tiền" title="Thông tin yêu cầu">
          <div className="space-y-3.5">
            <MetaRow
              label="Trạng thái"
              value={
                REFUND_REQUEST_STATUS_LABELS[refundRequest.status] ||
                refundRequest.status
              }
            />
            <MetaRow label="Lý do" value={refundRequest.reason || "—"} />
            <MetaRow
              label="Số tiền hoàn"
              value={
                <span className="font-droid-serif tabular-nums text-base">
                  {formatPrice(
                    refundRequest.refundAmount || order.totalAmount,
                  )}
                </span>
              }
            />
            <MetaRow
              label="Thời gian gửi"
              value={
                <span className="tabular-nums text-neutral-600">
                  {formatDateTime(refundRequest.createdAt)}
                </span>
              }
            />
          </div>

          {order.ghnReturnOrderCode ? (
            <div className="mt-4 border-t border-luxury-ink/8 pt-4">
              <p className={cn(microCaps, "text-neutral-500")}>
                Vận đơn hoàn trả GHN
              </p>
              <p
                className="font-droid-serif mt-2 text-sm tracking-wide text-luxury-ink"
              >
                {order.ghnReturnOrderCode}
              </p>
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
            </div>
          ) : null}
        </Panel>
      ) : null}

      {/* Money — the one figure that carries weight */}
      <InkSurface className="rounded-[2px]">
        <div className="px-5 py-6 sm:px-6">
          <Eyebrow tone="dark">Đối soát</Eyebrow>

          <div className="mt-5 space-y-3">
            <div className="flex items-baseline justify-between gap-6">
              <span className={cn(microCaps, "text-neutral-400")}>
                Tiền sản phẩm
              </span>
              <span
                className="font-droid-serif tabular-nums text-sm text-cream-50"
              >
                {formatPrice(productAmount)}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-6">
              <span className={cn(microCaps, "text-neutral-400")}>
                Phí vận chuyển
              </span>
              <span
                className="font-droid-serif tabular-nums text-sm text-cream-50"
              >
                {formatPrice(shippingFee)}
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-end justify-between gap-6 border-t border-white/12 pt-5">
            <span className={cn(microCaps, "text-luxury-champagne")}>
              Tổng cộng
            </span>
            <span
              className="font-droid-serif text-2xl leading-none tabular-nums text-cream-50"
            >
              {formatPrice(grandTotal)}
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <span className={cn(microCaps, "text-neutral-400")}>
              Trạng thái thanh toán
            </span>
            <PaymentChip
              status={order.paymentStatus}
              variant="full"
              tone="dark"
            />
          </div>
        </div>
      </InkSurface>

      <Link
        href={`/my/orders/${order._id}`}
        className={cn(outlineAction, "group/btn w-full")}
      >
        Xem trang chi tiết
        <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
      </Link>
    </div>
  );
}
