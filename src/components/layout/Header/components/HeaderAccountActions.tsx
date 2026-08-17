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
  productCount: number;
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
  productCount,
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
        className="gap-1 group relative inline-flex items-center justify-center h-8 sm:h-9 px-4 sm:px-5 text-xs font-medium uppercase tracking-[0.1em] text-white bg-primary rounded-[2px] transition-all duration-300 hover:scale-[1.03]"
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
          {productCount > 0 && (
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
              {productCount > 99 ? "99+" : productCount}
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
