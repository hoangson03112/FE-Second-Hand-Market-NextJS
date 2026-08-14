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
    className: "bg-amber-100 text-amber-800 border-amber-200",
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
  return (
    ROLE_CONFIG[role] ?? {
      label: "Người dùng",
      className: "bg-muted text-muted-foreground border-border",
    }
  );
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
    `w-full flex items-center gap-3 px-4 py-2.5 rounded-[2px] text-sm font-medium transition-colors ${
      activeTab === tab
        ? "bg-taupe-50 text-luxury-ink"
        : "text-muted-foreground hover:bg-taupe-50/50 hover:text-luxury-ink"
    }`;

  return (
    <aside className="lg:w-72 shrink-0">
      <div className="rounded-[2px] border border-luxury-ink/10 bg-white overflow-hidden">
        {/* User card */}
        <div className="p-6 border-b border-luxury-ink/10 bg-luxury-ivory/50">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              <UserAvatar
                avatarUrl={avatarUrl}
                fullName={fullName}
                size="large"
              />
            </div>
            <h3
              className="text-xl text-luxury-ink mb-1 line-clamp-1"
              style={{ fontFamily: "var(--font-droid-serif), serif" }}
            >
              {fullName || "Người dùng"}
            </h3>
            <p className="text-xs text-muted-foreground mb-4 line-clamp-1">
              {email}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-[2px] text-xs font-medium border ${roleBadge.className}`}
              >
                {roleBadge.label}
              </span>
              {isGoogleUser && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-xs font-medium border border-border bg-background/80">
                  <IconShield className="w-3 h-3 text-luxury-ink" />
                  Google
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs: Tài khoản */}
        <div className="p-4 border-b border-luxury-ink/10">
          <p className="px-2 py-2 text-xs font-bold text-charcoal-400  uppercase tracking-[0.13em]">
            Tài khoản
          </p>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onTabChange("profile")}
              className={navClass("profile")}
            >
              <IconUser className="w-4 h-4" />
              <span>Hồ sơ cá nhân</span>
            </button>
            <button
              type="button"
              onClick={() => onTabChange("password")}
              className={navClass("password")}
            >
              <IconLock className="w-4 h-4" />
              <span>
                {isGoogleUser ? "Thiết lập mật khẩu" : "Đổi mật khẩu"}
              </span>
            </button>
          </div>
        </div>

        {isSeller && (
          <div className="p-4 border-b border-luxury-ink/10">
            <p className="px-2 py-2 text-[10px] font-bold text-taupe-500 uppercase tracking-[0.2em]">
              Seller
            </p>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => onTabChange("bank")}
                className={navClass("bank")}
              >
                <IconBuildingBank className="w-4 h-4" />
                <span>Thông tin ngân hàng</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick links by role */}
        {(isSeller || isAdmin) && (
          <div className="p-4">
            <p className="px-2 py-2 text-xs font-bold text-charcoal-400  uppercase tracking-[0.13em]">
              Truy cập nhanh
            </p>
            <div className="space-y-1">
              {isSeller && (
                <>
                  <Link
                    href="/seller"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-[2px] text-sm font-medium text-muted-foreground hover:bg-taupe-50 hover:text-luxury-ink transition-colors"
                  >
                    <IconLayoutDashboard className="w-4 h-4 shrink-0" />
                    Tổng quan Seller
                  </Link>
                  <Link
                    href="/seller/orders"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-[2px] text-sm font-medium text-muted-foreground hover:bg-taupe-50 hover:text-luxury-ink transition-colors"
                  >
                    <IconTruck className="w-4 h-4 shrink-0" />
                    Đơn hàng bán
                  </Link>
                  <Link
                    href="/my/listings"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-[2px] text-sm font-medium text-muted-foreground hover:bg-taupe-50 hover:text-luxury-ink transition-colors"
                  >
                    <IconPackage className="w-4 h-4 shrink-0" />
                    Sản phẩm đã đăng
                  </Link>
                  <Link
                    href="/seller/payouts"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-[2px] text-sm font-medium text-muted-foreground hover:bg-taupe-50 hover:text-luxury-ink transition-colors"
                  >
                    <IconCurrencyDong className="w-4 h-4 shrink-0" />
                    Ví & Thanh toán
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className=" flex items-center gap-3 px-4 py-2.5 rounded-[2px] text-base font-medium text-muted-foreground hover:bg-taupe-50 hover:text-luxury-ink transition-colors"
                >
                  <IconSettings className="w-4 h-4 shrink-0" />
                  Quản trị hệ thống
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
