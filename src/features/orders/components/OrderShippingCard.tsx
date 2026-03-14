import { IconMapPin, IconTruck } from "@tabler/icons-react";
import { formatDateOnly } from "@/utils/format/date";
import { formatShippingMethod } from "@/utils/format";
import type { Order } from "@/types/order";

interface OrderShippingCardProps {
  order: Order;
}

export function OrderShippingCard({ order }: OrderShippingCardProps) {
  const addr = order.shippingAddress;
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        <IconMapPin className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-neutral-900">Địa chỉ nhận hàng</h3>
      </div>
      <p className="text-sm font-semibold text-neutral-900">{addr.fullName}</p>
      <p className="text-sm text-neutral-600">{addr.phoneNumber}</p>
      <p className="text-sm text-neutral-700 mt-1">{addr.specificAddress}</p>
      {(addr.ward || addr.district || addr.province) && (
        <p className="text-sm text-neutral-600">
          {[addr.ward, addr.district, addr.province].filter(Boolean).join(", ")}
        </p>
      )}
      {order.shippingMethod && (
        <div className="mt-3 pt-3 border-t border-neutral-200 flex items-center gap-2 text-sm">
          <IconTruck className="w-4 h-4 text-neutral-500" />
          <span className="text-neutral-600">{formatShippingMethod(order.shippingMethod)}</span>
          {order.expectedDeliveryTime && (
            <span className="text-neutral-500 ml-auto">{formatDateOnly(order.expectedDeliveryTime)}</span>
          )}
        </div>
      )}
    </div>
  );
}

