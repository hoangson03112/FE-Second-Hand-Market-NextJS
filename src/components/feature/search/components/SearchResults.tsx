"use client";

import { ProductList } from "@/components/feature/categories";
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
      <div className="flex gap-4 mb-6">
        <select
          value={filters.sortBy}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              sortBy: e.target.value as IProductFilters["sortBy"],
              page: 1,
            })
          }
          className="px-4 py-2 rounded-lg border border-border bg-background text-sm"
        >
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="price_low">Giá thấp đến cao</option>
          <option value="price_high">Giá cao đến thấp</option>
          <option value="popular">Phổ biến</option>
        </select>
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
