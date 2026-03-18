"use client";

import { IconLoader2, IconSearch } from "@tabler/icons-react";
import { useAdminOrders } from "./hooks/useAdminOrders";
import EmptyState from "./components/EmptyState";
import OrdersTable from "./components/OrdersTable";
import Pagination from "@/components/ui/Pagination";
import { ORDER_TABS } from "@/constants/orderStatus";

export default function AdminOrders() {
  const {
    orders,
    totalItems,
    isLoading,
    error,
    expandedId,
    toggleExpanded,
    statusFilter,
    setStatusFilter,
    paymentMethod,
    setPaymentMethod,
    payoutStatus,
    setPayoutStatus,
    startDate,
    endDate,
    setDateRange,
    search,
    setSearch,
    page,
    totalPages,
    setPage,
    completeRefund,
    isCompletingRefund,
  } = useAdminOrders();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        Không tải được danh sách đơn hàng.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">Đơn hàng</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Xem toàn bộ đơn hàng trong hệ thống ({totalItems} đơn)
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã đơn, tên, email..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-xl bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="all">Tất cả trạng thái</option>
            {ORDER_TABS.filter((t) => t.key !== "all").map((tab) => (
              <option key={tab.key} value={tab.key}>
                {tab.label}
              </option>
            ))}
          </select>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as "all" | "cod" | "bank_transfer")}
            className="px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="all">Tất cả thanh toán</option>
            <option value="cod">Thanh toán COD</option>
            <option value="bank_transfer">Chuyển khoản</option>
          </select>
          <select
            value={payoutStatus}
            onChange={(e) => setPayoutStatus(e.target.value as "all" | "pending" | "paid")}
            className="px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="all">Payout: Tất cả</option>
            <option value="pending">Payout: Chưa giải ngân</option>
            <option value="paid">Payout: Đã giải ngân</option>
          </select>
        </div>
      </div>

      {/* Date range filter (đơn giản: 2 input date) */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>Khoảng ngày tạo:</span>
        <input
          type="date"
          value={startDate ?? ""}
          onChange={(e) => setDateRange(e.target.value || undefined, endDate)}
          className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary"
        />
        <span className="mx-1">—</span>
        <input
          type="date"
          value={endDate ?? ""}
          onChange={(e) => setDateRange(startDate, e.target.value || undefined)}
          className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary"
        />
        {(startDate || endDate) && (
          <button
            type="button"
            onClick={() => setDateRange(undefined, undefined)}
            className="ml-2 text-xs text-primary hover:underline"
          >
            Xoá lọc ngày
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <OrdersTable
            orders={orders}
            expandedId={expandedId}
            onToggleExpanded={toggleExpanded}
            onCompleteRefund={completeRefund}
            isCompletingRefund={isCompletingRefund}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-4"
          />
        </>
      )}
    </div>
  );
}

