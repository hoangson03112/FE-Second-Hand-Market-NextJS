"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import type { DashboardStats } from "@/types/admin";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Loader2,
  DollarSign,
  Percent,
} from "lucide-react";
import { formatPrice } from "@/utils/format/price";
import Link from "next/link";

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  href,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  href?: string;
}) {
  const content = (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          {sub != null && (
            <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
          )}
        </div>
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }
  return content;
}

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useQuery<DashboardStats, Error>({
    queryKey: ["admin", "dashboard"],
    queryFn: () => AdminService.getDashboardStats(),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
          icon={DollarSign}
        />
        <StatCard
          title="Sản phẩm đã bán"
          value={s.soldProducts ?? 0}
          sub="đơn đã giao"
          icon={Package}
          href="/admin/orders"
        />
        <StatCard
          title="Người dùng mới (tháng)"
          value={s.newUsers ?? 0}
          icon={Users}
          href="/admin/users"
        />
        <StatCard
          title="Tỷ lệ hoàn thành"
          value={`${s.completionRate ?? 0}%`}
          sub="đơn giao thành công / tổng đơn"
          icon={Percent}
        />
      </div>

      {s.userActivityData && s.userActivityData.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Hoạt động 7 ngày qua
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Ngày</th>
                  <th className="pb-2 pr-4 font-medium">Sản phẩm đăng</th>
                  <th className="pb-2 font-medium">Đơn giao</th>
                </tr>
              </thead>
              <tbody>
                {s.userActivityData.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 last:border-0"
                  >
                    <td className="py-2 pr-4 text-foreground">{row.day}</td>
                    <td className="py-2 pr-4">{row.listings}</td>
                    <td className="py-2">{row.purchases}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Package className="h-4 w-4" />
          Quản lý sản phẩm
        </Link>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <ShoppingCart className="h-4 w-4" />
          Xem đơn hàng
        </Link>
        <Link
          href="/admin/sellers"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <LayoutDashboard className="h-4 w-4" />
          Quản lý Seller
        </Link>
      </div>
    </div>
  );
}

