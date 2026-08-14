"use client";

import { IconChevronRight } from "@tabler/icons-react";
import { AvatarOrInitials } from "@/components/shared/AvatarOrInitials";
import Link from "next/link";
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
  const productIds = items
    .map((i) => i.productId?._id)
    .filter(Boolean) as string[];
  const allSelected =
    productIds.length > 0 && productIds.every((id) => selectedIds.has(id));

  const handleSelectAll = (checked: boolean) => {
    onSelectAllInShop(productIds, checked);
  };

  return (
    <div className="bg-white overflow-hidden mb-6 rounded-[2px] border border-luxury-ink/10">
      <div className="flex items-center gap-3 px-6 py-4 bg-taupe-50/50 border-b border-luxury-ink/10">
        <label className="flex-shrink-0 cursor-pointer">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
            disabled={isUpdating}
            className="w-4 h-4 border border-luxury-ink/20 rounded-[2px] text-luxury-ink focus:ring-1 focus:ring-luxury-ink cursor-pointer disabled:opacity-50 transition-all"
          />
        </label>
        <Link href="#" className="flex-1 flex items-center gap-3 min-w-0 group">
          <AvatarOrInitials
            avatar={sellerAvatar}
            fullName={sellerName}
            size={28}
            className="w-7 h-7"
          />
          <span className="text-sm font-bold text-luxury-ink truncate group-hover:text-taupe-600">
            {sellerName}
          </span>
        </Link>
        <IconChevronRight className="h-4 w-4 text-taupe-400 flex-shrink-0" />
      </div>

      <div className="hidden lg:flex items-center gap-4 px-6 py-3 bg-white border-b border-luxury-ink/10 text-xs uppercase tracking-[0.13em] font-bold text-primary">
        <div className="w-4"></div>
        <div className="w-20"></div>
        <div className="flex-1">Sản phẩm</div>
        <div className="w-40 text-center">Đơn giá</div>
        <div className="w-40 text-center">Số lượng</div>
        <div className="w-52 text-center">Số tiền</div>
        <div className="w-8"></div>
      </div>

      <div className="divide-y divide-luxury-ink/10">
        {items.map((item) => (
          <CartItem
            key={item.productId._id}
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
