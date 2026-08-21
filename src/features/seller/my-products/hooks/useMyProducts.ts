import { useCallback, useEffect, useMemo, useState } from "react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import { useToast } from "@/components/ui";
import type {
  MyListingStatusCounts,
  MyListingTabKey,
  MyListingsResponse,
} from "@/types/myProducts";
import { PRODUCT_UI_MESSAGES } from "@/constants/messages";

/** Prefix chung cho mọi trang/tab — dùng để invalidate hoặc patch cache. */
export const MY_PRODUCTS_QUERY_KEY = ["my", "products"] as const;

export const MY_PRODUCTS_PAGE_SIZE = 10;

const EMPTY_STATUS_COUNTS: MyListingStatusCounts = {
  all: 0,
  pending: 0,
  approved: 0,
  under_review: 0,
  rejected: 0,
  sold: 0,
};

export function useMyProducts() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilterState] = useState<MyListingTabKey>("all");
  const [page, setPageState] = useState(1);

  const { data, isLoading, isFetching, error, refetch } = useQuery<
    MyListingsResponse,
    Error
  >({
    queryKey: [...MY_PRODUCTS_QUERY_KEY, { page, status: activeFilter }],
    queryFn: async () => {
      const res = await ProductService.getMyListings({
        page,
        limit: MY_PRODUCTS_PAGE_SIZE,
        status: activeFilter,
      });
      if (!res.success) {
        throw new Error(
          res.message || "Không thể tải danh sách sản phẩm của bạn",
        );
      }
      return res;
    },
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!error) return;
    toast.error(PRODUCT_UI_MESSAGES.LIST_LOAD_ERROR);
  }, [error, toast]);

  const products = data?.data ?? [];
  const totalItems = data?.pagination?.totalItems ?? products.length;
  const totalPages = Math.max(1, data?.pagination?.totalPages ?? 1);

  const stats = useMemo<MyListingStatusCounts>(
    () => ({ ...EMPTY_STATUS_COUNTS, ...(data?.statusCounts ?? {}) }),
    [data?.statusCounts],
  );

  useEffect(() => {
    if (page > totalPages) setPageState(totalPages);
  }, [page, totalPages]);

  const setPage = useCallback(
    (next: number) => setPageState(Math.max(1, next)),
    [],
  );

  const setActiveFilter = useCallback((filter: MyListingTabKey) => {
    setActiveFilterState(filter);
    setPageState(1);
  }, []);

  const refresh = useCallback(
    () => queryClient.invalidateQueries({ queryKey: MY_PRODUCTS_QUERY_KEY }),
    [queryClient],
  );

  const pageStart =
    totalItems === 0 ? 0 : (page - 1) * MY_PRODUCTS_PAGE_SIZE + 1;
  const pageEnd = Math.min(
    (page - 1) * MY_PRODUCTS_PAGE_SIZE + products.length,
    totalItems,
  );

  return {
    products,
    stats,
    activeFilter,
    setActiveFilter,
    page,
    setPage,
    totalPages,
    totalItems,
    pageStart,
    pageEnd,
    isLoading,
    isFetching,
    error,
    refetch,
    refresh,
  };
}
