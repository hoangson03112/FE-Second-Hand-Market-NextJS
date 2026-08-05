"use client";

import Link from "next/link";
import { IconX } from "@tabler/icons-react";

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
    <header className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-luxury-ink pb-8">
        <div className="space-y-4">
          <nav className="flex items-center gap-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-taupe-500">
            <Link href="/" className="hover:text-luxury-ink transition-colors">
              Trang chủ
            </Link>
            <span className="w-4 h-[1px] bg-taupe-300"></span>
            <span className="text-luxury-ink">Bộ sưu tập</span>
          </nav>
          <h1
            className="text-3xl sm:text-3xl md:text-4xl font-normal text-luxury-ink"
            style={{
              fontFamily: "var(--font-droid-serif), serif",
              letterSpacing: "-0.03em",
            }}
          >
            Tất cả sản phẩm.
          </h1>
          {typeof total === "number" && (
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-taupe-400">
              {total} hiện vật
            </p>
          )}
        </div>

        {onSearchSubmit && (
          <form
            onSubmit={onSearchSubmit}
            className="w-full md:max-w-md relative"
          >
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="TÌM KIẾM..."
              className="w-full bg-transparent border-b border-foreground py-3 pr-10 text-sm font-medium uppercase tracking-[0.1em] text-luxury-ink placeholder:text-foreground focus:outline-none focus:border-luxury-ink transition-colors rounded-none"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => onSearchChange?.("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-taupe-400 hover:text-luxury-ink transition-colors"
              >
                <IconX className="w-4 h-4" stroke={1.5} />
              </button>
            )}
          </form>
        )}
      </div>
    </header>
  );
}
