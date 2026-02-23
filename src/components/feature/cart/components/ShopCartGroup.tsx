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
    <div className="bg-card overflow-hidden mb-4 rounded-xl border border-default shadow-primary">
      <div className="flex items-center gap-3 px-5 py-3 bg-taupe-50 border-b border-default rounded-t-xl">
        <label className="flex-shrink-0 cursor-pointer">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
            disabled={isUpdating}
            className="w-4 h-4 border-2 border-taupe-300 rounded-sm text-primary focus:ring-1 focus:ring-primary cursor-pointer disabled:opacity-50"
          />
        </label>
        <Link
          href="#"
          className="flex-1 flex items-center gap-2.5 min-w-0 group"
        >
          {sellerAvatar ? (
            <Image
              src={sellerAvatar}
              alt={sellerName}
              width={24}
              height={24}
              className="w-6 h-6 object-cover flex-shrink-0"
            />
          ) : (
            <span className="w-6 h-6 bg-taupe-100 flex items-center justify-center flex-shrink-0">
              <User className="h-3.5 w-3.5 text-taupe-400" />
            </span>
          )}
          <span className="text-sm font-medium text-taupe-900 truncate group-hover:text-primary">{sellerName}</span>
        </Link>
        <ChevronRight className="h-4 w-4 text-taupe-400 flex-shrink-0" />
      </div>

      {/* Header row - desktop only */}
      <div className="hidden lg:flex items-center gap-3 px-5 py-2 bg-taupe-50 border-b border-default text-xs text-taupe-600 uppercase tracking-[0.08em]">
        <div className="w-4"></div>
        <div className="w-20"></div>
        <div className="flex-1">Sản phẩm</div>
        <div className="w-24 text-center">Đơn giá</div>
        <div className="w-28 text-center">Số lượng</div>
        <div className="w-24 text-center">Số tiền</div>
        <div className="w-8"></div>
      </div>

      <div className="divide-y divide-default">
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
