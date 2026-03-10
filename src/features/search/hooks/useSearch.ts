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
  const q = searchParams.get("q") || "";

  const [filters, setFilters] = useState<IProductFilters>({
    search: q,
    sortBy: "newest",
    limit: 20,
    page: 1,
  });

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: q, page: 1 }));
  }, [q]);

  const { data: productsData, isLoading, error } = useProductsSearch(q, {
    sortBy: filters.sortBy,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    limit: filters.limit,
    page: filters.page,
  });

  const response = productsData as SearchResponse | undefined;

  return {
    q,
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
