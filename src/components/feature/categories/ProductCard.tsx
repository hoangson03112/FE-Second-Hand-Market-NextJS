"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { IProduct } from "@/types/product";
import { MapPin } from "lucide-react";
import { formatPrice } from "@/utils/format/price";

interface ProductCardProps {
  product: IProduct;
}


export default function ProductCard({ product }: ProductCardProps) {


  return (
    <Link
      href={`/products/${product._id}/${product?.slug}`}
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden",
        "border border-default hover-border-primary",
        "hover-lift transition-all duration-300",
        "animate-scale-in"
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
  
          <Image
            src={product.avatar.url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
      
        {/* Quick Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-md"
            onClick={(e) => {
              e.preventDefault();
              // Handle favorite
            }}
            aria-label="Thêm vào yêu thích"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-tertiary">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-red-500"/>
            <span>{product.seller.province || "Chưa cập nhật"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

