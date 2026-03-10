import Image from "next/image";
import { IconPackage } from "@tabler/icons-react";
import { formatPrice } from "@/utils/format/price";
import type { Order } from "@/types/order";

interface OrderProductsCardProps {
  order: Order;
}

export function OrderProductsCard({ order }: OrderProductsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-neutral-200 flex items-center gap-2">
        <IconPackage className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-neutral-900">Sản phẩm ({order.products.length})</h3>
      </div>
      <div className="p-4 space-y-3">
        {order.products.map((item, idx) => {
          const product = item.productId;
          const avatar =
            typeof product?.avatar === "object" && product.avatar?.url
              ? product.avatar.url
              : typeof product?.avatar === "string"
                ? product.avatar
                : "/placeholder.svg";
          return (
            <div key={idx} className="flex gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                <Image src={avatar} alt={product?.name || "Sản phẩm"} width={64} height={64} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 line-clamp-2">{product?.name || "Sản phẩm"}</p>
                <p className="text-xs text-neutral-500 mt-0.5">×{item.quantity}</p>
                <p className="text-sm font-semibold text-primary mt-1">{formatPrice(item.price || product?.price || 0)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

