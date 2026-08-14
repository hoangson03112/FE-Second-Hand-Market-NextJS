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
            <Skeleton className="aspect-[3/4] w-full rounded-none bg-charcoal-200/50" />
            <div className="space-y-3 pt-2">
              <Skeleton className="h-3 w-full rounded-none bg-charcoal-200/50" />
              <Skeleton className="h-3 w-2/3 rounded-none bg-charcoal-200/50" />
              <Skeleton className="h-4 w-1/3 mt-4 rounded-none bg-charcoal-200/50" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center border-t border-b border-taupe-200/60 my-8">
        <span className="font-serif text-3xl mb-6 italic text-charcoal-400">
          Trống
        </span>
        <h3 className="text-xs font-bold uppercase tracking-[0.13em] text-luxury-ink mb-2">
          {emptyMessage}
        </h3>
        <p className="text-xs uppercase tracking-[0.1em] text-charcoal-500">
          Vui lòng tinh chỉnh lại bộ lọc hoặc từ khóa.
        </p>
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
        <div className="border-t border-luxury-ink/10 py-10">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between md:gap-6">
            <p className="order-2 text-[11px] font-bold uppercase tracking-[0.2em] text-charcoal-400 md:order-1 md:w-44">
              Trang{" "}
              <span className="text-luxury-ink">
                {String(pagination.currentPage).padStart(2, "0")}
              </span>{" "}
              <span className="text-luxury-ink/25">/</span>{" "}
              {String(Math.max(1, pagination.totalPages)).padStart(2, "0")}
            </p>

            <Pagination
              variant="luxury"
              className="order-1 md:order-2"
              currentPage={pagination.currentPage}
              totalPages={Math.max(1, pagination.totalPages)}
              onPageChange={onPageChange}
            />

            {pagination.total > 0 && (
              <p className="order-3 text-[11px] font-bold uppercase tracking-[0.2em] text-charcoal-400 md:w-44 md:text-right">
                <span className="text-luxury-ink">
                  {pagination.total.toLocaleString("vi-VN")}
                </span>{" "}
                sản phẩm
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
