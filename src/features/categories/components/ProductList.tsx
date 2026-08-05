"use client";

import React from "react";
import { IProduct } from "@/types/product";
import ProductCard from "./ProductCard";
import { Pagination, Skeleton } from "@/components/shared";

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
  emptyMessage = "Không có vật phẩm nào được tìm thấy",
  pagination,
  onPageChange,
}: ProductListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-12">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="flex flex-col space-y-4">
            <Skeleton className="aspect-[3/4] w-full rounded-none bg-taupe-200/50" />
            <div className="space-y-3 pt-2">
              <Skeleton className="h-3 w-full rounded-none bg-taupe-200/50" />
              <Skeleton className="h-3 w-2/3 rounded-none bg-taupe-200/50" />
              <Skeleton className="h-4 w-1/3 mt-4 rounded-none bg-taupe-200/50" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center border-t border-b border-taupe-200/60 my-8">
        <span className="font-serif text-3xl mb-6 italic text-taupe-400">Trống</span>
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-luxury-ink mb-2">{emptyMessage}</h3>
        <p className="text-[10px] uppercase tracking-[0.1em] text-taupe-500">Vui lòng tinh chỉnh lại bộ lọc hoặc từ khóa.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 relative z-0">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {pagination && onPageChange && (
        <div className="mt-24 flex flex-col items-center gap-6 border-t border-taupe-200/60 pt-12">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={Math.max(1, pagination.totalPages)}
            onPageChange={onPageChange}
          />
          <p className="text-[10px] uppercase tracking-[0.2em] text-taupe-400 font-medium">
            Trang {pagination.currentPage} / {Math.max(1, pagination.totalPages)}
            {pagination.total > 0 && ` — ${pagination.total.toLocaleString("vi-VN")} HIỆN VẬT`}
          </p>
        </div>
      )}
    </>
  );
}