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
    <div className="flex gap-3 py-4 px-5 items-start bg-card lg:items-center">
      <label className="flex-shrink-0 cursor-pointer pt-1 lg:pt-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(product._id)}
          disabled={isUpdating}
          className="w-4 h-4 border-2 border-taupe-300 rounded-sm text-primary focus:ring-1 focus:ring-primary cursor-pointer disabled:opacity-50"
        />
      </label>

      <Link
        href={productHref}
        className="flex-shrink-0 w-20 h-20 border border-default overflow-hidden bg-taupe-50 rounded-lg hover:border-primary/50 transition-colors"
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
          className="text-sm text-taupe-900 line-clamp-2 hover:text-primary transition-colors mb-2"
        >
          {product.name}
        </Link>
        
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-base font-medium text-primary">{formatPrice(product.price)}</span>
            <button
              type="button"
              onClick={() => onRemove(product._id)}
              disabled={isUpdating}
              className="text-taupe-400 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div
              className="flex items-center border border-default overflow-hidden rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                disabled={item.quantity <= 1 || isUpdating}
                onClick={() => onQuantityChange(product._id, item.quantity - 1)}
                className="w-7 h-7 flex items-center justify-center text-taupe-600 hover:bg-taupe-50 disabled:opacity-40 disabled:cursor-not-allowed border-r border-default"
              >
                −
              </button>
              <input
                type="text"
                value={item.quantity}
                readOnly
                className="w-10 h-7 text-center text-sm text-taupe-900 border-0 focus:outline-none bg-card"
              />
              <button
                type="button"
                disabled={item.quantity >= maxQty || isUpdating}
                onClick={() => onQuantityChange(product._id, item.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center text-taupe-600 hover:bg-taupe-50 disabled:opacity-40 disabled:cursor-not-allowed border-l border-default"
              >
                +
              </button>
            </div>

            <span className="text-base font-medium text-primary">
              {formatPrice(product.price * item.quantity)}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex flex-1 items-center gap-3">
        <Link
          href={productHref}
          className="flex-1 text-sm text-taupe-900 line-clamp-2 hover:text-primary transition-colors"
        >
          {product.name}
        </Link>

        <div className="w-24 text-center text-base font-medium text-taupe-900">
          {formatPrice(product.price)}
        </div>

        <div className="w-28 flex justify-center" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center border border-default overflow-hidden rounded-lg">
            <button
              type="button"
              disabled={item.quantity <= 1 || isUpdating}
              onClick={() => onQuantityChange(product._id, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-taupe-600 hover:bg-taupe-50 disabled:opacity-40 disabled:cursor-not-allowed border-r border-default"
            >
              −
            </button>
            <input
              type="text"
              value={item.quantity}
              readOnly
              className="w-12 h-8 text-center text-sm text-taupe-900 border-0 focus:outline-none bg-card"
            />
            <button
              type="button"
              disabled={item.quantity >= maxQty || isUpdating}
              onClick={() => onQuantityChange(product._id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-taupe-600 hover:bg-taupe-50 disabled:opacity-40 disabled:cursor-not-allowed border-l border-default"
            >
              +
            </button>
          </div>
        </div>

        <div className="w-24 text-center text-base font-medium text-primary">
          {formatPrice(product.price * item.quantity)}
        </div>

        <div className="w-8 flex justify-center">
          <button
            type="button"
            onClick={() => onRemove(product._id)}
            disabled={isUpdating}
            className="text-taupe-400 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
