"use client";

import useSWR from "swr";
import { Product, PaginatedResponse, SearchFilters } from "@/types";
import { fetcher } from "@/lib/fetcher";

// Get all products with pagination and filters
export function useProducts(
  page: number = 1,
  limit: number = 12,
  filters?: SearchFilters
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Product>>(
    `/products?${params}`,
    fetcher
  );

  return {
    products: data?.items || [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
  };
}

// Get single product by ID
export function useProduct(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Product>(
    id ? `/products/${id}` : null,
    fetcher
  );

  return {
    product: data,
    isLoading,
    error,
    mutate,
  };
}

// Search products
export function useSearchProducts(
  query: string,
  page: number = 1,
  limit: number = 12,
  filters?: SearchFilters
) {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }

  const shouldFetch = query && query.trim().length > 0;

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Product>>(
    shouldFetch ? `/products/search?${params}` : null,
    fetcher
  );

  return {
    products: data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
  };
}

// Get featured products
export function useFeaturedProducts(limit: number = 8) {
  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    `/products/featured?limit=${limit}`,
    fetcher
  );

  return {
    products: data || [],
    isLoading,
    error,
    mutate,
  };
}

// Get products by category
export function useProductsByCategory(
  categoryId: string | null,
  page: number = 1,
  limit: number = 12
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Product>>(
    categoryId ? `/products/categories?categoryId=${categoryId}` : null,
    fetcher
  );

  return {
    products: data?.items || [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
  };
}

// Get user's products
export function useUserProducts(
  userId: string | null,
  page: number = 1,
  limit: number = 12
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Product>>(
    userId ? `/users/${userId}/products?${params}` : null,
    fetcher
  );

  return {
    products: data?.items || [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
  };
}

// Get user's favorite products
export function useFavoriteProducts(page: number = 1, limit: number = 12) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Product>>(
    `/products/favorites?${params}`,
    fetcher
  );

  return {
    products: data?.items || [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
  };
}
