"use client";

import {
  IconArrowLeft,
  IconLoader2,
  IconPackage,
  IconBolt,
  IconTruck,
  IconCoins,
  IconChartBar,
  IconTrendingUp,
} from "@tabler/icons-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OrderService } from "@/services/order.service";
import { formatPrice } from "@/utils/format/price";
import type { Order } from "@/types/order";

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function isWithinDays(dateStr: string, days: number) {
  return new Date(dateStr).getTime() > Date.now() - days * 24 * 60 * 60 * 1000;
}

export default function SellerDashboard() {
  const router = useRouter();
  const { data: account, isLoading: userLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wallet, setWallet] = useState<{
    balance: number;
    pendingBalance: number;
    totalEarned: number;
    totalWithdrawn: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && !account) {
      router.push("/login");
      return;
    }
    if (!account) return;

    const load = async () => {
      try {
        const [ordersRes, walletRes] = await Promise.all([
          OrderService.getSellerOrders(),
          OrderService.getSellerWallet().catch(() => null),
        ]);
        setOrders(ordersRes.orders || []);
        setWallet(walletRes ?? null);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [account, userLoading, router]);

  if (userLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <IconLoader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!account) return null;

  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const todayRevenue = paidOrders.filter((o) => isToday(o.createdAt)).reduce((s, o) => s + o.totalAmount, 0);
  const weekRevenue = paidOrders.filter((o) => isWithinDays(o.createdAt, 7)).reduce((s, o) => s + o.totalAmount, 0);
  const monthRevenue = paidOrders.filter((o) => isWithinDays(o.createdAt, 30)).reduce((s, o) => s + o.totalAmount, 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const shipping = orders.filter((o) =>
    ["confirmed", "picked_up", "shipping", "out_for_delivery"].includes(o.status)
  ).length;

  const statCards = [
    { label: "Số dư ví", value: formatPrice(wallet?.balance ?? 0), Icon: IconCoins, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
    { label: "Chờ rút", value: formatPrice(wallet?.pendingBalance ?? 0), Icon: IconChartBar, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { label: "Doanh thu 7 ngày", value: formatPrice(weekRevenue), Icon: IconTrendingUp, color: "text-primary", bg: "bg-primary/8", border: "border-primary/15" },
    { label: "Doanh thu 30 ngày", value: formatPrice(monthRevenue), Icon: IconCoins, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  ];

  const actionCards = [
    { href: "/seller/orders", label: "Quản lý đơn hàng", sub: `${pending} chờ xác nhận • ${shipping} đang giao`, Icon: IconTruck },
    { href: "/my/listings", label: "Sản phẩm đã đăng", sub: "Chỉnh sửa, đăng thêm", Icon: IconPackage },
    { href: "/seller/payouts", label: "Ví & Thanh toán", sub: `Tổng thu: ${formatPrice(wallet?.totalEarned ?? 0)}`, Icon: IconBolt },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm">
          <IconArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-0.5">Tổng quan Seller</h1>
        <p className="text-sm text-muted-foreground">Xem nhanh doanh thu và đơn hàng của bạn</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <IconLoader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {statCards.map((c) => (
              <div key={c.label} className={`${c.bg} border ${c.border} rounded-2xl p-4`}>
                <c.Icon className={`w-5 h-5 ${c.color} mb-2.5`} />
                <div className="font-bold text-foreground text-sm leading-tight mb-0.5">{c.value}</div>
                <div className="text-xs text-muted-foreground">{c.label}</div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {actionCards.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-muted/50 hover:border-primary/20 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <c.Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{c.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.sub}</div>
                </div>
              </Link>
            ))}
          </div>

          {pending > 0 && (
            <div className="mt-6 p-4 rounded-xl border border-orange-200 bg-orange-50 flex items-center gap-3">
              <IconBolt className="w-5 h-5 text-orange-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-orange-800">Bạn có {pending} đơn chờ xác nhận</p>
                <Link href="/seller/orders?tab=pending" className="text-xs font-semibold text-orange-600 hover:underline">
                  Xử lý ngay →
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
