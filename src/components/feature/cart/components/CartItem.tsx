"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { formatPrice } from "@/utils/format/price";
import type { CartItem as CartItemType } from "@/types/cart";

interface CartItemProps {
  item: CartItemType;
  checked: boolean;
  onToggle: (productId: string) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  isUpdating?: boolean;
}

function getImageUrl(avatar: CartItemType["productId"]["avatar"]): string | null {
  if (!avatar) return null;
  return typeof avatar === "object" && "url" in avatar ? avatar.url : null;
}

export default function CartItem({
  item,
  checked,
  onToggle,
  onQuantityChange,
  onRemove,
  isUpdating = false,
}: CartItemProps) {
  const product = item.productId;
  if (!product) return null;

  const imageUrl = getImageUrl(product.avatar);
  const stock = product.stock ?? 999;
  const maxQty = Math.max(1, Math.min(stock, 99));
  const productHref = `/products/${product._id}/${product.slug}`;

  return (
    <div className="flex gap-4 py-4 px-4 items-center hover:bg-muted/20 transition-colors">
      <label className="flex-shrink-0 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(product._id)}
          disabled={isUpdating}
          className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer disabled:opacity-50"
        />
      </label>

      <Link
        href={productHref}
        className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted ring-1 ring-border"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="h-8 w-8 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={productHref}
          className="text-sm font-medium text-foreground line-clamp-2 hover:text-primary transition-colors block mb-1"
        >
          {product.name}
        </Link>
        <p className="text-base font-semibold text-primary mb-2">{formatPrice(product.price)}</p>
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            disabled={item.quantity <= 1 || isUpdating}
            onClick={() => onQuantityChange(product._id, item.quantity - 1)}
            className="w-8 h-8 rounded-md border border-border bg-background flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            −
          </button>
          <span className="min-w-[28px] text-center text-sm font-medium text-foreground">
            {item.quantity}
          </span>
          <button
            type="button"
            disabled={item.quantity >= maxQty || isUpdating}
            onClick={() => onQuantityChange(product._id, item.quantity + 1)}
            className="w-8 h-8 rounded-md border border-border bg-background flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className="text-base font-semibold text-primary">
          {formatPrice(product.price * item.quantity)}
        </span>
        <button
          type="button"
          onClick={() => onRemove(product._id)}
          disabled={isUpdating}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50 inline-flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          Xóa
        </button>
      </div>
    </div>
  );
}
