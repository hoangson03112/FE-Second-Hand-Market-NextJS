"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderService } from "@/services/order.service";
import { useToast } from "@/components/shared";
import type { Order } from "@/types/order";

export interface ProgressStep {
  key: string;
  label: string;
  shortLabel: string;
}

export const ORDER_PROGRESS_STEPS: ProgressStep[] = [
  { key: "pending", label: "Chờ xác nhận", shortLabel: "Chờ xác nhận" },
  { key: "confirmed", label: "Đã xác nhận", shortLabel: "Đã xác nhận" },
  { key: "picked_up", label: "Đã lấy hàng", shortLabel: "Đã lấy" },
  { key: "shipping", label: "Đang vận chuyển", shortLabel: "Vận chuyển" },
  { key: "out_for_delivery", label: "Đang giao hàng", shortLabel: "Đang giao" },
  { key: "delivered", label: "Đã giao hàng", shortLabel: "Đã giao" },
  { key: "completed", label: "Hoàn tất", shortLabel: "Hoàn tất" },
];

export const LOCAL_PICKUP_PROGRESS_STEPS: ProgressStep[] = [
  { key: "pending", label: "Chờ xác nhận", shortLabel: "Chờ xác nhận" },
  { key: "confirmed", label: "Đã xác nhận", shortLabel: "Đã xác nhận" },
  { key: "delivered", label: "Đã giao hàng", shortLabel: "Đã giao" },
  { key: "completed", label: "Hoàn tất", shortLabel: "Hoàn tất" },
];

export const FAILED_STATUSES: Record<string, string> = {
  failed: "Đơn hàng giao thất bại",
  returned: "Đơn hàng đã hoàn trả",
  cancelled: "Đơn hàng đã bị hủy",
};

export function useCheckoutSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmingReceived, setIsConfirmingReceived] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!orderId) {
      router.push("/checkout");
      return;
    }
    OrderService.getById(orderId)
      .then((r) => setOrder(r.order ?? null))
      .catch(() => setOrder(null))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleConfirmReceived = useCallback(async () => {
    if (!order || order.status !== "delivered") return;
    setIsConfirmingReceived(true);
    try {
      await OrderService.confirmReceived(order._id);
      setOrder((prev) => (prev ? { ...prev, status: "completed" } : prev));
      toast.success("Đã xác nhận nhận hàng thành công.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể xác nhận nhận hàng.",
      );
    } finally {
      setIsConfirmingReceived(false);
    }
  }, [order, toast]);

  const isLocalPickup = order?.shippingMethod === "local_pickup";
  const progressSteps = isLocalPickup
    ? LOCAL_PICKUP_PROGRESS_STEPS
    : ORDER_PROGRESS_STEPS;
  const currentStepIndex = order
    ? progressSteps.findIndex((step) => step.key === order.status)
    : -1;

  return {
    orderId,
    order,
    isLoading,
    isConfirmingReceived,
    handleConfirmReceived,
    isLocalPickup,
    progressSteps,
    effectiveStepIndex: currentStepIndex >= 0 ? currentStepIndex : 0,
    isTerminalFailed: order
      ? Object.keys(FAILED_STATUSES).includes(order.status)
      : false,
  };
}
