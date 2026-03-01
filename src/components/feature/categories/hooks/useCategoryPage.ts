import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "@/services/category.service";
import { useProductsByCategory } from "@/hooks/useProducts";
import { IProductFilters } from "@/types/product";
import type { ICategory } from "@/types/category";

interface UseCategoryPageProps {
  slug: string;
}

export function useCategoryPage({ slug }: UseCategoryPageProps) {
  const [filters, setFilters] = useState<IProductFilters>({
    categorySlug: slug,
    sortBy: "newest",
    limit: 20,
    page: 1,
  });

  // Fetch category info
  const { data: categoryData, isLoading: isLoadingCategory } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const response = await CategoryService.getAll();
      return response.data.find(
        (cat: ICategory) => cat.slug === slug
      );
    },
  });

  // Fetch products
  const {
    data: productsData,
    isLoading: isLoadingProducts,
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

  return {
    filters,
    setFilters,
    category: categoryData,
    products: productsData,
    breadcrumbs,
    isLoading: isLoadingCategory || isLoadingProducts,
    error,
  };
}
