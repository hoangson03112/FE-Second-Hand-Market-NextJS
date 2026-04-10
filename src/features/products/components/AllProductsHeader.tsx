"use client";

import Link from "next/link";
import { IconHome, IconChevronRight } from "@tabler/icons-react";

interface AllProductsHeaderProps {
  total?: number;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  onSearchSubmit?: (e: React.FormEvent) => void;
}

export default function AllProductsHeader({
  total,
  searchValue = "",
  onSearchChange,
  onSearchSubmit,
}: AllProductsHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-taupe-50 via-cream-50 to-white border-b border-taupe-200/80">
      {/* Decorative blobs */}
      <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-accent/5 blur-2xl pointer-events-none" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-taupe-400 mb-5">
          <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
            <IconHome className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <IconChevronRight className="w-3 h-3 text-taupe-300" />
          <span className="text-taupe-700 font-medium">Tất cả sản phẩm</span>
        </nav>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-taupe-900 mb-1.5 leading-[1.1] tracking-tight">
          Tất cả sản phẩm
        </h1>
        <p className="text-sm text-taupe-400 mb-5">
          {total !== undefined
            ? `Khám phá ${total.toLocaleString("vi-VN")} sản phẩm second-hand chất lượng`
            : "Khám phá hàng ngàn sản phẩm second-hand chất lượng"}
        </p>

        {/* Search bar */}
        {onSearchSubmit && (
          <form onSubmit={onSearchSubmit} className="max-w-xl">
            <div className="relative">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe-300 pointer-events-none"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full h-11 pl-10 pr-28 rounded-2xl border-2 border-taupe-200 bg-white focus:border-primary focus:outline-none text-sm text-taupe-800 placeholder:text-taupe-300 shadow-sm transition-colors"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 h-8 px-4 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm"
              >
                Tìm kiếm
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
