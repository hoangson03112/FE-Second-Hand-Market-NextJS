"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconLoader2,
  IconCircleCheck,
  IconCircleX,
  IconTruck,
  IconEye,
} from "@tabler/icons-react";
import { CancelOrderReasonDialog } from "@/features/order/components";
import { getShippingMethodType } from "@/utils/format";
import type { Order } from "@/types/order";

interface OrderActionsProps {
  order: Order;
  updatingId: string | null;
  onUpdateStatus: (
    orderId: string,
    status: "confirmed" | "cancelled",
    reason?: string,
  ) => void;
  onApproveRefund?: (orderId: string) => void;
}

export default function OrderActions({
  order,
  updatingId,
  onUpdateStatus,
  onApproveRefund,
}: OrderActionsProps) {
  const isUpdating = updatingId === order._id;
  const [cancelOpen, setCancelOpen] = useState(false);
  const isLocalPickup =
    getShippingMethodType(order.shippingMethod) === "local_pickup";
  const refundDoc =
    order.refundRequestId && typeof order.refundRequestId === "object"
      ? order.refundRequestId
      : null;
  const needsSellerRefundDecision =
    (order.status === "refund_requested" || order.status === "refund") &&
    (refundDoc == null || refundDoc.status === "pending");

  if (order.status === "pending") {
    return (
      <>
        <div className="flex items-center gap-2 px-4 pb-3">
          <button
            onClick={() => onUpdateStatus(order._id, "confirmed")}
            disabled={isUpdating}
            className="flex-1 py-2 px-3 bg-luxury-ink text-luxury-ivory rounded-[2px] text-2xs font-bold uppercase tracking-[0.12em] hover:bg-charcoal-800 disabled:opacity-40 flex items-center justify-center gap-1.5 transition-all"
          >
            {isUpdating ? (
              <IconLoader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <IconCircleCheck className="w-3.5 h-3.5" />
            )}
            Xác nhận đơn
          </button>
          <button
            onClick={() => setCancelOpen(true)}
            disabled={isUpdating}
            className="py-2 px-3 border border-luxury-ink/20 text-neutral-600 rounded-[2px] text-2xs font-bold uppercase tracking-[0.12em] hover:border-blush-600 hover:text-blush-600 disabled:opacity-40 flex items-center justify-center gap-1.5 transition-all"
          >
            <IconCircleX className="w-3.5 h-3.5" />
            Huỷ
          </button>
        </div>
        <CancelOrderReasonDialog
          isOpen={cancelOpen}
          orderCode={order._id.slice(-8).toUpperCase()}
          onConfirm={(reason) => {
            setCancelOpen(false);
            onUpdateStatus(order._id, "cancelled", reason);
          }}
          onCancel={() => setCancelOpen(false)}
          isLoading={isUpdating}
        />
      </>
    );
  }

  if (
    ["confirmed", "picked_up", "shipping", "out_for_delivery"].includes(
      order.status,
    )
  ) {
    const label = isLocalPickup
      ? order.status === "confirmed"
        ? "Đã xác nhận • Vui lòng liên hệ người mua để giao hàng"
        : "Đang chờ giao hàng trực tiếp"
      : "Đơn hàng đang được vận chuyển qua GHN";
    return (
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 bg-cream-50/70 border border-luxury-ink/10 rounded-[2px] px-3 py-2">
          <IconTruck className="w-3.5 h-3.5 text-luxury-ink shrink-0" />
          <p className="text-2xs font-medium text-neutral-600">{label}</p>
        </div>
      </div>
    );
  }

  if (needsSellerRefundDecision) {
    return (
      <div className="px-4 pb-3">
        <div className="flex gap-2">
          {onApproveRefund && (
            <button
              onClick={() => onApproveRefund(order._id)}
              disabled={isUpdating}
              className="flex-1 py-2 px-3 bg-luxury-ink text-luxury-ivory rounded-[2px] text-2xs font-bold uppercase tracking-[0.12em] hover:bg-charcoal-800 disabled:opacity-40 flex items-center justify-center gap-1.5 transition-all"
            >
              {isUpdating ? (
                <IconLoader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <IconCircleCheck className="w-3.5 h-3.5" />
              )}
              Đồng ý hoàn
            </button>
          )}
          <Link
            href={`/my/orders/${order._id}`}
            className="flex items-center justify-center gap-1.5 py-2 px-3 border border-luxury-ink/20 text-neutral-600 rounded-[2px] text-2xs font-bold uppercase tracking-[0.12em] hover:bg-taupe-50 transition-all"
          >
            <IconEye className="w-3.5 h-3.5" />
            Xem bằng chứng
          </Link>
        </div>
      </div>
    );
  }

  if (order.status === "refund_approved") {
    return (
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 bg-cream-50/70 border border-luxury-ink/10 rounded-[2px] px-3 py-2">
          <IconCircleCheck className="w-3.5 h-3.5 text-luxury-ink shrink-0" />
          <p className="text-2xs font-medium text-neutral-600">
            Đã chấp thuận hoàn tiền · Ban Quản Trị đang xử lý
          </p>
        </div>
      </div>
    );
  }

  return null;
}
