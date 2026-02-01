"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { IProduct } from "@/types/product";
import ProductCard from "./ProductCard";
import Pagination from "@/components/ui/Pagination";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
}

interface ProductListProps {
  products: IProduct[];
  isLoading?: boolean;
  emptyMessage?: string;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
}

export default function ProductList({
  products,
  isLoading = false,
  emptyMessage = "Không tìm thấy sản phẩm nào",
  pagination,
  onPageChange,
}: ProductListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className={cn("bg-white rounded-2xl overflow-hidden", "border border-default", "animate-shimmer")}>
            <div className="aspect-square bg-neutral-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="h-6 bg-neutral-200 rounded w-1/2" />
              <div className="h-3 bg-neutral-200 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-bold text-neutral-900 mb-2">{emptyMessage}</h3>
        <p className="text-neutral-600">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {pagination && pagination.totalPages > 1 && onPageChange && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
}
