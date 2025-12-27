import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import { IProductFilters } from "@/types/product";
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
  categoryId: string,
  filters?: Omit<IProductFilters, "category">
) {
  return useQuery({
    queryKey: queryKeys.products.byCategory(categoryId, filters),
    queryFn: async () => {
      const data = await ProductService.getByCategory(categoryId, filters);
      return data;
    },
  });
}

export function useProductsBySubCategory(
  categoryId: string,
  subCategoryId: string,
  filters?: Omit<IProductFilters, "category" | "subCategory">
) {
  return useQuery({
    queryKey: queryKeys.products.bySubCategory(categoryId, subCategoryId, filters),
    queryFn: async () => {
      const data = await ProductService.getBySubCategory(
        categoryId,
        subCategoryId,
        filters
      );
      return data;
    },
  });
}

