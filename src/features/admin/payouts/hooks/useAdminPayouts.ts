"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-client";

export function useAdminPayouts() {
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.orders.payouts(),
    queryFn: () => AdminService.getPayouts(),
    // backend returns { data: [...] } (pending-payouts endpoint)
    select: (d) => d.data ?? [],
  });

  const triggerMutation = useMutation({
    mutationFn: (orderId: string) => AdminService.triggerPayout(orderId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.orders.payouts() }),
  });

  return {
    payouts: data ?? [],
    isLoading,
    error,
    triggerPayout: triggerMutation.mutateAsync,
    isTriggering: triggerMutation.isPending,
    triggeringId: triggerMutation.variables as string | undefined,
  };
}
