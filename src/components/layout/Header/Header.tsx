"use client";

import Link from "next/link";
import Image from "next/image";
import { ICategory, ISubCategory } from "@/types/category";
import {
  Search,
  ShoppingCart,
  Bell,
  MessageCircle,
  ChevronUp,
  ChevronDown,
  Settings,
  Package,
  Truck,
} from "lucide-react";
import { useHeader } from "./hooks/useHeader";

// Swiss Typographic Style Header - Flat, rectangular, minimal decoration

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
    <header className="sticky top-0 z-50 bg-cream-50 border-b border-taupe-200" data-swiss-style="true">
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png"
                  alt="Eco Market Logo"
                  width={140}
                  height={140}
                  className="h-16 md:h-20 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Search bar */}
            <div className="hidden md:flex flex-1 justify-center px-4 lg:px-8">
              <form
                className="w-full max-w-2xl"
                onSubmit={submitSearch}
                role="search"
              >
                <div className="relative group">
                  {/* Search icon */}
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Search className="w-5 h-5 text-taupe-400 group-focus-within:text-primary transition-colors duration-200" />
                  </div>
                  
                  {/* Input */}
                  <input
                    id="search"
                    name="search"
                    className="block w-full bg-taupe-50 border border-taupe-200 py-3 pl-12 pr-6 text-base text-taupe-900 placeholder:text-taupe-400 focus:outline-none focus:border-primary transition-colors duration-200"
                    placeholder="Tìm kiếm sản phẩm..."
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  
                </div>
              </form>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center justify-end gap-2 lg:gap-3">
              {!account ? (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center border border-taupe-900 bg-taupe-900 px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-cream-50 hover:bg-primary hover:border-primary transition-colors duration-200"
                >
                  Đăng nhập
                </Link>
              ) : (
                <>
                  {/* Sell button */}
                  <Link
                    href={sellButtonHref}
                    className="inline-flex items-center justify-center border border-taupe-900 bg-taupe-900 px-5 py-2.5 text-xs lg:text-sm font-semibold uppercase tracking-[0.14em] text-cream-50 hover:bg-primary hover:border-primary transition-colors duration-200"
                  >
                    {sellButtonText}
                  </Link>
                  
                  {/* Icon buttons */}
                  <Link
                    href="/chat"
                    className="p-2 text-taupe-500 hover:text-primary transition-colors duration-200"
                    aria-label="Tin nhắn"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Link>
                  
                  <Link
                    href="/notifications"
                    className="p-2 text-taupe-500 hover:text-primary transition-colors duration-200"
                    aria-label="Thông báo"
                  >
                    <Bell className="w-5 h-5" />
                  </Link>
                  
                  <Link
                    href="/cart"
                    className="relative p-2 text-taupe-500 hover:text-primary transition-colors duration-200"
                    aria-label={`Giỏ hàng${cartItemCount > 0 ? ` (${cartItemCount} sản phẩm)` : ""}`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-primary">
                        {cartItemCount > 99 ? "99+" : cartItemCount}
                      </span>
                    )}
                  </Link>

                  {/* User menu */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={toggleUserDropdown}
                      className="flex items-center gap-2 p-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      aria-label="User menu"
                    >
                      {account?.avatar ? (
                        <Image
                          src={account.avatar}
                          alt={account.fullName || "Unknown"}
                          width={36}
                          height={36}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 bg-primary flex items-center justify-center text-white font-bold text-sm">
                          {getInitials(account?.fullName)}
                        </div>
                      )}
                      {showUserDropdown ? (
                        <ChevronUp className="w-4 h-4 text-taupe-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-taupe-500" />
                      )}
                    </button>

                    {showUserDropdown && (
                      <div className="absolute right-0 mt-1 w-64 bg-cream-50 border border-taupe-200 py-2 z-50">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
                        
                        {/* User info */}
                        <div className="px-4 py-4 border-b border-taupe-200">
                          <p className="text-sm font-bold text-taupe-900 truncate">
                            {account?.fullName || "Người dùng"}
                          </p>
                          <p className="text-xs text-taupe-500 truncate mt-1">
                            {account?.email}
                          </p>
                        </div>
                        {/* Menu items */}
                        <div className="py-2">
                          <Link
                            href="/profile"
                            onClick={closeUserDropdown}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-taupe-900 hover:bg-taupe-50 hover:text-primary transition-colors duration-200"
                          >
                            <svg
                              className="w-4 h-4 text-taupe-500"
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
                            <span>Thông tin tài khoản</span>
                          </Link>
                          
                          {account.role==="admin" && (
                            <Link
                              href="/admin"
                              onClick={closeUserDropdown}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-taupe-900 hover:bg-taupe-50 hover:text-primary transition-colors duration-200"
                            >
                              <Settings className="w-4 h-4 text-taupe-500" />
                              <span>Quản trị</span>
                            </Link>
                          )}
                          
                          <Link
                            href="/chat"
                            onClick={closeUserDropdown}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-taupe-900 hover:bg-taupe-50 hover:text-primary transition-colors duration-200"
                          >
                            <MessageCircle className="w-4 h-4 text-taupe-500" />
                            <span>Tin nhắn</span>
                          </Link>
                          
                          <Link
                            href="/my/listings"
                            onClick={closeUserDropdown}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-taupe-900 hover:bg-taupe-50 hover:text-primary transition-colors duration-200"
                          >
                            <Package className="w-4 h-4 text-taupe-500" />
                            <span>Sản phẩm đã đăng</span>
                          </Link>
                          
                          <Link
                            href="/orders"
                            onClick={closeUserDropdown}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-taupe-900 hover:bg-taupe-50 hover:text-primary transition-colors duration-200"
                          >
                            <svg
                              className="w-4 h-4 text-taupe-500"
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
                            <span>Đơn hàng của tôi</span>
                          </Link>
                          
                          {account.role === "seller" && (
                            <Link
                              href="/my/orders"
                              onClick={closeUserDropdown}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-taupe-900 hover:bg-taupe-50 hover:text-primary transition-colors duration-200"
                            >
                              <Truck className="w-4 h-4 text-taupe-500" />
                              <span>Đơn hàng bán (Seller)</span>
                            </Link>
                          )}
                          
                          <div className="my-2 mx-4 h-px bg-taupe-200" />
                          
                          {/* Logout button */}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                          >
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
                            <span>Đăng xuất</span>
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

      {/* Navigation */}
      <nav className="hidden md:block border-t border-taupe-100 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 h-14 relative">
            {/* All categories dropdown */}
            <div
              className="relative"
              onMouseEnter={handleShowAllCategories}
              onMouseLeave={handleHideAllCategories}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-taupe-700 hover:text-primary transition-colors duration-200 py-2 px-4 cursor-pointer">
                <svg
                  className="w-4 h-4 text-taupe-500"
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
                <span>Tất cả danh mục</span>
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
                <div className="absolute left-0 top-full mt-1 w-screen max-w-5xl z-50 bg-cream-50 border border-taupe-200">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
                  
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-taupe-900">
                        Tất cả danh mục
                      </h3>
                      <p className="text-sm text-taupe-500 mt-1">
                        Khám phá tất cả sản phẩm
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-8 max-h-[32rem] overflow-y-auto custom-scrollbar pr-2">
                          {categories.map((category: ICategory) => (
                            <div key={category._id} className="space-y-3">
                              <Link
                                href={`/categories/${category.slug}`}
                                className="flex items-center gap-2 text-sm font-bold text-taupe-900 hover:text-primary transition-colors duration-200"
                              >
                                <div className="w-1 h-1 bg-primary" />
                                {category.name}
                              </Link>
                              {category.subCategories &&
                                category.subCategories.length > 0 && (
                                  <div className="space-y-1.5 pl-3 border-l-2 border-taupe-200">
                                    {category.subCategories
                                      .slice(0, 5)
                                      .map((sub: ISubCategory) => (
                                        <Link
                                          key={sub._id}
                                          href={`/categories/${category.slug}/sub/${sub.slug}`}
                                          className="block text-xs font-medium text-taupe-500 hover:text-primary transition-colors duration-200"
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

              <div className="w-px h-6 bg-taupe-200"></div>
              
              {/* Category links */}
              <div className="flex flex-row flex-1 gap-1">
                {visibleCategories?.map((category: ICategory) => (
                  <div
                    key={category._id}
                    className="relative"
                    onMouseEnter={() =>
                      category.subCategories &&
                      category.subCategories.length > 0 &&
                      handleMouseEnterCategory(category._id)
                    }
                    onMouseLeave={handleMouseLeaveCategory}
                  >
                    <Link
                      href={`/categories/${category.slug}`}
                      className="flex items-center gap-1.5 text-sm font-semibold text-taupe-700 hover:text-primary transition-colors duration-200 py-2 px-3 whitespace-nowrap border-b-2 border-transparent hover:border-primary"
                    >
                      <span>{category.name}</span>
                      {category.subCategories &&
                        category.subCategories.length > 0 && (
                          <svg
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
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

                    {/* Subcategories dropdown */}
                    {activeCategory === category._id &&
                      category.subCategories &&
                      category.subCategories.length > 0 && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-72 z-50 bg-cream-50 border border-taupe-200">
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
                          
                          <div className="py-2">
                            <div className="px-4 py-3 text-xs font-bold text-taupe-900 uppercase tracking-[0.2em] border-b border-taupe-200 bg-taupe-50">
                              {category.name}
                            </div>
                            
                            {/* Subcategory items */}
                            <div className="max-h-80 overflow-y-auto custom-scrollbar py-1">
                              {category.subCategories.map(
                                (sub: ISubCategory) => (
                                  <Link
                                    key={sub._id}
                                    href={`/categories/${category.slug}/sub/${sub.slug}`}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-taupe-900 hover:bg-taupe-50 hover:text-primary transition-colors duration-200"
                                    role="menuitem"
                                  >
                                    <div className="w-1 h-1 bg-taupe-300" />
                                    <span>{sub.name}</span>
                                  </Link>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>

              {/* Loading state */}
              {isLoading && (
                <div className="flex items-center gap-2 text-sm font-medium text-taupe-500">
                  <div className="relative w-4 h-4">
                    <div className="absolute inset-0 border-2 border-primary/20"></div>
                    <div className="absolute inset-0 border-2 border-primary border-t-transparent animate-spin"></div>
                  </div>
                  <span>Đang tải...</span>
                </div>
              )}
            </div>
          </div>
      </nav>
    </header>
  );
}