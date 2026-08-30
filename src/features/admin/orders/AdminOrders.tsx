"use client";

import { IconLoader2, IconSearch, IconShoppingCart, IconFilter, IconCalendar } from "@tabler/icons-react";
import { useAdminOrders } from "./hooks/useAdminOrders";
import { NoData, PageHeader, ErrorState } from "@/features/admin/components";
import OrdersTable from "./components/OrdersTable";
import { Pagination } from "@/components/ui";
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
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <IconLoader2 className="h-9 w-9 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Đang tải danh sách đơn hàng...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Không tải được danh sách đơn hàng"
        description="Vui lòng thử lại sau hoặc kiểm tra quyền tài khoản."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Quản lý đơn hàng"
        description="Theo dõi, tra cứu vận đơn GHN và quản lý trạng thái đơn hàng toàn sàn."
        badge={
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
            {totalItems} đơn hàng
          </span>
        }
      />

      {/* Search & Filter Toolbar Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo mã đơn hàng, tên khách, email..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-border/80 rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium border border-border/80 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
              className="px-3 py-2 text-xs font-medium border border-border/80 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">Thanh toán: Tất cả</option>
              <option value="cod">COD (Khi nhận)</option>
              <option value="bank_transfer">Chuyển khoản</option>
            </select>

            <select
              value={payoutStatus}
              onChange={(e) => setPayoutStatus(e.target.value as "all" | "pending" | "paid")}
              className="px-3 py-2 text-xs font-medium border border-border/80 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">Payout: Tất cả</option>
              <option value="pending">Payout: Chưa giải ngân</option>
              <option value="paid">Payout: Đã giải ngân</option>
            </select>
          </div>
        </div>

        {/* Date range filter */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
          <IconCalendar className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-medium">Lọc theo ngày tạo:</span>
          <input
            type="date"
            value={startDate ?? ""}
            onChange={(e) => setDateRange(e.target.value || undefined, endDate)}
            className="rounded-lg border border-border/80 bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <span>đến</span>
          <input
            type="date"
            value={endDate ?? ""}
            onChange={(e) => setDateRange(startDate, e.target.value || undefined)}
            className="rounded-lg border border-border/80 bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          {(startDate || endDate) && (
            <button
              type="button"
              onClick={() => setDateRange(undefined, undefined)}
              className="ml-2 px-2 py-0.5 rounded text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              Xoá bộ lọc ngày
            </button>
          )}
        </div>
      </div>

      {orders.length === 0 ? (
        <NoData
          icon={<IconShoppingCart className="w-10 h-10 text-muted-foreground" />}
          title="Chưa có đơn hàng nào"
          description="Không tìm thấy đơn hàng phù hợp với điều kiện tìm kiếm."
        />
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


