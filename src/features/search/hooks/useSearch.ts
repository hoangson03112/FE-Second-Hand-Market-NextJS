"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProductsSearch } from "@/hooks/useProducts";
import type { IProductFilters, IProduct } from "@/types/product";

interface SearchResponse {
  success: boolean;
  data: IProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useSearch() {
  const searchParams = useSearchParams();
  // Accept multiple query param aliases used by manual tests and automation tools.
  const q =
    searchParams.get("q") ||
    searchParams.get("query") ||
    searchParams.get("keyword") ||
    searchParams.get("search") ||
    "";

  const [filters, setFilters] = useState<IProductFilters>({
    search: q,
    sortBy: "newest",
    limit: 20,
    page: 1,
  });

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: q.trim(), page: 1 }));
  }, [q]);

  const normalizedQuery = q.trim();

  const { data: productsData, isLoading, error } = useProductsSearch(normalizedQuery, {
    sortBy: filters.sortBy,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    limit: filters.limit,
    page: filters.page,
  });

  const response = productsData as SearchResponse | undefined;

  return {
    q: normalizedQuery,
    filters,
    setFilters,
    products: response?.data || [],
    total: response?.total || 0,
    totalPages: response?.totalPages || 1,
    currentPage: response?.page || 1,
    isLoading,
    error,
  };
}
