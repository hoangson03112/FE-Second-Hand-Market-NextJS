"use client";

import { formatPrice } from "@/utils/format/price";
import { Store } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  condition?: string;
  seller?: {
    name: string;
    avatar?: string | null;
  };
}

interface OrderItemsProps {
  items: OrderItem[];
}

export default function OrderItems({ items }: OrderItemsProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="flex gap-4 p-4">
            {/* Image */}
            <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-muted">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="h-10 w-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground line-clamp-2 mb-2">
                {item.name}
              </h4>

              {item.condition && (
                <span className="inline-block px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full mb-2">
                  {item.condition}
                </span>
              )}

              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted-foreground">Số lượng: ×{item.quantity}</span>
                <span className="text-lg font-bold text-primary">{formatPrice(item.price)}</span>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          {item.seller && (
            <div className="px-4 py-3 bg-muted/30 border-t border-border">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Người bán:</span>
                <div className="flex items-center gap-2">
                  {item.seller.avatar && (
                    <img
                      src={item.seller.avatar}
                      alt={item.seller.name}
                      className="w-5 h-5 rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {item.seller.name}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
