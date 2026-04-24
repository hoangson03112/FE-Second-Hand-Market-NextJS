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
          background: "rgba(253,250,246,0.97)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--border)",
          boxShadow: "0 2px 12px rgba(26,23,20,0.06)",
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-[58px] min-w-0 items-center gap-1 sm:h-[62px] sm:gap-2">
            <HeaderLogo />

            <CategoryMegaMenu
              categories={categories}
              showAllCategories={showAllCategories}
              onShowAllCategories={handleShowAllCategories}
              onHideAllCategories={handleHideAllCategories}
            />

            <div className="ml-auto flex min-w-0 items-center gap-1 sm:gap-2">
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
              <div className="min-w-0">
                <HeaderSearch query={query} setQuery={setQuery} submitSearch={submitSearch} />
              </div>
            </div>
          </div>

          <div className="pb-3 xl:hidden">
            <form onSubmit={submitSearch} role="search" className="relative">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-taupe-500" />
              <input
                id="header-mobile-search"
                name="search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="h-10 w-full rounded-full border border-taupe-200 bg-white pl-10 pr-4 text-sm text-taupe-900 placeholder:text-taupe-400 focus:outline-none"
              />
            </form>

          </div>
        </div>
      </header>

    </>
  );
}
