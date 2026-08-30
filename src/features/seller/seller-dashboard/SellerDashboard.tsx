"use client";

import {
  IconLoader2,
  IconPackage,
  IconBolt,
  IconTruck,
  IconCoins,
  IconChartBar,
  IconTrendingUp,
} from "@tabler/icons-react";
import Link from "next/link";
import { useUser } from "@/features/auth/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OrderService } from "@/services/order.service";
import { formatPrice } from "@/utils/format/price";
import type { Order } from "@/types/order";
import AllProductsHeader from "@/features/product-list/components/AllProductsHeader";

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
      <div className="min-h-[50vh] flex items-center justify-center bg-luxury-ivory">
        <IconLoader2 className="h-10 w-10 animate-spin text-luxury-ink" />
      </div>
    );
  }

  if (!account) return null;

  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const weekRevenue = paidOrders
    .filter((o) => isWithinDays(o.createdAt, 7))
    .reduce((s, o) => s + o.totalAmount, 0);
  const monthRevenue = paidOrders
    .filter((o) => isWithinDays(o.createdAt, 30))
    .reduce((s, o) => s + o.totalAmount, 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const shipping = orders.filter((o) =>
    ["confirmed", "picked_up", "shipping", "out_for_delivery"].includes(
      o.status,
    ),
  ).length;

  const statCards = [
    {
      label: "Số dư ví",
      value: formatPrice(wallet?.balance ?? 0),
      Icon: IconCoins,
      accent: "text-luxury-ink",
      panelClass: "bg-white/80",
      ringClass: "border-taupe-200/80",
    },
    {
      label: "Chờ rút",
      value: formatPrice(wallet?.pendingBalance ?? 0),
      Icon: IconChartBar,
      accent: "text-charcoal-600",
      panelClass: "bg-[#f8f3ee]",
      ringClass: "border-taupe-200/80",
    },
    {
      label: "Doanh thu 7 ngày",
      value: formatPrice(weekRevenue),
      Icon: IconTrendingUp,
      accent: "text-luxury-ink",
      panelClass: "bg-[#f5efe8]",
      ringClass: "border-[#e7d9c9]",
    },
    {
      label: "Doanh thu 30 ngày",
      value: formatPrice(monthRevenue),
      Icon: IconCoins,
      accent: "text-charcoal-700",
      panelClass: "bg-white/80",
      ringClass: "border-taupe-200/80",
    },
  ];

  const actionCards = [
    {
      href: "/seller/orders",
      label: "Quản lý đơn hàng",
      sub: `${pending} chờ xác nhận • ${shipping} đang giao`,
      Icon: IconTruck,
    },
    {
      href: "/my/listings",
      label: "Sản phẩm đã đăng",
      sub: "Chỉnh sửa, đăng thêm",
      Icon: IconPackage,
    },
    {
      href: "/seller/payouts",
      label: "Ví & Thanh toán",
      sub: `Tổng thu: ${formatPrice(wallet?.totalEarned ?? 0)}`,
      Icon: IconBolt,
    },
  ];

  return (
    <div className="max-w-9xl mx-auto flex-1 w-full min-h-full bg-luxury-ivory text-luxury-ink selection:text-background flex flex-col font-sans">
      <AllProductsHeader
        total={orders.length}
        title="Tổng quan Seller"
        breadcrumbLabel="Seller"
        totalLabel="đơn hàng"
      />

      <div className="mx-auto w-full px-4 pb-12 sm:px-8 lg:px-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <IconLoader2 className="h-10 w-10 animate-spin text-luxury-ink" />
          </div>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className={`rounded-[26px] border ${card.ringClass} ${card.panelClass} p-5 shadow-[0_18px_45px_rgba(28,27,24,0.04)]`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80">
                      <card.Icon className={`h-5 w-5 ${card.accent}`} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-charcoal-400">
                      {card.label}
                    </span>
                  </div>
                  <div className="mt-6 text-2xl font-medium text-luxury-ink">
                    {card.value}
                  </div>
                </div>
              ))}
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
              <div className="rounded-[30px] border border-taupe-200/80 bg-white/80 p-6 shadow-[0_18px_45px_rgba(28,27,24,0.04)] backdrop-blur-sm">
                <div className="mb-5 flex items-center justify-between gap-3 border-b border-taupe-200/70 pb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-charcoal-400">
                      Truy cập nhanh
                    </p>
                    <h2 className="mt-2 text-xl font-medium text-luxury-ink">
                      Hành động quản lý
                    </h2>
                  </div>
                  <span className="rounded-full border border-taupe-200 bg-luxury-ivory px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-charcoal-500">
                    {actionCards.length} mục
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {actionCards.map((card) => (
                    <Link
                      key={card.href}
                      href={card.href}
                      className="group flex min-h-[180px] flex-col justify-between rounded-[24px] border border-taupe-200/80 bg-luxury-ivory p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-luxury-ink/30 hover:bg-[#f8f3ec]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-taupe-200/80">
                        <card.Icon className="h-5 w-5 text-luxury-ink" />
                      </div>

                      <div>
                        <div className="text-base font-medium text-luxury-ink">
                          {card.label}
                        </div>
                        <div className="mt-2 text-xs leading-5 text-charcoal-500">
                          {card.sub}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <aside className="rounded-[30px] border border-taupe-200/80 bg-white/80 p-6 shadow-[0_18px_45px_rgba(28,27,24,0.04)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-charcoal-400">
                  Cần xử lý
                </p>
                <h3 className="mt-2 text-xl font-medium text-luxury-ink">
                  Thông báo bán hàng
                </h3>

                {pending > 0 ? (
                  <div className="mt-5 rounded-[22px] border border-amber-200 bg-amber-50/80 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-amber-600">
                        <IconBolt className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-amber-900">
                          Bạn có {pending} đơn chờ xác nhận
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-amber-700">
                          cần xử lý ngay
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/seller/orders?tab=pending"
                      className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-amber-700 transition-colors hover:text-amber-900"
                    >
                      Xử lý ngay
                    </Link>
                  </div>
                ) : (
                  <div className="mt-5 rounded-[22px] border border-emerald-200 bg-emerald-50/80 p-4">
                    <p className="text-sm font-medium text-emerald-900">
                      Tất cả đơn hàng đang trong trạng thái ổn định.
                    </p>
                  </div>
                )}

                <div className="mt-6 border-t border-taupe-200/70 pt-5">
                  <div className="flex items-center justify-between text-sm text-charcoal-500">
                    <span>Đang giao</span>
                    <span className="font-medium text-luxury-ink">{shipping}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-charcoal-500">
                    <span>Doanh thu 7 ngày</span>
                    <span className="font-medium text-luxury-ink">
                      {formatPrice(weekRevenue)}
                    </span>
                  </div>
                </div>
              </aside>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
