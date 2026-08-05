import { IconShoppingBag, IconClock } from "@tabler/icons-react";
import { format } from "@/utils/format/date";
import { StatusBadge } from "@/components/shared";
import type { Order } from "@/types/order";

interface OrderInfoCardProps {
  order: Order;
}

export function OrderInfoCard({ order }: OrderInfoCardProps) {
  return (
    <div className="bg-gradient-to-br from-cream-50 to-white border-2 border-border rounded-2xl p-5 shadow-md">
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-border">
        <div className="flex items-center gap-2">
          <IconShoppingBag className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-taupe-900 uppercase tracking-wider">Thông tin đơn hàng</h3>
        </div>
        <StatusBadge status={order.status} size="md" />
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-taupe-500">Mã đơn nội bộ</span>
          <span className="font-mono font-medium text-taupe-900">#{order._id.slice(-8).toUpperCase()}</span>
        </div>
        {order.ghnOrderCode && (
          <div className="flex justify-between">
            <span className="text-taupe-500">Mã GHN</span>
            <span className="font-mono font-medium text-taupe-900">{order.ghnOrderCode}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-taupe-500 flex items-center gap-1">
            <IconClock className="w-3.5 h-3.5" /> Đặt hàng
          </span>
          <span className="text-taupe-900">{format(order.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}