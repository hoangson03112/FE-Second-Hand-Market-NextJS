"use client";

import Link from "next/link";
import { IconHome, IconChevronRight } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";

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
    <div className="relative bg-background border-b border-taupe-200/50">
      <div className="relative max-w-8xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10 pb-12 md:pt-14 md:pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-taupe-500 mb-8 uppercase tracking-widest font-medium">
          <Link href="/" className="hover:text-luxury-ink transition-colors">
            Trang chủ
          </Link>
          <IconChevronRight className="w-3.5 h-3.5 text-taupe-300" />
          <span className="text-luxury-ink">Tất cả sản phẩm</span>
        </nav>

        {/* Title */}
        <div className="max-w-3xl mb-12">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl text-luxury-ink mb-4"
            style={{
              fontFamily: "var(--font-droid-serif), serif",
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Tất cả <span className="italic text-accent">sản phẩm</span>
          </h1>
          <p className="text-lg text-taupe-500 max-w-xl font-light leading-relaxed">
            {total !== undefined
              ? `Khám phá bộ sưu tập ${total.toLocaleString("vi-VN")} sản phẩm second-hand được tuyển chọn kỹ lưỡng.`
              : "Khám phá bộ sưu tập hàng ngàn sản phẩm second-hand được tuyển chọn kỹ lưỡng."}
          </p>
        </div>

        {/* Search bar */}
        {onSearchSubmit && (
          <form onSubmit={onSearchSubmit} className="max-w-2xl">
            <div className="relative group">
              <svg
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-taupe-400 group-focus-within:text-luxury-ink transition-colors pointer-events-none z-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Tìm kiếm sản phẩm yêu thích..."
                className="w-full h-14 pl-14 pr-32 rounded-full border border-taupe-200 bg-white/50 backdrop-blur-sm focus-visible:border-luxury-ink focus-visible:ring-0 text-[15px] text-luxury-ink placeholder:text-taupe-400 shadow-sm transition-all hover:bg-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 rounded-full bg-luxury-ink text-background text-sm font-medium uppercase tracking-wider hover:scale-[1.02] hover:shadow-md transition-all active:scale-95"
              >
                Tìm
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
