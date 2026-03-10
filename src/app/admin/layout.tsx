"use client";

import { IconLayoutDashboard, IconPackage, IconShieldCheck, IconChevronRight, IconShoppingCart, IconUsers, IconBuildingStore, IconFolders, IconFlag, IconRobot, IconHome, IconCoinOff, IconCash } from "@tabler/icons-react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: account, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;
    if (!account) {
      router.replace("/login");
      return;
    }
    if (account.role !== "admin") {
      router.replace("/");
    }
  }, [account, isLoading, router]);

  if (isLoading || !account || account.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="animate-pulse text-muted-foreground text-sm">
          Đang kiểm tra quyền...
        </div>
      </div>
    );
  }

  const nav = [
    { href: "/admin", label: "Tổng quan", icon: IconLayoutDashboard },
    { href: "/admin/products", label: "Sản phẩm", icon: IconPackage },
    { href: "/admin/orders", label: "Đơn hàng", icon: IconShoppingCart },
    { href: "/admin/refunds", label: "Hoàn tiền", icon: IconCoinOff },
    { href: "/admin/payouts", label: "Thanh toán", icon: IconCash },
    { href: "/admin/users", label: "Người dùng", icon: IconUsers },
    { href: "/admin/sellers", label: "Seller", icon: IconBuildingStore },
    { href: "/admin/categories", label: "Danh mục", icon: IconFolders },
    { href: "/admin/reports", label: "Báo cáo", icon: IconFlag },
    { href: "/admin/moderation", label: "Kiểm duyệt AI", icon: IconRobot },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-muted/20">
      <aside className="w-full lg:w-56 shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <IconShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-sm text-foreground">
              Admin
            </span>
          </div>
          <Link
            href="/"
            className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <IconHome className="w-4 h-4 shrink-0" />
            Về trang chủ
          </Link>
        </div>
        <nav className="p-2 space-y-0.5">
          {nav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
                <IconChevronRight className="w-3.5 h-3.5 ml-auto lg:hidden" />
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex-1 min-w-0 p-4 lg:p-6">{children}</div>
    </div>
  );
}
