/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Inter } from "next/font/google";
import { formatPrice } from "@/utils/format/price";
import { IProduct } from "@/types/product";
import { MapPin, Star } from "lucide-react";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });

interface ProductInfoProps {
  product: IProduct;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export default function ProductInfo({
  product,
  quantity,
  onQuantityChange,
}: ProductInfoProps) {
  return (
    <div className={`${inter.variable} font-sans space-y-6`}>
      {/* Title & Badges */}
      <div className="space-y-4">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
          {product?.name || "Đang tải thông tin sản phẩm..."}
        </h1>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 rounded-xl text-sm font-semibold bg-green-100 text-green-700 border border-green-200">
            {product.condition || "Mới"}
          </span>
          <span
            className={`px-3 py-1.5 rounded-xl text-sm font-semibold border ${
              product.stock > 0
                ? "bg-blue-100 text-blue-700 border-blue-200"
                : "bg-red-100 text-red-700 border-red-200"
            }`}
          >
            Còn {product.stock || 0} sản phẩm
          </span>
          {product.category && (
            <span className="px-3 py-1.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 bg-white">
              {typeof product.category === "object"
                ? product.category.name
                : product.category}
            </span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-4xl lg:text-5xl font-bold text-red-600">
            {product.price ? formatPrice(product.price) : "Liên hệ"}
          </span>
        </div>

        <div className="flex items-center gap-4 mt-4 flex-wrap">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">
              {product.seller?.province || "Chưa xác định"}
            </span>
          </div>
      
        </div>
      </div>
      {/* Quantity */}
      <div className="">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-gray-900">Số lượng:</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || !product.stock}
              className="cursor-pointer w-11 h-11 rounded-xl border-2 border-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:border-primary hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span className="text-xl font-medium">−</span>
            </button>
            <span className="text-xl font-medium text-orange-600 min-w-[50px] text-center bg-white px-4 py-2 rounded-xl border-2 border-gray-200">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              disabled={quantity >= (product.stock || 0) || !product.stock}
              className="cursor-pointer w-11 h-11 rounded-xl border-2 border-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:border-primary hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span className="text-xl font-medium">+</span>
            </button>
          </div>
        </div>
      </div>
      {/* Product Details */}
      {(product.category || product.subcategory) && (
        <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Thông tin sản phẩm
          </h3>
          <div className="space-y-3">
            {product.category && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-600 font-medium">Danh mục:</span>
                <span className="text-sm font-medium text-gray-900">
                  {typeof product.category === "object"
                    ? product.category.name
                    : product.category}
                </span>
              </div>
            )}
            {product.subcategory && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-600 font-medium">Danh mục con:</span>
                <span className="text-sm font-medium text-gray-900">
                  {typeof product.subcategory === "object"
                    ? product.subcategory.name
                    : product.subcategory}
                </span>
              </div>
            )}
          </div>
        </div>
      )}



      {product.stock && product.stock < 10 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-2xl">
          <p className="text-sm text-yellow-800 font-semibold">
            ⚡ Chỉ còn {product.stock} sản phẩm!
          </p>
        </div>
      )}

      {/* Trust Badges */}
      <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-green-600 text-sm">✓</span>
            <span className="text-xs font-semibold">Thanh toán bảo mật</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-blue-600 text-sm">✓</span>
            <span className="text-xs font-semibold">Đổi trả 7 ngày</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-primary text-sm">✓</span>
            <span className="text-xs font-semibold">Chính hãng 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
