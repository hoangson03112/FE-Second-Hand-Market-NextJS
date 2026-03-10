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

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
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

