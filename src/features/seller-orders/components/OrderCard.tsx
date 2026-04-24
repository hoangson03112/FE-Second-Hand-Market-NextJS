"use client";

import Link from "next/link";
import Image from "next/image";
import {
  IconMessageCircle,
  IconAlertTriangle,
  IconClock,
  IconPackage,
} from "@tabler/icons-react";
import type { Order } from "@/types/order";
import { StatusBadge } from "@/components/shared";
import { formatPrice } from "@/utils/format/price";
import { getProductImage } from "../utils/orderUtils";
import OrderActions from "./OrderActions";
import { cn } from "@/lib/utils";
import { formatTimeAgo } from "@/utils/format/date";
import { AvatarOrInitials } from "@/components/common/AvatarOrInitials";
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
    reason?: string
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
    order.status === "refund" && refundDoc && refundDoc.status !== "pending" && refundDoc.status !== "rejected";
  const isRefundRequest = needsSellerRefundReview;
  const isPending = order.status === "pending";

  return (
    <div
      className={cn(
        "group bg-background overflow-hidden rounded-xl border shadow-sm transition-all duration-200",
        "hover:shadow-md hover:-translate-y-0.5",
        isRefundRequest
          ? "border-orange-200 hover:border-orange-300"
          : isRefundInProgress
            ? "border-sky-200 hover:border-sky-300"
            : isPending
              ? "border-amber-200 hover:border-amber-300"
              : "border-border hover:border-primary/25",
      )}
    >
      {/* ── MAIN ROW ──────────────────────────────────────────────────────── */}
      <div className="flex gap-3 p-4">
        {/* Product image */}
        <div className="relative w-[92px] h-[92px] rounded-lg overflow-hidden shrink-0 bg-muted">
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
              <IconPackage className="w-10 h-10 text-muted-foreground/40" strokeWidth={1.5} />
            </div>
          )}
          {order.products.length > 1 && (
            <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-sm">
              +{order.products.length - 1}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {/* Product name + status badge */}
          <div className="flex items-start gap-2">
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 flex-1 group-hover:text-primary transition-colors">
              {firstProduct?.name ?? "Sản phẩm không xác định"}
            </h3>
            <StatusBadge status={order.status} />
          </div>

          {/* Buyer */}
          <div className="flex items-center gap-1.5">
            <AvatarOrInitials
              avatar={(order.buyerId as { avatar?: { url?: string } })?.avatar}
              fullName={order.buyerId?.fullName}
              size={20}
            />
            <span className="text-[12px] text-muted-foreground font-medium truncate">
              {order.buyerId?.fullName || "—"}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-primary leading-none">
              {formatPrice(order.totalAmount)}
            </span>
            {order.shippingFee !== undefined && order.shippingFee > 0 && (
              <span className="text-[11px] text-muted-foreground/70">
                +{formatPrice(order.shippingFee)} ship
              </span>
            )}
          </div>

          {/* Meta: ID · time · GHN code */}
          <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0 text-[11px] text-muted-foreground mt-auto">
            <span className="font-mono font-semibold text-foreground/50">
              #{order._id.slice(-6).toUpperCase()}
            </span>
            <span className="w-[3px] h-[3px] rounded-full bg-muted-foreground/40 shrink-0" />
            <IconClock className="w-3 h-3 shrink-0" strokeWidth={2} />
            <span>{formatTimeAgo(order.createdAt)}</span>
            {order.ghnOrderCode && (
              <>
                <span className="w-[3px] h-[3px] rounded-full bg-muted-foreground/40 shrink-0" />
                <span className="font-mono font-semibold text-blue-600/80">
                  {order.ghnOrderCode}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── REFUND BANNER ─────────────────────────────────────────────────── */}
      {isRefundRequest && (
        <div className="mx-4 mb-3">
          <div className="flex items-start gap-2.5 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2.5">
            <IconAlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-semibold text-orange-700 leading-snug">
                Yêu cầu hoàn tiền
                {refundDoc?.reason &&
                  ` · ${REFUND_REASON_LABELS[refundDoc.reason] ?? refundDoc.reason}`}
              </p>
              <p className="text-[11px] text-orange-500 mt-0.5">
                Xem bằng chứng trước khi phê duyệt.
              </p>
            </div>
          </div>
        </div>
      )}
      {isRefundInProgress && (
        <div className="mx-4 mb-3">
          <div className="flex items-start gap-2.5 bg-sky-50 border border-sky-100 rounded-xl px-3 py-2.5">
            <IconPackage className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-semibold text-sky-800 leading-snug">
                Hoàn tiền đang xử lý
                {refundDoc?.status &&
                  ` · ${REFUND_PHASE_LABELS[refundDoc.status] ?? refundDoc.status}`}
              </p>
              <p className="text-[11px] text-sky-600 mt-0.5">
                Theo dõi vận đơn hoàn và xác nhận khi đã nhận lại hàng. {REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── ACTIONS ───────────────────────────────────────────────────────── */}
      <OrderActions
        order={order}
        updatingId={updatingId}
        onUpdateStatus={onUpdateStatus}
        onApproveRefund={onApproveRefund}
      />

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <div className="flex items-center border-t border-border/60 divide-x divide-border/60 bg-muted/10">
        <Link
          href={`/my/messages?buyerId=${order.buyerId?._id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors"
        >
          <IconMessageCircle className="w-3.5 h-3.5" strokeWidth={2} />
          Chat
        </Link>
        <Link
          href={`/my/orders/${order._id}`}
          className="flex-1 flex items-center justify-center py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors"
        >
          Xem đơn
        </Link>
      </div>
    </div>
  );
}
