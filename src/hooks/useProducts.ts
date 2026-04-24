import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import { ProductReviewService } from "@/services/productReview.service";
import type { IProduct, IProductFilters } from "@/types/product";
import { queryKeys } from "@/lib/query-client";

const PRODUCT_REVIEWS_PAGE_SIZE = 10;

/** Đánh giá sản phẩm trên trang chi tiết (infinite scroll / xem thêm) */
export function useProductReviews(productId: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.products.reviews(productId),
    queryFn: async ({ pageParam }) => {
      return ProductReviewService.getByProduct(productId, {
        page: pageParam as number,
        limit: PRODUCT_REVIEWS_PAGE_SIZE,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.page < last.pagination.totalPages
        ? last.pagination.page + 1
        : undefined,
    enabled: !!productId,
  });
}

export function useProducts(filters?: IProductFilters) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: async () => {
      const data = await ProductService.getAll(filters);
      return data;
    },
  });
}

export function useAllPublicProducts(filters?: IProductFilters) {
  return useQuery({
    queryKey: [...queryKeys.products.all, "public-all", filters],
    queryFn: async () => ProductService.getAllPublic(filters),
  });
}

export function useFeaturedProducts(limit = 4) {
  return useQuery({
    queryKey: [...queryKeys.products.all, "featured", limit],
    queryFn: async () => ProductService.getFeatured(limit),
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
