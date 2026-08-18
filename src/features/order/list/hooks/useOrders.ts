"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/features/auth/hooks/useUser";
import { OrderService } from "@/services/order.service";
import { useToast } from "@/components/ui";
import type { Order } from "@/types/order";
import { ORDER_MESSAGES, REFUND_MESSAGES } from "@/constants/messages";
import { BUYER_ORDER_TABS, BUYER_TAB_STATUSES } from "@/constants/orderStatus";
import { getBuyerTodo } from "../utils/orderStage";

export const PAGE_SIZE = 8;

/** Free-text match over the fields a buyer would actually remember. */
function matchesQuery(order: Order, query: string) {
  const haystack = [
    order._id,
    order.ghnOrderCode,
    order.sellerId?.fullName,
    ...(order.products ?? []).map((item) => item.productId?.name),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function matchesTab(order: Order, tab: string) {
  if (tab === "all") return true;
  if (tab === "action") return getBuyerTodo(order) !== null;
  return (BUYER_TAB_STATUSES[tab] ?? []).includes(order.status);
}

export function useOrders() {
  const router = useRouter();
  const { data: account, isLoading: userLoading } = useUser();
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
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
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
    // Không phân giải được tài khoản sau khi useUser đã xong ⇒ chưa đăng nhập
    // hoặc phiên đã hết hạn.
    if (!userLoading && !account) {
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
  }, [account, userLoading, router]);

  const openRefundModal = (orderId: string) => {
    const order = orders.find((o) => o._id === orderId) ?? null;
    setRefundTargetOrder(order);
    setRefundReason("");
    setRefundDescription("");
    setRefundImages([]);
    setRefundVideos([]);
    setBankName("");
    setAccountNumber("");
    setAccountHolder("");
  };

  const closeRefundModal = () => {
    if (isSubmittingRefund) return;
    setRefundTargetOrder(null);
    setRefundReason("");
    setRefundDescription("");
    setRefundImages([]);
    setRefundVideos([]);
    setBankName("");
    setAccountNumber("");
    setAccountHolder("");
  };

  const handleSubmitRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTargetOrder || !refundReason.trim()) return;
    if (!bankName.trim() || !accountNumber.trim() || !accountHolder.trim()) return;
    setIsSubmittingRefund(true);
    try {
      await OrderService.requestRefund(
        refundTargetOrder._id,
        refundReason,
        refundDescription || undefined,
        refundImages.length ? refundImages : undefined,
        refundVideos.length ? refundVideos : undefined,
        bankName.trim(),
        accountNumber.trim(),
        accountHolder.trim(),
      );
      setOrders((prev) =>
        // Server sets order.status = "refund" on a refund request; the request
        // itself lives on order.refundRequestId.
        prev.map((o) => o._id === refundTargetOrder._id ? { ...o, status: "refund" as const } : o),
      );
      setRefundTargetOrder(null);
      setBankName("");
      setAccountNumber("");
      setAccountHolder("");
      toast.success(REFUND_MESSAGES.REQUEST_SUCCESS);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể gửi yêu cầu hoàn tiền");
    } finally {
      setIsSubmittingRefund(false);
    }
  };

  const searchedOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return orders;
    return orders.filter((o) => matchesQuery(o, query));
  }, [orders, searchQuery]);

  /* Counts follow the search, so the tab numbers always describe what a click
     would actually show. */
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tab of BUYER_ORDER_TABS) {
      counts[tab.key] = searchedOrders.filter((o) =>
        matchesTab(o, tab.key),
      ).length;
    }
    return counts;
  }, [searchedOrders]);

  const filteredOrders = useMemo(
    () => searchedOrders.filter((o) => matchesTab(o, activeTab)),
    [searchedOrders, activeTab],
  );

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedOrders = filteredOrders.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
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
    tabCounts,
    searchQuery,
    setSearchQuery: handleSearchChange,
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
    bankName,
    setBankName,
    accountNumber,
    setAccountNumber,
    accountHolder,
    setAccountHolder,
  };
}
