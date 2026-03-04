"use client";

import { HeaderLogo } from "./components/HeaderLogo";
import { CategoryMegaMenu } from "./components/CategoryMegaMenu";
import { CategoryNav } from "./components/CategoryNav";
import { HeaderSearch } from "./components/HeaderSearch";
import { HeaderGuestActions } from "./components/HeaderGuestActions";
import { HeaderAccountActions } from "./components/HeaderAccountActions";
import { useHeader } from "./hooks/useHeader";

export default function Header() {
  const {
    account,
    categories,
    isLoading,
    visibleCategories,
    activeCategory,
    showAllCategories,
    cartItemCount,
    query,
    setQuery,
    showUserDropdown,
    dropdownRef,
    handleMouseEnterCategory,
    handleMouseLeaveCategory,
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
          borderBottom: "1px solid #E4D9CC",
          boxShadow: "0 2px 12px rgba(26,23,20,0.06)",
        }}
      >
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center h-[56px] sm:h-[60px] gap-1.5 sm:gap-2.5">
            <HeaderLogo />

            <CategoryMegaMenu
              categories={categories}
              showAllCategories={showAllCategories}
              onShowAllCategories={handleShowAllCategories}
              onHideAllCategories={handleHideAllCategories}
            />

          {/* Divider */}
          <div className="w-px h-4 shrink-0 hidden lg:block" style={{ background: "#DDD0C0" }} />

            <CategoryNav
              isLoading={isLoading}
              categories={visibleCategories}
              activeCategory={activeCategory}
              onMouseEnterCategory={handleMouseEnterCategory}
              onMouseLeaveCategory={handleMouseLeaveCategory}
            />

            <HeaderSearch query={query} setQuery={setQuery} submitSearch={submitSearch} />

          {/* Actions */}
          <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0 ml-auto">
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
      </header>

    </>
  );
}
