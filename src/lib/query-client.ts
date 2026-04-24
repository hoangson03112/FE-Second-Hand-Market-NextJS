import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: 1,

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
    byCategory: (categorySlug: string, filters?: unknown) =>
      [
        ...queryKeys.products.lists(),
        "category",
        categorySlug,
        filters,
      ] as const,
    bySubCategory: (
      categorySlug: string,
      subCategorySlug: string,
      filters?: unknown
    ) =>
      [
        ...queryKeys.products.lists(),
        "category",
        categorySlug,
        "sub",
        subCategorySlug,
        filters,
      ] as const,
    /** Đánh giá sản phẩm (theo productId) */
    reviews: (productId: string) =>
      [...queryKeys.products.all, "reviews", productId] as const,
  },

  // Users
  users: {
    all: ["users"] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    current: () => [...queryKeys.users.all, "current"] as const,
  },

  // Cart
  cart: {
    all: ["cart"] as const,
    list: () => [...queryKeys.cart.all, "list"] as const,
  },

  // Addresses
  addresses: {
    all: ["addresses"] as const,
    lists: () => [...queryKeys.addresses.all, "list"] as const,
    list: () => [...queryKeys.addresses.lists()] as const,
    provinces: () => [...queryKeys.addresses.all, "provinces"] as const,
    districts: (provinceId: number | null) =>
      [...queryKeys.addresses.all, "districts", provinceId] as const,
    wards: (districtId: number | null) =>
      [...queryKeys.addresses.all, "wards", districtId] as const,
    searchProvinces: (query: string) =>
      [...queryKeys.addresses.all, "search", query] as const,
  },

  // Orders
  orders: {
    all: ["orders"] as const,
    myOrders: () => [...queryKeys.orders.all, "my"] as const,
    sellerOrders: () => [...queryKeys.orders.all, "seller"] as const,
    adminOrders: (params?: {
      page?: number;
      status?: string;
      search?: string;
      paymentMethod?: "all" | "cod" | "bank_transfer";
      payoutStatus?: "all" | "pending" | "paid";
      startDate?: string;
      endDate?: string;
    }) =>
      [...queryKeys.orders.all, "admin", params] as const,
    detail: (id: string) => [...queryKeys.orders.all, "detail", id] as const,
    tracking: (id: string) => [...queryKeys.orders.all, "tracking", id] as const,
    refunds: () => [...queryKeys.orders.all, "refunds"] as const,
    payouts: () => [...queryKeys.orders.all, "payouts"] as const,
  },
} as const;
