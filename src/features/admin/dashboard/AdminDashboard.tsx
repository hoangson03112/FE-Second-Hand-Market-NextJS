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
  IconArrowRight,
  IconBuildingStore,
  IconFolders,
  IconCoinOff,
} from "@tabler/icons-react";
import Link from "next/link";
import { formatPrice } from "@/utils/format/price";
import { useAdminDashboard } from "./hooks/useAdminDashboard";
import StatCard from "./components/StatCard";
import { PageHeader } from "@/features/admin/components";

export default function AdminDashboard() {
  const { stats, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <IconLoader2 className="h-9 w-9 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Đang tải dữ liệu tổng quan...
          </p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        <div className="flex items-center gap-2 font-bold mb-1">
          <IconAlertTriangle className="w-5 h-5" />
          Không tải được thống kê
        </div>
        <p className="text-muted-foreground">
          Vui lòng kiểm tra quyền đăng nhập tài khoản quản trị viên và thử lại.
        </p>
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
      <PageHeader
        title="Tổng quan hệ thống"
        description="Theo dõi doanh thu, luồng đơn hàng, hoàn tiền và các chỉ số hoạt động toàn sàn Eco Market."
        badge={
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Trực tiếp
          </span>
        }
      />

      {/* KPI Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng doanh thu"
          value={formatPrice(kpis.totalRevenue ?? 0)}
          sub="Đơn hoàn tất thành công"
          icon={IconCurrencyDollar}
          tone="emerald"
        />
        <StatCard
          title="Tổng đơn hàng"
          value={(kpis.totalOrders ?? 0).toLocaleString("vi-VN")}
          sub="Toàn bộ đơn phát sinh"
          icon={IconShoppingCart}
          tone="blue"
        />
        <StatCard
          title="Tỷ lệ hoàn thành"
          value={`${kpis.completionRate ?? 0}%`}
          sub="Đã giao / Tổng số đơn"
          icon={IconPercentage}
          tone="purple"
        />
        <StatCard
          title="Tổng tiền hoàn"
          value={formatPrice(kpis.totalRefundAmount ?? 0)}
          sub="Đã hoàn trả cho khách"
          icon={IconRefreshAlert}
          tone="amber"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Người dùng mới (tháng này)"
          value={(kpis.newUsers ?? 0).toLocaleString("vi-VN")}
          sub="Nhấn để xem danh sách tài khoản →"
          icon={IconUsers}
          href="/admin/users"
          tone="default"
        />
        <StatCard
          title="Seller mới đăng ký (tháng này)"
          value={(kpis.newSellers ?? 0).toLocaleString("vi-VN")}
          sub="Nhấn để duyệt hồ sơ seller →"
          icon={IconBuildingStore}
          href="/admin/sellers"
          tone="default"
        />
      </div>

      {/* Middle section: orders & refunds status grids */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders by status */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <IconShoppingCart className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-foreground">
                Trạng thái đơn hàng
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              Xem tất cả
              <IconArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5">
              <span className="text-muted-foreground font-medium">Đang chờ</span>
              <p className="mt-1 text-xl font-bold text-foreground tabular-nums">
                {orders.pending}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5">
              <span className="text-muted-foreground font-medium">Đã xác nhận</span>
              <p className="mt-1 text-xl font-bold text-foreground tabular-nums">
                {orders.confirmed}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5">
              <span className="text-muted-foreground font-medium">Đang giao</span>
              <p className="mt-1 text-xl font-bold text-sky-600 tabular-nums">
                {orders.shipping}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5">
              <span className="text-muted-foreground font-medium">Đã giao</span>
              <p className="mt-1 text-xl font-bold text-emerald-600 tabular-nums">
                {orders.delivered}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5">
              <span className="text-muted-foreground font-medium">Đang hoàn</span>
              <p className="mt-1 text-xl font-bold text-amber-600 tabular-nums">
                {orders.refund}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5">
              <span className="text-muted-foreground font-medium">Đã hoàn tiền</span>
              <p className="mt-1 text-xl font-bold text-rose-600 tabular-nums">
                {orders.refunded}
              </p>
            </div>
          </div>
        </div>

        {/* Refunds by status */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <IconCoinOff className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-foreground">
                Trạng thái hoàn tiền & khiếu nại
              </h2>
            </div>
            <Link
              href="/admin/refunds"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              Xem chi tiết
              <IconArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5">
              <span className="text-muted-foreground font-medium">Chờ seller</span>
              <p className="mt-1 text-xl font-bold text-foreground tabular-nums">
                {refunds.pending}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5">
              <span className="text-muted-foreground font-medium">Đã duyệt</span>
              <p className="mt-1 text-xl font-bold text-emerald-600 tabular-nums">
                {refunds.approved}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5">
              <span className="text-muted-foreground font-medium">Đã nhận hàng</span>
              <p className="mt-1 text-xl font-bold text-sky-600 tabular-nums">
                {refunds.returned}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5">
              <span className="text-muted-foreground font-medium">Chờ CK Admin</span>
              <p className="mt-1 text-xl font-bold text-amber-600 tabular-nums">
                {refunds.processing}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5">
              <span className="text-muted-foreground font-medium">Hoàn tất</span>
              <p className="mt-1 text-xl font-bold text-emerald-600 tabular-nums">
                {refunds.completed}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5">
              <span className="text-muted-foreground font-medium">Từ chối / Lỗi</span>
              <p className="mt-1 text-xl font-bold text-rose-600 tabular-nums">
                {refunds.failed}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk & Quick Actions Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk panel */}
        <div className="rounded-2xl border border-rose-200/70 bg-rose-50/40 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <IconShieldLock className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-rose-900">
              Rủi ro, báo cáo & khiếu nại
            </h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-rose-100">
              <div className="flex items-center gap-2.5 text-foreground font-medium">
                <IconUsers className="h-4 w-4 text-rose-600" />
                <span>Tài khoản bị khóa</span>
              </div>
              <span className="font-bold text-foreground tabular-nums">
                {risk.bannedAccounts}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-rose-100">
              <div className="flex items-center gap-2.5 text-foreground font-medium">
                <IconBuildingStore className="h-4 w-4 text-rose-600" />
                <span>Seller bị khóa</span>
              </div>
              <span className="font-bold text-foreground tabular-nums">
                {risk.bannedSellers}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-rose-100">
              <div className="flex items-center gap-2.5 text-foreground font-medium">
                <IconAlertTriangle className="h-4 w-4 text-rose-600" />
                <span>Report đang chờ xử lý</span>
              </div>
              <span className="font-bold text-foreground tabular-nums">
                {risk.pendingReports}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Link
              href="/admin/users?status=banned"
              className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 font-medium text-rose-800 hover:bg-rose-100/50 transition-colors"
            >
              Xem tài khoản khóa
            </Link>
            <Link
              href="/admin/sellers?status=banned"
              className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 font-medium text-rose-800 hover:bg-rose-100/50 transition-colors"
            >
              Xem seller khóa
            </Link>
            <Link
              href="/admin/reports?status=pending"
              className="rounded-lg bg-rose-600 px-3 py-1.5 font-bold text-white hover:bg-rose-700 transition-colors shadow-2xs"
            >
              Xử lý report ngay →
            </Link>
          </div>
        </div>

        {/* Quick Navigation Panel */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <IconLayoutDashboard className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-foreground">
                Lối tắt thao tác nhanh
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Link
                href="/admin/products"
                className="flex items-center gap-3 p-3 rounded-xl border border-border/80 bg-card hover:bg-muted/40 hover:border-primary/20 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <IconPackage className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">
                    Duyệt sản phẩm
                  </p>
                  <p className="text-[11px] text-muted-foreground">Kiểm duyệt đăng bán</p>
                </div>
              </Link>

              <Link
                href="/admin/sellers"
                className="flex items-center gap-3 p-3 rounded-xl border border-border/80 bg-card hover:bg-muted/40 hover:border-primary/20 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <IconBuildingStore className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">
                    Duyệt Seller
                  </p>
                  <p className="text-[11px] text-muted-foreground">Thẩm định CCCD</p>
                </div>
              </Link>

              <Link
                href="/admin/refunds"
                className="flex items-center gap-3 p-3 rounded-xl border border-border/80 bg-card hover:bg-muted/40 hover:border-primary/20 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <IconCoinOff className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">
                    Xử lý hoàn tiền
                  </p>
                  <p className="text-[11px] text-muted-foreground">Khiếu nại & VietQR</p>
                </div>
              </Link>

              <Link
                href="/admin/categories"
                className="flex items-center gap-3 p-3 rounded-xl border border-border/80 bg-card hover:bg-muted/40 hover:border-primary/20 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <IconFolders className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">
                    Cây danh mục
                  </p>
                  <p className="text-[11px] text-muted-foreground">Quản lý phân loại</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
