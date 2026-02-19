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
        "group relative bg-cream-50 rounded-2xl overflow-hidden",
        "border border-default hover-border-primary",
        "hover-lift transition-all duration-300",
        "animate-scale-in",
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={product.avatar?.url ?? product.images?.[0]?.url ?? "/file.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {(product.stock ?? 0) === 1 && (
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-amber-500/90 text-white text-xs font-medium">
            Chỉ còn 1
          </span>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="w-10 h-10 rounded-full bg-cream-50/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-md"
            onClick={(e) => e.preventDefault()}
            aria-label="Thêm vào yêu thích"
          >
            <svg
              className="w-5 h-5"
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
      <div className="p-4">
        <h3 className="text-base font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-tertiary">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-red-500" />
            <span>{provinceDisplay}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
