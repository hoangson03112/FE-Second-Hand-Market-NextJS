"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { IProduct } from "@/types/product";
import { MapPin } from "lucide-react";
import { formatPrice } from "@/utils/format/price";
import { getProvinceName } from "@/utils";

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const provinceDisplay = getProvinceName(product.seller?.from_province_id);
  return (
    <Link
      href={`/products/${product._id}/${product?.slug}`}
      className={cn(
        "group relative bg-cream-50 overflow-hidden",
        "border border-taupe-200 hover:border-taupe-400",
        "hover:shadow-md transition-all duration-200",
        "animate-scale-in",
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-taupe-100">
        <Image
          src={product.avatar?.url ?? product.images?.[0]?.url ?? "/file.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {(product.stock ?? 0) === 1 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-blush-500 text-cream-50 text-[11px] font-black uppercase tracking-[0.08em]">
            Chỉ còn 1
          </span>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="w-8 h-8 bg-cream-50/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm border border-taupe-200"
            onClick={(e) => e.preventDefault()}
            aria-label="Thêm vào yêu thích"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-3 border-t border-taupe-100">
        <h3 className="text-sm text-taupe-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-base font-medium text-primary">
            {formatPrice(product.price)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-taupe-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-blush-400" />
            <span>{provinceDisplay}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
