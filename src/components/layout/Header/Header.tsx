"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    // 🟢 Tìm thẻ <main> đang chứa thanh cuộn
    const mainContainer = document.getElementById("main-scroll-container");
    if (!mainContainer) return;

    const handleScroll = () => {
      // Kiểm tra độ cuộn của <main> thay vì window
      setIsScrolled(mainContainer.scrollTop > 10);
    };

    // Kiểm tra ngay khi vừa load
    handleScroll();

    mainContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => mainContainer.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      // 🟢 dùng absolute top-0 để đè lên đầu <main>
      className={`absolute top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#F8F9F7] border-b border-neutral-200/80 shadow-sm" /* Khi cuộn <main>: Đục 100% che nội dung bên dưới */
          : "bg-transparent border-b border-transparent shadow-none" /* Khi ở đỉnh: Trong suốt hoàn toàn */
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