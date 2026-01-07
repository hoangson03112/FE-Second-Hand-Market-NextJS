"use client";

import { formatPrice } from "@/utils/format/price";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  condition?: string;
}

interface OrderItemsProps {
  items: OrderItem[];
}

export default function OrderItems({ items }: OrderItemsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">Sản Phẩm ({items.length})</h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 p-4 bg-background border border-border rounded-xl hover:shadow-md transition"
          >
            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground line-clamp-2 mb-1">
                {item.name}
              </h4>
              {item.condition && (
                <span className="inline-block px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full mb-2">
                  {item.condition}
                </span>
              )}
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                <span className="font-bold text-primary">{formatPrice(item.price)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


