"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-client";
import type { AdminOrder } from "@/types/admin";

export function useAdminPayouts() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [payoutStatusFilter, setPayoutStatusFilter] = useState<"pending" | "paid" | "all">("pending");
  const [search, setSearch] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [...queryKeys.orders.payouts(), page, payoutStatusFilter, search],
    queryFn: () =>
      AdminService.getOrders({
        page,
        limit: 20,
        status: "completed",
        payoutStatus: payoutStatusFilter === "all" ? undefined : payoutStatusFilter,
        search: search.trim() || undefined,
      }),
  });

  const confirmMutation = useMutation({
    mutationFn: (orderId: string) => AdminService.confirmSellerPayout(orderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.orders.payouts() });
      qc.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });

  const orders: AdminOrder[] = data?.orders ?? [];
  const pagination = data?.pagination ?? { page: 1, limit: 20, totalItems: 0, totalPages: 1 };

  return {
    orders,
    pagination,
    isLoading,
    error,
    refetch,
    page,
    setPage,
    payoutStatusFilter,
    setPayoutStatusFilter,
    search,
    setSearch,
    confirmPayout: confirmMutation.mutateAsync,
    isConfirming: confirmMutation.isPending,
    confirmingId: confirmMutation.variables as string | undefined,
  };
}
