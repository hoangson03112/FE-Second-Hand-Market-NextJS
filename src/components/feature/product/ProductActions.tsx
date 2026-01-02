"use client";

import React, { useState } from "react";
import { Inter } from "next/font/google";
import { useUserStore } from '@/store/useUserStore';
import { ShoppingCart, Zap, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });

interface ProductActionsProps {
  stock: number;
  actionLoading?: boolean;
  onPurchaseNow?: () => void;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
  onShare?: () => void;
}

export default function ProductActions({
  stock,
  actionLoading = false,
  onPurchaseNow,
  onAddToCart,
}: ProductActionsProps) {
  const [addedToCart, setAddedToCart] = useState(false);
  const {account} = useUserStore();

  const isOutOfStock = !stock || stock <= 0;
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart();
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  return (
    <div className={`${inter.variable} font-sans space-y-4`}>
      <button
        onClick={onPurchaseNow}
        disabled={actionLoading || isOutOfStock}
        className={cn(
          "w-full cursor-pointer group relative overflow-hidden flex justify-center items-center gap-2 py-4 px-6 bg-gradient-to-r from-primary via-primary-dark to-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        )}
      >
        <span className="relative z-10 flex items-center gap-2">
          {actionLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Đang xử lý...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>{isOutOfStock ? "Hết hàng" : account ? "Mua ngay" : "Đăng nhập để mua"}</span>
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
      <button
        onClick={handleAddToCart}
        disabled={actionLoading || isOutOfStock}
        className={cn(
          "w-full cursor-pointer py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300",
          "flex items-center justify-center gap-2",
          "border-2",
          isOutOfStock
            ? "border-gray-300 text-gray-500 cursor-not-allowed bg-gray-100"
            : addedToCart
            ? "border-green-500 bg-green-500 text-white"
            : "border-primary text-primary bg-white hover:bg-primary hover:text-white hover:border-primary shadow-sm hover:shadow-md transform hover:scale-[1.02]",
          actionLoading && "opacity-70 cursor-not-allowed"
        )}
      >
           <>
            <ShoppingCart className="w-5 h-5" />
            <span>
              {account ? (actionLoading ? "Đang thêm..." : isOutOfStock ? "Hết hàng" : "Thêm vào giỏ hàng") : "Đăng nhập để thêm vào giỏ hàng"}
            </span>
          </>
      </button>
    </div>
  );
}
