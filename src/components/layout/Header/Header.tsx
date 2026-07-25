"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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

  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomeHero = pathname === "/" && !isScrolled;

  useEffect(() => {
    const mainContainer = document.getElementById("main-scroll-container");
    if (!mainContainer) return;

    const handleScroll = () => {
      setIsScrolled(mainContainer.scrollTop > 10);
    };

    handleScroll();

    mainContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => mainContainer.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`relative z-50 w-full bg-luxury-ivory shrink-0 transition-all duration-500 ${
        isScrolled
          ? "border-b border-[#1A1816]/8 bg-[#F7F5F0]/95 shadow-[0_8px_30px_rgba(26,24,22,0.06)] backdrop-blur-md"
          : isHomeHero
            ? "border-b border-transparent bg-[#F7F5F0]/25 backdrop-blur-sm"
            : "border-b border-transparent bg-transparent"
      }`}
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
  );
}
