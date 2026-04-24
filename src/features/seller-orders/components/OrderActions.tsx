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
import { CancelOrderReasonDialog } from "@/components/shared";
import { getShippingMethodType } from "@/utils/format";
import type { Order } from "@/types/order";

interface OrderActionsProps {
  order: Order;
  updatingId: string | null;
  onUpdateStatus: (
    orderId: string,
    status: "confirmed" | "cancelled",
    reason?: string
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
  const isLocalPickup = getShippingMethodType(order.shippingMethod) === "local_pickup";
  const refundDoc =
    order.refundRequestId && typeof order.refundRequestId === "object"
      ? order.refundRequestId
      : null;
  const needsSellerRefundDecision =
    (order.status === "refund_requested" || order.status === "refund") &&
    (refundDoc == null || refundDoc.status === "pending");

  // ── Chờ xác nhận ──────────────────────────────────────────────────────────
  if (order.status === "pending") {
    return (
      <>
        <div className="flex items-center gap-2 px-3 pb-3">
          <button
            onClick={() => onUpdateStatus(order._id, "confirmed")}
            disabled={isUpdating}
            className="flex-1 py-2 px-3 bg-primary text-primary-foreground rounded-xl text-[13px] font-semibold hover:bg-primary/90 active:bg-primary/95 disabled:opacity-40 flex items-center justify-center gap-2 transition-all"
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
            className="py-2 px-3 bg-muted text-muted-foreground rounded-xl text-[13px] font-medium hover:bg-destructive/10 hover:text-destructive disabled:opacity-40 flex items-center justify-center gap-1.5 transition-all"
          >
            <IconCircleX className="w-3.5 h-3.5" />
            Huỷ đơn
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

  // ── Đang vận chuyển ───────────────────────────────────────────────────────
  if (["confirmed", "picked_up", "shipping", "out_for_delivery"].includes(order.status)) {
    const label = isLocalPickup
      ? order.status === "confirmed"
        ? "Đã xác nhận • Liên hệ người mua để sắp xếp giao hàng"
        : "Đang chờ giao hàng trực tiếp"
      : "Đơn hàng đang được GHN vận chuyển";
    return (
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 bg-muted border border-border rounded-xl px-3 py-2">
          <IconTruck className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <p className="text-[12px] font-medium text-foreground/70">{label}</p>
        </div>
      </div>
    );
  }

  // ── Yêu cầu hoàn tiền (BE thường dùng order.status === "refund") ───────────
  if (needsSellerRefundDecision) {
    return (
      <div className="px-3 pb-3">
        <div className="flex gap-1.5">
          {onApproveRefund && (
            <button
              onClick={() => onApproveRefund(order._id)}
              disabled={isUpdating}
              className="flex-1 py-1.5 px-3 bg-primary text-primary-foreground rounded-xl text-[12px] font-semibold hover:bg-primary/90 disabled:opacity-40 flex items-center justify-center gap-1.5 transition-all"
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
            className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-muted text-muted-foreground rounded-xl text-[12px] font-medium hover:bg-muted/80 transition-all"
          >
            <IconEye className="w-3.5 h-3.5" />
            Xem bằng chứng
          </Link>
        </div>
      </div>
    );
  }

  // ── Hoàn tiền đã duyệt ────────────────────────────────────────────────────
  if (order.status === "refund_approved") {
    return (
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 bg-muted border border-border rounded-xl px-3 py-2">
          <IconCircleCheck className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <p className="text-[12px] font-medium text-muted-foreground">Đã chấp thuận hoàn tiền · Admin đang xử lý</p>
        </div>
      </div>
    );
  }

  // ── Các trạng thái kết thúc ────────────────────────────────────────────────
  if (
    ["delivered", "completed", "delivery_failed", "returned", "cancelled", "refunded"].includes(
      order.status
    )
  ) {
    return null;
  }

  return null;
}