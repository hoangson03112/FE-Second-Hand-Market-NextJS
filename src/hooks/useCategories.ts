import { CategoryService } from "@/services/category.service";
import { useQuery } from "@tanstack/react-query";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useEffect } from "react";
import { queryKeys } from "@/lib/query-client";

export function useCategories() {
  const { setCategories, setIsLoading, categories, isLoading } =
    useCategoryStore();

  const query = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const data = await CategoryService.getAll();
      return data.data;
    },
    // Chỉ fetch nếu chưa có data trong store
    enabled: !categories,
    // Cache lâu hơn vì categories ít thay đổi
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Sync data với Zustand store
  useEffect(() => {
    if (query.data) {
      setCategories(query.data);
    }
  }, [query.data, setCategories]);

  useEffect(() => {
    setIsLoading(query.isLoading);
  }, [query.isLoading, setIsLoading]);

  // Trả về data từ store nếu có, nếu không thì từ query
  return {
    ...query,
    data: categories || query.data,
    isLoading: isLoading || query.isLoading,
  };
}

export default useCategories;
