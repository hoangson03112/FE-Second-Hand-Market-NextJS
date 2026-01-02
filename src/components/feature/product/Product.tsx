"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Inter } from "next/font/google";
import { Background } from "@/components/ui";
import ProductImageGallery from "./ProductImageGallery";
import ProductInfo from "./ProductInfo";
import ProductActions from "./ProductActions";
import SellerInfo from "./SellerInfo";
import ProductTabs from "./ProductTabs";
import { useProduct } from "@/hooks/useProducts";
import { useUserStore } from "@/store/useUserStore";
  import {  useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });

export default function Product({id}: {id: string}) {
  const { data: product, isLoading, error } = useProduct(id);
  const [quantity, setQuantity] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const {account} = useUserStore();
  const router= useRouter();
  const handleQuantityChange = useCallback(
    (newQuantity: number) => {
      if (newQuantity > 0 && newQuantity <= (product?.stock || 0)) {
        setQuantity(newQuantity);
      } 
    },
    [product?.stock]
  );

  const handlePurchaseNow = useCallback(async () => {
    if (!account) {
      router.push("/login");
        return;
      }
  }, [account, router]);

  const handleAddToCart = useCallback(async () => {
    if (!account) {
      router.push("/login");
      return;
    }
  }, [account, router]);

  const handleOpenChat = useCallback(async () => {
    try {
      console.log("Open chat with seller:", product?.seller?._id);
    } catch (error) {
      console.error("Error opening chat:", error);
    }
  }, [product?.seller?._id]);

  // Loading state
  if (isLoading) {
    return (
      <Background className={`${inter.variable} font-sans flex flex-col`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải thông tin sản phẩm...</p>
            </div>
          </div>
        </div>
      </Background>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <Background className={`${inter.variable} font-sans flex flex-col`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">
                {error ? "Không thể tải thông tin sản phẩm" : "Sản phẩm không tồn tại"}
              </p>
              <button
                onClick={() => router.back()}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </Background>
    );
  }

  return (
    <Background className={`${inter.variable} font-sans flex flex-col`}>
      {/* Breadcrumb */}
      <div className="mt-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Trang chủ
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link
              href="/categories"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Danh mục
            </Link>
            {product.category && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <Link
                  href={`/categories/${
                    typeof product.category === "object"
                      ? product.category.slug
                      : product.category
                  }`}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {typeof product.category === "object"
                    ? product.category.name
                    : product.category}
                </Link>
              </>
            )}
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-semibold truncate max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Product Images & Info */}
          <div className="lg:col-span-9 space-y-6">
            {/* Main Product Card */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                {/* Image Gallery */}
                <div className="md:col-span-7 p-6 lg:p-8">
                  <ProductImageGallery
                    images={product.images || [product.avatar]}
                    productName={product.name}
                  />
                </div>

                {/* Product Info */}
                <div className="md:col-span-5 p-6 lg:p-8 bg-gray-50/30">
                  <ProductInfo
                    product={product}
                    quantity={quantity}
                    onQuantityChange={handleQuantityChange}
                  />

                  {/* Action Buttons */}
                  <div className="mt-8">
                    <ProductActions
                      stock={product.stock || 0}
                      actionLoading={actionLoading}
                      onPurchaseNow={handlePurchaseNow}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Tabs */}
            <ProductTabs product={product} />
          </div>

          {/* Seller Info Sidebar */}
          <div className="lg:col-span-3">
            <SellerInfo seller={product.seller} onChatClick={handleOpenChat} />
          </div>
        </div>
      </div>
    </Background>
  );
}
