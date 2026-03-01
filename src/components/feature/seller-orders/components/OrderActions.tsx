import Link from "next/link";
import {
  IconLoader2,
  IconCircleCheck,
  IconCircleX,
  IconTruck,
  IconChevronRight,
} from "@tabler/icons-react";
import type { Order } from "@/types/order";

interface OrderActionsProps {
  order: Order;
  updatingId: string | null;
  onUpdateStatus: (
    orderId: string,
    status: "confirmed" | "cancelled",
    reason?: string
  ) => void;
}

export default function OrderActions({
  order,
  updatingId,
  onUpdateStatus,
}: OrderActionsProps) {
  // Chỉ hiển thị nút hành động cho đơn PENDING
  if (order.status === "pending") {
    return (
      <div className="flex gap-2 pt-4 border-t border-border">
        <button
          onClick={() => onUpdateStatus(order._id, "confirmed")}
          disabled={updatingId === order._id}
          className="flex-1 py-2.5 px-4 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
        >
          {updatingId === order._id ? (
            <IconLoader2 className="w-4 h-4 animate-spin" />
          ) : (
            <IconCircleCheck className="w-4 h-4" />
          )}
          Xác nhận & tạo đơn GHN
        </button>
        <button
          onClick={() => {
            if (window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
              onUpdateStatus(order._id, "cancelled");
            }
          }}
          disabled={updatingId === order._id}
          className="flex-1 py-2.5 px-4 border-2 border-red-500 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
        >
          <IconCircleX className="w-4 h-4" />
          Hủy đơn
        </button>
      </div>
    );
  }

  // Đơn đã xác nhận trở đi: GHN tự động cập nhật qua webhook
  if (
    ["confirmed", "picked_up", "shipping", "out_for_delivery"].includes(
      order.status
    )
  ) {
    return (
      <div className="pt-4 border-t border-border">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <IconTruck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Đơn hàng đang được GHN xử lý
              </p>
              <p className="text-xs text-blue-700">
                Trạng thái sẽ tự động cập nhật khi GHN lấy hàng và vận chuyển
              </p>
              {order.ghnOrderCode && (
                <p className="text-xs text-blue-600 mt-2 font-mono">
                  Mã vận đơn:{" "}
                  <span className="font-semibold">{order.ghnOrderCode}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Nút xem chi tiết cho tất cả đơn đã hoàn tất hoặc có vấn đề
  if (
    ["delivered", "completed", "failed", "returned", "cancelled"].includes(
      order.status
    )
  ) {
    return (
      <div className="pt-4 border-t border-border">
        <Link
          href={`/orders/${order._id}`}
          className="w-full py-2.5 px-4 border-2 border-primary text-primary rounded-xl text-sm font-semibold hover:bg-primary/5 flex items-center justify-center gap-2 transition-all"
        >
          Xem chi tiết
          <IconChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return null;
}
