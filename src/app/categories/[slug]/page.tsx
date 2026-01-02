"use client";

import React, { useState, use } from "react";
import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "@/services/category.service";
import { useProductsByCategory } from "@/hooks/useProducts";
import { IProductFilters } from "@/types/product";
import CategoryHeader from "@/components/feature/categories/CategoryHeader";
import FilterBar from "@/components/feature/categories/FilterBar";
import ProductList from "@/components/feature/categories/ProductList";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const [filters, setFilters] = useState<IProductFilters>({
    categorySlug: slug,
    sortBy: "newest",
    limit: 20,
    page: 1,
  });

  // Fetch category info
  const { data: categoryData } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const response = await CategoryService.getAll();
      return response.data.find(
        (cat: { slug: string }) => cat.slug === slug
      );
    },
  });

  // Fetch products
  const {
    data: productsData,
    isLoading,
    error,
  } = useProductsByCategory(slug, {
    sortBy: filters.sortBy,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    condition: filters.condition,
    limit: filters.limit,
    page: filters.page,
  });

  const breadcrumbs = categoryData
    ? [
        {
          label: "Danh mục",
          href: "/categories",
        },
        {
          label: categoryData.name,
          href: `/categories/${slug}`,
        },
      ]
    : undefined;

  return (
    <div className="min-h-screen bg-white">
      <CategoryHeader category={categoryData} breadcrumbs={breadcrumbs} />

      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        totalProducts={productsData?.length}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              Có lỗi xảy ra
            </h3>
            <p className="text-neutral-600">
              Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.
            </p>
          </div>
        ) : (
          <ProductList
            products={productsData || []}
            isLoading={isLoading}
            emptyMessage="Không có sản phẩm nào trong danh mục này"
            pagination={{
              currentPage: productsData?.page || 1,
              totalPages: productsData?.totalPages || 1,
              total: productsData?.total || 0,
              limit: productsData?.limit || 20,
            }}
            onPageChange={(page) => {
              setFilters((prev) => ({ ...prev, page }));
            }}
          />
        )}
      </div>
    </div>
  );
}
  