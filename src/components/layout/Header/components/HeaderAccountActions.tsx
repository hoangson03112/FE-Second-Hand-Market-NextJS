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
          background: "linear-gradient(135deg, #C47B5A 0%, #B06038 100%)",
          color: "#FDFAF6",
          borderRadius: "9999px",
          boxShadow: "0 2px 8px rgba(196,123,90,0.32)",
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
          className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-150"
          style={{ color: "#7A6755" }}
          onMouseEnter={(event) => {
            event.currentTarget.style.color = "#C47B5A";
            event.currentTarget.style.background = "#EDE0D4";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.color = "#7A6755";
            event.currentTarget.style.background = "";
          }}
        >
          <IconShoppingCart className="w-[17px] h-[17px]" />
          {cartItemCount > 0 && (
            <span
              className="absolute top-0 right-0 min-w-[16px] h-4 flex items-center justify-center text-white text-[9px] font-bold"
              style={{
                background: "#C47B5A",
                borderRadius: "20px",
                border: "1.5px solid #FDFAF6",
                padding: "0 3px",
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
