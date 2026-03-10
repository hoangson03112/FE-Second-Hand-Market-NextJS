"use client";

import {
  IconLayoutDashboard,
  IconPackage,
  IconShoppingCart,
  IconUsers,
  IconCurrencyDollar,
  IconPercentage,
  IconLoader2,
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Tổng quan</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Thống kê tổng quan hệ thống
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Doanh thu (đã giao)"
          value={formatPrice(s.totalRevenue ?? 0)}
          icon={IconCurrencyDollar}
        />
        <StatCard
          title="Sản phẩm đã bán"
          value={s.soldProducts ?? 0}
          sub="đơn đã giao"
          icon={IconPackage}
          href="/admin/orders"
        />
        <StatCard
          title="Người dùng mới (tháng)"
          value={s.newUsers ?? 0}
          icon={IconUsers}
          href="/admin/users"
        />
        <StatCard
          title="Tỷ lệ hoàn thành"
          value={`${s.completionRate ?? 0}%`}
          sub="đơn giao thành công / tổng đơn"
          icon={IconPercentage}
        />
      </div>

      {s.userActivityData && s.userActivityData.length > 0 && (
        <ActivityTable data={s.userActivityData} />
      )}

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
  );
}
