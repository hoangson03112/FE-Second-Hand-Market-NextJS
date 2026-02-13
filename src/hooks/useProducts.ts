import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import type { IProduct, IProductFilters } from "@/types/product";
import { queryKeys } from "@/lib/query-client";

export function useProducts(filters?: IProductFilters) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: async () => {
      const data = await ProductService.getAll(filters);
      return data;
    },
  });
}

export function useProductsByCategory(
  categorySlug: string,
  filters?: IProductFilters
) {
  return useQuery({
    queryKey: queryKeys.products.byCategory(categorySlug, filters),
    queryFn: async () => {
      const data = await ProductService.getByCategory(categorySlug, filters);
      return data;
    },
  });
}

export function useProductsBySubCategory(
  categorySlug: string,
  subCategorySlug: string,
  filters?: IProductFilters
) {
  return useQuery({
    queryKey: queryKeys.products.bySubCategory(
      categorySlug,
      subCategorySlug,
      filters
    ),
    queryFn: async () => {
      const data = await ProductService.getBySubCategory(
        categorySlug,
        subCategorySlug,
        filters
      );
      return data;
    },
  });
}

export function useProduct(id: string) {
  return useQuery<IProduct>({
    queryKey: queryKeys.products.detail(id),
    queryFn: async () => {
      if (!id) throw new Error("Product ID is required");
      return ProductService.getById(id);
    },
    enabled: !!id,
  });
}

export function useProductsSearch(searchQuery: string, filters?: IProductFilters) {
  return useQuery({
    queryKey: [...queryKeys.products.all, "search", searchQuery, filters],
    queryFn: async () => {
      return ProductService.search(searchQuery, filters);
    },
    enabled: !!searchQuery && searchQuery.trim().length > 0,
  });
}
