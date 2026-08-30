"use client";

import { useSubCategoryPage } from "./hooks/useSubCategoryPage";
import ProductList from "./components/ProductList";
import AllProductsHeader from "@/features/product-list/components/AllProductsHeader";
import FilterSidebar from "@/features/product-list/components/FilterSidebar";
import { useProvinces } from "@/hooks/useGHNLocation";

interface SubCategoryPageProps {
  slug: string;
  subId: string;
}

export default function SubCategoryPage({ slug, subId }: SubCategoryPageProps) {
  const {
    filters,
    setFilters,
    category,
    subCategory,
    products,
    isLoading,
    error,
  } = useSubCategoryPage({ slug, subId });

  const { data: provinces = [] } = useProvinces();

  return (
    <div className="min-h-screen bg-luxury-ivory text-luxury-ink mx-auto w-full max-w-9xl">
      <AllProductsHeader
        total={products?.total}
        title={subCategory?.name || category?.name || "Danh mục"}
        breadcrumbLabel={category?.name || "Danh mục"}
      />

      <div className=" flex-1 px-4 sm:px-8 lg:px-12">
        <div className="relative flex flex-col items-start lg:flex-row">
          <aside className="top-12 hidden min-h-[80vh] w-72 shrink-0 border-taupe-200/60 pr-12 lg:block lg:border-r">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              provinces={provinces}
              resultCount={products?.total}
            />
          </aside>

          <main className="w-full min-w-0 flex-1 lg:pl-12">
            {error ? (
              <div className="mt-8 flex flex-col items-center justify-center border-t border-b border-taupe-200/60 py-32 text-center">
                <span className="mb-4 font-serif text-4xl italic text-charcoal-600">
                  Lỗi Hệ Thống
                </span>
                <p className="text-xs uppercase tracking-[0.15em] text-charcoal-500">
                  Không thể truy xuất dữ liệu lúc này.
                </p>
              </div>
            ) : (
              <ProductList
                products={products?.data || []}
                isLoading={isLoading}
                emptyMessage="Không có sản phẩm nào trong danh mục này"
                pagination={{
                  currentPage: products?.page || 1,
                  totalPages: products?.totalPages || 1,
                  total: products?.total || 0,
                  limit: products?.limit || 12,
                }}
                onPageChange={(page: number) => {
                  setFilters((prev) => ({ ...prev, page }));
                }}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
