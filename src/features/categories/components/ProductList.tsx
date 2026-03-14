"use client";

import React from "react";
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl overflow-hidden border border-border/60 animate-pulse">
            <div className="aspect-square bg-taupe-100" />
            <div className="p-3 space-y-2">
              <div className="h-3.5 bg-taupe-100 rounded-md w-full" />
              <div className="h-3.5 bg-taupe-100 rounded-md w-2/3" />
              <div className="h-5 bg-taupe-100 rounded-md w-1/2 mt-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-2xl bg-taupe-100 flex items-center justify-center text-4xl mb-5 shadow-sm">
          🔍
        </div>
        <h3 className="text-lg font-bold text-taupe-900 mb-1.5">{emptyMessage}</h3>
        <p className="text-sm text-taupe-500 max-w-xs">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 relative z-0">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {pagination && onPageChange && (
        <div className="mt-10 flex flex-col items-center gap-4">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={Math.max(1, pagination.totalPages)}
            onPageChange={onPageChange}
          />
          <p className="text-sm text-taupe-500">
            Trang {pagination.currentPage} / {Math.max(1, pagination.totalPages)}
            {pagination.total > 0 && ` · ${pagination.total.toLocaleString()} sản phẩm`}
          </p>
        </div>
      )}
    </>
  );
}
