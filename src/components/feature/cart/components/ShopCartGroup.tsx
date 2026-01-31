"use client";

import Link from "next/link";
import { ChevronRight, User } from "lucide-react";
import CartItem from "./CartItem";
import type { CartItem as CartItemType } from "@/types/cart";

interface ShopCartGroupProps {
  sellerId: string;
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
  sellerId,
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
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden mb-4">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30">
        <label className="flex-shrink-0 cursor-pointer">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
            disabled={isUpdating}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer disabled:opacity-50"
          />
        </label>
        <Link
          href="#"
          className="flex-1 flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity"
        >
          {sellerAvatar ? (
            <img
              src={sellerAvatar}
              alt={sellerName}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-border"
            />
          ) : (
            <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-muted-foreground" />
            </span>
          )}
          <span className="text-sm font-medium text-foreground truncate">{sellerName}</span>
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </div>

      <div className="divide-y divide-border">
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
