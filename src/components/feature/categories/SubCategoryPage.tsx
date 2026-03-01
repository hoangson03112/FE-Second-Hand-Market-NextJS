"use client";

import { useSubCategoryPage } from "./hooks/useSubCategoryPage";
import CategoryHeader from "./components/CategoryHeader";
import FilterBar from "./components/FilterBar";
import ProductList from "./components/ProductList";
import ErrorState from "./components/ErrorState";

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
    breadcrumbs,
    isLoading,
    error,
  } = useSubCategoryPage({ slug, subId });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-cream-50/30 to-background">
      <CategoryHeader
        category={category}
        subCategory={subCategory}
        breadcrumbs={breadcrumbs}
      />

      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        totalProducts={products?.total}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <ErrorState />
        ) : (
          <ProductList
            products={products?.data || []}
            isLoading={isLoading}
            emptyMessage="Không có sản phẩm nào trong danh mục này"
            pagination={{
              currentPage: products?.page || 1,
              totalPages: products?.totalPages || 1,
              total: products?.total || 0,
              limit: products?.limit || 20,
            }}
            onPageChange={(page: number) => {
              setFilters((prev) => ({ ...prev, page }));
            }}
          />
        )}
      </div>
    </div>
  );
}
