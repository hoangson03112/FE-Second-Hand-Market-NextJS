"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useTokenStore } from "@/store/useTokenStore";
import { OrderService } from "@/services/order.service";
import { useToast } from "@/components/ui/Toast";
import type { Order } from "@/types/order";
import { ORDER_MESSAGES, REFUND_MESSAGES } from "@/constants/messages";

export const PAGE_SIZE = 5;

export const ORDER_TABS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "picked_up", label: "Đã lấy hàng" },
  { key: "shipping", label: "Đang vận chuyển" },
  { key: "out_for_delivery", label: "Đang giao hàng" },
  { key: "delivered", label: "Đã giao" },
  { key: "completed", label: "Hoàn thành" },
  { key: "failed", label: "Giao thất bại" },
  { key: "returned", label: "Đã hoàn hàng" },
  { key: "cancelled", label: "Đã hủy" },
] as const;

export function useOrders() {
  const router = useRouter();
  const { data: account, isLoading: userLoading } = useUser();
  const accessToken = useTokenStore((state) => state.accessToken);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirectingAuth, setIsRedirectingAuth] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelTargetOrderId, setCancelTargetOrderId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [refundTargetOrder, setRefundTargetOrder] = useState<Order | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundDescription, setRefundDescription] = useState("");
  const [refundImages, setRefundImages] = useState<File[]>([]);
  const [refundVideos, setRefundVideos] = useState<File[]>([]);
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useToast();

  const openCancelDialog = (orderId: string) => {
    setCancelTargetOrderId(orderId);
  };

  const closeCancelDialog = () => {
    if (cancellingId) return;
    setCancelTargetOrderId(null);
  };

  const confirmCancelOrder = async (reason: string) => {
    const orderId = cancelTargetOrderId;
    if (!orderId) return;

    setCancellingId(orderId);
    try {
      await OrderService.cancelOrder(orderId, reason);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o)),
      );
      setCancelTargetOrderId(null);
    } catch (err) {
      console.error("Cancel order error:", err);
      toast.error(ORDER_MESSAGES.CANCEL_FAILED);
    } finally {
      setCancellingId(null);
    }
  };

  const handleConfirmReceived = async (orderId: string) => {
    setConfirmingId(orderId);
    try {
      await OrderService.confirmReceived(orderId);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "completed" } : o)),
      );
      toast.success(ORDER_MESSAGES.CONFIRM_RECEIVED_SUCCESS);
    } catch (err) {
      console.error("Confirm received error:", err);
      toast.error(ORDER_MESSAGES.CONFIRM_RECEIVED_FAILED);
    } finally {
      setConfirmingId(null);
    }
  };

  useEffect(() => {
    if (!userLoading && !accessToken) {
      setIsRedirectingAuth(true);
      setIsLoading(false);
      router.replace("/login?redirect=%2Forders");
      return;
    }

    if (!userLoading && accessToken && !account) {
      // Token exists but account cannot be resolved (expired/invalid session).
      setIsRedirectingAuth(true);
      setIsLoading(false);
      router.replace("/login?redirect=%2Forders");
      return;
    }

    if (!account) return;

    const fetchOrders = async () => {
      try {
        const res = await OrderService.getMyOrders();
        setOrders(res.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [account, userLoading, accessToken, router]);

  const openRefundModal = (orderId: string) => {
    const order = orders.find((o) => o._id === orderId) ?? null;
    setRefundTargetOrder(order);
    setRefundReason("");
    setRefundDescription("");
    setRefundImages([]);
    setRefundVideos([]);
  };

  const closeRefundModal = () => {
    if (isSubmittingRefund) return;
    setRefundTargetOrder(null);
  };

  const handleSubmitRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTargetOrder || !refundReason.trim()) return;
    setIsSubmittingRefund(true);
    try {
      await OrderService.requestRefund(
        refundTargetOrder._id,
        refundReason,
        refundDescription || undefined,
        refundImages.length ? refundImages : undefined,
        refundVideos.length ? refundVideos : undefined,
      );
      setOrders((prev) =>
        prev.map((o) => o._id === refundTargetOrder._id ? { ...o, status: "refund_requested" } : o),
      );
      setRefundTargetOrder(null);
      toast.success(REFUND_MESSAGES.REQUEST_SUCCESS);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể gửi yêu cầu hoàn tiền");
    } finally {
      setIsSubmittingRefund(false);
    }
  };

  const filteredOrders =
    activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedOrders = filteredOrders.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const cancelTargetOrder = cancelTargetOrderId
    ? orders.find((order) => order._id === cancelTargetOrderId) || null
    : null;

  return {
    account,
    userLoading,
    isRedirectingAuth,
    orders,
    filteredOrders,
    paginatedOrders,
    currentPage: safePage,
    totalPages,
    setCurrentPage,
    isLoading,
    activeTab,
    setActiveTab: handleTabChange,
    cancellingId,
    cancelTargetOrder,
    openCancelDialog,
    closeCancelDialog,
    confirmCancelOrder,
    confirmingId,
    handleConfirmReceived,
    refundTargetOrder,
    refundReason,
    refundDescription,
    refundImages,
    refundVideos,
    isSubmittingRefund,
    openRefundModal,
    closeRefundModal,
    handleSubmitRefund,
    setRefundReason,
    setRefundDescription,
    setRefundImages,
    setRefundVideos,
  };
}
