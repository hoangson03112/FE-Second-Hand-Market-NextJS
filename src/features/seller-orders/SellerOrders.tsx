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
  { value: "all", label: "Tất cả thời gian" },
  { value: "today", label: "Hôm nay" },
  { value: "week", label: "7 ngày qua" },
  { value: "month", label: "30 ngày qua" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "highest", label: "Giá trị cao" },
  { value: "lowest", label: "Giá trị thấp" },
];

const REFUND_REQUEST_STATUS_LABELS: Record<string, string> = {
  pending: "Chờ bạn xét duyệt",
  approved: "Đã chấp thuận (chờ tạo / gửi hàng hoàn)",
  rejected: "Đã từ chối",
  return_shipping: "Đang hoàn trả hàng (buyer gửi về)",
  returning: "Hàng hoàn đang vận chuyển",
  returned: "Đã nhận hàng hoàn",
  bank_info_required: "Chờ buyer cung cấp STK",
  processing: "Đang xử lý hoàn tiền",
  completed: "Đã hoàn tiền",
  failed: "Hoàn tiền lỗi — cần xử lý lại",
  disputed: "Đang tranh chấp",
};

/** order.status thường vẫn là "refund"; chi tiết nằm ở Refund.status */
function getSellerRefundTodo(orderStatus: string, refundStatus: string | null | undefined) {
  const rs = refundStatus ?? null;
  if (orderStatus === "refunded") {
    return {
      tone: "success" as const,
      title: "Hoàn tiền đã hoàn tất",
      description: "Đơn hàng này đã được hoàn tiền thành công cho buyer.",
    };
  }
  if (rs === "rejected") {
    return {
      tone: "warning" as const,
      title: "Bạn đã từ chối yêu cầu",
      description: "Buyer có thể khiếu nại lên admin. Theo dõi thông báo nếu có tranh chấp.",
    };
  }
  if (rs === "disputed") {
    return {
      tone: "warning" as const,
      title: "Đang tranh chấp",
      description: "Admin đang xem xét. Không cần bấm duyệt lại trên đơn này.",
    };
  }
  if (rs === "pending" || ((orderStatus === "refund" || orderStatus === "refund_requested") && !rs)) {
    return {
      tone: "warning" as const,
      title: "Việc cần làm ngay",
      description: "Kiểm tra lý do hoàn tiền, sau đó chọn Chấp thuận hoặc Từ chối để không quá SLA xử lý.",
    };
  }
  if (rs === "approved" || rs === "return_shipping" || rs === "returning") {
    return {
      tone: "info" as const,
      title: "Việc cần làm ngay",
      description:
        "Theo dõi vận đơn hoàn và xác nhận đã nhận lại hàng khi buyer trả hàng thành công. " +
        REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER,
    };
  }
  if (rs === "returned" || rs === "processing" || rs === "bank_info_required") {
    return {
      tone: "warning" as const,
      title: "Đơn đã sẵn sàng hoàn tiền",
      description: "Hệ thống đang xử lý chuyển tiền hoàn cho buyer (hoặc chờ thông tin từ buyer).",
    };
  }
  if (rs === "completed") {
    return {
      tone: "success" as const,
      title: "Hoàn tiền đã hoàn tất",
      description: "Đơn hàng này đã được hoàn tiền thành công cho buyer.",
    };
  }
  switch (orderStatus) {
    case "returning":
    case "return_shipping":
      return {
        tone: "info" as const,
        title: "Việc cần làm ngay",
        description:
          "Theo dõi vận đơn hoàn và xác nhận đã nhận lại hàng khi buyer trả hàng thành công. " +
          REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER,
      };
    case "returned":
      return {
        tone: "warning" as const,
        title: "Đơn đã sẵn sàng hoàn tiền",
        description: "Bạn đã nhận lại hàng. Hệ thống đang chờ admin xử lý hoàn tiền cho buyer.",
      };
    default:
      return null;
  }
}

/** Map Refund.status → pseudo order status cho getRefundStatusNotice (seller) */
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
    : "Không xác định";
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
          title: "Bạn đã từ chối yêu cầu hoàn tiền",
          description: "Buyer có thể khiếu nại lên admin. Bạn không cần thao tác duyệt thêm trên đơn này.",
          tone: "warning" as const,
        }
      : refundRequestStatus === "disputed"
      ? {
          title: "Khiếu nại đang được admin xem xét",
          description: "Vui lòng chờ quyết định từ quản trị viên.",
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
      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Quản lý đơn hàng</h1>
            <p className="text-sm text-muted-foreground">
              Theo dõi và xử lý các đơn hàng mới từ người mua.
            </p>
          </div>
          <div className="text-xs font-medium text-muted-foreground">
            Hôm nay: <span className="text-foreground">{stats.todayOrders}</span> đơn •{" "}
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
                placeholder="Tìm mã đơn hoặc tên người mua..."
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
                    <span>Mã đơn</span>
                    <span>Ngày tạo</span>
                    <span>Người mua</span>
                    <span>Số SP</span>
                    <span>Tổng tiền</span>
                    <span>Thanh toán</span>
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
                            <p className="text-xs text-muted-foreground">{productCount} sản phẩm</p>
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
                                ? "ĐÃ TT"
                                : order.paymentStatus === "refunded"
                                ? "ĐÃ HOÀN"
                                : "CHƯA TT"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 md:flex-row">
                    <p className="text-xs text-muted-foreground">
                      Hiển thị {pageStart}-{pageEnd} trên {filteredOrders.length} kết quả
                    </p>
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                  </div>
                </div>

                <aside className="rounded-xl border border-border bg-background">
                  {!selectedOrder ? (
                    <div className="flex min-h-[420px] items-center justify-center p-6 text-center text-sm text-muted-foreground">
                      Chọn đơn hàng bên trái để xem chi tiết.
                    </div>
                  ) : (
                    <div className="space-y-4 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xl font-bold text-foreground">
                            Đơn #{selectedOrder._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Đặt lúc {formatDateTime(selectedOrder.createdAt)}
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
                            Xác nhận đơn
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCancelOpen(true)}
                            disabled={isSelectedUpdating}
                            leftIcon={<IconCircleX className="h-4 w-4" />}
                          >
                            Hủy đơn
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
                            Từ chối
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApproveRefund(selectedOrder._id)}
                            loading={isSelectedUpdating}
                            leftIcon={<IconCircleCheck className="h-4 w-4" />}
                          >
                            Chấp thuận
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
                          Xác nhận đã nhận lại hàng
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
                            ? "Bạn đã xác nhận nhận lại hàng. Hệ thống đang chờ bước hoàn tiền cho buyer."
                            : "Hệ thống đang xử lý hoàn tiền cho buyer."}
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
                            Đơn hàng hiện không có thao tác nhanh.
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
                            Thông tin yêu cầu hoàn tiền
                          </p>
                          <div className="space-y-1.5 text-xs">
                            <p className="text-muted-foreground">
                              Trạng thái:{" "}
                              <span className="font-medium text-foreground">
                                {REFUND_REQUEST_STATUS_LABELS[refundRequest.status] || refundRequest.status}
                              </span>
                            </p>
                            <p className="text-muted-foreground">
                              Lý do: <span className="font-medium text-foreground">{refundRequest.reason || "—"}</span>
                            </p>
                            <p className="text-muted-foreground">
                              Số tiền hoàn:{" "}
                              <span className="font-semibold text-foreground">
                                {formatPrice(refundRequest.refundAmount || selectedOrder.totalAmount)}
                              </span>
                            </p>
                            <p className="text-muted-foreground">
                              Thời gian gửi:{" "}
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
                        Xem trang chi tiết
                        <IconArrowNarrowRight className="h-4 w-4" />
                      </Link>

                      <div className="rounded-xl border border-border bg-muted/20 p-3">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Thông tin khách hàng
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {getBuyerName(selectedOrder)}
                        </p>
                        <p className="text-xs text-muted-foreground">Email: {getBuyerEmail(selectedOrder)}</p>
         
                        <p className="text-xs text-muted-foreground">
                          Cập nhật: {formatDateTime(selectedOrder.updatedAt)}
                        </p>
                      </div>

                      <div className="rounded-xl border border-border bg-muted/20 p-3">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Địa chỉ giao hàng
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {selectedOrder.shippingAddress?.fullName || "—"}
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
                            .join(", ") || "—"}
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
                            Sản phẩm trong đơn
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
                                    alt={p.productId?.name || "Sản phẩm"}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                    onError={() => handleImageError(imageKey)}
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-foreground">
                                    {p.productId?.name || "Sản phẩm"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    SL: {p.quantity} • Đơn giá: {formatPrice(p.price)}
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
                          <span className="text-muted-foreground">Tiền sản phẩm</span>
                          <span className="font-medium">{formatPrice(selectedProductAmount)}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Tiền ship</span>
                          <span className="font-medium">{formatPrice(selectedShippingFee)}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Phương thức thanh toán</span>
                          <span className="font-medium text-foreground">
                            {formatPaymentMethod(selectedOrder.paymentMethod, {
                              shippingMethod: selectedOrder.shippingMethod,
                            })}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Trạng thái thanh toán</span>
                          <span className={cn("rounded-md border px-2 py-0.5 text-[11px] font-semibold", paymentBadgeClass)}>
                            {selectedPaymentStatusLabel}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
                          <span className="font-semibold text-foreground">Tổng tiền</span>
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
            title="Từ chối yêu cầu hoàn tiền"
            description={`Đơn #${selectedOrder._id.slice(-8).toUpperCase()}`}
            reasonLabel="Lý do từ chối"
            reasonPlaceholder="Mô tả lý do từ chối để buyer nắm được."
            reasonHint="Buyer sẽ nhận nội dung lý do này."
            confirmText="Xác nhận từ chối"
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

