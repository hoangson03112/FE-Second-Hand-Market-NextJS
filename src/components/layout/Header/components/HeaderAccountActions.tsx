import { IconPlus, IconShoppingCart } from "@tabler/icons-react";
import Link from "next/link";
import { NotificationDropdown } from "./NotificationDropdown";
import { UserMenuDropdown } from "./UserMenuDropdown";

interface HeaderAccount {
  avatar?: string;
  fullName?: string;
  email?: string;
  role?: string;
}

interface HeaderAccountActionsProps {
  account: HeaderAccount;
  sellButtonHref: string;
  sellButtonText: string;
  cartItemCount: number;
  showUserDropdown: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  toggleUserDropdown: () => void;
  closeUserDropdown: () => void;
  handleLogout: () => void;
  getInitials: (name?: string) => string;
}

export function HeaderAccountActions({
  account,
  sellButtonHref,
  sellButtonText,
  cartItemCount,
  showUserDropdown,
  dropdownRef,
  toggleUserDropdown,
  closeUserDropdown,
  handleLogout,
  getInitials,
}: HeaderAccountActionsProps) {
  return (
    <>
      <Link
        href={sellButtonHref}
        className="hidden xl:inline-flex items-center gap-1.5 h-9 px-4 text-[12.5px] font-semibold transition-all duration-150 hover:opacity-90"
        style={{
          background: "linear-gradient(135deg, var(--primary) 0%, oklch(0.43 0.08 35) 100%)",
          color: "var(--background)",
          borderRadius: "9999px",
          boxShadow: "0 2px 8px color-mix(in oklch, var(--primary) 32%, transparent)",
        }}
      >
        <IconPlus className="w-3.5 h-3.5" strokeWidth={2.5} />
        {sellButtonText}
      </Link>

      <div className="flex items-center">


        <NotificationDropdown />

        <Link
          href="/cart"
          aria-label="Giỏ hàng"
          className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-150 text-muted-foreground hover:text-foreground hover:bg-primary/10"
        >
          <IconShoppingCart className="w-[17px] h-[17px]" />
          {cartItemCount > 0 && (
            <span
              className="absolute top-0 right-0 min-w-[16px] h-4 flex items-center justify-center text-white text-[9px] font-bold"
              style={{
                background: "oklch(0.48 0.12 35)",
                borderRadius: "20px",
                border: "1.5px solid var(--background)",
                padding: "0 3px",
                boxShadow: "0 1px 4px oklch(0.48 0.12 35 / 0.4)",
              }}
            >
              {cartItemCount > 99 ? "99+" : cartItemCount}
            </span>
          )}
        </Link>
      </div>

      <UserMenuDropdown
        account={account}
        showUserDropdown={showUserDropdown}
        dropdownRef={dropdownRef}
        toggleUserDropdown={toggleUserDropdown}
        closeUserDropdown={closeUserDropdown}
        handleLogout={handleLogout}
        getInitials={getInitials}
      />
    </>
  );
}
