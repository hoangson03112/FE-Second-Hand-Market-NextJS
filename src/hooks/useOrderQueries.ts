"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderService } from "@/services/order.service";
import { queryKeys } from "@/lib/query-client";
import type { Order } from "@/types/order";

// ── Query: buyer's orders ─────────────────────────────────────────────────────
export function useMyOrders() {
  return useQuery({
    queryKey: queryKeys.orders.myOrders(),
    queryFn: () => OrderService.getMyOrders(),
    select: (data) => data.orders ?? [],
    staleTime: 2 * 60 * 1000,
  });
}

// ── Query: order detail ───────────────────────────────────────────────────────
export function useOrderDetail(orderId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => OrderService.getById(orderId),
    select: (data) => data.order,
    enabled: Boolean(orderId) && enabled,
    staleTime: 60 * 1000,
  });
}

// ── Query: seller's orders ────────────────────────────────────────────────────
export function useSellerOrders() {
  return useQuery({
    queryKey: queryKeys.orders.sellerOrders(),
    queryFn: () => OrderService.getSellerOrders(),
    select: (data) => data.orders ?? [],
    staleTime: 2 * 60 * 1000,
  });
}

// ── Query: GHN tracking ───────────────────────────────────────────────────────
export function useOrderTracking(orderId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.orders.tracking(orderId),
    queryFn: () => OrderService.getTracking(orderId),
    select: (data) => data.tracking,
    enabled: Boolean(orderId) && enabled,
    staleTime: 3 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // refresh every 5 min
  });
}

// ── Mutation helpers ──────────────────────────────────────────────────────────

function patchOrderInCache(
  qc: ReturnType<typeof useQueryClient>,
  orderId: string,
  patch: Partial<Order>
) {
  // Update in detail cache
  qc.setQueryData(
    queryKeys.orders.detail(orderId),
    (old: { order: Order } | undefined) =>
      old ? { order: { ...old.order, ...patch } } : old
  );
  // Update in list caches
  const updateList = (key: readonly unknown[]) => {
    qc.setQueryData(key, (old: Order[] | undefined) =>
      old?.map((o) => (o._id === orderId ? { ...o, ...patch } : o))
    );
  };
  updateList(queryKeys.orders.myOrders());
  updateList(queryKeys.orders.sellerOrders());
}

// ── Mutation: cancel order ────────────────────────────────────────────────────
export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
      OrderService.updateStatus(orderId, "cancelled", reason),
    onSuccess: (_, { orderId }) => {
      patchOrderInCache(qc, orderId, { status: "cancelled" });
    },
  });
}

// ── Mutation: confirm received (delivered → completed) ────────────────────────
export function useConfirmReceived() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => OrderService.confirmReceived(orderId),
    onSuccess: (_, orderId) => {
      patchOrderInCache(qc, orderId, { status: "completed" });
    },
  });
}

// ── Mutation: request refund ──────────────────────────────────────────────────
export function useRequestRefund() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      reason,
      description,
      images,
      videos,
    }: {
      orderId: string;
      reason: string;
      description?: string;
      images?: File[];
      videos?: File[];
    }) => OrderService.requestRefund(orderId, reason, description, images, videos),
    onSuccess: (_, { orderId }) => {
      patchOrderInCache(qc, orderId, { status: "refund_requested" });
    },
  });
}

// ── Mutation: seller confirm order ────────────────────────────────────────────
export function useSellerConfirmOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      OrderService.updateSellerOrder(orderId, "confirmed", reason),
    onSuccess: (data, { orderId }) => {
      patchOrderInCache(qc, orderId, {
        status: "confirmed",
        ...(data.order?.ghnOrderCode
          ? { ghnOrderCode: data.order.ghnOrderCode }
          : {}),
      });
    },
  });
}

// ── Mutation: seller cancel order ─────────────────────────────────────────────
export function useSellerCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
      OrderService.updateSellerOrder(orderId, "cancelled", reason),
    onSuccess: (_, { orderId }) => {
      patchOrderInCache(qc, orderId, { status: "cancelled" });
    },
  });
}
