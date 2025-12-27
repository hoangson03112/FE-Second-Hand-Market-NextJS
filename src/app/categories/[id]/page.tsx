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
    id: string;
  }>;
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const { id } = use(params);
  const [filters, setFilters] = useState<IProductFilters>({
    category: id,
    sortBy: "newest",
    limit: 20,
    page: 1,
  });

  // Fetch category info
  const { data: categoryData } = useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const response = await CategoryService.getAll();
      return response.data.data.find(
        (cat: { _id: string }) => cat._id === id
      );
    },
  });

  // Fetch products
  const {
    data: productsData,
    isLoading,
    error,
  } = useProductsByCategory(id, {
    sortBy: filters.sortBy,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    condition: filters.condition,
    limit: filters.limit,
    page: filters.page,
  });
  console.log(productsData);
  
  const breadcrumbs = categoryData
    ? [
        {
          label: "Danh mục",
          href: "/categories",
        },
        {
          label: categoryData.name,
          href: `/categories/${id}`,
        },
      ]
    : undefined;

  return (
    <div className="min-h-screen bg-white">
      <CategoryHeader category={categoryData} breadcrumbs={breadcrumbs} />

      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        totalProducts={productsData?.total}
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
          />
        )}
      </div>
    </div>
  );
}
  