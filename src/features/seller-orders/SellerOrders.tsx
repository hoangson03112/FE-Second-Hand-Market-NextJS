"use client";

import {
  IconArrowLeft,
  IconLoader2,
  IconPackage,
  IconBolt,
  IconTruck,
  IconAlertCircle,
  IconCoins,
  IconSearch,
  IconX,
  IconCalendar,
  IconArrowsSort,
} from "@tabler/icons-react";
import Link from "next/link";
import { useSellerOrders } from "./hooks/useSellerOrders";
import type { DateFilter, SortOption } from "./hooks/useSellerOrders";
import OrderTabs from "./components/OrderTabs";
import OrderCard from "./components/OrderCard";
import EmptyOrderState from "./components/EmptyOrderState";
import Pagination from "@/components/ui/Pagination";
import { formatPrice } from "@/utils/format/price";

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "Tất cả thời gian" },
  { value: "today", label: "Hôm nay" },
  { value: "week", label: "7 ngày qua" },
  { value: "month", label: "30 ngày qua" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "highest", label: "Giá trị cao nhất" },
  { value: "lowest", label: "Giá trị thấp nhất" },
];

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
    orders,
    imageErrorMap,
    updatingId,
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
  } = useSellerOrders();

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!account) return null;

  const statsCards = [
    {
      label: "Đơn hôm nay",
      value: stats.todayOrders,
      Icon: IconPackage,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Chờ xử lý",
      value: stats.pending,
      Icon: IconBolt,
      color: "text-orange-600",
      bg: stats.pending > 0 ? "bg-orange-50" : "bg-muted/40",
      border: stats.pending > 0 ? "border-orange-200" : "border-border",
      urgent: stats.pending > 0,
    },
    {
      label: "Đang vận chuyển",
      value: stats.shipping,
      Icon: IconTruck,
      color: "text-primary",
      bg: "bg-primary/8",
      border: "border-primary/15",
    },
    {
      label: "Yêu cầu hoàn",
      value: stats.returnRequests,
      Icon: IconAlertCircle,
      color: "text-red-600",
      bg: stats.returnRequests > 0 ? "bg-red-50" : "bg-muted/40",
      border: stats.returnRequests > 0 ? "border-red-200" : "border-border",
      urgent: stats.returnRequests > 0,
    },
    {
      label: "Doanh thu hôm nay",
      value: formatPrice(stats.todayRevenue),
      Icon: IconCoins,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
      isText: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-cream-50/30 to-background">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm"
          >
            <IconArrowLeft className="h-4 w-4" />
            Quay lại
          </Link>
          {(stats.pending > 0 || stats.returnRequests > 0) && (
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-xl px-3 py-1.5">
              <IconBolt className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs font-semibold text-orange-700">
                {[
                  stats.pending > 0 && `${stats.pending} chờ xác nhận`,
                  stats.returnRequests > 0 && `${stats.returnRequests} yêu cầu hoàn`,
                ]
                  .filter(Boolean)
                  .join(" • ")}
              </span>
            </div>
          )}
        </div>

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-0.5">Quản lý đơn hàng</h1>
          <p className="text-sm text-muted-foreground">{orders.length} đơn hàng tổng cộng</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {statsCards.map((card) => (
            <div
              key={card.label}
              className={`${card.bg} border ${card.border} rounded-2xl p-4 transition-all ${
                card.urgent ? "ring-2 ring-offset-1 ring-orange-200" : ""
              }`}
            >
              <card.Icon className={`w-5 h-5 ${card.color} mb-2.5`} />
              <div
                className={`font-bold text-foreground mb-0.5 ${
                  card.isText ? "text-sm leading-tight" : "text-2xl tabular-nums"
                }`}
              >
                {card.value}
              </div>
              <div className="text-xs text-muted-foreground leading-tight">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} tabCounts={tabCounts} />

        {/* Filter Bar */}
        <div className="bg-cream-50 border border-border rounded-2xl p-3 mb-5 flex flex-wrap gap-2 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm theo mã đơn, tên KH, sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-background border border-border rounded-xl outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <IconX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Date filter */}
          <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-2.5 py-2 text-sm">
            <IconCalendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilter)}
              className="bg-transparent outline-none cursor-pointer text-sm text-foreground"
            >
              {DATE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-2.5 py-2 text-sm">
            <IconArrowsSort className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent outline-none cursor-pointer text-sm text-foreground"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <span className="text-xs text-muted-foreground ml-auto shrink-0">
            {filteredOrders.length} kết quả
          </span>
        </div>

        {/* Orders */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <IconLoader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Đang tải đơn hàng...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyOrderState activeTab={activeTab} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginatedOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  imageErrorMap={imageErrorMap}
                  updatingId={updatingId}
                  onImageError={handleImageError}
                  onUpdateStatus={handleUpdateStatus}
                  onApproveRefund={handleApproveRefund}
                />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="mt-6"
            />
          </>
        )}
      </main>
    </div>
  );
}

