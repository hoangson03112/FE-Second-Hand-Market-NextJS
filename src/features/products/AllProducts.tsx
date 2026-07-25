"use client";

import { useState } from "react";
import { useAllProducts } from "./hooks/useAllProducts";
import { useProvinces } from "@/hooks/useGHNLocation";
import AllProductsHeader from "./components/AllProductsHeader";
import FilterBar from "@/features/categories/components/FilterBar";
import FilterSidebar from "./components/FilterSidebar";
import { ProductList } from "@/features/categories/components";
import { Background } from "@/components/shared";

export default function AllProducts() {
  const {
    filters,
    setFilters,
    products,
    total,
    totalPages,
    currentPage,
    isLoading,
    error,
  } = useAllProducts();

  const { data: provinces = [] } = useProvinces();

  const [searchInput, setSearchInput] = useState(filters.search || "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchInput || undefined, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AllProductsHeader
        total={total}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        totalProducts={total}
        provinces={provinces}
      />

      <div className="flex-1 max-w-8xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Left sidebar ── */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-28">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              provinces={provinces}
            />
          </aside>

          {/* ── Product grid ── */}
          <main className="flex-1 min-w-0 w-full">
            {error ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-taupe-100 flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
                <h3 className="text-lg font-bold text-luxury-ink mb-1.5">Không thể tải sản phẩm</h3>
                <p className="text-sm text-taupe-500">Vui lòng thử lại sau</p>
              </div>
            ) : (
              <ProductList
                products={products}
                isLoading={isLoading}
                emptyMessage="Không tìm thấy sản phẩm nào"
                pagination={{ currentPage, totalPages, total, limit: filters.limit || 15 }}
                onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
              />
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
