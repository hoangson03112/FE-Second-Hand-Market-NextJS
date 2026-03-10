import { useCallback, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-client";
import type { AdminOrder } from "@/types/admin";

export function useAdminOrders() {
  const qc = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilterState] = useState<string>("all");
  const [searchState, setSearchState] = useState("");
  const [page, setPageState] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.orders.adminOrders({ page, status: statusFilter, search: searchState }),
    queryFn: () =>
      AdminService.getOrders({ page, limit: 20, status: statusFilter, search: searchState }),
  });

  const totalPages = data?.pagination?.totalPages ?? 1;
  const totalItems = data?.pagination?.totalItems ?? 0;
  const allOrders: AdminOrder[] = data?.orders ?? [];

  // Clamp page when filter/search changes reduce total pages
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) setPageState(1);
  }, [totalPages, page]);

  const setPage = useCallback(
    (p: number) => setPageState(Math.max(1, Math.min(p, Math.max(1, totalPages)))),
    [totalPages],
  );

  const setStatusFilter = useCallback((status: string) => {
    setStatusFilterState(status);
    setPageState(1);
  }, []);

  const setSearch = useCallback((q: string) => {
    setSearchState(q);
    setPageState(1);
  }, []);

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status, reason }: { orderId: string; status: string; reason?: string }) =>
      AdminService.updateOrderStatus(orderId, status, reason),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...queryKeys.orders.all, "admin"] }),
  });

  const completeRefundMutation = useMutation({
    mutationFn: (orderId: string) => AdminService.approveRefund(orderId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...queryKeys.orders.all, "admin"] }),
  });

  const toggleExpanded = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return {
    orders: allOrders,
    allOrders,
    totalItems,
    isLoading,
    error,
    expandedId,
    toggleExpanded,
    statusFilter,
    setStatusFilter,
    search: searchState,
    setSearch,
    page,
    totalPages,
    setPage,
    updateOrderStatus: updateStatusMutation.mutateAsync,
    isUpdating: updateStatusMutation.isPending,
    completeRefund: completeRefundMutation.mutateAsync,
    isCompletingRefund: completeRefundMutation.isPending,
  };
}

