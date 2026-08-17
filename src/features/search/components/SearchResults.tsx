"use client";

import { ProductList } from "@/features/categories/components";
import type { IProduct, IProductFilters } from "@/types/product";

interface SearchResultsProps {
  query: string;
  filters: IProductFilters;
  onFilterChange: (filters: IProductFilters) => void;
  products: IProduct[];
  isLoading: boolean;
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "price_low", label: "Giá thấp đến cao" },
  { value: "price_high", label: "Giá cao đến thấp" },
  { value: "popular", label: "Phổ biến" },
];

export default function SearchResults({
  query,
  filters,
  onFilterChange,
  products,
  isLoading,
  total,
  currentPage,
  totalPages,
  limit,
}: SearchResultsProps) {
  return (
    <>
      <div className="mb-8 flex items-center justify-between gap-4">
        <p className="hidden text-xs uppercase tracking-[0.14em] text-taupe-400 sm:block">
          Sắp xếp theo
        </p>
        <div className="relative ml-auto">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                sortBy: e.target.value as IProductFilters["sortBy"],
                page: 1,
              })
            }
            className="h-10 appearance-none border border-luxury-ink/15 bg-white py-2 pl-4 pr-9 text-[13px] font-medium text-luxury-ink outline-none transition-colors duration-300 hover:border-luxury-ink/25 focus:border-luxury-champagne"
            style={{ borderRadius: "2px" }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-taupe-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <ProductList
        products={products}
        isLoading={isLoading}
        emptyMessage={`Không tìm thấy sản phẩm cho "${query}"`}
        pagination={{
          currentPage,
          totalPages,
          total,
          limit,
        }}
        onPageChange={(page) => onFilterChange({ ...filters, page })}
      />
    </>
  );
}
