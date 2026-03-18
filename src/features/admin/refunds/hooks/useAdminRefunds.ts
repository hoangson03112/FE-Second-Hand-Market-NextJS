"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-client";

const LIMIT = 20;

export function useAdminRefunds() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: [...queryKeys.orders.refunds(), statusFilter, page],
    queryFn: () =>
      AdminService.getRefunds({
        status: statusFilter || undefined,
        page,
        limit: LIMIT,
      }),
  });

  const approveDisputeMutation = useMutation({
    mutationFn: ({ refundId, comment }: { refundId: string; comment?: string }) =>
      AdminService.approveDispute(refundId, comment),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.orders.refunds() }),
  });

  const rejectDisputeMutation = useMutation({
    mutationFn: ({ refundId, adminNote }: { refundId: string; adminNote: string }) =>
      AdminService.rejectRefund(refundId, adminNote),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.orders.refunds() }),
  });

  const approveRefundMutation = useMutation({
    mutationFn: ({ orderId }: { orderId: string }) =>
      AdminService.approveRefund(orderId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.orders.refunds() }),
  });

  const totalPages = data?.pagination?.totalPages ?? 1;
  const safeSetPage = useCallback(
    (p: number) => setPage(Math.max(1, Math.min(p, Math.max(1, totalPages)))),
    [totalPages],
  );

  const setStatus = useCallback((s: string) => {
    setStatusFilter(s);
    setPage(1);
  }, []);

  return {
    refunds: data?.refunds ?? [],
    pagination: data?.pagination,
    totalPages,
    isLoading,
    error,
    approveDispute: approveDisputeMutation.mutateAsync,
    rejectDispute: rejectDisputeMutation.mutateAsync,
    approveRefund: approveRefundMutation.mutateAsync,
    isApprovingDispute: approveDisputeMutation.isPending,
    isRejectingDispute: rejectDisputeMutation.isPending,
    isApprovingRefund: approveRefundMutation.isPending,
    statusFilter,
    setStatusFilter: setStatus,
    page,
    setPage: safeSetPage,
  };
}

export function useRefundDetail(refundId: string | null) {
  const { data, isLoading } = useQuery({
    queryKey: ["refund-detail", refundId],
    queryFn: async () => {
      const res = await AdminService.getRefundDetail(refundId!);
      return res;
    },
    enabled: !!refundId,
  });
  return { refund: data?.refund ?? null, isLoading };
}
