"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, User } from "lucide-react";
import CartItem from "./CartItem";
import type { CartItem as CartItemType } from "@/types/cart";

interface ShopCartGroupProps {
  sellerName: string;
  sellerAvatar: string | null;
  items: CartItemType[];
  selectedIds: Set<string>;
  onToggle: (productId: string) => void;
  onSelectAllInShop: (productIds: string[], checked: boolean) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  isUpdating?: boolean;
}

export default function ShopCartGroup({
  sellerName,
  sellerAvatar,
  items,
  selectedIds,
  onToggle,
  onSelectAllInShop,
  onQuantityChange,
  onRemove,
  isUpdating = false,
}: ShopCartGroupProps) {
  const productIds = items.map((i) => i.productId?._id).filter(Boolean) as string[];
  const allSelected = productIds.length > 0 && productIds.every((id) => selectedIds.has(id));

  const handleSelectAll = (checked: boolean) => {
    onSelectAllInShop(productIds, checked);
  };

  return (
    <div className="bg-cream-50/90 backdrop-blur-md rounded-3xl border-2 border-neutral-200/60 shadow-lg shadow-neutral-200/50 overflow-hidden mb-4">
      <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-neutral-200/60 bg-cream-50/50">
        <label className="flex-shrink-0 cursor-pointer">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
            disabled={isUpdating}
            className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary cursor-pointer disabled:opacity-50"
          />
        </label>
        <Link
          href="#"
          className="flex-1 flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity"
        >
          {sellerAvatar ? (
            <Image
              src={sellerAvatar}
              alt={sellerName}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-neutral-200"
            />
          ) : (
            <span className="w-8 h-8 rounded-full bg-cream-50 flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-neutral-600" />
            </span>
          )}
          <span className="text-sm font-medium text-neutral-900 truncate">{sellerName}</span>
        </Link>
        <ChevronRight className="h-4 w-4 text-neutral-600 flex-shrink-0" />
      </div>

      <div className="divide-y-2 divide-neutral-200/60">
        {items.map((item) => (
          <CartItem
            key={item.productId?._id ?? String(Math.random())}
            item={item}
            checked={selectedIds.has(item.productId?._id ?? "")}
            onToggle={onToggle}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
            isUpdating={isUpdating}
          />
        ))}
      </div>
    </div>
  );
}
