"use client";

import Link from "next/link";
import { IconLoader2, IconCircleCheck, IconCircleX, IconRefresh, IconStar } from "@tabler/icons-react";
import type { Order } from "@/types/order";

interface OrderActionsProps {
  order: Order;
  cancellingId: string | null;
  confirmingId: string | null;
  onCancel: (orderId: string) => void;
  onConfirmReceived: (orderId: string) => void;
  onOpenRefund: (orderId: string) => void;
}

export function OrderActions({ order, cancellingId, confirmingId, onCancel, onConfirmReceived, onOpenRefund }: OrderActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {order.status === "pending" && (
        <button
          onClick={() => onCancel(order._id)}
          disabled={cancellingId === order._id}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-destructive/40 text-destructive text-sm font-semibold hover:bg-destructive/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {cancellingId === order._id
            ? <IconLoader2 className="w-4 h-4 animate-spin" />
            : <IconCircleX className="w-4 h-4" />}
          Hủy đơn
        </button>
      )}
      {order.status === "delivered" && (
        <button
          onClick={() => onConfirmReceived(order._id)}
          disabled={confirmingId === order._id}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {confirmingId === order._id
            ? <IconLoader2 className="w-4 h-4 animate-spin" />
            : <IconCircleCheck className="w-4 h-4" />}
          Đã nhận hàng
        </button>
      )}
      {(order.status === "delivered" || order.status === "completed") && (
        <button
          type="button"
          onClick={() => onOpenRefund(order._id)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-orange-300 text-orange-600 text-sm font-semibold hover:bg-orange-50 transition-all"
        >
          <IconRefresh className="w-4 h-4" />
          Hoàn tiền
        </button>
      )}
      {order.status === "completed" && (
        <Link
          href={`/orders/${order._id}?review=1`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-primary/30 text-primary text-sm font-semibold hover:bg-primary/5 transition-all"
        >
          <IconStar className="w-4 h-4" />
          Đánh giá
        </Link>
      )}
    </div>
  );
}

