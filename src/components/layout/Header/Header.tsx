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
  Plus,
  AlignLeft,
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-[60px] gap-2.5">

          {/* Logo */}
          <Link href="/" className="shrink-0 group">
            <Image
              src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png"
              alt="Eco Market"
              width={110}
              height={110}
              className="h-9 w-auto object-contain transition-opacity duration-200 group-hover:opacity-70"
              priority
            />
          </Link>

          {/* Tất cả — pill trigger */}
          <div
            className="relative shrink-0"
            onMouseEnter={handleShowAllCategories}
            onMouseLeave={handleHideAllCategories}
          >
            <button
              type="button"
              className="flex items-center gap-1.5 h-8 px-3 text-[12.5px] font-semibold focus:outline-none transition-all duration-150 select-none"
              style={{
                background: showAllCategories ? "#E2D4C2" : "#EDE0D4",
                color: "#4A3F33",
                borderRadius: "9999px",
              }}
              onMouseEnter={e => { if (!showAllCategories) (e.currentTarget as HTMLElement).style.background = "#E2D4C2"; }}
              onMouseLeave={e => { if (!showAllCategories) (e.currentTarget as HTMLElement).style.background = "#EDE0D4"; }}
            >
              <AlignLeft className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
              <span className="hidden lg:inline">Danh mục</span>
              <ChevronDown
                className={`w-3 h-3 shrink-0 transition-transform duration-200 ${showAllCategories ? "rotate-180" : ""}`}
                strokeWidth={2.5}
              />
            </button>

            {showAllCategories && (
              <div className="absolute left-0 top-full pt-2 z-50 w-[min(1180px,calc(100vw-2rem))]">
                <div
                  style={{
                    background: "#FDFAF6",
                    border: "1px solid #E4D9CC",
                    borderRadius: "16px",
                    boxShadow: "0 20px 56px rgba(26,23,20,0.13), 0 4px 16px rgba(26,23,20,0.06)",
                  }}
                >
                  <div className="py-8 px-8 lg:px-10">
                    <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-1.5" style={{ color: "#C47B5A" }}>Danh mục</p>
                    <h2 className="text-xl font-semibold mb-7" style={{ color: "#1A1714" }}>
                      Tìm đúng thứ <span style={{ color: "#C47B5A" }}>bạn đang cần.</span>
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6 max-h-[min(90vh,580px)] overflow-y-auto custom-scrollbar pr-1">
                      {categories.map((category: ICategory, index: number) => (
                        <div key={category._id} className="group min-w-0">
                          <Link
                            href={`/categories/${category.slug}`}
                            className="flex items-center gap-2.5 mb-2 py-1"
                            onClick={handleHideAllCategories}
                          >
                            <span className="text-[10px] font-medium tabular-nums shrink-0" style={{ color: "#C47B5A" }}>
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="text-[13px] font-semibold truncate transition-colors group-hover:text-[#C47B5A]" style={{ color: "#1A1714" }}>
                              {category.name}
                            </span>
                          </Link>
                          <div style={{ height: "1px", background: "#EDE0D4", marginBottom: "6px" }} />
                          {category.subCategories?.length > 0 && (
                            <div className="space-y-0.5">
                              {category.subCategories.map((sub: ISubCategory) => (
                                <Link
                                  key={sub._id}
                                  href={`/categories/${category.slug}/sub/${sub.slug}`}
                                  onClick={handleHideAllCategories}
                                  className="flex items-center gap-2 py-1.5 px-2 text-[12px] font-medium rounded-md transition-colors truncate"
                                  style={{ color: "#7A6755" }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F5EDE4"; (e.currentTarget as HTMLElement).style.color = "#C47B5A"; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; (e.currentTarget as HTMLElement).style.color = "#7A6755"; }}
                                >
                                  <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "#C4A882" }} />
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

          {/* Divider */}
          <div className="w-px h-4 shrink-0 hidden lg:block" style={{ background: "#DDD0C0" }} />

          {/* Category nav — flex-1 */}
          <nav className="hidden lg:flex flex-1 items-center gap-0.5 min-w-0">
            {isLoading ? (
              <div className="flex items-center gap-1.5 px-2" style={{ color: "#B8997D" }}>
                <div className="w-2.5 h-2.5 border-2 rounded-full animate-spin" style={{ borderColor: "#EDE0D4", borderTopColor: "#C47B5A" }} />
              </div>
            ) : (
              visibleCategories?.map((category: ICategory) => (
                <div
                  key={category._id}
                  className="relative shrink-0"
                  onMouseEnter={() => category.subCategories?.length > 0 && handleMouseEnterCategory(category._id)}
                  onMouseLeave={handleMouseLeaveCategory}
                >
                  <Link
                    href={`/categories/${category.slug}`}
                    className="flex items-center gap-0.5 px-2.5 py-1 text-[12.5px] font-medium whitespace-nowrap rounded-full transition-all duration-150"
                    style={{ color: activeCategory === category._id ? "#C47B5A" : "#5C4E3D" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#C47B5A"; (e.currentTarget as HTMLElement).style.background = "#F5EDE4"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = activeCategory === category._id ? "#C47B5A" : "#5C4E3D"; (e.currentTarget as HTMLElement).style.background = ""; }}
                  >
                    {category.name}
                    {category.subCategories?.length > 0 && (
                      <ChevronDown
                        className={`w-3 h-3 shrink-0 transition-transform duration-200 ${activeCategory === category._id ? "rotate-180" : ""}`}
                        strokeWidth={2.5}
                      />
                    )}
                  </Link>

                  {activeCategory === category._id && category.subCategories?.length > 0 && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 w-52"
                    >
                      <div style={{ background: "#FDFAF6", border: "1px solid #E4D9CC", borderRadius: "14px", boxShadow: "0 12px 36px rgba(26,23,20,0.12)" }}>
                        <div className="px-4 pt-3 pb-2" style={{ borderBottom: "1px solid #EDE0D4" }}>
                          <p className="text-[11px] font-semibold" style={{ color: "#C47B5A" }}>{category.name}</p>
                        </div>
                        <div className="py-2 px-2 max-h-72 overflow-y-auto custom-scrollbar">
                          {category.subCategories.map((sub: ISubCategory) => (
                            <Link
                              key={sub._id}
                              href={`/categories/${category.slug}/sub/${sub.slug}`}
                              className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium rounded-lg transition-colors"
                              style={{ color: "#4A3F33" }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F5EDE4"; (e.currentTarget as HTMLElement).style.color = "#C47B5A"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; (e.currentTarget as HTMLElement).style.color = "#4A3F33"; }}
                              role="menuitem"
                            >
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#C47B5A", opacity: 0.45 }} />
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </nav>

          {/* Search */}
          <form onSubmit={submitSearch} role="search" className="hidden md:flex shrink-0 w-48 lg:w-56 xl:w-64">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "#A8957F" }} />
              <input
                id="header-search"
                name="search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full h-9 pl-9 pr-4 text-[13px] font-medium text-taupe-900 placeholder:text-taupe-400 focus:outline-none transition-all duration-200"
                style={{ background: "#EDE0D4", border: "1.5px solid transparent", borderRadius: "9999px" }}
                onFocus={e => {
                  (e.target as HTMLInputElement).style.background = "#FFF8F2";
                  (e.target as HTMLInputElement).style.borderColor = "#C47B5A";
                  (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(196,123,90,0.13)";
                }}
                onBlur={e => {
                  (e.target as HTMLInputElement).style.background = "#EDE0D4";
                  (e.target as HTMLInputElement).style.borderColor = "transparent";
                  (e.target as HTMLInputElement).style.boxShadow = "none";
                }}
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {!account ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center h-9 px-4 text-[13px] font-semibold transition-all duration-150 hover:opacity-85"
                  style={{ color: "#4A3F33", background: "#EDE0D4", borderRadius: "9999px" }}
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:inline-flex items-center justify-center h-9 px-4 text-[13px] font-semibold transition-all duration-150 hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #C47B5A 0%, #B06038 100%)",
                    color: "#FDFAF6",
                    borderRadius: "9999px",
                    boxShadow: "0 2px 8px rgba(196,123,90,0.32)",
                  }}
                >
                  Đăng ký
                </Link>
              </div>
            ) : (
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
                  <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                  {sellButtonText}
                </Link>

                <div className="flex items-center">
                  {[
                    { href: "/chat", icon: <MessageCircle className="w-[17px] h-[17px]" />, label: "Tin nhắn" },
                    { href: "/notifications", icon: <Bell className="w-[17px] h-[17px]" />, label: "Thông báo" },
                  ].map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-label={item.label}
                      className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-150"
                      style={{ color: "#7A6755" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#C47B5A"; (e.currentTarget as HTMLElement).style.background = "#EDE0D4"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#7A6755"; (e.currentTarget as HTMLElement).style.background = ""; }}
                    >
                      {item.icon}
                    </Link>
                  ))}
                  <Link
                    href="/cart"
                    aria-label="Giỏ hàng"
                    className="relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-150"
                    style={{ color: "#7A6755" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#C47B5A"; (e.currentTarget as HTMLElement).style.background = "#EDE0D4"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#7A6755"; (e.currentTarget as HTMLElement).style.background = ""; }}
                  >
                    <ShoppingCart className="w-[17px] h-[17px]" />
                    {cartItemCount > 0 && (
                      <span
                        className="absolute top-0 right-0 min-w-[16px] h-4 flex items-center justify-center text-white text-[9px] font-bold"
                        style={{ background: "#C47B5A", borderRadius: "20px", border: "1.5px solid #FDFAF6", padding: "0 3px" }}
                      >
                        {cartItemCount > 99 ? "99+" : cartItemCount}
                      </span>
                    )}
                  </Link>
                </div>

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={toggleUserDropdown}
                    className="flex items-center gap-1.5 h-9 pl-1 pr-2.5 rounded-full transition-all duration-150 focus:outline-none"
                    style={{ background: showUserDropdown ? "#EDE0D4" : "transparent" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#EDE0D4"; }}
                    onMouseLeave={e => { if (!showUserDropdown) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    aria-expanded={showUserDropdown}
                    aria-haspopup="true"
                  >
                    {account?.avatar ? (
                      <Image
                        src={account.avatar}
                        alt=""
                        width={30}
                        height={30}
                        className="w-[30px] h-[30px] object-cover rounded-full"
                        style={{ border: "2px solid #DDD0C0" }}
                      />
                    ) : (
                      <span
                        className="w-[30px] h-[30px] flex items-center justify-center text-white text-[11px] font-bold rounded-full"
                        style={{ background: "linear-gradient(135deg, #C47B5A 0%, #B06038 100%)" }}
                      >
                        {getInitials(account?.fullName)}
                      </span>
                    )}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${showUserDropdown ? "rotate-180" : ""}`}
                      style={{ color: "#8A7264" }}
                      strokeWidth={2.5}
                    />
                  </button>

                  {showUserDropdown && (
                    <div
                      className="absolute right-0 mt-2 w-60 z-50"
                      style={{
                        background: "#FDFAF6",
                        border: "1px solid #E4D9CC",
                        borderRadius: "16px",
                        boxShadow: "0 16px 48px rgba(26,23,20,0.13), 0 2px 8px rgba(26,23,20,0.05)",
                      }}
                    >
                      <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid #EDE0D4" }}>
                        <div className="flex items-center gap-3">
                          {account?.avatar ? (
                            <Image src={account.avatar} alt="" width={36} height={36} className="w-9 h-9 rounded-full object-cover shrink-0" style={{ border: "2px solid #DDD0C0" }} />
                          ) : (
                            <span className="w-9 h-9 flex items-center justify-center text-white text-[13px] font-bold shrink-0 rounded-full" style={{ background: "linear-gradient(135deg, #C47B5A 0%, #B06038 100%)" }}>
                              {getInitials(account?.fullName)}
                            </span>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-semibold truncate" style={{ color: "#1A1714" }}>{account?.fullName || "Người dùng"}</p>
                            <p className="text-[11.5px] truncate mt-0.5" style={{ color: "#A8957F" }}>{account?.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-1.5">
                        {[
                          { href: "/profile", icon: <User className="w-4 h-4 shrink-0" />, label: "Thông tin tài khoản", show: true },
                          { href: "/admin", icon: <Settings className="w-4 h-4 shrink-0" />, label: "Quản trị", show: account.role === "admin" },
                          { href: "/chat", icon: <MessageCircle className="w-4 h-4 shrink-0" />, label: "Tin nhắn", show: true },
                          { href: "/my/listings", icon: <Package className="w-4 h-4 shrink-0" />, label: "Sản phẩm đã đăng", show: true },
                          { href: "/orders", icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>, label: "Đơn hàng của tôi", show: true },
                          { href: "/my/orders", icon: <Truck className="w-4 h-4 shrink-0" />, label: "Đơn hàng bán", show: account.role === "seller" },
                        ].filter(item => item.show).map(item => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeUserDropdown}
                            className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-xl transition-all duration-100"
                            style={{ color: "#3A3028" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F5EDE4"; (e.currentTarget as HTMLElement).style.color = "#C47B5A"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; (e.currentTarget as HTMLElement).style.color = "#3A3028"; }}
                          >
                            <span style={{ color: "#B8997D" }}>{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}
                        <div className="my-1 mx-1" style={{ height: "1px", background: "#EDE0D4" }} />
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-xl transition-all duration-100"
                          style={{ color: "#C0392B" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#FEF0EE"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; }}
                        >
                          <LogOut className="w-4 h-4 shrink-0" />Đăng xuất
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
    </header>
  );
}
