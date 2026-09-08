"use client";

import {
  IconLoader2,
  IconPackage,
  IconBolt,
  IconTruck,
  IconBuildingBank,
  IconCheck,
  IconTrendingUp,
  IconClock,
  IconArrowRight,
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && !account) {
      router.push("/login");
      return;
    }
    if (!account) return;

    const load = async () => {
      try {
        const ordersRes = await OrderService.getSellerOrders();
        setOrders(ordersRes.orders || []);
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

  const paidOrders = orders.filter((o) => o.paymentStatus === "paid" || o.status === "completed");
  const weekRevenue = paidOrders
    .filter((o) => isWithinDays(o.createdAt, 7))
    .reduce((s, o) => s + o.totalAmount, 0);
  const monthRevenue = paidOrders
    .filter((o) => isWithinDays(o.createdAt, 30))
    .reduce((s, o) => s + o.totalAmount, 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const shipping = orders.filter((o) =>
    ["confirmed", "picked_up", "shipping", "out_for_delivery"].includes(o.status),
  ).length;
  const completed = orders.filter((o) => o.status === "completed").length;

  const statCards = [
    {
      label: "Chờ xác nhận",
      value: `${pending} đơn`,
      Icon: IconClock,
      note: "Cần đóng gói & giao bưu tá",
      attention: pending > 0,
    },
    {
      label: "Đang vận chuyển",
      value: `${shipping} đơn`,
      Icon: IconTruck,
      note: "Bưu tá GHN đang giao",
    },
    {
      label: "Đơn hoàn thành",
      value: `${completed} đơn`,
      Icon: IconCheck,
      note: "Đã giao & chờ Admin bank",
    },
    {
      label: "Doanh thu 30 ngày",
      value: formatPrice(monthRevenue),
      Icon: IconTrendingUp,
      note: `7 ngày qua: ${formatPrice(weekRevenue)}`,
    },
  ];

  const actionCards = [
    {
      href: "/seller/orders",
      label: "Quản lý đơn hàng",
      sub: `${pending} chờ xác nhận · ${shipping} đang giao`,
      Icon: IconTruck,
    },
    {
      href: "/my/listings",
      label: "Sản phẩm đã đăng",
      sub: "Chỉnh sửa giá & đăng thêm sản phẩm",
      Icon: IconPackage,
    },
    {
      href: "/profile?tab=bank",
      label: "Tài khoản nhận tiền",
      sub: "Cập nhật STK ngân hàng để nhận tiền từ Admin",
      Icon: IconBuildingBank,
    },
  ];

  return (
    <div className="max-w-9xl mx-auto flex-1 w-full min-h-full bg-luxury-ivory text-luxury-ink selection:text-background flex flex-col font-sans">
      <AllProductsHeader
        total={orders.length}
        title="Tổng quan Kênh Bán"
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
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className={`rounded-[2px] border bg-white p-5 space-y-3 transition-all ${
                    card.attention
                      ? "border-luxury-champagne bg-cream-100/50"
                      : "border-luxury-ink/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xs font-bold uppercase tracking-[0.16em] text-neutral-500">
                      {card.label}
                    </span>
                    <div className="w-8 h-8 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink flex items-center justify-center">
                      <card.Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="font-droid-serif text-2xl font-bold text-luxury-ink">
                    {card.value}
                  </div>
                  <p className="text-xs text-neutral-500">{card.note}</p>
                </div>
              ))}
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
              <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-6">
                <div className="mb-6 flex items-center justify-between gap-3 border-b border-luxury-ink/8 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-2 mb-1">
                      <span className="h-px w-6 bg-luxury-champagne/80" />
                      <span className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                        Thao tác nhanh
                      </span>
                    </div>
                    <h2 className="font-droid-serif text-xl font-bold text-luxury-ink">
                      Hành Động Quản Lý
                    </h2>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {actionCards.map((card) => (
                    <Link
                      key={card.href}
                      href={card.href}
                      className="group flex min-h-[160px] flex-col justify-between rounded-[2px] border border-luxury-ink/10 bg-cream-50/30 p-5 transition-all hover:border-luxury-ink/30 hover:bg-cream-50/70"
                    >
                      <div className="w-10 h-10 rounded-[2px] border border-luxury-ink/10 bg-white flex items-center justify-center text-luxury-ink">
                        <card.Icon className="h-5 w-5" />
                      </div>

                      <div className="space-y-1.5 pt-4">
                        <div className="font-droid-serif text-base font-bold text-luxury-ink group-hover:text-accent transition-colors flex items-center justify-between">
                          <span>{card.label}</span>
                          <IconArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <div className="text-xs text-neutral-500 leading-relaxed">
                          {card.sub}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <aside className="rounded-[2px] border border-luxury-ink/10 bg-white p-6 space-y-5">
                <div>
                  <div className="inline-flex items-center gap-2 mb-1">
                    <span className="h-px w-6 bg-luxury-champagne/80" />
                    <span className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                      Trạng thái
                    </span>
                  </div>
                  <h3 className="font-droid-serif text-xl font-bold text-luxury-ink">
                    Cần Xử Lý
                  </h3>
                </div>

                {pending > 0 ? (
                  <div className="rounded-[2px] border border-luxury-champagne/60 bg-cream-100/70 p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[2px] bg-luxury-champagne text-white flex items-center justify-center shrink-0">
                        <IconBolt className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-luxury-ink">
                          Bạn có {pending} đơn hàng chờ xác nhận
                        </p>
                        <p className="text-2xs uppercase tracking-[0.12em] text-neutral-600 mt-0.5">
                          Đóng gói và bàn giao bưu tá
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/seller/orders?tab=pending"
                      className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.14em] text-luxury-ink hover:underline pt-1"
                    >
                      Mở danh sách đơn cần xử lý →
                    </Link>
                  </div>
                ) : (
                  <div className="rounded-[2px] border border-accent/20 bg-cream-50/70 p-4">
                    <p className="text-xs font-semibold text-accent">
                      Tất cả đơn hàng của bạn đang được xử lý ổn định.
                    </p>
                  </div>
                )}

                <div className="border-t border-luxury-ink/8 pt-4 space-y-2.5 text-xs text-neutral-600">
                  <div className="flex items-center justify-between">
                    <span>Đơn đang giao (GHN):</span>
                    <span className="font-bold text-luxury-ink">{shipping}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Doanh thu 7 ngày:</span>
                    <span className="font-bold text-luxury-ink">
                      {formatPrice(weekRevenue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Nhận tiền bán hàng:</span>
                    <Link
                      href="/profile?tab=bank"
                      className="text-accent font-bold hover:underline"
                    >
                      Kiểm tra STK →
                    </Link>
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
