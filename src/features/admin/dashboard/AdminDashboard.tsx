"use client";

import {
  IconLayoutDashboard,
  IconPackage,
  IconShoppingCart,
  IconUsers,
  IconCurrencyDollar,
  IconPercentage,
  IconLoader2,
  IconAlertTriangle,
  IconShieldLock,
  IconRefreshAlert,
} from "@tabler/icons-react";
import Link from "next/link";
import { formatPrice } from "@/utils/format/price";
import { useAdminDashboard } from "./hooks/useAdminDashboard";
import StatCard from "./components/StatCard";
import ActivityTable from "./components/ActivityTable";

export default function AdminDashboard() {
  const { stats, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        Không tải được thống kê. Kiểm tra đăng nhập với tài khoản admin.
      </div>
    );
  }

  const s = stats;
  const kpis = s.kpis;
  const orders = s.ordersByStatus;
  const refunds = s.refundsByStatus;
  const risk = s.risk;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Tổng quan hệ thống</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Theo dõi hiệu suất đơn hàng, hoàn tiền và rủi ro trong sàn.
          </p>
        </div>
        {/* Placeholder cho date range filter - có thể nối với query params sau */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Khoảng thời gian:</span>
          <span className="rounded-full border border-border bg-card px-3 py-1">
            Mặc định (toàn bộ)
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng doanh thu"
          value={formatPrice(kpis.totalRevenue ?? 0)}
          sub="Đơn đã giao / hoàn tất"
          icon={IconCurrencyDollar}
        />
        <StatCard
          title="Tổng đơn hàng"
          value={kpis.totalOrders ?? 0}
          sub="Toàn bộ trạng thái"
          icon={IconShoppingCart}
        />
        <StatCard
          title="Tỷ lệ hoàn thành"
          value={`${kpis.completionRate ?? 0}%`}
          sub="Đã giao / hoàn tất trên tổng đơn"
          icon={IconPercentage}
        />
        <StatCard
          title="Tổng tiền hoàn"
          value={formatPrice(kpis.totalRefundAmount ?? 0)}
          sub="Đã hoàn cho khách"
          icon={IconRefreshAlert}
        />
        <StatCard
          title="Người dùng mới (tháng)"
          value={kpis.newUsers ?? 0}
          icon={IconUsers}
          href="/admin/users"
        />
        <StatCard
          title="Seller mới (tháng)"
          value={kpis.newSellers ?? 0}
          icon={IconLayoutDashboard}
          href="/admin/sellers"
        />
      </div>

      {/* Middle section: orders & refunds summary */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Orders by status */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            Trạng thái đơn hàng
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="text-muted-foreground">Đang chờ</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{orders.pending}</p>
            </div>
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="text-muted-foreground">Đã xác nhận</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{orders.confirmed}</p>
            </div>
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="text-muted-foreground">Đang giao</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{orders.shipping}</p>
            </div>
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="text-muted-foreground">Đã giao</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{orders.delivered}</p>
            </div>
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="text-muted-foreground">Đang hoàn</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{orders.refund}</p>
            </div>
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="text-muted-foreground">Đã hoàn tiền</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{orders.refunded}</p>
            </div>
          </div>
        </div>

        {/* Refunds by status */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            Trạng thái hoàn tiền
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="text-muted-foreground">Chờ xử lý</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{refunds.pending}</p>
            </div>
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="text-muted-foreground">Đã duyệt</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{refunds.approved}</p>
            </div>
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="text-muted-foreground">Đã nhận hàng hoàn</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{refunds.returned}</p>
            </div>
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="text-muted-foreground">Đang hoàn tiền</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{refunds.processing}</p>
            </div>
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="text-muted-foreground">Hoàn thành</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{refunds.completed}</p>
            </div>
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="text-muted-foreground">Lỗi / thất bại</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{refunds.failed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk & quick actions */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Risk panel */}
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-destructive">
            Rủi ro & khiếu nại
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconShieldLock className="h-4 w-4 text-destructive" />
                <span>Tài khoản bị khóa</span>
              </div>
              <span className="font-semibold">{risk.bannedAccounts}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconLayoutDashboard className="h-4 w-4 text-destructive" />
                <span>Seller bị khóa</span>
              </div>
              <span className="font-semibold">{risk.bannedSellers}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconAlertTriangle className="h-4 w-4 text-destructive" />
                <span>Report đang chờ xử lý</span>
              </div>
              <span className="font-semibold">{risk.pendingReports}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Link
              href="/admin/users?status=banned"
              className="rounded-full border border-border bg-card px-3 py-1 hover:bg-muted"
            >
              Xem tài khoản bị khóa
            </Link>
            <Link
              href="/admin/sellers?status=banned"
              className="rounded-full border border-border bg-card px-3 py-1 hover:bg-muted"
            >
              Xem seller bị khóa
            </Link>
            <Link
              href="/admin/reports?status=pending"
              className="rounded-full border border-border bg-card px-3 py-1 hover:bg-muted"
            >
              Xử lý report
            </Link>
          </div>
        </div>

        {/* Quick links */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            Điều hướng nhanh
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <IconPackage className="h-4 w-4" />
              Quản lý sản phẩm
            </Link>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <IconShoppingCart className="h-4 w-4" />
              Xem đơn hàng
            </Link>
            <Link
              href="/admin/sellers"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <IconLayoutDashboard className="h-4 w-4" />
              Quản lý Seller
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
