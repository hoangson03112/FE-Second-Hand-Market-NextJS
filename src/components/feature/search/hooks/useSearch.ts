"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProductsSearch } from "@/hooks/useProducts";
import type { IProductFilters } from "@/types/product";

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

  return {
    q,
    filters,
    setFilters,
    products: productsData?.data || [],
    total: productsData?.total || 0,
    totalPages: productsData?.totalPages || 1,
    currentPage: productsData?.page || 1,
    isLoading,
    error,
  };
}
