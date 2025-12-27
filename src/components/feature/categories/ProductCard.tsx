"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { IProduct } from "@/types/product";

interface ProductCardProps {
  product: IProduct;
}

const conditionLabels: Record<string, string> = {
  new: "Mới",
  like_new: "Như mới",
  good: "Tốt",
  fair: "Khá",
  poor: "Cũ",
};

const conditionColors: Record<string, string> = {
  new: "bg-success text-white",
  like_new: "bg-success-light text-success-dark",
  good: "bg-info-light text-info-dark",
  fair: "bg-warning-light text-warning-dark",
  poor: "bg-neutral-200 text-neutral-700",
};

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getLocation = () => {
    // Check if location is directly on product (from BE)
    if (product.location) {
      return product.location;
    }
    // Fallback to seller province if available
    if (product.seller?.province) {
      return product.seller.province;
    }
    return "Chưa cập nhật";
  };

  return (
    <Link
      href={`/products/${product._id}`}
      className={cn(
        "group relative bg-white rounded-xl overflow-hidden",
        "border border-default hover:border-primary",
        "shadow-sm hover:shadow-lg transition-all duration-300",
        "flex flex-col h-full"
      )}
    >
      {/* Image Container - Full width, no white spaces */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200">
        {product.avatar?.url ? (
          <>
            <Image
              src={product.avatar.url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={true}
            />
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-30">📦</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.condition && (
            <span
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm",
                "shadow-md border border-white/20",
                conditionColors[product.condition] || conditionColors.good
              )}
            >
              {conditionLabels[product.condition] || product.condition}
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-error/90 text-white backdrop-blur-sm shadow-md">
              Hết hàng
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 shadow-lg hover:scale-110"
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

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-4">
        {/* Product Name */}
        <h3 className="text-base font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200 min-h-[3rem]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mb-3">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Meta Information */}
        <div className="mt-auto space-y-2 pt-2 border-t border-default">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-tertiary">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate">{getLocation()}</span>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between text-xs text-tertiary">
            {/* Views */}
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>{product.views || 0}</span>
            </div>

            {/* Likes */}
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{product.likes || 0}</span>
            </div>

            {/* Stock indicator */}
            {product.stock > 0 && (
              <div className="flex items-center gap-1 text-success">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Còn hàng</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

