"use client";

import {
  IconLayoutDashboard,
  IconPackage,
  IconShieldCheck,
  IconChevronRight,
  IconShoppingCart,
  IconUsers,
  IconBuildingStore,
  IconFolders,
  IconFlag,
  IconRobot,
  IconHome,
  IconCoinOff,
  IconCash,
  IconHistory,
  IconBellRinging,
  IconLogout,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/features/auth/hooks/useUser";
import { PageLoader } from "@/components/ui";
import { AvatarOrInitials } from "@/components/ui/AvatarOrInitials";
import { AuthService } from "@/services/auth.service";
import { announceSession } from "@/lib/session";

interface NavGroup {
  group: string;
  items: {
    href: string;
    label: string;
    icon: React.ElementType;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: "Tổng quan",
    items: [
      { href: "/admin", label: "Tổng quan", icon: IconLayoutDashboard },
    ],
  },
  {
    group: "Quản lý sàn",
    items: [
      { href: "/admin/products", label: "Sản phẩm", icon: IconPackage },
      { href: "/admin/orders", label: "Đơn hàng", icon: IconShoppingCart },
      { href: "/admin/refunds", label: "Hoàn tiền & Khiếu nại", icon: IconCoinOff },
      { href: "/admin/payouts", label: "Thanh toán Seller", icon: IconCash },
      { href: "/admin/categories", label: "Danh mục", icon: IconFolders },
    ],
  },
  {
    group: "Tài khoản",
    items: [
      { href: "/admin/users", label: "Người dùng", icon: IconUsers },
      { href: "/admin/sellers", label: "Seller", icon: IconBuildingStore },
    ],
  },
  {
    group: "Hệ thống & AI",
    items: [
      { href: "/admin/reports", label: "Báo cáo", icon: IconFlag },
      { href: "/admin/notifications", label: "Thông báo hệ thống", icon: IconBellRinging },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: IconHistory },
      { href: "/admin/moderation", label: "Kiểm duyệt AI", icon: IconRobot },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: account, isLoading } = useUser();
  const [authCheckReady, setAuthCheckReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Đợi token store rehydrate từ localStorage trước khi kiểm tra auth
  useEffect(() => {
    const id = requestAnimationFrame(() => setAuthCheckReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!authCheckReady) return;
    if (isLoading) return;
    if (!account) {
      router.replace(
        `/login?redirect=${encodeURIComponent(pathname || "/admin")}`,
      );
      return;
    }
    if (account.role !== "admin") {
      router.replace("/");
    }
  }, [account, isLoading, router, pathname, authCheckReady]);

  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      announceSession("signed-out");
      router.replace("/login");
      router.refresh();
    }
  };

  if (!authCheckReady || isLoading || !account || account.role !== "admin") {
    return (
      <PageLoader
        fullScreen
        eyebrow="Khu vực quản trị"
        title="Đang kiểm tra quyền truy cập..."
      />
    );
  }

  const currentNav = NAV_GROUPS.flatMap((g) => g.items).find(
    (item) =>
      item.href === pathname ||
      (item.href !== "/admin" && pathname.startsWith(item.href)),
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* ─── SIDEBAR BACKDROP (Mobile) ─── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ─── SIDEBAR ─── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-border/80 flex items-center justify-between shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary transition-transform group-hover:scale-105">
              <IconShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-foreground tracking-tight block">
                Eco Admin
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider block">
                Control Hub
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted lg:hidden"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links grouped */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.group} className="space-y-1">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1">
                {group.group}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer: Admin Profile & Back to site */}
        <div className="p-3 border-t border-border/80 space-y-2 shrink-0 bg-muted/20">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-card hover:text-foreground hover:border hover:border-border transition-all border border-transparent"
          >
            <IconHome className="w-4 h-4 shrink-0 text-muted-foreground" />
            <span>Về trang mua sắm</span>
          </Link>

          <div className="p-2.5 rounded-xl bg-card border border-border/80 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <AvatarOrInitials
                avatar={account.avatar}
                fullName={account.fullName}
                size={32}
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate leading-tight">
                  {account.fullName || "Quản trị viên"}
                </p>
                <span className="inline-block mt-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  Admin
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
              title="Đăng xuất"
            >
              <IconLogout className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN WRAPPER ─── */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* TopBar */}
        <header className="h-16 px-4 lg:px-8 border-b border-border/80 bg-card/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
              aria-label="Mở menu"
            >
              <IconMenu2 className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Quản trị
              </span>
              <IconChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 hidden sm:inline" />
              <span className="text-sm font-bold text-foreground truncate">
                {currentNav?.label || "Khu vực quản trị"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <IconHome className="w-3.5 h-3.5" />
              Trang người dùng
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-9xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
