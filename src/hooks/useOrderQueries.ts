"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderService } from "@/services/order.service";
import { queryKeys } from "@/lib/query-client";
import type { Order } from "@/types/order";


export function useMyOrders() {
  return useQuery({
    queryKey: queryKeys.orders.myOrders(),
    queryFn: () => OrderService.getMyOrders(),
    select: (data) => data.orders ?? [],
    staleTime: 2 * 60 * 1000,
  });
}


export function useOrderDetail(orderId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => OrderService.getById(orderId),
    select: (data) => data.order,
    enabled: Boolean(orderId) && enabled,
    staleTime: 60 * 1000,
  });
}


export function useSellerOrders() {
  return useQuery({
    queryKey: queryKeys.orders.sellerOrders(),
    queryFn: () => OrderService.getSellerOrders(),
    select: (data) => data.orders ?? [],
    staleTime: 2 * 60 * 1000,
  });
}


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


function patchOrderInCache(
  qc: ReturnType<typeof useQueryClient>,
  orderId: string,
  patch: Partial<Order>
) {

  qc.setQueryData(
    queryKeys.orders.detail(orderId),
    (old: { order: Order } | undefined) =>
      old ? { order: { ...old.order, ...patch } } : old
  );

  const updateList = (key: readonly unknown[]) => {
    qc.setQueryData(key, (old: Order[] | undefined) =>
      old?.map((o) => (o._id === orderId ? { ...o, ...patch } : o))
    );
  };
  updateList(queryKeys.orders.myOrders());
  updateList(queryKeys.orders.sellerOrders());
}


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


export function useConfirmReceived() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => OrderService.confirmReceived(orderId),
    onSuccess: (_, orderId) => {
      patchOrderInCache(qc, orderId, { status: "completed" });
    },
  });
}


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


      patchOrderInCache(qc, orderId, { status: "refund" });
    },
  });
}


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
