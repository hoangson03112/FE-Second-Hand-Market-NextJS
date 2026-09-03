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
  IconArrowUpRight,
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
          <IconLoader2 className="h-9 w-9 animate-spin text-luxury-ink" />
          <p className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
            Đang tải dữ liệu tổng quan...
          </p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-[2px] border border-rose-200 bg-white p-6 text-sm text-rose-800">
        <div className="flex items-center gap-2 font-bold mb-1">
          <IconAlertTriangle className="w-5 h-5 text-rose-600" />
          Không tải được thống kê
        </div>
        <p className="text-neutral-600 text-xs">
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
      <PageHeader
        eyebrow="Bảng điều khiển trung tâm"
        title="Tổng quan hệ thống"
        description="Theo dõi doanh thu, luồng đơn hàng, hoàn tiền và các chỉ số hoạt động toàn sàn Eco Market."
        badge={
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] text-2xs font-bold uppercase tracking-[0.16em] bg-cream-50 text-luxury-ink border border-luxury-ink/10">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Trực tiếp
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng doanh thu"
          value={formatPrice(kpis.totalRevenue ?? 0)}
          sub="Đơn hoàn tất thành công"
          icon={IconCurrencyDollar}
        />
        <StatCard
          title="Tổng đơn hàng"
          value={(kpis.totalOrders ?? 0).toLocaleString("vi-VN")}
          sub="Toàn bộ đơn phát sinh"
          icon={IconShoppingCart}
        />
        <StatCard
          title="Tỷ lệ hoàn thành"
          value={`${kpis.completionRate ?? 0}%`}
          sub="Đã giao / Tổng số đơn"
          icon={IconPercentage}
        />
        <StatCard
          title="Tổng tiền hoàn"
          value={formatPrice(kpis.totalRefundAmount ?? 0)}
          sub="Đã hoàn trả cho khách"
          icon={IconRefreshAlert}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Người dùng mới (tháng này)"
          value={(kpis.newUsers ?? 0).toLocaleString("vi-VN")}
          sub="Xem danh sách tài khoản →"
          icon={IconUsers}
          href="/admin/users"
        />
        <StatCard
          title="Seller mới đăng ký (tháng này)"
          value={(kpis.newSellers ?? 0).toLocaleString("vi-VN")}
          sub="Duyệt hồ sơ seller →"
          icon={IconBuildingStore}
          href="/admin/sellers"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5 border-b border-luxury-ink/8 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink flex items-center justify-center">
                <IconShoppingCart className="w-4 h-4" />
              </div>
              <h2 className="font-droid-serif text-base text-luxury-ink font-bold">
                Trạng thái đơn hàng
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-2xs font-bold uppercase tracking-[0.16em] text-luxury-ink hover:text-accent inline-flex items-center gap-1 transition-colors"
            >
              Xem tất cả
              <IconArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-[2px] border border-luxury-ink/8 bg-cream-50/60 p-3.5">
              <span className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                Đang chờ
              </span>
              <p className="font-droid-serif mt-1.5 text-xl text-luxury-ink tabular-nums">
                {orders.pending}
              </p>
            </div>
            <div className="rounded-[2px] border border-luxury-ink/8 bg-cream-50/60 p-3.5">
              <span className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                Đã xác nhận
              </span>
              <p className="font-droid-serif mt-1.5 text-xl text-luxury-ink tabular-nums">
                {orders.confirmed}
              </p>
            </div>
            <div className="rounded-[2px] border border-luxury-ink/8 bg-cream-50/60 p-3.5">
              <span className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                Đang giao
              </span>
              <p className="font-droid-serif mt-1.5 text-xl text-luxury-ink tabular-nums">
                {orders.shipping}
              </p>
            </div>
            <div className="rounded-[2px] border border-luxury-ink/8 bg-cream-50/60 p-3.5">
              <span className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                Đã giao
              </span>
              <p className="font-droid-serif mt-1.5 text-xl text-accent tabular-nums">
                {orders.delivered}
              </p>
            </div>
            <div className="rounded-[2px] border border-luxury-ink/8 bg-cream-50/60 p-3.5">
              <span className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                Đang hoàn
              </span>
              <p className="font-droid-serif mt-1.5 text-xl text-amber-700 tabular-nums">
                {orders.refund}
              </p>
            </div>
            <div className="rounded-[2px] border border-luxury-ink/8 bg-cream-50/60 p-3.5">
              <span className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                Đã hoàn tiền
              </span>
              <p className="font-droid-serif mt-1.5 text-xl text-rose-700 tabular-nums">
                {orders.refunded}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5 border-b border-luxury-ink/8 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink flex items-center justify-center">
                <IconCoinOff className="w-4 h-4" />
              </div>
              <h2 className="font-droid-serif text-base text-luxury-ink font-bold">
                Trạng thái hoàn tiền & khiếu nại
              </h2>
            </div>
            <Link
              href="/admin/refunds"
              className="text-2xs font-bold uppercase tracking-[0.16em] text-luxury-ink hover:text-accent inline-flex items-center gap-1 transition-colors"
            >
              Xem chi tiết
              <IconArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-[2px] border border-luxury-ink/8 bg-cream-50/60 p-3.5">
              <span className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                Chờ seller
              </span>
              <p className="font-droid-serif mt-1.5 text-xl text-luxury-ink tabular-nums">
                {refunds.pending}
              </p>
            </div>
            <div className="rounded-[2px] border border-luxury-ink/8 bg-cream-50/60 p-3.5">
              <span className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                Đã duyệt
              </span>
              <p className="font-droid-serif mt-1.5 text-xl text-accent tabular-nums">
                {refunds.approved}
              </p>
            </div>
            <div className="rounded-[2px] border border-luxury-ink/8 bg-cream-50/60 p-3.5">
              <span className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                Đã nhận hàng
              </span>
              <p className="font-droid-serif mt-1.5 text-xl text-luxury-ink tabular-nums">
                {refunds.returned}
              </p>
            </div>
            <div className="rounded-[2px] border border-luxury-ink/8 bg-cream-50/60 p-3.5">
              <span className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                Chờ CK Admin
              </span>
              <p className="font-droid-serif mt-1.5 text-xl text-amber-700 tabular-nums">
                {refunds.processing}
              </p>
            </div>
            <div className="rounded-[2px] border border-luxury-ink/8 bg-cream-50/60 p-3.5">
              <span className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                Hoàn tất
              </span>
              <p className="font-droid-serif mt-1.5 text-xl text-accent tabular-nums">
                {refunds.completed}
              </p>
            </div>
            <div className="rounded-[2px] border border-luxury-ink/8 bg-cream-50/60 p-3.5">
              <span className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                Từ chối / Lỗi
              </span>
              <p className="font-droid-serif mt-1.5 text-xl text-rose-700 tabular-nums">
                {refunds.failed}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-4 border-b border-luxury-ink/8 pb-4">
            <div className="w-8 h-8 rounded-[2px] border border-rose-200 bg-rose-50 text-rose-700 flex items-center justify-center">
              <IconShieldLock className="w-4 h-4" />
            </div>
            <h2 className="font-droid-serif text-base text-luxury-ink font-bold">
              Rủi ro, báo cáo & khiếu nại
            </h2>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between p-3 rounded-[2px] bg-cream-50/70 border border-luxury-ink/8">
              <div className="flex items-center gap-2.5 text-luxury-ink text-xs font-medium">
                <IconUsers className="h-4 w-4 text-neutral-500" />
                <span>Tài khoản bị khóa</span>
              </div>
              <span className="font-droid-serif font-bold text-luxury-ink tabular-nums text-base">
                {risk.bannedAccounts}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-[2px] bg-cream-50/70 border border-luxury-ink/8">
              <div className="flex items-center gap-2.5 text-luxury-ink text-xs font-medium">
                <IconBuildingStore className="h-4 w-4 text-neutral-500" />
                <span>Seller bị khóa</span>
              </div>
              <span className="font-droid-serif font-bold text-luxury-ink tabular-nums text-base">
                {risk.bannedSellers}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-[2px] bg-cream-50/70 border border-luxury-ink/8">
              <div className="flex items-center gap-2.5 text-luxury-ink text-xs font-medium">
                <IconAlertTriangle className="h-4 w-4 text-neutral-500" />
                <span>Report đang chờ xử lý</span>
              </div>
              <span className="font-droid-serif font-bold text-luxury-ink tabular-nums text-base">
                {risk.pendingReports}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-2xs font-bold uppercase tracking-[0.15em]">
            <Link
              href="/admin/users?status=banned"
              className="rounded-[2px] border border-luxury-ink/15 bg-white px-3.5 py-2 text-luxury-ink hover:bg-taupe-50 transition-colors"
            >
              Tài khoản khóa
            </Link>
            <Link
              href="/admin/sellers?status=banned"
              className="rounded-[2px] border border-luxury-ink/15 bg-white px-3.5 py-2 text-luxury-ink hover:bg-taupe-50 transition-colors"
            >
              Seller khóa
            </Link>
            <Link
              href="/admin/reports?status=pending"
              className="rounded-[2px] bg-luxury-ink px-4 py-2 text-luxury-ivory hover:bg-charcoal-800 transition-colors"
            >
              Xử lý report →
            </Link>
          </div>
        </div>

        <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4 border-b border-luxury-ink/8 pb-4">
              <div className="w-8 h-8 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink flex items-center justify-center">
                <IconLayoutDashboard className="w-4 h-4" />
              </div>
              <h2 className="font-droid-serif text-base text-luxury-ink font-bold">
                Lối tắt thao tác nhanh
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Link
                href="/admin/products"
                className="flex items-center gap-3 p-3 rounded-[2px] border border-luxury-ink/10 bg-white hover:bg-taupe-50/50 hover:border-luxury-ink/30 transition-all group"
              >
                <div className="w-9 h-9 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <IconPackage className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-luxury-ink truncate">
                    Duyệt sản phẩm
                  </p>
                  <p className="text-[11px] text-neutral-500">Kiểm duyệt đăng bán</p>
                </div>
              </Link>

              <Link
                href="/admin/sellers"
                className="flex items-center gap-3 p-3 rounded-[2px] border border-luxury-ink/10 bg-white hover:bg-taupe-50/50 hover:border-luxury-ink/30 transition-all group"
              >
                <div className="w-9 h-9 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <IconBuildingStore className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-luxury-ink truncate">
                    Duyệt Seller
                  </p>
                  <p className="text-[11px] text-neutral-500">Thẩm định CCCD</p>
                </div>
              </Link>

              <Link
                href="/admin/refunds"
                className="flex items-center gap-3 p-3 rounded-[2px] border border-luxury-ink/10 bg-white hover:bg-taupe-50/50 hover:border-luxury-ink/30 transition-all group"
              >
                <div className="w-9 h-9 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <IconCoinOff className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-luxury-ink truncate">
                    Xử lý hoàn tiền
                  </p>
                  <p className="text-[11px] text-neutral-500">Khiếu nại & VietQR</p>
                </div>
              </Link>

              <Link
                href="/admin/categories"
                className="flex items-center gap-3 p-3 rounded-[2px] border border-luxury-ink/10 bg-white hover:bg-taupe-50/50 hover:border-luxury-ink/30 transition-all group"
              >
                <div className="w-9 h-9 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <IconFolders className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-luxury-ink truncate">
                    Cây danh mục
                  </p>
                  <p className="text-[11px] text-neutral-500">Quản lý phân loại</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
