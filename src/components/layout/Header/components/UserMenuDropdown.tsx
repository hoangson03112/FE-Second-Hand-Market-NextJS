import { IconChevronDown, IconMessageCircle, IconSettings, IconPackage, IconTruck, IconUser, IconLogout } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { RefObject } from "react";

interface HeaderAccount {
  avatar?: string;
  fullName?: string;
  email?: string;
  role?: string;
}

interface UserMenuDropdownProps {
  account: HeaderAccount;
  showUserDropdown: boolean;
  dropdownRef: RefObject<HTMLDivElement | null>;
  toggleUserDropdown: () => void;
  closeUserDropdown: () => void;
  handleLogout: () => void;
  getInitials: (name?: string) => string;
}

export function UserMenuDropdown({
  account,
  showUserDropdown,
  dropdownRef,
  toggleUserDropdown,
  closeUserDropdown,
  handleLogout,
  getInitials,
}: UserMenuDropdownProps) {
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleUserDropdown}
        className={`flex items-center gap-1 sm:gap-1.5 h-8 sm:h-9 pl-0.5 sm:pl-1 pr-1.5 sm:pr-2.5 rounded-full transition-all duration-150 focus:outline-none hover:bg-primary/10 ${showUserDropdown ? "bg-primary/10" : ""}`}
        aria-expanded={showUserDropdown}
        aria-haspopup="true"
      >
        {account?.avatar ? (
          <Image
            src={account.avatar}
            alt=""
            width={30}
            height={30}
            className="w-7 h-7 sm:w-[30px] sm:h-[30px] object-cover rounded-full"
            style={{ border: "2px solid var(--border)" }}
          />
        ) : (
          <span
            className="w-7 h-7 sm:w-[30px] sm:h-[30px] flex items-center justify-center text-white text-[11px] font-bold rounded-full"
            style={{ background: "linear-gradient(135deg, var(--primary) 0%, oklch(0.43 0.08 35) 100%)" }}
          >
            {getInitials(account?.fullName)}
          </span>
        )}
        <IconChevronDown
          className={`hidden sm:block w-3.5 h-3.5 transition-transform duration-200 text-muted-foreground ${showUserDropdown ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </button>

      {showUserDropdown && (
        <div
          className="absolute right-0 mt-2 w-60 z-50"
          style={{
            background: "var(--background)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            boxShadow: "0 16px 48px rgba(26,23,20,0.13), 0 2px 8px rgba(26,23,20,0.05)",
          }}
        >
          <div className="px-4 pt-4 pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              {account?.avatar ? (
                <Image
                  src={account.avatar}
                  alt=""
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                  style={{ border: "2px solid var(--border)" }}
                />
              ) : (
                <span
                  className="w-9 h-9 flex items-center justify-center text-white text-[13px] font-bold shrink-0 rounded-full"
                  style={{ background: "linear-gradient(135deg, var(--primary) 0%, oklch(0.43 0.08 35) 100%)" }}
                >
                  {getInitials(account?.fullName)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold truncate text-foreground">
                  {account?.fullName || "Người dùng"}
                </p>
                <p className="text-[11.5px] truncate mt-0.5 text-muted-foreground">
                  {account?.email}
                </p>
              </div>
            </div>
          </div>
          <div className="p-1.5">
            {[
              { href: "/profile", icon: <IconUser className="w-4 h-4 shrink-0" />, label: "Thông tin tài khoản", show: true },
              { href: "/admin", icon: <IconSettings className="w-4 h-4 shrink-0" />, label: "Quản trị", show: account.role === "admin" },
              { href: "/chat", icon: <IconMessageCircle className="w-4 h-4 shrink-0" />, label: "Tin nhắn", show: true },
              { href: "/my/listings", icon: <IconPackage className="w-4 h-4 shrink-0" />, label: "Sản phẩm đã đăng", show: true },
              {
                href: "/orders",
                icon: (
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                label: "Đơn hàng của tôi",
                show: true,
              },
              { href: "/seller/orders", icon: <IconTruck className="w-4 h-4 shrink-0" />, label: "Đơn hàng bán của tôi", show: true },
            ]
              .filter((item) => item.show)
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeUserDropdown}
                  className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-xl transition-all duration-100 text-foreground hover:bg-primary/10 hover:text-foreground"
                >
                  <span className="text-muted-foreground group-hover:text-primary">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            <div className="my-1 mx-1 h-px bg-border" />
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-xl transition-all duration-100 text-destructive hover:bg-destructive/5"
            >
              <IconLogout className="w-4 h-4 shrink-0" />Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
