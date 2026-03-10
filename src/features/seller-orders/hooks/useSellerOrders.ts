import { useCallback, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { OrderService } from "@/services/order.service";
import { useToast } from "@/components/ui/Toast";
import { usePagination } from "@/hooks/usePagination";
import type { Order } from "@/types/order";
import { ORDER_MESSAGES, SELLER_MESSAGES } from "@/constants/messages";

const PAGE_SIZE = 8;

// Maps individual tab keys → matching order statuses
export const SELLER_TAB_STATUSES: Record<string, string[]> = {
  all:              [],
  pending:          ["pending"],
  confirmed:        ["confirmed"],
  picked_up:        ["picked_up"],
  shipping:         ["shipping"],
  out_for_delivery: ["out_for_delivery"],
  delivered:        ["delivered"],
  completed:        ["completed"],
  refund_requested: ["refund_requested"],
  refund_approved:  ["refund_approved"],
  cancelled:        ["cancelled"],
  delivery_failed:  ["delivery_failed"],
  returned:         ["returned"],
  refunded:         ["refunded"],
};

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export type SortOption = "newest" | "oldest" | "highest" | "lowest";
export type DateFilter = "all" | "today" | "week" | "month";

export function useSellerOrders() {
  const router = useRouter();
  const toast = useToast();
  const { data: account, isLoading: userLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTabState] = useState<string>("all");
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQueryState] = useState("");
  const [sortBy, setSortByState] = useState<SortOption>("newest");
  const [dateFilter, setDateFilterState] = useState<DateFilter>("all");

  useEffect(() => {
    if (!userLoading && !account) {
      router.push("/login");
      return;
    }
    if (!account) return;

    const fetchOrders = async () => {
      try {
        const res = await OrderService.getSellerOrders();
        setOrders(res.orders || []);
      } catch (error) {
        console.error("Error fetching seller orders:", error);
        toast.error(ORDER_MESSAGES.LOAD_ERROR);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [account, userLoading, router, toast]);

  // Dashboard summary stats
  const stats = useMemo(() => {
    const todayOrders = orders.filter((o) => isToday(o.createdAt));
    const todayRevenue = todayOrders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.totalAmount, 0);
    return {
      todayOrders: todayOrders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      shipping: orders.filter((o) =>
        ["confirmed", "picked_up", "shipping", "out_for_delivery"].includes(o.status)
      ).length,
      returnRequests: orders.filter((o) => o.status === "refund_requested").length,
      todayRevenue,
    };
  }, [orders]);

  // Per-tab counts (using the simplified tab mapping)
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    for (const [tab, statuses] of Object.entries(SELLER_TAB_STATUSES)) {
      if (tab === "all") continue;
      counts[tab] = orders.filter((o) => statuses.includes(o.status)).length;
    }
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let list = orders;

    // Tab filter
    const tabStatuses = SELLER_TAB_STATUSES[activeTab];
    if (tabStatuses && tabStatuses.length > 0) {
      list = list.filter((o) => tabStatuses.includes(o.status));
    }

    // Date filter
    if (dateFilter === "today") {
      list = list.filter((o) => isToday(o.createdAt));
    } else if (dateFilter === "week") {
      const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
      list = list.filter((o) => new Date(o.createdAt).getTime() > cutoff);
    } else if (dateFilter === "month") {
      const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
      list = list.filter((o) => new Date(o.createdAt).getTime() > cutoff);
    }

    // Search by order ID / buyer name / product name
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o._id.toLowerCase().includes(q) ||
          o.buyerId?.fullName?.toLowerCase().includes(q) ||
          o.products?.some((p) => p.productId?.name?.toLowerCase().includes(q))
      );
    }

    // Sort
    return [...list].sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "highest") return b.totalAmount - a.totalAmount;
      if (sortBy === "lowest") return a.totalAmount - b.totalAmount;
      return 0;
    });
  }, [orders, activeTab, searchQuery, sortBy, dateFilter]);

  const paginationTotalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const { page, setPage, resetPage } = usePagination(paginationTotalPages);
  const paginatedOrders = useMemo(
    () => filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredOrders, page],
  );

  const handleUpdateStatus = async (
    orderId: string,
    status: "confirmed" | "cancelled",
    reason?: string
  ) => {
    setUpdatingId(orderId);
    try {
      const { order: updatedOrder } = await OrderService.updateSellerOrder(
        orderId,
        status,
        reason
      );
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, ...(updatedOrder || { status }) } : o
        )
      );
      if (status === "confirmed") {
        toast.success(
          updatedOrder?.ghnOrderCode
            ? "Đã xác nhận đơn hàng và tạo đơn GHN"
            : "Đã xác nhận đơn hàng (chưa tạo được đơn GHN)"
        );
      } else {
        toast.success(SELLER_MESSAGES.SELLER_ORDER_CANCEL_SUCCESS);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể cập nhật đơn hàng"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleImageError = (orderId: string) => {
    setImageErrorMap((prev) =>
      prev[orderId] ? prev : { ...prev, [orderId]: true }
    );
  };

  const handleApproveRefund = async (orderId: string) => {
    setUpdatingId(orderId);
    try {
      await OrderService.approveRefund(orderId);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "refund_approved" } : o))
      );
      toast.success(SELLER_MESSAGES.SELLER_REFUND_AGREED);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể xử lý yêu cầu hoàn tiền"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const setActiveTab = useCallback(
    (tab: string) => { setActiveTabState(tab); resetPage(); },
    [resetPage],
  );
  const setSearchQuery = useCallback(
    (q: string) => { setSearchQueryState(q); resetPage(); },
    [resetPage],
  );
  const setSortBy = useCallback(
    (s: SortOption) => { setSortByState(s); resetPage(); },
    [resetPage],
  );
  const setDateFilter = useCallback(
    (d: DateFilter) => { setDateFilterState(d); resetPage(); },
    [resetPage],
  );

  return {
    account,
    userLoading,
    orders,
    isLoading,
    updatingId,
    activeTab,
    setActiveTab,
    imageErrorMap,
    stats,
    tabCounts,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    dateFilter,
    setDateFilter,
    handleImageError,
    handleUpdateStatus,
    handleApproveRefund,
    filteredOrders,
    paginatedOrders,
    page,
    totalPages: paginationTotalPages,
    setPage,
  };
}
