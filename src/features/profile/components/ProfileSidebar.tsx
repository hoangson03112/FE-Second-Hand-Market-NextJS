import {
  IconUser,
  IconLock,
  IconLayoutDashboard,
  IconTruck,
  IconPackage,
  IconCurrencyDong,
  IconSettings,
  IconShield,
  IconBuildingBank,
} from "@tabler/icons-react";
import Link from "next/link";
import { UserAvatar } from "./UserAvatar";
import type { TabId } from "../types";

interface ProfileSidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  avatarUrl: string | null;
  fullName: string;
  email: string;
  role?: string;
  isGoogleUser: boolean;
}

const ROLE_CONFIG: Record<string, { label: string; className: string }> = {
  admin: {
    label: "Quản trị viên",
    className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
  },
  seller: {
    label: "Seller",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  buyer: {
    label: "Người mua",
    className: "bg-muted text-muted-foreground border-border",
  },
};

function getRoleBadge(role?: string) {
  if (!role) return ROLE_CONFIG.buyer;
  return ROLE_CONFIG[role] ?? { label: "Người dùng", className: "bg-muted text-muted-foreground border-border" };
}

export function ProfileSidebar({
  activeTab,
  onTabChange,
  avatarUrl,
  fullName,
  email,
  role,
  isGoogleUser,
}: ProfileSidebarProps) {
  const roleBadge = getRoleBadge(role);
  const isSeller = role === "seller";
  const isAdmin = role === "admin";

  const navClass = (tab: TabId) =>
    `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      activeTab === tab
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
    }`;

  return (
    <aside className="lg:w-72 shrink-0">
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        {/* User card */}
        <div className="p-5 border-b border-border bg-gradient-to-b from-muted/40 to-transparent">
          <div className="flex flex-col items-center text-center">
            <div className="mb-3">
              <UserAvatar avatarUrl={avatarUrl} fullName={fullName} size="large" showEditIcon />
            </div>
            <h3 className="font-semibold text-foreground text-base mb-1 line-clamp-1">
              {fullName || "Người dùng"}
            </h3>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{email}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${roleBadge.className}`}
              >
                {roleBadge.label}
              </span>
              {isGoogleUser && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-border bg-background/80">
                  <IconShield className="w-3 h-3 text-primary" />
                  Google
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs: Tài khoản */}
        <div className="p-3 border-b border-border">
          <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Tài khoản
          </p>
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => onTabChange("profile")}
              className={navClass("profile")}
            >
              <div className="p-1.5 rounded-lg bg-muted/50">
                <IconUser className="w-4 h-4" />
              </div>
              <span>Hồ sơ cá nhân</span>
            </button>
            <button
              type="button"
              onClick={() => onTabChange("password")}
              className={navClass("password")}
            >
              <div className="p-1.5 rounded-lg bg-muted/50">
                <IconLock className="w-4 h-4" />
              </div>
              <span>{isGoogleUser ? "Thiết lập mật khẩu" : "Đổi mật khẩu"}</span>
            </button>
          </div>
        </div>

        {/* Tab: Ngân hàng (chỉ Seller) */}
        {isSeller && (
          <div className="p-3 border-b border-border">
            <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Seller
            </p>
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => onTabChange("bank")}
                className={navClass("bank")}
              >
                <div className="p-1.5 rounded-lg bg-muted/50">
                  <IconBuildingBank className="w-4 h-4" />
                </div>
                <span>Thông tin ngân hàng</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick links by role */}
        {(isSeller || isAdmin) && (
          <div className="p-3">
            <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Truy cập nhanh
            </p>
            <div className="space-y-0.5">
              {isSeller && (
                <>
                  <Link
                    href="/seller"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <IconLayoutDashboard className="w-4 h-4 shrink-0" />
                    Tổng quan Seller
                  </Link>
                  <Link
                    href="/seller/orders"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <IconTruck className="w-4 h-4 shrink-0" />
                    Đơn hàng bán
                  </Link>
                  <Link
                    href="/my/listings"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <IconPackage className="w-4 h-4 shrink-0" />
                    Sản phẩm đã đăng
                  </Link>
                  <Link
                    href="/seller/payouts"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <IconCurrencyDong className="w-4 h-4 shrink-0" />
                    Ví & Thanh toán
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <IconSettings className="w-4 h-4 shrink-0" />
                  Trang quản trị
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
