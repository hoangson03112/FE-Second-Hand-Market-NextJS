import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "@/services/category.service";
import { useProductsBySubCategory } from "@/hooks/useProducts";
import { IProductFilters } from "@/types/product";

interface UseSubCategoryPageProps {
  slug: string;
  subId: string;
}

export function useSubCategoryPage({ slug, subId }: UseSubCategoryPageProps) {
  const [filters, setFilters] = useState<IProductFilters>({
    categorySlug: slug,
    subCategorySlug: subId,
    sortBy: "newest",
    limit: 20,
    page: 1,
  });

  // Fetch category and subcategory info
  const { data: categoryData, isLoading: isLoadingCategory } = useQuery({
    queryKey: ["category", slug, subId],
    queryFn: async () => {
      const response = await CategoryService.getAll();
      const category = response.data.find(
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
    isLoading: isLoadingProducts,
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

  return {
    filters,
    setFilters,
    category: categoryData?.category,
    subCategory: categoryData?.subCategory,
    products: productsData,
    breadcrumbs,
    isLoading: isLoadingCategory || isLoadingProducts,
    error,
  };
}
