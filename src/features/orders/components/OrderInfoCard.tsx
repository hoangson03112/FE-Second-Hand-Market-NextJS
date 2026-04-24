import { IconShoppingBag, IconClock } from "@tabler/icons-react";
import { format } from "@/utils/format/date";
import { StatusBadge } from "@/components/shared";
import type { Order } from "@/types/order";

interface OrderInfoCardProps {
  order: Order;
}

export function OrderInfoCard({ order }: OrderInfoCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <IconShoppingBag className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-neutral-900">Thông tin đơn hàng</h3>
        </div>
        <StatusBadge status={order.status} size="md" />
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">Mã đơn nội bộ</span>
          <span className="font-mono font-medium text-neutral-800">#{order._id.slice(-8).toUpperCase()}</span>
        </div>
        {order.ghnOrderCode && (
          <div className="flex justify-between">
            <span className="text-neutral-500">Mã GHN</span>
            <span className="font-mono font-medium text-neutral-800">{order.ghnOrderCode}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-neutral-500 flex items-center gap-1">
            <IconClock className="w-3.5 h-3.5" /> Đặt hàng
          </span>
          <span className="text-neutral-800">{format(order.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

