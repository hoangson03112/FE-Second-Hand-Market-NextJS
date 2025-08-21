"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

type User = {
  name?: string;
  avatarUrl?: string;
};

type HeaderProps = {
  user?: User | null;
  cartCount?: number;
  notificationsCount?: number;
  onSearch?: (q: string) => void;
  onLogout?: () => void;
};

const categories = [
  {
    name: "Đồ điện tử",
    href: "/c/do-dien-tu",
    subCategories: [
      { name: "Điện thoại", href: "/c/dien-thoai" },
      { name: "Máy tính, Laptop", href: "/c/may-tinh" },
      { name: "Máy ảnh, Máy quay", href: "/c/may-anh" },
      { name: "Phụ kiện", href: "/c/phu-kien-dien-tu" },
    ],
  },
  {
    name: "Xe cộ",
    href: "/c/xe-co",
    subCategories: [
      { name: "Ô tô", href: "/c/o-to" },
      { name: "Xe máy", href: "/c/xe-may" },
      { name: "Xe đạp", href: "/c/xe-dap" },
      { name: "Phụ tùng xe", href: "/c/phu-tung-xe" },
    ],
  },
  {
    name: "Nội thất, Gia dụng",
    href: "/c/noi-that",
    subCategories: [
      { name: "Bàn ghế", href: "/c/ban-ghe" },
      { name: "Tủ, Kệ", href: "/c/tu-ke" },
      { name: "Đồ dùng nhà bếp", href: "/c/do-dung-bep" },
      { name: "Thiết bị gia dụng", href: "/c/thiet-bi-gia-dung" },
    ],
  },
  {
    name: "Thời trang",
    href: "/c/thoi-trang",
    subCategories: [
      { name: "Quần áo", href: "/c/quan-ao" },
      { name: "Túi xách", href: "/c/tui-xach" },
      { name: "Giày dép", href: "/c/giay-dep" },
      { name: "Đồng hồ", href: "/c/dong-ho" },
    ],
  },
  { name: "Mẹ & Bé", href: "/c/me-va-be", subCategories: [] },
  { name: "Sách, Đồ dùng học tập", href: "/c/sach", subCategories: [] },
];

const IconBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold">
        {count}
      </span>
    </span>
  );
};

export default function Header({
  user = null,
  cartCount = 0,
  notificationsCount = 0,
  onSearch,
  onLogout,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-xl shadow-black/5">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <Image
                  src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png"
                  alt="Eco Market Logo"
                  width={150}
                  height={150}
                  className="h-24 w-auto transition-transform duration-300 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <form
              className="w-full max-w-xl"
              onSubmit={submitSearch}
              role="search"
            >
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-6 w-6 text-slate-400 group-focus-within:text-slate-600 transition-colors duration-300"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full bg-slate-50/80 backdrop-blur-sm border border-slate-200/50 rounded-full py-3 pl-12 pr-4 text-base placeholder-slate-500 focus:outline-none focus:text-slate-900 focus:placeholder-slate-400 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 focus:bg-white/90 transition-all duration-300 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10"
                  placeholder="Tìm kiếm sản phẩm..."
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center justify-end gap-3">
            <Link
              href="/sell"
              className="group relative inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-full text-white bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 transition-all duration-300 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative z-10">Đăng bán</span>
            </Link>
            <Link
              href="/notifications"
              className="relative p-3 rounded-full text-slate-500 hover:bg-slate-100/80 hover:text-slate-700 transition-all duration-300 group hover:scale-110 backdrop-blur-sm shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10"
              aria-label="Thông báo"
            >
              <svg
                className="h-6 w-6 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
              <IconBadge count={notificationsCount} />
            </Link>
            <Link
              href="/cart"
              className="relative p-3 rounded-full text-slate-500 hover:bg-slate-100/80 hover:text-slate-700 transition-all duration-300 group hover:scale-110 backdrop-blur-sm shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10"
              aria-label="Giỏ hàng"
            >
              <svg
                className="h-6 w-6 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.823-6.84a1.125 1.125 0 00-1.087-1.415H4.5"
                />
              </svg>
              <IconBadge count={cartCount} />
            </Link>

            <div className="w-px h-8 bg-slate-300/50 mx-3"></div>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 group transition-all duration-300 hover:scale-110"
                >
                  <div className="relative">
                    <Image
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-white/50 group-hover:ring-slate-300 transition-all duration-300"
                      src={user.avatarUrl || "/default-avatar.png"}
                      alt="User avatar"
                      width={40}
                      height={40}
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </button>
                {dropdownOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-3 w-52 rounded-xl shadow-2xl py-2 bg-white/95 backdrop-blur-xl ring-1 ring-slate-200/50 focus:outline-none transition ease-out duration-200 transform opacity-100 scale-100"
                    role="menu"
                  >
                    <div className="px-4 py-3">
                      <p className="text-sm">Đăng nhập với</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                      </p>
                    </div>
                    <div className="h-px bg-gray-100"></div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Hồ sơ của bạn
                    </Link>
                    <Link
                      href="/my-listings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Tin đã đăng
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="group inline-flex items-center justify-center px-5 py-2.5 border-2 border-slate-300 text-sm font-semibold rounded-full text-slate-700 bg-white/80 backdrop-blur-sm hover:bg-slate-50/90 hover:border-slate-400 transition-all duration-300 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 hover:scale-105"
              >
                <span className="relative z-10">Đăng nhập</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category Bar - Desktop */}
      <nav className="hidden md:block bg-white/90 backdrop-blur-lg border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center gap-x-8 h-12">
            {categories.map((category) => (
              <div
                key={category.name}
                className="relative flex"
                onMouseEnter={() =>
                  category.subCategories.length > 0 &&
                  setActiveCategory(category.name)
                }
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  href={category.href}
                  className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-all duration-300 py-3 group relative overflow-hidden rounded-lg px-3 hover:bg-slate-50/80"
                >
                  {category.name}
                  {category.subCategories.length > 0 && (
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeCategory === category.name ? "rotate-180" : ""
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
                {activeCategory === category.name &&
                  category.subCategories.length > 0 && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-60">
                      <div className="rounded-xl shadow-2xl bg-white/95 backdrop-blur-xl ring-1 ring-slate-200/50 z-20">
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                        >
                          {category.subCategories.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50/80 hover:text-slate-900 transition-all duration-300 rounded-lg mx-2 group"
                              role="menuitem"
                            >
                              <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
                                {sub.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden" id="mobile-menu" ref={mobileMenuRef}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <form className="p-2" onSubmit={submitSearch}>
              <input
                className="block w-full bg-gray-100 border border-transparent rounded-full py-2 px-4 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Tìm kiếm..."
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>
            <Link
              href="/sell"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Đăng bán
            </Link>
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Hồ sơ
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Đăng nhập
              </Link>
            )}
            <div className="border-t border-gray-200 my-2"></div>
            <p className="px-3 pt-2 text-xs font-semibold text-gray-500 uppercase">
              Danh mục
            </p>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
