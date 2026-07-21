"use client";

import {
  IconArrowNarrowRight,
  IconCircleCheck,
  IconCircleX,
  IconCalendar,
  IconArrowsSort,
  IconLoader2,
  IconSearch,
  IconTruck,
  IconCreditCard,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PAGE_SIZE, useSellerOrders, type DateFilter, type SortOption } from "./hooks/useSellerOrders";
import OrderTabs from "./components/OrderTabs";
import EmptyOrderState from "./components/EmptyOrderState";
import {
  Button,
  CancelOrderReasonDialog,
  ConfirmWithReasonDialog,
  Pagination,
  StatusBadge,
} from "@/components/shared";
import { REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER } from "@/constants/refund";
import { formatPrice } from "@/utils/format/price";
import { format as formatDateTime, formatDateOnly } from "@/utils/format/date";
import { formatPaymentMethod, formatShippingMethod } from "@/utils/format";
import { getOrderStatusLabel, getRefundStatusNotice } from "@/constants/orderStatus";
import { cn } from "@/lib/utils";
import {
  getBuyerEmail,
  getBuyerName,
  getProductImage,
  getPaymentStatusLabel,
} from "./utils/orderUtils";

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "Táº¥t cáº£ thá»i gian" },
  { value: "today", label: "HÃ´m nay" },
  { value: "week", label: "7 ngÃ y qua" },
  { value: "month", label: "30 ngÃ y qua" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Má»›i nháº¥t" },
  { value: "oldest", label: "CÅ© nháº¥t" },
  { value: "highest", label: "GiÃ¡ trá»‹ cao" },
  { value: "lowest", label: "GiÃ¡ trá»‹ tháº¥p" },
];

const REFUND_REQUEST_STATUS_LABELS: Record<string, string> = {
  pending: "Chá» báº¡n xÃ©t duyá»‡t",
  approved: "ÄÃ£ cháº¥p thuáº­n (chá» táº¡o / gá»­i hÃ ng hoÃ n)",
  rejected: "ÄÃ£ tá»« chá»‘i",
  return_shipping: "Äang hoÃ n tráº£ hÃ ng (buyer gá»­i vá»)",
  returning: "HÃ ng hoÃ n Ä‘ang váº­n chuyá»ƒn",
  returned: "ÄÃ£ nháº­n hÃ ng hoÃ n",
  bank_info_required: "Chá» buyer cung cáº¥p STK",
  processing: "Äang xá»­ lÃ½ hoÃ n tiá»n",
  completed: "ÄÃ£ hoÃ n tiá»n",
  failed: "HoÃ n tiá»n lá»—i â€” cáº§n xá»­ lÃ½ láº¡i",
  disputed: "Äang tranh cháº¥p",
};

/** order.status thÆ°á»ng váº«n lÃ  "refund"; chi tiáº¿t náº±m á»Ÿ Refund.status */
function getSellerRefundTodo(orderStatus: string, refundStatus: string | null | undefined) {
  const rs = refundStatus ?? null;
  if (orderStatus === "refunded") {
    return {
      tone: "success" as const,
      title: "HoÃ n tiá»n Ä‘Ã£ hoÃ n táº¥t",
      description: "ÄÆ¡n hÃ ng nÃ y Ä‘Ã£ Ä‘Æ°á»£c hoÃ n tiá»n thÃ nh cÃ´ng cho buyer.",
    };
  }
  if (rs === "rejected") {
    return {
      tone: "warning" as const,
      title: "Báº¡n Ä‘Ã£ tá»« chá»‘i yÃªu cáº§u",
      description: "Buyer cÃ³ thá»ƒ khiáº¿u náº¡i lÃªn admin. Theo dÃµi thÃ´ng bÃ¡o náº¿u cÃ³ tranh cháº¥p.",
    };
  }
  if (rs === "disputed") {
    return {
      tone: "warning" as const,
      title: "Äang tranh cháº¥p",
      description: "Admin Ä‘ang xem xÃ©t. KhÃ´ng cáº§n báº¥m duyá»‡t láº¡i trÃªn Ä‘Æ¡n nÃ y.",
    };
  }
  if (rs === "pending" || ((orderStatus === "refund" || orderStatus === "refund_requested") && !rs)) {
    return {
      tone: "warning" as const,
      title: "Viá»‡c cáº§n lÃ m ngay",
      description: "Kiá»ƒm tra lÃ½ do hoÃ n tiá»n, sau Ä‘Ã³ chá»n Cháº¥p thuáº­n hoáº·c Tá»« chá»‘i Ä‘á»ƒ khÃ´ng quÃ¡ SLA xá»­ lÃ½.",
    };
  }
  if (rs === "approved" || rs === "return_shipping" || rs === "returning") {
    return {
      tone: "info" as const,
      title: "Viá»‡c cáº§n lÃ m ngay",
      description:
        "Theo dÃµi váº­n Ä‘Æ¡n hoÃ n vÃ  xÃ¡c nháº­n Ä‘Ã£ nháº­n láº¡i hÃ ng khi buyer tráº£ hÃ ng thÃ nh cÃ´ng. " +
        REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER,
    };
  }
  if (rs === "returned" || rs === "processing" || rs === "bank_info_required") {
    return {
      tone: "warning" as const,
      title: "ÄÆ¡n Ä‘Ã£ sáºµn sÃ ng hoÃ n tiá»n",
      description: "Há»‡ thá»‘ng Ä‘ang xá»­ lÃ½ chuyá»ƒn tiá»n hoÃ n cho buyer (hoáº·c chá» thÃ´ng tin tá»« buyer).",
    };
  }
  if (rs === "completed") {
    return {
      tone: "success" as const,
      title: "HoÃ n tiá»n Ä‘Ã£ hoÃ n táº¥t",
      description: "ÄÆ¡n hÃ ng nÃ y Ä‘Ã£ Ä‘Æ°á»£c hoÃ n tiá»n thÃ nh cÃ´ng cho buyer.",
    };
  }
  switch (orderStatus) {
    case "returning":
    case "return_shipping":
      return {
        tone: "info" as const,
        title: "Viá»‡c cáº§n lÃ m ngay",
        description:
          "Theo dÃµi váº­n Ä‘Æ¡n hoÃ n vÃ  xÃ¡c nháº­n Ä‘Ã£ nháº­n láº¡i hÃ ng khi buyer tráº£ hÃ ng thÃ nh cÃ´ng. " +
          REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER,
      };
    case "returned":
      return {
        tone: "warning" as const,
        title: "ÄÆ¡n Ä‘Ã£ sáºµn sÃ ng hoÃ n tiá»n",
        description: "Báº¡n Ä‘Ã£ nháº­n láº¡i hÃ ng. Há»‡ thá»‘ng Ä‘ang chá» admin xá»­ lÃ½ hoÃ n tiá»n cho buyer.",
      };
    default:
      return null;
  }
}

/** Map Refund.status â†’ pseudo order status cho getRefundStatusNotice (seller) */
function sellerNoticeStatusFromRefund(
  orderStatus: string,
  refundStatus: string | null | undefined,
): string {
  const rs = refundStatus ?? null;
  if (orderStatus !== "refund" || !rs) return orderStatus;
  switch (rs) {
    case "pending":
      return "refund_requested";
    case "approved":
      return "refund_approved";
    case "return_shipping":
    case "returning":
      return "return_shipping";
    case "returned":
    case "processing":
    case "bank_info_required":
      return "returned";
    case "completed":
      return "refunded";
    case "rejected":
    case "disputed":
      return orderStatus;
    default:
      return orderStatus;
  }
}

export default function SellerOrders() {
  const {
    account,
    userLoading,
    isLoading,
    activeTab,
    setActiveTab,
    filteredOrders,
    paginatedOrders,
    page,
    totalPages,
    setPage,
    updatingId,
    stats,
    tabCounts,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    dateFilter,
    setDateFilter,
    imageErrorMap,
    handleImageError,
    handleUpdateStatus,
    handleApproveRefund,
    handleRejectRefund,
    handleConfirmReturnReceived,
  } = useSellerOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rejectRefundOpen, setRejectRefundOpen] = useState(false);
  const pageStart = filteredOrders.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(page * PAGE_SIZE, filteredOrders.length);
  const selectedOrder = useMemo(
    () =>
      (selectedOrderId ? paginatedOrders.find((o) => o._id === selectedOrderId) : null) ||
      paginatedOrders[0] ||
      null,
    [selectedOrderId, paginatedOrders]
  );

  useEffect(() => {
    if (!selectedOrderId && paginatedOrders[0]) {
      setSelectedOrderId(paginatedOrders[0]._id);
      return;
    }
    if (
      selectedOrderId &&
      paginatedOrders.length > 0 &&
      !paginatedOrders.some((o) => o._id === selectedOrderId)
    ) {
      setSelectedOrderId(paginatedOrders[0]._id);
    }
  }, [selectedOrderId, paginatedOrders]);

  const selectedOrderProducts = selectedOrder?.products || [];
  const isSelectedUpdating = selectedOrder ? updatingId === selectedOrder._id : false;
  const paymentBadgeClass =
    selectedOrder?.paymentStatus === "paid"
      ? "bg-green-100 text-green-700 border-green-200"
      : selectedOrder?.paymentStatus === "refunded"
      ? "bg-blue-100 text-blue-700 border-blue-200"
      : "bg-amber-100 text-amber-700 border-amber-200";
  const selectedPaymentStatusLabel = selectedOrder
    ? getPaymentStatusLabel(selectedOrder.paymentStatus)
    : "KhÃ´ng xÃ¡c Ä‘á»‹nh";
  const selectedProductAmount = selectedOrder
    ? selectedOrder.productAmount ??
      selectedOrder.products.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0)
    : 0;
  const selectedShippingFee = selectedOrder
    ? selectedOrder.totalShippingFee ?? selectedOrder.shippingFee ?? 0
    : 0;
  const selectedGrandTotal = selectedOrder?.totalAmount ?? selectedProductAmount + selectedShippingFee;
  const refundRequest =
    selectedOrder?.refundRequestId && typeof selectedOrder.refundRequestId === "object"
      ? selectedOrder.refundRequestId
      : null;
  const refundRequestStatus = refundRequest?.status;
  const sellerRefundNotice = selectedOrder
    ? refundRequestStatus === "rejected"
      ? {
          title: "Báº¡n Ä‘Ã£ tá»« chá»‘i yÃªu cáº§u hoÃ n tiá»n",
          description: "Buyer cÃ³ thá»ƒ khiáº¿u náº¡i lÃªn admin. Báº¡n khÃ´ng cáº§n thao tÃ¡c duyá»‡t thÃªm trÃªn Ä‘Æ¡n nÃ y.",
          tone: "warning" as const,
        }
      : refundRequestStatus === "disputed"
      ? {
          title: "Khiáº¿u náº¡i Ä‘ang Ä‘Æ°á»£c admin xem xÃ©t",
          description: "Vui lÃ²ng chá» quyáº¿t Ä‘á»‹nh tá»« quáº£n trá»‹ viÃªn.",
          tone: "warning" as const,
        }
      : getRefundStatusNotice(
          sellerNoticeStatusFromRefund(selectedOrder.status, refundRequestStatus),
          "seller",
        )
    : null;
  const sellerRefundNoticeClass =
    sellerRefundNotice?.tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : sellerRefundNotice?.tone === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-sky-200 bg-sky-50 text-sky-800";
  const sellerRefundTodo = selectedOrder
    ? getSellerRefundTodo(selectedOrder.status, refundRequestStatus)
    : null;
  const sellerRefundTodoClass =
    sellerRefundTodo?.tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : sellerRefundTodo?.tone === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-sky-200 bg-sky-50 text-sky-800";

  const canSellerApproveRejectRefund =
    !!selectedOrder &&
    (selectedOrder.status === "refund_requested" || selectedOrder.status === "refund") &&
    (refundRequest == null || refundRequest.status === "pending");
  const canSellerConfirmReturn =
    !!selectedOrder &&
    (refundRequest?.status === "return_shipping" ||
      refundRequest?.status === "returning" ||
      selectedOrder.status === "returning" ||
      selectedOrder.status === "return_shipping");

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!account) return null;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-8xl px-4 py-6 md:py-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Quáº£n lÃ½ Ä‘Æ¡n hÃ ng</h1>
            <p className="text-sm text-muted-foreground">
              Theo dÃµi vÃ  xá»­ lÃ½ cÃ¡c Ä‘Æ¡n hÃ ng má»›i tá»« ngÆ°á»i mua.
            </p>
          </div>
          <div className="text-xs font-medium text-muted-foreground">
            HÃ´m nay: <span className="text-foreground">{stats.todayOrders}</span> Ä‘Æ¡n â€¢{" "}
            <span className="text-foreground">{formatPrice(stats.todayRevenue)}</span>
          </div>
        </div>

        <section className="rounded-2xl border border-border bg-card p-3 shadow-sm">
          <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} tabCounts={tabCounts} />

          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-background p-2.5">
            <div className="relative min-w-[220px] flex-1">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="TÃ¬m mÃ£ Ä‘Æ¡n hoáº·c tÃªn ngÆ°á»i mua..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-2 text-sm">
              <IconCalendar className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                className="cursor-pointer bg-transparent text-sm outline-none"
              >
                {DATE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-2 text-sm">
              <IconArrowsSort className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="cursor-pointer bg-transparent text-sm outline-none"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <EmptyOrderState activeTab={activeTab} />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.8fr_1fr]">
                <div className="rounded-xl border border-border">
                  <div className="hidden grid-cols-[1.1fr_1fr_1.2fr_0.9fr_1fr_0.8fr] border-b border-border bg-muted/20 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground md:grid">
                    <span>MÃ£ Ä‘Æ¡n</span>
                    <span>NgÃ y táº¡o</span>
                    <span>NgÆ°á»i mua</span>
                    <span>Sá»‘ SP</span>
                    <span>Tá»•ng tiá»n</span>
                    <span>Thanh toÃ¡n</span>
                  </div>

                  <div className="divide-y divide-border">
                    {paginatedOrders.map((order) => {
                      const productCount = order.products?.length ?? 0;
                      const isSelected = selectedOrder?._id === order._id;
                      const rowRefundDoc =
                        order.refundRequestId && typeof order.refundRequestId === "object"
                          ? order.refundRequestId
                          : null;
                      const paymentClass =
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : order.paymentStatus === "refunded"
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : "bg-amber-100 text-amber-700 border-amber-200";

                      return (
                        <button
                          key={order._id}
                          type="button"
                          onClick={() => setSelectedOrderId(order._id)}
                          className={cn(
                            "w-full px-4 py-3 text-left transition-colors hover:bg-muted/20",
                            isSelected && "bg-primary/5"
                          )}
                        >
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-[1.1fr_1fr_1.2fr_0.9fr_1fr_0.8fr] md:items-center">
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-foreground">
                                #{order._id.slice(-8).toUpperCase()}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {getOrderStatusLabel(order.status)}
                              </p>
                              {rowRefundDoc && order.status === "refund" && (
                                <p className="text-[10px] text-primary/80 font-medium mt-0.5">
                                  {REFUND_REQUEST_STATUS_LABELS[rowRefundDoc.status] ?? rowRefundDoc.status}
                                </p>
                              )}
                            </div>
                            <p className="text-xs text-foreground">{formatDateOnly(order.createdAt)}</p>
                            <p className="truncate text-sm font-medium text-foreground">
                              {getBuyerName(order)}
                            </p>
                            <p className="text-xs text-muted-foreground">{productCount} sáº£n pháº©m</p>
                            <p className="text-sm font-semibold text-foreground">
                              {formatPrice(order.totalAmount)}
                            </p>
                            <span
                              className={cn(
                                "inline-flex h-6 items-center justify-center rounded-full border px-2 text-[10px] font-bold",
                                paymentClass
                              )}
                            >
                              {order.paymentStatus === "paid"
                                ? "ÄÃƒ TT"
                                : order.paymentStatus === "refunded"
                                ? "ÄÃƒ HOÃ€N"
                                : "CHÆ¯A TT"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 md:flex-row">
                    <p className="text-xs text-muted-foreground">
                      Hiá»ƒn thá»‹ {pageStart}-{pageEnd} trÃªn {filteredOrders.length} káº¿t quáº£
                    </p>
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                  </div>
                </div>

                <aside className="rounded-xl border border-border bg-background">
                  {!selectedOrder ? (
                    <div className="flex min-h-[420px] items-center justify-center p-6 text-center text-sm text-muted-foreground">
                      Chá»n Ä‘Æ¡n hÃ ng bÃªn trÃ¡i Ä‘á»ƒ xem chi tiáº¿t.
                    </div>
                  ) : (
                    <div className="space-y-4 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xl font-bold text-foreground">
                            ÄÆ¡n #{selectedOrder._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Äáº·t lÃºc {formatDateTime(selectedOrder.createdAt)}
                          </p>
                        </div>
                        <StatusBadge status={selectedOrder.status} />
                      </div>

                      {selectedOrder.status === "pending" && (
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(selectedOrder._id, "confirmed")}
                            loading={isSelectedUpdating}
                            leftIcon={<IconCircleCheck className="h-4 w-4" />}
                          >
                            XÃ¡c nháº­n Ä‘Æ¡n
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCancelOpen(true)}
                            disabled={isSelectedUpdating}
                            leftIcon={<IconCircleX className="h-4 w-4" />}
                          >
                            Há»§y Ä‘Æ¡n
                          </Button>
                        </div>
                      )}

                      {canSellerApproveRejectRefund && (
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRejectRefundOpen(true)}
                            disabled={isSelectedUpdating}
                            leftIcon={<IconCircleX className="h-4 w-4" />}
                          >
                            Tá»« chá»‘i
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApproveRefund(selectedOrder._id)}
                            loading={isSelectedUpdating}
                            leftIcon={<IconCircleCheck className="h-4 w-4" />}
                          >
                            Cháº¥p thuáº­n
                          </Button>
                        </div>
                      )}

                      {canSellerConfirmReturn && (
                        <Button
                          size="sm"
                          fullWidth
                          onClick={() => handleConfirmReturnReceived(selectedOrder._id)}
                          loading={isSelectedUpdating}
                          leftIcon={<IconCircleCheck className="h-4 w-4" />}
                        >
                          XÃ¡c nháº­n Ä‘Ã£ nháº­n láº¡i hÃ ng
                        </Button>
                      )}

                      {sellerRefundTodo && (
                        <div className={cn("rounded-lg border px-3 py-2.5", sellerRefundTodoClass)}>
                          <p className="inline-flex items-center gap-1.5 text-xs font-semibold">
                            <IconAlertTriangle className="h-3.5 w-3.5" />
                            {sellerRefundTodo.title}
                          </p>
                          <p className="mt-1 text-xs">{sellerRefundTodo.description}</p>
                        </div>
                      )}

                      {(selectedOrder.status === "returned" ||
                        refundRequest?.status === "returned" ||
                        refundRequest?.status === "processing" ||
                        refundRequest?.status === "bank_info_required") && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                          {refundRequest?.status === "returned"
                            ? "Báº¡n Ä‘Ã£ xÃ¡c nháº­n nháº­n láº¡i hÃ ng. Há»‡ thá»‘ng Ä‘ang chá» bÆ°á»›c hoÃ n tiá»n cho buyer."
                            : "Há»‡ thá»‘ng Ä‘ang xá»­ lÃ½ hoÃ n tiá»n cho buyer."}
                        </div>
                      )}

                      {selectedOrder.status !== "pending" &&
                        !canSellerApproveRejectRefund &&
                        !canSellerConfirmReturn &&
                        selectedOrder.status !== "refund_requested" &&
                        selectedOrder.status !== "refund" &&
                        selectedOrder.status !== "returning" &&
                        selectedOrder.status !== "return_shipping" &&
                        selectedOrder.status !== "returned" &&
                        refundRequest?.status !== "returned" &&
                        refundRequest?.status !== "processing" &&
                        refundRequest?.status !== "bank_info_required" && (
                          <div className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                            ÄÆ¡n hÃ ng hiá»‡n khÃ´ng cÃ³ thao tÃ¡c nhanh.
                          </div>
                        )}
                      {sellerRefundNotice && (
                        <div className={cn("rounded-lg border px-3 py-2.5", sellerRefundNoticeClass)}>
                          <p className="text-xs font-semibold">{sellerRefundNotice.title}</p>
                          <p className="mt-1 text-xs">{sellerRefundNotice.description}</p>
                        </div>
                      )}
                      {refundRequest && (
                        <div className="rounded-xl border border-border bg-card p-3">
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            ThÃ´ng tin yÃªu cáº§u hoÃ n tiá»n
                          </p>
                          <div className="space-y-1.5 text-xs">
                            <p className="text-muted-foreground">
                              Tráº¡ng thÃ¡i:{" "}
                              <span className="font-medium text-foreground">
                                {REFUND_REQUEST_STATUS_LABELS[refundRequest.status] || refundRequest.status}
                              </span>
                            </p>
                            <p className="text-muted-foreground">
                              LÃ½ do: <span className="font-medium text-foreground">{refundRequest.reason || "â€”"}</span>
                            </p>
                            <p className="text-muted-foreground">
                              Sá»‘ tiá»n hoÃ n:{" "}
                              <span className="font-semibold text-foreground">
                                {formatPrice(refundRequest.refundAmount || selectedOrder.totalAmount)}
                              </span>
                            </p>
                            <p className="text-muted-foreground">
                              Thá»i gian gá»­i:{" "}
                              <span className="font-medium text-foreground">
                                {formatDateTime(refundRequest.createdAt)}
                              </span>
                            </p>
                          </div>
                        </div>
                      )}

                      <Link
                        href={`/my/orders/${selectedOrder._id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        Xem trang chi tiáº¿t
                        <IconArrowNarrowRight className="h-4 w-4" />
                      </Link>

                      <div className="rounded-xl border border-border bg-muted/20 p-3">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          ThÃ´ng tin khÃ¡ch hÃ ng
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {getBuyerName(selectedOrder)}
                        </p>
                        <p className="text-xs text-muted-foreground">Email: {getBuyerEmail(selectedOrder)}</p>
         
                        <p className="text-xs text-muted-foreground">
                          Cáº­p nháº­t: {formatDateTime(selectedOrder.updatedAt)}
                        </p>
                      </div>

                      <div className="rounded-xl border border-border bg-muted/20 p-3">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Äá»‹a chá»‰ giao hÃ ng
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {selectedOrder.shippingAddress?.fullName || "â€”"}
                          {selectedOrder.shippingAddress?.phoneNumber
                            ? ` | ${selectedOrder.shippingAddress.phoneNumber}`
                            : ""}
                        </p>
                        <p className="text-xs leading-relaxed text-foreground">
                          {[
                            selectedOrder.shippingAddress?.specificAddress,
                            selectedOrder.shippingAddress?.ward,
                            selectedOrder.shippingAddress?.district,
                            selectedOrder.shippingAddress?.province,
                          ]
                            .filter((part) => Boolean(part && String(part).trim()))
                            .join(", ") || "â€”"}
                        </p>
                        <div className="mt-2 grid grid-cols-1 gap-1.5 text-xs text-muted-foreground">
                          <p className="inline-flex items-center gap-1.5">
                            <IconTruck className="h-3.5 w-3.5" />
                            {formatShippingMethod(selectedOrder.shippingMethod)}
                          </p>
                          <p className="inline-flex items-center gap-1.5">
                            <IconCreditCard className="h-3.5 w-3.5" />
                            {formatPaymentMethod(selectedOrder.paymentMethod, {
                              shippingMethod: selectedOrder.shippingMethod,
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-xl border border-border">
                        <div className="border-b border-border px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Sáº£n pháº©m trong Ä‘Æ¡n
                          </p>
                        </div>
                        <div className="divide-y divide-border">
                          {selectedOrderProducts.map((p, idx) => {
                            const imageKey = `${selectedOrder._id}-${idx}`;
                            const productImage = getProductImage(p.productId, imageErrorMap, imageKey);

                            return (
                              <div key={`${p.productId?._id || idx}`} className="flex items-start gap-2.5 px-3 py-2.5">
                                <div className="relative h-10 w-10 overflow-hidden rounded-md border border-border bg-muted/50">
                                  <Image
                                    src={productImage}
                                    alt={p.productId?.name || "Sáº£n pháº©m"}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                    onError={() => handleImageError(imageKey)}
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-foreground">
                                    {p.productId?.name || "Sáº£n pháº©m"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    SL: {p.quantity} â€¢ ÄÆ¡n giÃ¡: {formatPrice(p.price)}
                                  </p>
                                </div>
                                <p className="text-xs font-semibold text-foreground">
                                  {formatPrice(p.price * p.quantity)}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="rounded-xl border border-border bg-card p-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Tiá»n sáº£n pháº©m</span>
                          <span className="font-medium">{formatPrice(selectedProductAmount)}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Tiá»n ship</span>
                          <span className="font-medium">{formatPrice(selectedShippingFee)}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">PhÆ°Æ¡ng thá»©c thanh toÃ¡n</span>
                          <span className="font-medium text-foreground">
                            {formatPaymentMethod(selectedOrder.paymentMethod, {
                              shippingMethod: selectedOrder.shippingMethod,
                            })}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Tráº¡ng thÃ¡i thanh toÃ¡n</span>
                          <span className={cn("rounded-md border px-2 py-0.5 text-[11px] font-semibold", paymentBadgeClass)}>
                            {selectedPaymentStatusLabel}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
                          <span className="font-semibold text-foreground">Tá»•ng tiá»n</span>
                          <span className="font-bold text-primary">
                            {formatPrice(selectedGrandTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </aside>
              </div>
            </>
          )}
        </section>

        {selectedOrder && (
          <CancelOrderReasonDialog
            isOpen={cancelOpen}
            orderCode={selectedOrder._id.slice(-8).toUpperCase()}
            isLoading={isSelectedUpdating}
            onCancel={() => setCancelOpen(false)}
            onConfirm={(reason) => {
              setCancelOpen(false);
              handleUpdateStatus(selectedOrder._id, "cancelled", reason);
            }}
          />
        )}
        {selectedOrder && (
          <ConfirmWithReasonDialog
            isOpen={rejectRefundOpen}
            title="Tá»« chá»‘i yÃªu cáº§u hoÃ n tiá»n"
            description={`ÄÆ¡n #${selectedOrder._id.slice(-8).toUpperCase()}`}
            reasonLabel="LÃ½ do tá»« chá»‘i"
            reasonPlaceholder="MÃ´ táº£ lÃ½ do tá»« chá»‘i Ä‘á»ƒ buyer náº¯m Ä‘Æ°á»£c."
            reasonHint="Buyer sáº½ nháº­n ná»™i dung lÃ½ do nÃ y."
            confirmText="XÃ¡c nháº­n tá»« chá»‘i"
            variant="danger"
            isLoading={isSelectedUpdating}
            onCancel={() => setRejectRefundOpen(false)}
            onConfirm={(reason) => {
              setRejectRefundOpen(false);
              handleRejectRefund(selectedOrder._id, reason);
            }}
          />
        )}
      </main>
    </div>
  );
}

