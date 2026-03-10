"use client";

import { IconBuildingStore } from "@tabler/icons-react";
import { formatPrice } from "@/utils/format/price";
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
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition"
        >
          <div className="flex gap-3 p-3">
            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 relative">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm text-gray-900 line-clamp-2 mb-2">{item.name}</h4>
              {item.condition && (
                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md mb-2">
                  {item.condition}
                </span>
              )}
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-600">Số lượng: ×{item.quantity}</span>
                <span className="text-base font-medium text-primary">{formatPrice(item.price)}</span>
              </div>
            </div>
          </div>
          {item.seller && (
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <IconBuildingStore className="h-3.5 w-3.5 text-gray-600" />
                <span className="text-xs text-gray-600">Người bán:</span>
                <div className="flex items-center gap-2">
                  {item.seller.avatar && (
                    <Image src={item.seller.avatar} alt={item.seller.name} width={16} height={16} className="rounded-full" />
                  )}
                  <span className="text-xs font-medium text-gray-900">{item.seller.name}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
