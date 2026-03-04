"use client";

import { IconMapPin, IconEye, IconPackage } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { IProduct } from "@/types/product";
import { formatPrice } from "@/utils/format/price";
import { getProvinceName } from "@/utils";

interface ProductCardProps {
  product: IProduct;
}

const CONDITION_LABEL: Record<string, { label: string; color: string }> = {
  new: {
    label: "Mới",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  like_new: {
    label: "Như mới",
    color: "bg-sky-100 text-sky-700 border-sky-200",
  },
  good: { label: "Tốt", color: "bg-blue-100 text-blue-700 border-blue-200" },
  fair: { label: "Khá", color: "bg-amber-100 text-amber-700 border-amber-200" },
  poor: { label: "Cũ", color: "bg-taupe-100 text-taupe-600 border-taupe-200" },
};

export default function ProductCard({ product }: ProductCardProps) {
  const provinceDisplay = getProvinceName(product.seller?.from_province_id);
  const condition = CONDITION_LABEL[product.condition ?? ""];

  return (
    <Link
      href={`/products/${product._id}/${product?.slug}`}
      className={cn(
        "group relative flex flex-col bg-white overflow-hidden",
        "border border-border/50 hover:border-primary/30 rounded-2xl",
        "hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300",
        "animate-scale-in",
      )}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-taupe-50 to-cream-50">
        {product.avatar?.url || product.images?.[0]?.url ? (
          <Image
            src={product.avatar?.url ?? product.images?.[0]?.url ?? "/file.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconPackage
              className="w-16 h-16 text-taupe-300"
              strokeWidth={1.5}
            />
          </div>
        )}

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {condition && (
            <span
              className={cn(
                "px-2.5 py-1 rounded-lg border text-[11px] font-bold tracking-wide backdrop-blur-md bg-white/90 shadow-sm",
                condition.color,
              )}
            >
              {condition.label}
            </span>
          )}
          {(product.stock ?? 0) === 1 && (
            <span className="px-2.5 py-1 rounded-lg bg-red-500 text-white text-[11px] font-bold tracking-wide backdrop-blur-md shadow-sm">
              Còn 1
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-[15px] font-semibold text-taupe-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-[1.4] min-h-[42px]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mb-3">
          {product.hasPersonalDiscount && product.originalPrice ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary leading-none">
                  {formatPrice(product.price)}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-red-500 rounded-md">
                  DEAL
                </span>
              </div>
              <span className="text-sm text-taupe-400 line-through leading-none">
                {formatPrice(product.originalPrice)}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-primary leading-none">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Meta info */}
        <div className="flex items-center justify-between text-[12px] text-taupe-400 mt-auto pt-3 border-t border-taupe-100">
          {provinceDisplay && (
            <div className="flex items-center gap-1">
              <IconMapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
              <span className="max-w-[100px] truncate">{provinceDisplay}</span>
            </div>
          )}
          {(product.views ?? 0) > 0 && (
            <div className="flex items-center gap-1 ml-auto">
              <IconEye className="w-3.5 h-3.5" strokeWidth={2} />
              <span>{product.views}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
