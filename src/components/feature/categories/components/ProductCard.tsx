"use client";

import { IconMapPin, IconHeart } from "@tabler/icons-react";
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
  new:      { label: "Mới",     color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  like_new: { label: "Như mới", color: "bg-sky-100 text-sky-700 border-sky-200" },
  good:     { label: "Tốt",     color: "bg-blue-100 text-blue-700 border-blue-200" },
  fair:     { label: "Khá",     color: "bg-amber-100 text-amber-700 border-amber-200" },
  poor:     { label: "Cũ",      color: "bg-taupe-100 text-taupe-600 border-taupe-200" },
};

export default function ProductCard({ product }: ProductCardProps) {
  const provinceDisplay = getProvinceName(product.seller?.from_province_id);
  const condition = CONDITION_LABEL[product.condition ?? ""];

  return (
    <Link
      href={`/products/${product._id}/${product?.slug}`}
      className={cn(
        "group relative flex flex-col bg-white overflow-hidden",
        "border border-border/60 hover:border-primary/40 rounded-2xl",
        "hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300",
        "animate-scale-in",
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-taupe-50/60 rounded-t-2xl shrink-0">
        <Image
          src={product.avatar?.url ?? product.images?.[0]?.url ?? "/file.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges top-left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {condition && (
            <span className={cn(
              "px-2 py-0.5 rounded-md border text-[10px] font-bold leading-none backdrop-blur-sm bg-white/80",
              condition.color
            )}>
              {condition.label}
            </span>
          )}
          {(product.stock ?? 0) === 1 && (
            <span className="px-2 py-0.5 rounded-md bg-red-500/90 text-white text-[10px] font-bold leading-none backdrop-blur-sm">
              Còn 1
            </span>
          )}
        </div>

        {/* Wishlist btn */}
        <button
          className={cn(
            "absolute top-2.5 right-2.5",
            "w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-white/60 shadow",
            "flex items-center justify-center",
            "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200",
            "hover:bg-red-50 hover:border-red-200 hover:text-red-500",
          )}
          onClick={(e) => e.preventDefault()}
          aria-label="Yêu thích"
        >
          <IconHeart className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3">
        <h3 className="text-sm font-medium text-taupe-900 mb-2.5 line-clamp-2 group-hover:text-primary transition-colors leading-snug flex-1">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-base font-bold text-primary leading-none">
            {formatPrice(product.price)}
          </span>
          {provinceDisplay && (
            <div className="flex items-center gap-0.5 text-[11px] text-taupe-400">
              <IconMapPin className="w-3 h-3" />
              <span className="max-w-[80px] truncate">{provinceDisplay}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
