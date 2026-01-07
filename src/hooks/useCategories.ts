/**
 * Categories Hook (Server State)
 * 
 * Fetches categories from API using TanStack Query
 * This is SERVER STATE because it's data from API
 */
import { CategoryService } from "@/services/category.service";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import { serverStateConfig } from "@/lib/state";
import type { ICategory } from "@/types/category";

export function useCategories() {
  return useQuery<ICategory[]>({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const data = await CategoryService.getAll();
      return data.data;
    },
    // Use config for static data (categories rarely change)
    staleTime: serverStateConfig.staleTime.static,
    gcTime: serverStateConfig.gcTime.static,
  });
}

export function useVisibleCategories(limit: number = 8) {
  const { data: categories } = useCategories();

  return categories?.slice(0, limit);
}

export default useCategories;
