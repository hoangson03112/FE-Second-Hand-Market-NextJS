"use client";

import { OrderStatusBadge } from "@/features/order/components";
import Link from "next/link";
import Image from "next/image";
import {
  IconMessageCircle,
  IconAlertTriangle,
  IconClock,
  IconPackage,
} from "@tabler/icons-react";
import type { Order } from "@/types/order";
import { formatPrice } from "@/utils/format/price";
import { getProductImage } from "../utils/orderUtils";
import OrderActions from "./OrderActions";
import { cn } from "@/lib/utils";
import { formatTimeAgo } from "@/utils/format/date";
import { AvatarOrInitials } from "@/components/ui/AvatarOrInitials";
import { REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER } from "@/constants/refund";

const REFUND_PHASE_LABELS: Record<string, string> = {
  approved: "Đã duyệt — chờ gửi hàng hoàn",
  return_shipping: "Đang hoàn trả hàng",
  returning: "Hàng hoàn đang đi",
  returned: "Đã nhận hàng hoàn",
  processing: "Đang hoàn tiền",
  bank_info_required: "Chờ STK buyer",
  completed: "Đã hoàn tiền",
  disputed: "Tranh chấp",
  failed: "Lỗi hoàn tiền",
};

const REFUND_REASON_LABELS: Record<string, string> = {
  damaged: "Hàng bị hỏng",
  wrong_item: "Giao sai hàng",
  not_as_described: "Không đúng mô tả",
  missing_parts: "Thiếu phụ kiện",
  quality_issue: "Chất lượng kém",
  other: "Lý do khác",
};

interface OrderCardProps {
  order: Order;
  imageErrorMap: Record<string, boolean>;
  updatingId: string | null;
  onImageError: (orderId: string) => void;
  onUpdateStatus: (
    orderId: string,
    status: "confirmed" | "cancelled",
    reason?: string,
  ) => void;
  onApproveRefund?: (orderId: string) => void;
}

export default function OrderCard({
  order,
  imageErrorMap,
  updatingId,
  onImageError,
  onUpdateStatus,
  onApproveRefund,
}: OrderCardProps) {
  const firstProduct = order.products?.[0]?.productId;
  const productImage = getProductImage(firstProduct, imageErrorMap, order._id);

  const refundDoc =
    order.refundRequestId && typeof order.refundRequestId === "object"
      ? order.refundRequestId
      : null;
  const needsSellerRefundReview =
    (order.status === "refund_requested" || order.status === "refund") &&
    (refundDoc == null || refundDoc.status === "pending");
  const isRefundInProgress =
    order.status === "refund" &&
    refundDoc &&
    refundDoc.status !== "pending" &&
    refundDoc.status !== "rejected";
  const isRefundRequest = needsSellerRefundReview;
  const isPending = order.status === "pending";

  return (
    <div
      className={cn(
        "group bg-white overflow-hidden rounded-[2px] border transition-all duration-200 shadow-xs",
        isRefundRequest
          ? "border-luxury-champagne/60"
          : isRefundInProgress
            ? "border-luxury-ink/20"
            : isPending
              ? "border-luxury-ink/30"
              : "border-luxury-ink/10 hover:border-luxury-ink/30",
      )}
    >
      <div className="flex gap-3.5 p-4">
        <div className="relative w-20 h-20 rounded-[2px] overflow-hidden shrink-0 bg-taupe-50 border border-luxury-ink/10">
          {productImage ? (
            <Image
              src={productImage}
              alt={firstProduct?.name ?? "Sản phẩm"}
              fill
              sizes="100px"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              onError={() => onImageError(order._id)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <IconPackage
                className="w-8 h-8 text-neutral-400"
                strokeWidth={1.5}
              />
            </div>
          )}
          {order.products.length > 1 && (
            <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded-[1px] text-[9px] font-bold bg-luxury-ink/80 text-white backdrop-blur-xs">
              +{order.products.length - 1}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-xs leading-snug line-clamp-2 flex-1 text-luxury-ink group-hover:underline">
              {firstProduct?.name ?? "Sản phẩm không xác định"}
            </h3>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="flex items-center gap-1.5">
            <AvatarOrInitials
              avatar={(order.buyerId as { avatar?: { url?: string } })?.avatar}
              fullName={order.buyerId?.fullName}
              size={18}
            />
            <span className="text-2xs text-neutral-500 font-medium truncate">
              {order.buyerId?.fullName || "—"}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-droid-serif text-sm font-bold text-luxury-ink leading-none">
              {formatPrice(order.totalAmount)}
            </span>
            {order.shippingFee !== undefined && order.shippingFee > 0 && (
              <span className="text-[10px] text-neutral-400">
                +{formatPrice(order.shippingFee)} ship
              </span>
            )}
          </div>

          <div className="flex items-center flex-wrap gap-x-2 gap-y-0 text-2xs text-neutral-400 mt-auto pt-1">
            <span className="font-mono font-bold text-luxury-ink/70">
              #{order._id.slice(-6).toUpperCase()}
            </span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <IconClock className="w-3 h-3 shrink-0" />
              <span>{formatTimeAgo(order.createdAt)}</span>
            </div>
            {order.ghnOrderCode && (
              <>
                <span>•</span>
                <span className="font-mono font-bold text-accent">
                  GHN: {order.ghnOrderCode}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {isRefundRequest && (
        <div className="mx-4 mb-3">
          <div className="flex items-start gap-2.5 bg-cream-100/80 border border-luxury-champagne/50 rounded-[2px] p-3 text-xs">
            <IconAlertTriangle className="w-4 h-4 text-taupe-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-2xs font-bold uppercase tracking-wider text-neutral-800 leading-snug">
                Yêu cầu hoàn tiền
                {refundDoc?.reason &&
                  ` · ${REFUND_REASON_LABELS[refundDoc.reason] ?? refundDoc.reason}`}
              </p>
              <p className="text-2xs text-neutral-600 mt-0.5">
                Vui lòng xem kỹ bằng chứng trước khi xác nhận.
              </p>
            </div>
          </div>
        </div>
      )}

      {isRefundInProgress && (
        <div className="mx-4 mb-3">
          <div className="flex items-start gap-2.5 bg-cream-50 border border-luxury-ink/10 rounded-[2px] p-3 text-xs">
            <IconPackage className="w-4 h-4 text-luxury-ink shrink-0 mt-0.5" />
            <div>
              <p className="text-2xs font-bold uppercase tracking-wider text-luxury-ink leading-snug">
                Hoàn tiền đang xử lý
                {refundDoc?.status &&
                  ` · ${REFUND_PHASE_LABELS[refundDoc.status] ?? refundDoc.status}`}
              </p>
              <p className="text-2xs text-neutral-600 mt-0.5">
                Theo dõi hàng hoàn và xác nhận khi đã nhận lại kiện hàng.{" "}
                {REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER}
              </p>
            </div>
          </div>
        </div>
      )}

      <OrderActions
        order={order}
        updatingId={updatingId}
        onUpdateStatus={onUpdateStatus}
        onApproveRefund={onApproveRefund}
      />

      <div className="flex items-center border-t border-luxury-ink/10 divide-x divide-luxury-ink/10 bg-cream-50/50">
        <Link
          href={`/my/messages?buyerId=${order.buyerId?._id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-2xs font-bold uppercase tracking-[0.12em] text-neutral-600 hover:bg-taupe-50 hover:text-luxury-ink transition-colors"
        >
          <IconMessageCircle className="w-3.5 h-3.5" />
          Nhắn tin
        </Link>
        <Link
          href={`/my/orders/${order._id}`}
          className="flex-1 flex items-center justify-center py-2.5 text-2xs font-bold uppercase tracking-[0.12em] text-neutral-600 hover:bg-taupe-50 hover:text-luxury-ink transition-colors"
        >
          Chi tiết đơn
        </Link>
      </div>
    </div>
  );
}
