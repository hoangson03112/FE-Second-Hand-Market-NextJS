"use client";

import { IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
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
  const productHref = `/products/${product._id}/${product.slug || "product"}`;

  return (
    <div className="flex gap-4 py-5 px-6 items-start bg-white hover:bg-luxury-ivory/50 transition-colors lg:items-center">
      <label className="flex-shrink-0 cursor-pointer pt-1 lg:pt-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(product._id)}
          disabled={isUpdating}
          className="w-4 h-4 border border-luxury-ink/20 rounded-[2px] text-luxury-ink focus:ring-1 focus:ring-luxury-ink cursor-pointer disabled:opacity-50 transition-all"
        />
      </label>

      <Link
        href={productHref}
        className="flex-shrink-0 w-20 h-20 border border-luxury-ink/10 overflow-hidden bg-taupe-50 rounded-[2px] hover:border-luxury-ink/30 transition-all duration-300"
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
          <div className="w-full h-full flex items-center justify-center bg-taupe-50">
            <svg
              className="h-8 w-8 text-taupe-300"
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

      {/* Mobile layout */}
      <div className="flex-1 min-w-0 flex flex-col lg:hidden">
        <Link
          href={productHref}
          className="text-sm font-medium text-luxury-ink line-clamp-2 hover:text-taupe-600 transition-colors mb-2"
        >
          {product.name}
        </Link>
        
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-base font-bold text-luxury-ink" style={{ fontFamily: "var(--font-droid-serif), serif" }}>{formatPrice(product.price)}</span>
              {product.hasPersonalDiscount && product.originalPrice != null && (
                <span className="text-[10px] text-taupe-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => onRemove(product._id)}
              disabled={isUpdating}
              className="text-taupe-400 hover:text-blush-600 hover:scale-110 transition-all duration-200 disabled:opacity-50"
            >
              <IconTrash className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div
              className="flex items-center border border-luxury-ink/20 overflow-hidden rounded-[2px]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                disabled={item.quantity <= 1 || isUpdating}
                onClick={() => onQuantityChange(product._id, item.quantity - 1)}
                className="w-7 h-7 flex items-center justify-center text-luxury-ink hover:bg-taupe-50 disabled:opacity-40 disabled:cursor-not-allowed border-r border-luxury-ink/10 transition-colors"
              >
                −
              </button>
              <input
                type="text"
                value={item.quantity}
                readOnly
                className="w-10 h-7 text-center text-[13px] font-medium tabular-nums text-luxury-ink border-0 focus:outline-none bg-transparent"
              />
              <button
                type="button"
                disabled={item.quantity >= maxQty || isUpdating}
                onClick={() => onQuantityChange(product._id, item.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center text-luxury-ink hover:bg-taupe-50 disabled:opacity-40 disabled:cursor-not-allowed border-l border-luxury-ink/10 transition-colors"
              >
                +
              </button>
            </div>

            <span className="text-base font-bold text-luxury-ink" style={{ fontFamily: "var(--font-droid-serif), serif" }}>
              {formatPrice(product.price * item.quantity)}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex flex-1 items-center gap-4">
        <Link
          href={productHref}
          className="flex-1 text-sm font-medium text-luxury-ink line-clamp-2 hover:text-taupe-600 transition-colors"
        >
          {product.name}
        </Link>

        <div className="w-28 text-center">
          <div className="text-base font-bold text-luxury-ink" style={{ fontFamily: "var(--font-droid-serif), serif" }}>{formatPrice(product.price)}</div>
          {product.hasPersonalDiscount && product.originalPrice != null && (
            <div className="text-[10px] text-taupe-400 line-through">{formatPrice(product.originalPrice)}</div>
          )}
        </div>

        <div className="w-32 flex justify-center" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center border border-luxury-ink/20 overflow-hidden rounded-[2px]">
            <button
              type="button"
              disabled={item.quantity <= 1 || isUpdating}
              onClick={() => onQuantityChange(product._id, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-luxury-ink hover:bg-taupe-50 disabled:opacity-40 disabled:cursor-not-allowed border-r border-luxury-ink/10 transition-colors"
            >
              −
            </button>
            <input
              type="text"
              value={item.quantity}
              readOnly
              className="w-10 h-8 text-center text-[13px] font-medium tabular-nums text-luxury-ink border-0 focus:outline-none bg-transparent"
            />
            <button
              type="button"
              disabled={item.quantity >= maxQty || isUpdating}
              onClick={() => onQuantityChange(product._id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-luxury-ink hover:bg-taupe-50 disabled:opacity-40 disabled:cursor-not-allowed border-l border-luxury-ink/10 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="w-28 text-center text-base font-bold text-luxury-ink" style={{ fontFamily: "var(--font-droid-serif), serif" }}>
          {formatPrice(product.price * item.quantity)}
        </div>

        <div className="w-8 flex justify-center">
          <button
            type="button"
            onClick={() => onRemove(product._id)}
            disabled={isUpdating}
            className="text-taupe-400 hover:text-blush-600 transition-colors disabled:opacity-50"
          >
            <IconTrash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
