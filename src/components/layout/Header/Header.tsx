"use client";

import { IconSearch } from "@tabler/icons-react";
import { HeaderLogo } from "./components/HeaderLogo";
import { CategoryMegaMenu } from "./components/CategoryMegaMenu";
import { HeaderSearch } from "./components/HeaderSearch";
import { HeaderGuestActions } from "./components/HeaderGuestActions";
import { HeaderAccountActions } from "./components/HeaderAccountActions";
import { useHeader } from "./hooks/useHeader";

export default function Header() {
  const {
    account,
    categories,
    showAllCategories,
    cartItemCount,
    query,
    setQuery,
    showUserDropdown,
    dropdownRef,
    handleShowAllCategories,
    handleHideAllCategories,
    submitSearch,
    toggleUserDropdown,
    closeUserDropdown,
    handleLogout,
    getInitials,
    sellButtonHref,
    sellButtonText,
  } = useHeader();

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--border)",
          boxShadow: "0 2px 12px rgba(26,23,20,0.06)",
        }}
      >
        <div className="mx-auto w-full max-w-8xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-[58px] min-w-0 items-center gap-1 sm:h-[62px] sm:gap-2">
            <HeaderLogo />

            <CategoryMegaMenu
              categories={categories}
              showAllCategories={showAllCategories}
              onShowAllCategories={handleShowAllCategories}
              onHideAllCategories={handleHideAllCategories}
            />

            <div className="ml-auto flex min-w-0 items-center gap-1 sm:gap-2">
              <div className="min-w-0">
                <HeaderSearch
                  query={query}
                  submitSearch={submitSearch}
                  setQuery={setQuery}
                />
              </div>
              <div className="flex shrink-0 items-center gap-0 sm:gap-1">
                {!account ? (
                  <HeaderGuestActions />
                ) : (
                  <HeaderAccountActions
                    account={account}
                    sellButtonHref={sellButtonHref}
                    sellButtonText={sellButtonText}
                    cartItemCount={cartItemCount}
                    showUserDropdown={showUserDropdown}
                    dropdownRef={dropdownRef}
                    toggleUserDropdown={toggleUserDropdown}
                    closeUserDropdown={closeUserDropdown}
                    handleLogout={handleLogout}
                    getInitials={getInitials}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
