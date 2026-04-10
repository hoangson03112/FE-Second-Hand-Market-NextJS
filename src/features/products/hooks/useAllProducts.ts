"use client";

import { useState } from "react";
import { useAllPublicProducts } from "@/hooks/useProducts";
import type { IProductFilters } from "@/types/product";

export function useAllProducts() {
  const [filters, setFilters] = useState<IProductFilters>({
    sortBy: "newest",
    limit: 15,
    page: 1,
  });

  const { data, isLoading, error } = useAllPublicProducts(filters);

  return {
    filters,
    setFilters,
    products: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 1,
    currentPage: data?.page || 1,
    isLoading,
    error,
  };
}
