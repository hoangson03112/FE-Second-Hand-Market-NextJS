"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useCategories from "@/hooks/useCategories";
import useMounted from "@/hooks/useMounted";
type User = {
  name?: string;
  avatarUrl?: string;
};

type HeaderProps = {
  user?: User | null;
  cartCount?: number;
  notificationsCount?: number;
  onLogout?: () => void;
};

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
  onLogout,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const mounted = useMounted();
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const { categories, isLoading } = useCategories();
  console.log(categories);
  const { visibleCategories } = useMemo(
    () => ({
      visibleCategories: categories.slice(0, 6),
    }),
    [categories]
  );

  const handleMouseEnterCategory = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);

  const handleMouseLeaveCategory = useCallback(() => {
    setActiveCategory(null);
  }, []);

  const handleShowAllCategories = useCallback(() => {
    setShowAllCategories(true);
  }, []);

  const handleHideAllCategories = useCallback(() => {
    setShowAllCategories(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setShowAllCategories(false);
        setActiveCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mounted]);

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28">
          {/* Logo */}
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

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <form
              className="w-full max-w-xl"
              onSubmit={submitSearch}
              role="search"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-6 w-6 text-gray-400"
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
                  className="block w-full bg-gray-100 border border-transparent rounded-full py-3 pl-12 pr-4 text-base placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
              className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-full text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              Đăng bán
            </Link>
            <Link
              href="/notifications"
              className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Thông báo"
            >
              <svg
                className="h-7 w-7"
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
              {mounted && <IconBadge count={notificationsCount} />}
            </Link>
            <Link
              href="/cart"
              className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Giỏ hàng"
            >
              <svg
                className="h-7 w-7"
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
              {mounted && <IconBadge count={cartCount} />}
            </Link>

            <div className="w-px h-8 bg-gray-200 mx-2"></div>

            {mounted && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <Image
                    className="h-10 w-10 rounded-full object-cover"
                    src={user.avatarUrl || "/default-avatar.png"}
                    alt="User avatar"
                    width={40}
                    height={40}
                  />
                </button>
                {dropdownOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100 transform opacity-100 scale-100"
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
            ) : mounted && !user ? (
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Đăng nhập
              </Link>
            ) : (
              <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-full"></div>
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
      <nav
        className="hidden md:block bg-white border-t border-gray-200"
        ref={categoriesRef}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-x-6 h-12 relative">
            {/* "Tất cả danh mục" Button - Đặt đầu tiên */}
            <div
              className="relative"
              onMouseEnter={handleShowAllCategories}
              onMouseLeave={handleHideAllCategories}
            >
              <div className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors py-3 px-3 rounded-md hover:bg-gray-50 cursor-pointer">
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

              {/* All Categories Mega Menu */}
              {showAllCategories && (
                <div className="absolute left-0 top-full pt-2 w-screen max-w-4xl z-50">
                  <div className="rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 border">
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Tất cả danh mục
                        </h3>
                        <p className="text-sm text-gray-500">
                          Khám phá tất cả sản phẩm
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-6 max-h-96 overflow-y-auto">
                        {categories.map((category) => (
                          <div key={category._id} className="space-y-2">
                            <Link
                              href={`/categories/${category._id}`}
                              className="block text-sm font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
                            >
                              {category.name}
                            </Link>
                            {category.subCategories &&
                              category.subCategories.length > 0 && (
                                <div className="space-y-1 pl-2">
                                  {category.subCategories
                                    .slice(0, 5)
                                    .map((sub) => (
                                      <Link
                                        key={sub._id}
                                        href={`/categories/${category._id}/sub/${sub._id}`}
                                        className="block text-xs text-gray-600 hover:text-emerald-600 transition-colors"
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

            {/* Separator */}
            <div className="w-px h-6 bg-gray-300"></div>

            {/* Visible Categories */}
            {visibleCategories.map((category) => (
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
                  href={`/categories/${category._id}`}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors py-3 whitespace-nowrap"
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

                {/* Subcategories Dropdown */}
                {activeCategory === category._id &&
                  category.subCategories &&
                  category.subCategories.length > 0 && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-64 z-50">
                      <div className="rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 border">
                        <div
                          className="py-2"
                          role="menu"
                          aria-orientation="vertical"
                        >
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b">
                            {category.name}
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {category.subCategories.map((sub) => (
                              <Link
                                key={sub._id}
                                href={`/categories/${category._id}/sub/${sub._id}`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                role="menuitem"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            ))}

            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                Đang tải danh mục...
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden" id="mobile-menu">
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
                key={cat._id}
                href={`/categories/${cat._id}`}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {cat.name}
              </Link>
            ))}
            {isLoading && (
              <div className="px-3 py-2 text-sm text-gray-500">
                Đang tải danh mục...
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
