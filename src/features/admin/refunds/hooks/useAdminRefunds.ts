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

  // Admin "approve" = finalize refund with wallet deduction (POST /orders/:id/complete-refund)
  const approveMutation = useMutation({
    mutationFn: ({ orderId }: { orderId: string }) =>
      AdminService.approveRefund(orderId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.orders.refunds() }),
  });

  // Admin "reject" = reject a disputed refund (PUT /refunds/:refundId/admin-handle)
  const rejectMutation = useMutation({
    mutationFn: ({ refundId, adminNote }: { refundId: string; adminNote: string }) =>
      AdminService.rejectRefund(refundId, adminNote),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.orders.refunds() }),
  });

  return {
    refunds: data ?? [],
    isLoading,
    error,
    approveRefund: approveMutation.mutateAsync,
    rejectRefund: rejectMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
}
