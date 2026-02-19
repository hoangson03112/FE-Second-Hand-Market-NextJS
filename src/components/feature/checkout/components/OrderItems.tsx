"use client";

import { formatPrice } from "@/utils/format/price";
import { Store } from "lucide-react";
import Image from "next/image";

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
          className="border-2 border-neutral-200/60 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-neutral-200/50 transition-all duration-300"
        >
          <div className="flex gap-4 p-4">
            <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-cream-50 relative">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="h-10 w-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-neutral-900 line-clamp-2 mb-2">{item.name}</h4>
              {item.condition && (
                <span className="inline-block px-2 py-0.5 bg-cream-50 text-neutral-600 text-xs rounded-full mb-2">
                  {item.condition}
                </span>
              )}
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-neutral-600">Số lượng: ×{item.quantity}</span>
                <span className="text-lg font-bold text-primary">{formatPrice(item.price)}</span>
              </div>
            </div>
          </div>
          {item.seller && (
            <div className="px-4 py-3 bg-cream-50/50 border-t-2 border-neutral-200/60">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-neutral-600" />
                <span className="text-sm text-neutral-600">Người bán:</span>
                <div className="flex items-center gap-2">
                  {item.seller.avatar && (
                    <Image src={item.seller.avatar} alt={item.seller.name} width={20} height={20} className="rounded-full" />
                  )}
                  <span className="text-sm font-medium text-neutral-900">{item.seller.name}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
