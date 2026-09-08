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
    <div className="h-screen overflow-hidden flex bg-luxury-ivory text-luxury-ink">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar: Luxury Ink with Champagne Accents */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-luxury-ink text-luxury-ivory border-r border-luxury-ink/20 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 px-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-[2px] bg-luxury-champagne/15 border border-luxury-champagne/30 flex items-center justify-center text-luxury-champagne transition-transform group-hover:scale-105">
              <IconShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-droid-serif font-bold text-sm text-luxury-ivory tracking-wide block">
                Eco Admin
              </span>
              <span className="text-2xs text-luxury-champagne font-bold uppercase tracking-[0.2em] block">
                Control Hub
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-[2px] text-luxury-ivory/70 hover:bg-white/10 lg:hidden"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.group} className="space-y-1">
              <p className="px-3 text-2xs font-medium uppercase tracking-[0.15em] text-neutral-400 mb-1">
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
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-[2px] text-xs font-medium transition-all group ${
                        isActive
                          ? "bg-luxury-champagne/15 text-luxury-champagne border-l-2 border-luxury-champagne"
                          : "text-luxury-ivory/70 hover:bg-white/5 hover:text-luxury-ivory"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive
                            ? "text-luxury-champagne"
                            : "text-luxury-ivory/50 group-hover:text-luxury-ivory"
                        }`}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-white/10 space-y-2 shrink-0 bg-black/20">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-[2px] text-xs font-medium text-luxury-ivory/70 hover:bg-white/5 hover:text-luxury-ivory transition-all"
          >
            <IconHome className="w-4 h-4 shrink-0 text-luxury-champagne" />
            <span>Về trang chủ</span>
          </Link>

          <div className="p-2.5 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <AvatarOrInitials
                avatar={account.avatar}
                fullName={account.fullName}
                size={32}
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-luxury-ivory truncate leading-tight">
                  {account.fullName || "Quản trị viên"}
                </p>
                <span className="inline-block mt-0.5 text-2xs font-medium uppercase tracking-wider text-luxury-champagne">
                  Admin
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-[2px] text-luxury-ivory/60 hover:bg-white/10 hover:text-blush-400 transition-colors shrink-0"
              title="Đăng xuất"
            >
              <IconLogout className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-0">
        <header className="h-16 px-4 lg:px-8 border-b border-luxury-ink/10 bg-luxury-ivory/95 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-[2px] border border-luxury-ink/15 text-luxury-ink hover:bg-taupe-50 lg:hidden"
              aria-label="Mở menu"
            >
              <IconMenu2 className="w-5 h-5" />
            </button>

            <div className="flex font-medium items-center gap-2 min-w-0">
              <span className="text-2xs  uppercase tracking-[0.2em] text-neutral-500 hidden sm:inline">
                Quản trị
              </span>
              <IconChevronRight className="w-3 h-3 text-neutral-400 hidden sm:inline" />
              <span className="font-droid-serif text-sm text-luxury-ink truncate">
                {currentNav?.label || "Khu vực quản trị"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[2px] text-2xs font-medium uppercase tracking-[0.16em] border border-luxury-ink/15 text-luxury-ink bg-white hover:bg-taupe-50 transition-colors"
            >
              <IconHome className="w-3.5 h-3.5" />
              Trang người dùng
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8  w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
