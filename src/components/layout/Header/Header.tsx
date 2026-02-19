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
  User,
  LogOut,
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
    <header className="sticky top-0 z-50 w-full bg-beige-50 border-b-2 border-taupe-300">
      {/* Top bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24 gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2 min-w-0"
          >
            <Image
              src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png"
              alt="Eco Market"
              width={140}
              height={140}
              className="h-16 md:h-20 w-auto object-contain"
              priority
            />
          </Link>

          {/* Search - center, rectangular Swiss style */}
          <form
            onSubmit={submitSearch}
            role="search"
            className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8"
          >
            <label htmlFor="header-search" className="sr-only">
              Tìm kiếm sản phẩm
            </label>
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-taupe-400 pointer-events-none" />
              <input
                id="header-search"
                name="search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full h-12 pl-12 pr-6 bg-cream-50 border-2 border-taupe-300 text-taupe-900 placeholder:text-taupe-400 text-[15px] font-medium focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            {!account ? (
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-12 px-7 border-2 border-taupe-900 bg-taupe-900 text-cream-50 text-[13px] font-black uppercase tracking-[0.16em] hover:bg-primary hover:border-primary transition-all duration-200"
              >
                Đăng nhập
              </Link>
            ) : (
              <>
                <Link
                  href={sellButtonHref}
                  className="hidden sm:inline-flex items-center justify-center h-12 px-6 border-2 border-taupe-900 bg-taupe-900 text-cream-50 text-[12px] lg:text-[13px] font-black uppercase tracking-[0.16em] hover:bg-primary hover:border-primary transition-all duration-200"
                >
                  {sellButtonText}
                </Link>
                <Link
                  href="/chat"
                  className="flex items-center justify-center w-11 h-11 border-2 border-taupe-300 text-taupe-600 hover:text-primary hover:border-primary transition-colors"
                  aria-label="Tin nhắn"
                >
                  <MessageCircle className="w-5 h-5" />
                </Link>
                <Link
                  href="/notifications"
                  className="flex items-center justify-center w-11 h-11 border-2 border-taupe-300 text-taupe-600 hover:text-primary hover:border-primary transition-colors"
                  aria-label="Thông báo"
                >
                  <Bell className="w-5 h-5" />
                </Link>
                <Link
                  href="/cart"
                  className="relative flex items-center justify-center w-11 h-11 border-2 border-taupe-300 text-taupe-600 hover:text-primary hover:border-primary transition-colors"
                  aria-label="Giỏ hàng"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] flex items-center justify-center bg-primary text-cream-50 text-[10px] font-black border-2 border-beige-50">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                </Link>

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={toggleUserDropdown}
                    className="flex items-center gap-2 p-1 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    aria-expanded={showUserDropdown}
                    aria-haspopup="true"
                  >
                    {account?.avatar ? (
                      <Image
                        src={account.avatar}
                        alt=""
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover border-2 border-taupe-300"
                      />
                    ) : (
                      <span className="w-10 h-10 bg-primary flex items-center justify-center text-cream-50 text-[14px] font-black border-2 border-taupe-300">
                        {getInitials(account?.fullName)}
                      </span>
                    )}
                    <ChevronDown
                      className={`w-4 h-4 text-taupe-600 transition-transform ${showUserDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-72 bg-beige-50 border-2 border-taupe-300 py-2 z-50 shadow-[6px_6px_0_0_rgba(107,95,82,0.1)]">
                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary" />
                      <div className="px-5 py-4 border-b-2 border-taupe-200">
                        <p className="text-[15px] font-black text-taupe-900 truncate tracking-tight uppercase">
                          {account?.fullName || "Người dùng"}
                        </p>
                        <p className="text-[13px] text-taupe-500 truncate mt-1 font-medium">
                          {account?.email}
                        </p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/profile"
                          onClick={closeUserDropdown}
                          className="flex items-center gap-3 px-5 py-3 text-[14px] font-bold text-taupe-900 hover:bg-taupe-100 hover:text-primary transition-colors duration-200"
                        >
                          <User className="w-5 h-5 text-taupe-500" />
                          Thông tin tài khoản
                        </Link>
                        {account.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={closeUserDropdown}
                            className="flex items-center gap-3 px-5 py-3 text-[14px] font-bold text-taupe-900 hover:bg-taupe-100 hover:text-primary transition-colors duration-200"
                          >
                            <Settings className="w-5 h-5 text-taupe-500" />
                            Quản trị
                          </Link>
                        )}
                        <Link
                          href="/chat"
                          onClick={closeUserDropdown}
                          className="flex items-center gap-3 px-5 py-3 text-[14px] font-bold text-taupe-900 hover:bg-taupe-100 hover:text-primary transition-colors duration-200"
                        >
                          <MessageCircle className="w-5 h-5 text-taupe-500" />
                          Tin nhắn
                        </Link>
                        <Link
                          href="/my/listings"
                          onClick={closeUserDropdown}
                          className="flex items-center gap-3 px-5 py-3 text-[14px] font-bold text-taupe-900 hover:bg-taupe-100 hover:text-primary transition-colors duration-200"
                        >
                          <Package className="w-5 h-5 text-taupe-500" />
                          Sản phẩm đã đăng
                        </Link>
                        <Link
                          href="/orders"
                          onClick={closeUserDropdown}
                          className="flex items-center gap-3 px-5 py-3 text-[14px] font-bold text-taupe-900 hover:bg-taupe-100 hover:text-primary transition-colors duration-200"
                        >
                          <svg className="w-5 h-5 text-taupe-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Đơn hàng của tôi
                        </Link>
                        {account.role === "seller" && (
                          <Link
                            href="/my/orders"
                            onClick={closeUserDropdown}
                            className="flex items-center gap-3 px-5 py-3 text-[14px] font-bold text-taupe-900 hover:bg-taupe-100 hover:text-primary transition-colors duration-200"
                          >
                            <Truck className="w-5 h-5 text-taupe-500" />
                            Đơn hàng bán
                          </Link>
                        )}
                        <div className="my-2 mx-5 h-[2px] bg-taupe-200" />
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-3 text-[14px] font-bold text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <LogOut className="w-5 h-5" />
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

      {/* Categories nav */}
      <nav className="hidden md:block border-t-2 border-taupe-300 bg-cream-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 h-14 relative">
            {/* All categories dropdown */}
            <div
              className="relative"
              onMouseEnter={handleShowAllCategories}
              onMouseLeave={handleHideAllCategories}
            >
              <div className="flex items-center gap-2 text-[13px] font-black text-taupe-900 hover:text-primary transition-colors duration-200 py-2 px-4 cursor-pointer uppercase tracking-[0.1em] border-b-2 border-transparent hover:border-primary">
                <svg
                  className="w-4 h-4 text-taupe-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
                <span>Danh mục</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showAllCategories ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {showAllCategories && (
                <div className="absolute left-0 top-full mt-0 pt-1 z-50 w-[min(1280px,calc(100vw-2rem))] animate-slide-in-top overflow-x-hidden">
                  <div className="border-2 border-taupe-300 bg-beige-50 shadow-[8px_8px_0_0_rgba(107,95,82,0.1)] overflow-hidden">
                    {/* Accent line */}
                    <div className="h-[3px] bg-primary" />
                    <div className="lg:ps-8 py-8 px-6">
                      {/* Header */}
                      <p className="text-[10px] font-black tracking-[0.45em] uppercase text-taupe-400 mb-3">
                        DANH MỤC
                      </p>
                      <h2 className="text-xl lg:text-2xl font-black tracking-tight text-taupe-900 leading-tight mb-8">
                        Tìm đúng thứ{" "}
                        <span className="text-primary">bạn đang cần.</span>
                      </h2>
                      {/* List - grid 2–3 cột */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-5 max-h-[min(90vh,660px)] overflow-y-auto overflow-x-hidden custom-scrollbar">
                        {categories.map((category: ICategory, index: number) => (
                          <div key={category._id} className="group min-w-0 border-l-2 border-taupe-200 pl-4 hover:border-primary transition-colors">
                            {/* Danh mục cha */}
                            <div className="flex items-center justify-between gap-3 mb-3">
                              <Link
                                href={`/categories/${category.slug}`}
                                className="flex items-center gap-3 flex-1 min-w-0 py-1 transition-colors"
                              >
                                <span className="text-[10px] font-black tracking-[0.2em] text-taupe-400 tabular-nums shrink-0">
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="text-[14px] font-bold text-taupe-800 group-hover:text-primary transition-colors truncate uppercase">
                                  {category.name}
                                </span>
                              </Link>
                              <Link
                                href={`/categories/${category.slug}`}
                                className="text-[11px] font-black tracking-[0.25em] text-taupe-400 hover:text-primary transition-colors shrink-0"
                              >
                                →
                              </Link>
                            </div>
                            {/* Danh mục con — mỗi item có thể bấm */}
                            {category.subCategories &&
                              category.subCategories.length > 0 && (
                                <div className="pl-6 space-y-1 border-l border-taupe-200">
                                  {category.subCategories.map((sub: ISubCategory) => (
                                    <Link
                                      key={sub._id}
                                      href={`/categories/${category.slug}/sub/${sub.slug}`}
                                      className="block py-1.5 px-2 text-[12px] font-semibold text-taupe-600 hover:text-primary hover:bg-cream-100 transition-colors truncate"
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

              <div className="w-[2px] h-6 bg-taupe-300"></div>
              
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
                      className="flex items-center gap-1.5 text-[13px] font-black text-taupe-900 hover:text-primary transition-colors duration-200 py-2 px-3 whitespace-nowrap border-b-2 border-transparent hover:border-primary uppercase tracking-[0.08em]"
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
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                    </Link>

                    {/* Subcategories dropdown */}
                    {activeCategory === category._id &&
                      category.subCategories &&
                      category.subCategories.length > 0 && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 z-50 bg-beige-50 border-2 border-taupe-300 shadow-[6px_6px_0_0_rgba(107,95,82,0.12)]">
                          <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary" />
                          
                          <div className="py-2">
                            <div className="px-5 py-3 text-[11px] font-black text-taupe-900 uppercase tracking-[0.28em] border-b-2 border-taupe-200 bg-cream-100">
                              {category.name}
                            </div>
                            
                            {/* Subcategory items */}
                            <div className="max-h-80 overflow-y-auto custom-scrollbar py-2">
                              {category.subCategories.map(
                                (sub: ISubCategory) => (
                                  <Link
                                    key={sub._id}
                                    href={`/categories/${category.slug}/sub/${sub.slug}`}
                                    className="flex items-center gap-3 px-5 py-2.5 text-[14px] font-bold text-taupe-900 hover:bg-cream-100 hover:text-primary transition-colors duration-200"
                                    role="menuitem"
                                  >
                                    <div className="w-[2px] h-4 bg-taupe-300" />
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
                <div className="flex items-center gap-2 text-[13px] font-bold text-taupe-500">
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
