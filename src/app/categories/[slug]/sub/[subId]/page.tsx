"use client";

import { useState, use } from "react";
import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "@/services/category.service";
import { useProductsBySubCategory } from "@/hooks/useProducts";
import { IProductFilters } from "@/types/product";
import { CategoryHeader, FilterBar, ProductList } from "@/components/feature/categories";

type SubCategoryPageProps = {
  params: Promise<{
    slug: string;
    subId: string;
  }>;
};

export default function SubCategoryPage({ params }: SubCategoryPageProps) {
  const { slug, subId } = use(params);
  const [filters, setFilters] = useState<IProductFilters>({
    category: slug,
    subCategory: subId,
    sortBy: "newest",
    limit: 20,
    page: 1,
  });

  // Fetch category and subcategory info
  const { data: categoryData } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const response = await CategoryService.getAll();
      const category = response.data.data.find(
        (cat: { slug: string; subCategories?: Array<{ slug: string }> }) =>
          cat.slug === slug
      );
      const subCategory = category?.subCategories?.find(
        (sub: { slug: string }) => sub.slug === subId
      );
      return { category, subCategory };
    },
  });

  // Fetch products
  const {
    data: productsData,
    isLoading,
    error,
  } = useProductsBySubCategory(slug, subId, {
    sortBy: filters.sortBy,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    condition: filters.condition,
    limit: filters.limit,
    page: filters.page,
  });

  const breadcrumbs = categoryData?.category
    ? [
        {
          label: "Danh mục",
          href: "/categories",
        },
        {
          label: categoryData.category.name,
          href: `/categories/${slug}`,
        },
        ...(categoryData.subCategory
          ? [
              {
                label: categoryData.subCategory.name,
                href: `/categories/${slug}/sub/${subId}`,
              },
            ]
          : []),
      ]
    : undefined;

  return (
    <div className="min-h-screen bg-white">
      <CategoryHeader
        category={categoryData?.category}
        subCategory={categoryData?.subCategory}
        breadcrumbs={breadcrumbs}
      />

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
            products={productsData?.data || []}
            isLoading={isLoading}
            emptyMessage="Không có sản phẩm nào trong danh mục này"
          />
        )}
      </div>
    </div>
  );
}

