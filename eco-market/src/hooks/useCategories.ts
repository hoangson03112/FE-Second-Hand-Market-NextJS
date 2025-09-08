"use client";

import useSWR from "swr";
import { Category } from "@/types";
import { fetcher } from "@/lib/fetcher";

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    "/categories",
    fetcher,
    {
      dedupingInterval: 5 * 60 * 1000,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
    }
  );

  return {
    categories: data || [],
    isLoading,
    error,
    mutate,
  };
}

export function useCategory(id: string | null) {
  const { data, error, isLoading } = useSWR<Category>(
    id ? `/categories/${id}` : null,
    fetcher
  );
  console.log(data);
  return {
    category: data,
    isLoading,
    error,
  };
}

export default useCategories;
