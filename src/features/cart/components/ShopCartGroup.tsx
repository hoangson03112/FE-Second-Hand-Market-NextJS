"use client";

import { IconChevronRight } from "@tabler/icons-react";
import { AvatarOrInitials } from "@/components/common/AvatarOrInitials";
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
  const productIds = items.map((i) => i.productId?._id).filter(Boolean) as string[];
  const allSelected = productIds.length > 0 && productIds.every((id) => selectedIds.has(id));

  const handleSelectAll = (checked: boolean) => {
    onSelectAllInShop(productIds, checked);
  };

  return (
    <div className="bg-card overflow-hidden mb-5 rounded-2xl border border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-taupe-50 to-cream-50 border-b border-border rounded-t-2xl">
        <label className="flex-shrink-0 cursor-pointer">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
            disabled={isUpdating}
            className="w-4 h-4 border-2 border-taupe-300 rounded-md text-primary focus:ring-2 focus:ring-primary/50 cursor-pointer disabled:opacity-50 transition-all"
          />
        </label>
        <Link
          href="#"
          className="flex-1 flex items-center gap-2.5 min-w-0 group"
        >
          <AvatarOrInitials
            avatar={sellerAvatar}
            fullName={sellerName}
            size={24}
            className="w-6 h-6"
          />
          <span className="text-sm font-medium text-taupe-900 truncate group-hover:text-primary">{sellerName}</span>
        </Link>
        <IconChevronRight className="h-4 w-4 text-taupe-400 flex-shrink-0" />
      </div>

      {/* Header row - desktop only */}
      <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-muted/40 border-b border-border text-xs font-semibold text-muted-foreground">
        <div className="w-4"></div>
        <div className="w-20"></div>
        <div className="flex-1">Sản phẩm</div>
        <div className="w-24 text-center">Đơn giá</div>
        <div className="w-28 text-center">Số lượng</div>
        <div className="w-24 text-center">Số tiền</div>
        <div className="w-8"></div>
      </div>

      <div className="divide-y divide-border/50">
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
