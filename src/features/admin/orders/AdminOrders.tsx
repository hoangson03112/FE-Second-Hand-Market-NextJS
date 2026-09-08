"use client";

import { IconLoader2, IconSearch, IconShoppingCart, IconCalendar } from "@tabler/icons-react";
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
          <IconLoader2 className="h-9 w-9 animate-spin text-luxury-ink" />
          <p className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
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
      <PageHeader
        eyebrow="Quản lý giao dịch"
        title="Quản lý đơn hàng"
        description="Theo dõi, tra cứu vận đơn GHN và quản lý trạng thái đơn hàng toàn sàn."
        badge={
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-[2px] text-2xs font-bold uppercase tracking-[0.16em] bg-cream-50 text-luxury-ink border border-luxury-ink/10">
            {totalItems} đơn hàng
          </span>
        }
      />

      {/* Filter Card: Quiet Luxury Style */}
      <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-4 sm:p-5 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo mã đơn hàng, tên khách, email..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-luxury-ink/15 rounded-[2px] bg-white text-luxury-ink placeholder:text-neutral-400 focus:outline-none focus:border-luxury-ink transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-2xs font-bold uppercase tracking-[0.1em] border border-luxury-ink/15 rounded-[2px] bg-white text-luxury-ink focus:outline-none focus:border-luxury-ink"
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
              className="px-3 py-2 text-2xs font-bold uppercase tracking-[0.1em] border border-luxury-ink/15 rounded-[2px] bg-white text-luxury-ink focus:outline-none focus:border-luxury-ink"
            >
              <option value="all">Thanh toán: Tất cả</option>
              <option value="cod">COD (Khi nhận)</option>
              <option value="bank_transfer">Chuyển khoản</option>
            </select>

            <select
              value={payoutStatus}
              onChange={(e) => setPayoutStatus(e.target.value as "all" | "pending" | "paid")}
              className="px-3 py-2 text-2xs font-bold uppercase tracking-[0.1em] border border-luxury-ink/15 rounded-[2px] bg-white text-luxury-ink focus:outline-none focus:border-luxury-ink"
            >
              <option value="all">Payout: Tất cả</option>
              <option value="pending">Payout: Chưa giải ngân</option>
              <option value="paid">Payout: Đã giải ngân</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-luxury-ink/8 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
          <IconCalendar className="w-3.5 h-3.5 text-neutral-500" />
          <span>Lọc ngày:</span>
          <input
            type="date"
            value={startDate ?? ""}
            onChange={(e) => setDateRange(e.target.value || undefined, endDate)}
            className="rounded-[2px] border border-luxury-ink/15 bg-white px-2.5 py-1 text-xs text-luxury-ink focus:outline-none focus:border-luxury-ink"
          />
          <span className="lowercase font-normal">đến</span>
          <input
            type="date"
            value={endDate ?? ""}
            onChange={(e) => setDateRange(startDate, e.target.value || undefined)}
            className="rounded-[2px] border border-luxury-ink/15 bg-white px-2.5 py-1 text-xs text-luxury-ink focus:outline-none focus:border-luxury-ink"
          />
          {(startDate || endDate) && (
            <button
              type="button"
              onClick={() => setDateRange(undefined, undefined)}
              className="ml-2 px-2.5 py-1 rounded-[2px] border border-blush-200 text-2xs font-bold uppercase tracking-[0.1em] text-blush-700 hover:bg-blush-50 transition-colors"
            >
              Xoá lọc ngày
            </button>
          )}
        </div>
      </div>

      {orders.length === 0 ? (
        <NoData
          icon={<IconShoppingCart className="w-10 h-10 text-neutral-400" />}
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

