"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-client";

export function useAdminRefunds() {
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.orders.refunds(),
    queryFn: () => AdminService.getRefunds(),
    select: (d) => d.refunds ?? [],
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

  return {
    refunds: data ?? [],
    isLoading,
    error,
    approveDispute: approveDisputeMutation.mutateAsync,
    rejectDispute: rejectDisputeMutation.mutateAsync,
    approveRefund: approveRefundMutation.mutateAsync,
    isApprovingDispute: approveDisputeMutation.isPending,
    isRejectingDispute: rejectDisputeMutation.isPending,
    isApprovingRefund: approveRefundMutation.isPending,
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
