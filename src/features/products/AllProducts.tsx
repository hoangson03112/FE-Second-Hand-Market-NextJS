"use client";

import { useAllProducts } from "./hooks/useAllProducts";
import { useProvinces } from "@/hooks/useGHNLocation";
import AllProductsHeader from "./components/AllProductsHeader";
import FilterSidebar from "./components/FilterSidebar";
import { ProductList } from "@/features/categories/components";

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
  return (
    <div className="max-w-9xl mx-auto flex-1 w-full min-h-screen  text-luxury-ink  selection:text-background flex flex-col font-sans">
      <AllProductsHeader total={total} />

      <div className="max-w-9xl flex-1 w-full mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row items-start relative">
          <aside className="hidden lg:block w-72 shrink-0 sticky top-12 pr-12 lg:border-r border-taupe-200/60 min-h-[80vh]">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              provinces={provinces}
            />
          </aside>

          <main className="flex-1 min-w-0 w-full lg:pl-12">
            {error ? (
              <div className="py-32 flex flex-col items-center justify-center text-center border-t border-b border-taupe-200/60 mt-8">
                <span className="font-serif text-4xl mb-4 italic text-charcoal-600">
                  Lỗi Hệ Thống
                </span>
                <p className="text-xs uppercase tracking-[0.15em] text-charcoal-500">
                  Không thể truy xuất dữ liệu lúc này.
                </p>
              </div>
            ) : (
              <ProductList
                products={products}
                isLoading={isLoading}
                emptyMessage="Không có vật phẩm nào được tìm thấy."
                pagination={{
                  currentPage,
                  totalPages,
                  total,
                  limit: filters.limit || 16,
                }}
                onPageChange={(page) =>
                  setFilters((prev) => ({ ...prev, page }))
                }
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
