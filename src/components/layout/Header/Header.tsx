"use client";

import Link from "next/link";
import Image from "next/image";
import { ICategory, ISubCategory } from "@/types/category";
import {
  Search,
  ShoppingCart,
  Bell,
  MessageCircle,
  ChevronDown,
  Settings,
  Package,
  Truck,
  Menu,
} from "lucide-react";
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
    <header className="sticky top-0 z-50 bg-cream-50 border-b border-taupe-200">

      {/* ── Top bar ── */}
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 h-16 md:h-[72px]">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png"
              alt="Eco Market"
              width={110}
              height={110}
              className="h-10 md:h-12 w-auto"
              priority
            />
          </Link>

          {/* Search — rectangular, Swiss editorial style */}
          <form
            className="hidden md:flex flex-1 max-w-xl"
            onSubmit={submitSearch}
            role="search"
          >
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe-400 pointer-events-none" />
              <input
                id="search"
                name="search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full bg-taupe-50 border border-taupe-200 py-2.5 pl-11 pr-4 text-sm text-taupe-900 placeholder:text-taupe-400 focus:outline-none focus:border-primary focus:bg-white transition-colors duration-150"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-3 ml-auto md:ml-0">
            {!account ? (
              <>
                <Link
                  href="/login"
                  className="hidden md:inline-flex items-center px-5 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-taupe-700 border border-taupe-300 hover:border-primary hover:text-primary transition-colors duration-150"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="hidden md:inline-flex items-center px-5 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-cream-50 bg-taupe-900 hover:bg-primary transition-colors duration-150"
                >
                  Đăng ký
                </Link>
              </>
            ) : (
              <>
                {/* Sell */}
                <Link
                  href={sellButtonHref}
                  className="hidden md:inline-flex items-center px-5 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-cream-50 bg-primary hover:bg-taupe-700 transition-colors duration-150"
                >
                  {sellButtonText}
                </Link>

                {/* Icon cluster */}
                <Link
                  href="/chat"
                  className="p-2 text-taupe-500 hover:text-primary transition-colors duration-150"
                  aria-label="Tin nhắn"
                >
                  <MessageCircle className="w-5 h-5" />
                </Link>

                <Link
                  href="/notifications"
                  className="p-2 text-taupe-500 hover:text-primary transition-colors duration-150"
                  aria-label="Thông báo"
                >
                  <Bell className="w-5 h-5" />
                </Link>

                <Link
                  href="/cart"
                  className="relative p-2 text-taupe-500 hover:text-primary transition-colors duration-150"
                  aria-label="Giỏ hàng"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center text-[9px] font-bold text-white bg-primary">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                </Link>

                {/* User menu */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center gap-2 pl-3 border-l border-taupe-200 focus:outline-none group cursor-pointer"
                    aria-label="Tài khoản"
                  >
                    {account?.avatar ? (
                      <Image
                        src={account.avatar}
                        alt={account.fullName || ""}
                        width={32}
                        height={32}
                        className="w-8 h-8 object-cover border border-taupe-200"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary flex items-center justify-center text-cream-50 text-xs font-bold">
                        {getInitials(account?.fullName)}
                      </div>
                    )}
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-taupe-400 transition-transform duration-200 ${
                        showUserDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User dropdown */}
                  {showUserDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-cream-50 border border-taupe-200 shadow-lg z-50">
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />

                      {/* Account info */}
                      <div className="px-4 py-3 border-b border-taupe-100">
                        <p className="text-sm font-bold text-taupe-900 truncate">
                          {account?.fullName || "Người dùng"}
                        </p>
                        <p className="text-xs text-taupe-500 truncate">
                          {account?.email}
                        </p>
                      </div>

                      {/* Menu items — text only, no icon boxes */}
                      <div className="py-1">
                        <DropdownLink href="/profile" onClick={closeUserDropdown}>
                          Thông tin tài khoản
                        </DropdownLink>

                        {account.role === "admin" && (
                          <DropdownLink href="/admin" onClick={closeUserDropdown}>
                            <Settings className="w-3.5 h-3.5" />
                            Quản trị
                          </DropdownLink>
                        )}

                        <DropdownLink href="/chat" onClick={closeUserDropdown}>
                          Tin nhắn
                        </DropdownLink>

                        <DropdownLink href="/my/listings" onClick={closeUserDropdown}>
                          <Package className="w-3.5 h-3.5" />
                          Sản phẩm đã đăng
                        </DropdownLink>

                        <DropdownLink href="/orders" onClick={closeUserDropdown}>
                          Đơn hàng của tôi
                        </DropdownLink>

                        {account.role === "seller" && (
                          <DropdownLink href="/my/orders" onClick={closeUserDropdown}>
                            <Truck className="w-3.5 h-3.5" />
                            Đơn hàng bán
                          </DropdownLink>
                        )}

                        <div className="my-1 mx-4 h-px bg-taupe-100" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-taupe-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-150 text-left"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Nav bar ── */}
      <nav className="hidden md:block border-t border-taupe-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-11 gap-0">

            {/* All categories */}
            <div
              className="relative shrink-0"
              onMouseEnter={handleShowAllCategories}
              onMouseLeave={handleHideAllCategories}
            >
              <div className="flex items-center gap-2 h-11 px-4 text-xs font-bold uppercase tracking-[0.22em] text-taupe-700 hover:text-primary border-r border-taupe-100 cursor-pointer transition-colors duration-150">
                <Menu className="w-3.5 h-3.5" />
                <span>Tất cả</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    showAllCategories ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Mega menu */}
              {showAllCategories && (
                <div className="absolute left-0 top-full w-[720px] z-50 bg-cream-50 border border-taupe-200 shadow-xl">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
                  <div className="p-6">
                    <p className="text-[11px] font-bold tracking-[0.36em] uppercase text-taupe-400 mb-5">
                      DANH MỤC SẢN PHẨM
                    </p>
                    <div className="grid grid-cols-3 gap-x-8 gap-y-0 max-h-[28rem] overflow-y-auto custom-scrollbar">
                      {categories.map((category: ICategory) => (
                        <div key={category._id} className="border-t border-taupe-100 py-3">
                          <Link
                            href={`/categories/${category.slug}`}
                            className="text-sm font-bold text-taupe-900 hover:text-primary transition-colors duration-150 block mb-2"
                          >
                            {category.name}
                          </Link>
                          {category.subCategories && category.subCategories.length > 0 && (
                            <div className="space-y-1">
                              {category.subCategories.slice(0, 4).map((sub: ISubCategory) => (
                                <Link
                                  key={sub._id}
                                  href={`/categories/${category.slug}/sub/${sub.slug}`}
                                  className="block text-xs text-taupe-500 hover:text-primary transition-colors duration-150"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Category links */}
            {visibleCategories?.map((category: ICategory) => (
              <div
                key={category._id}
                className="relative"
                onMouseEnter={() =>
                  category.subCategories?.length && handleMouseEnterCategory(category._id)
                }
                onMouseLeave={handleMouseLeaveCategory}
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className={`flex items-center gap-1 h-11 px-3 text-xs font-semibold text-taupe-600 hover:text-primary border-b-2 transition-colors duration-150 whitespace-nowrap ${
                    activeCategory === category._id
                      ? "border-primary text-primary"
                      : "border-transparent"
                  }`}
                >
                  {category.name}
                  {category.subCategories && category.subCategories.length > 0 && (
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeCategory === category._id ? "rotate-180" : ""}`} />
                  )}
                </Link>

                {/* Subcategory dropdown */}
                {activeCategory === category._id &&
                  category.subCategories &&
                  category.subCategories.length > 0 && (
                    <div className="absolute left-0 top-full w-56 z-50 bg-cream-50 border border-taupe-200 shadow-lg">
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
                      <div className="py-1">
                        <div className="px-4 py-2.5 border-b border-taupe-100">
                          <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-taupe-500">
                            {category.name}
                          </p>
                        </div>
                        {category.subCategories.map((sub: ISubCategory) => (
                          <Link
                            key={sub._id}
                            href={`/categories/${category.slug}/sub/${sub.slug}`}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-taupe-700 hover:bg-taupe-50 hover:text-primary transition-colors duration-150"
                          >
                            <span className="w-1 h-1 bg-taupe-300 shrink-0" />
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}

            {isLoading && (
              <div className="ml-4 flex items-center gap-2 text-xs text-taupe-400">
                <div className="w-3.5 h-3.5 border border-primary border-t-transparent rounded-full animate-spin" />
                Đang tải...
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

/* ── Shared dropdown link component ── */
function DropdownLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 text-sm text-taupe-700 hover:bg-taupe-50 hover:text-primary transition-colors duration-150"
    >
      {children}
    </Link>
  );
}
