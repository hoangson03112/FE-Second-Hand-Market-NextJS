import { QueryClient } from "@tanstack/react-query";

/**
 * Centralized QueryClient configuration
 * This ensures consistent caching and refetch behavior across the app
 */
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 5 minutes
        staleTime: 5 * 60 * 1000, // 5 minutes

        // Data stays in cache for 30 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)

        // Don't refetch on window focus (reduce unnecessary requests)
        refetchOnWindowFocus: false,

        // Don't refetch on reconnect
        refetchOnReconnect: false,

        // Don't refetch on mount if data exists
        refetchOnMount: false,

        // Retry failed requests once
        retry: 1,

        // Retry delay increases exponentially
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // Retry mutations once
        retry: 1,

        // Show error on mutation failure
        onError: (error) => {
          console.error("Mutation error:", error);
          // You can integrate with error tracking service here
        },
      },
    },
  });
};

/**
 * Query keys factory for type-safe query keys
 */
export const queryKeys = {
  // Categories
  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.categories.lists(), filters] as const,
    details: () => [...queryKeys.categories.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },

  // Products
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters?: unknown) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    byCategory: (categoryId: string, filters?: unknown) =>
      [...queryKeys.products.lists(), "category", categoryId, filters] as const,
    bySubCategory: (
      categoryId: string,
      subCategoryId: string,
      filters?: unknown
    ) =>
      [
        ...queryKeys.products.lists(),
        "category",
        categoryId,
        "sub",
        subCategoryId,
        filters,
      ] as const,
  },


















  
  // Users
  users: {
    all: ["users"] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    current: () => [...queryKeys.users.all, "current"] as const,
  },
} as const;
