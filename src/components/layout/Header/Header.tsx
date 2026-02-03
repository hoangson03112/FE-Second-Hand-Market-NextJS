"use client";

import Link from "next/link";
import Image from "next/image";
import { ICategory, ISubCategory } from "@/types/category";
import { Search, ShoppingCart, Bell, ChevronUp, ChevronDown, Settings } from "lucide-react";
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
    <header className="relative bg-gradient-to-br from-cream-50 via-neutral-50 to-taupe-50 backdrop-blur-md border-b border-default sticky top-0 z-50 shadow-md">
      <div className="absolute inset-0 opacity-40" />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-28">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png"
                  alt="Eco Market Logo"
                  width={150}
                  height={150}
                  className="h-24 w-auto"
                  priority
                />
              </Link>
            </div>

            <div className="hidden md:flex flex-1 justify-center px-8">
              <form
                className="w-full max-w-xl"
                onSubmit={submitSearch}
                role="search"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-6 h-6 text-tertiary" />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full bg-neutral border border-primary rounded-full py-3 pl-12 pr-4 text-base text-tertiary placeholder:text-tertiary focus:outline-none focus:text-primary focus:placeholder:text-tertiary focus-ring-primary"
                    placeholder="Tìm kiếm sản phẩm..."
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>

            <div className="hidden md:flex items-center justify-end gap-3">
              {!account ? (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-5 py-2.5 text-base font-medium rounded-full text-white btn-primary hover-bg-primary-dark transition-colors"
                >
                  Đăng nhập
                </Link>
              ) : (
                <>
                  <Link
                    href={sellButtonHref}
                    className="inline-flex items-center justify-center px-5 py-2.5  text-base font-medium rounded-full text-white btn-primary  hover-bg-primary-dark transition-colors"
                  >
                    {sellButtonText}
                  </Link>
                  <Link
                    href="/notifications"
                    className="relative p-2 rounded-full text-tertiary hover-bg-neutral hover-text-secondary transition-colors"
                    aria-label="Thông báo"
                  >
                    <Bell className="w-6 h-6 text-tertiary hover:text-primary" />
                  </Link>
                  <Link
                    href="/cart"
                    className="relative p-2 rounded-full text-tertiary hover-bg-neutral hover-text-secondary transition-colors"
                    aria-label={`Giỏ hàng${cartItemCount > 0 ? ` (${cartItemCount} sản phẩm)` : ""}`}
                  >
                    <ShoppingCart className="w-6 h-6 text-tertiary hover:text-primary" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-semibold text-white bg-primary rounded-full">
                        {cartItemCount > 99 ? "99+" : cartItemCount}
                      </span>
                    )}
                  </Link>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={toggleUserDropdown}
                      className="cursor-pointer flex items-center gap-2 p-1.5 rounded-full hover-bg-neutral transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                      aria-label="User menu"
                    >
                      {account?.avatar ? (
                        <Image
                          src={account.avatar}
                          alt={account.fullName || "Unknown"}
                          width={36}
                          height={36}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold text-sm">
                          {getInitials(account?.fullName)}
                        </div>
                      )}
                      {showUserDropdown ? (
                        <ChevronUp className="w-6 h-6 text-tertiary hover:text-primary" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-tertiary hover:text-primary" />
                      )}
                    </button>

                    {showUserDropdown && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-semibold text-secondary">
                            {account?.fullName || "Người dùng"}
                          </p>
                          <p className="text-xs text-tertiary truncate">
                            {account?.email}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/profile"
                            onClick={closeUserDropdown}
                            className="block px-4 py-2 text-sm text-secondary hover-bg-neutral transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              Thông tin tài khoản
                            </div>
                          </Link>
                          {account.role==="admin" && (   <Link
                            href="/admin"
                            onClick={closeUserDropdown}
                            className="block px-4 py-2 text-sm text-secondary hover-bg-neutral transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Settings />
                              Quản trị 
                            </div>
                          </Link>)}
                          <Link
                            href="/orders"
                            onClick={closeUserDropdown}
                            className="block px-4 py-2 text-sm text-secondary hover-bg-neutral transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                              </svg>
                              Đơn hàng của tôi
                            </div>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                              Đăng xuất
                            </div>
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
      </div>

      <nav className="max-w-7xl mx-auto  hidden md:block relative bg-gradient-to-r from-cream-50/60 via-neutral-50/80 to-taupe-50/60 border-default backdrop-blur-sm">
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto ">
            <div className="flex items-center gap-5 h-12 relative">
              <div
                className="relative "
                onMouseEnter={handleShowAllCategories}
                onMouseLeave={handleHideAllCategories}
              >
                <div className="flex items-center gap-1 text-sm font-medium text-secondary hover-text-primary transition-colors py-3 px-3 rounded-md hover-bg-neutral-light cursor-pointer">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                  Tất cả danh mục
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showAllCategories ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {showAllCategories && (
                  <div className="absolute left-0 top-full pt-2 w-screen max-w-4xl z-50 bg-white rounded-lg shadow-xl">
                    <div className="rounded-lg shadow-xl">
                      <div className="py-4 ps-4">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-primary">
                            Tất cả danh mục
                          </h3>
                          <p className="text-sm text-tertiary">
                            Khám phá tất cả sản phẩm
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-6 max-h-96 overflow-y-auto">
                          {categories.map((category: ICategory) => (
                            <div key={category._id} className="space-y-2">
                              <Link
                                href={`/categories/${category.slug}`}
                                className="block text-sm font-semibold text-primary hover-text-primary transition-colors"
                              >
                                {category.name}
                              </Link>
                              {category.subCategories &&
                                category.subCategories.length > 0 && (
                                  <div className="space-y-1 pl-2">
                                    {category.subCategories
                                      .slice(0, 5)
                                      .map((sub: ISubCategory) => (
                                        <Link
                                          key={sub._id}
                                          href={`/categories/${category.slug}/sub/${sub.slug}`}
                                          className="block text-xs text-secondary hover-text-primary transition-colors"
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
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-neutral-300"></div>
              <div className="flex flex-row flex-1 gap-7">
                {visibleCategories?.map((category: ICategory) => (
                  <div
                    key={category._id}
                    className="relative flex"
                    onMouseEnter={() =>
                      category.subCategories &&
                      category.subCategories.length > 0 &&
                      handleMouseEnterCategory(category._id)
                    }
                    onMouseLeave={handleMouseLeaveCategory}
                  >
                    <Link
                      href={`/categories/${category.slug}`}
                      className="flex items-center gap-1 text-sm font-medium text-secondary hover-text-primary transition-colors py-3 whitespace-nowrap"
                    >
                      {category.name}
                      {category.subCategories &&
                        category.subCategories.length > 0 && (
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                              activeCategory === category._id ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                    </Link>

                    {activeCategory === category._id &&
                      category.subCategories &&
                      category.subCategories.length > 0 && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full  w-64 z-50 bg-white rounded-lg shadow-xl  ">
                          <div className="rounded-lg shadow-xl">
                            <div
                              className="py-2"
                              role="menu"
                              aria-orientation="vertical"
                            >
                              <div className="px-4 py-2 text-xs font-semibold text-primary uppercase border-b border-default">
                                {category.name}
                              </div>
                              <div className="max-h-80 overflow-y-auto">
                                {category.subCategories.map(
                                  (sub: ISubCategory) => (
                                    <Link
                                      key={sub._id}
                                      href={`/categories/${category.slug}/sub/${sub.slug}`}
                                      className="block px-4 py-2 text-sm text-secondary hover:bg-primary-tint hover-text-primary transition-colors"
                                      role="menuitem"
                                    >
                                      {sub.name}
                                    </Link>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>

              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-tertiary">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Đang tải danh mục...
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}