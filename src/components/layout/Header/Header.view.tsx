"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { HeaderViewProps } from "./Header.types";
import { ICategory, ISubCategory } from "@/types/category";

export default function HeaderView(props: HeaderViewProps) {
  const {
    visibleCategories,
    categories,
    isLoading,
    activeCategory,
    showAllCategories,
    onMouseEnterCategory,
    onMouseLeaveCategory,
    onShowAll,
    onHideAll,
    onSearch,
  } = props;

  const [query, setQuery] = useState("");

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <header className="relative bg-gradient-to-br from-orange-50 via-neutral-50 to-blue-50 backdrop-blur-md border-b border-default sticky top-0 z-50 shadow-md">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(251,146,60,0.15)_1px,transparent_0)] [background-size:20px_20px] opacity-40" />
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
                    <svg
                      className="h-6 w-6 text-tertiary"
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
                    className="block w-full bg-neutral border border-transparent rounded-full py-3 pl-12 pr-4 text-base text-tertiary placeholder:text-tertiary focus:outline-none focus:text-primary focus:placeholder:text-tertiary focus-ring-primary"
                    placeholder="Tìm kiếm sản phẩm..."
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>

            <div className="hidden md:flex items-center justify-end gap-3">
              <Link
                href="/sell"
                className="inline-flex items-center justify-center px-5 py-2.5  text-base font-medium rounded-full text-white btn-primary  hover-bg-primary-dark transition-colors"
              >
                Đăng bán
              </Link>
              <Link
                href="/notifications"
                className="relative p-2 rounded-full text-tertiary hover-bg-neutral hover-text-secondary transition-colors"
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
              </Link>
              <Link
                href="/cart"
                className="relative p-2 rounded-full text-tertiary hover-bg-neutral hover-text-secondary transition-colors"
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
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto  hidden md:block relative bg-gradient-to-r from-orange-50/60 via-neutral-50/80 to-blue-50/60 border-default backdrop-blur-sm">
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto ">
            <div className="flex items-center gap-5 h-12 relative">
              <div
                className="relative "
                onMouseEnter={onShowAll}
                onMouseLeave={onHideAll}
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
                                href={`/categories/${category._id}`}
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
                                          href={`/categories/${category._id}/sub/${sub._id}`}
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
                      onMouseEnterCategory(category._id)
                    }
                    onMouseLeave={onMouseLeaveCategory}
                  >
                    <Link
                      href={`/categories/${category._id}`}
                      className="flex items-center gap-1 text-sm font-medium text-secondary hover-text-primary transition-colors py-3 whitespace-nowrap"
                    >
                      {category.name}
                      {category.subCategories &&
                        category.subCategories.length > 0 && (
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                              activeCategory === category._id
                                ? "rotate-180"
                                : ""
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
                                      href={`/categories/${category._id}/sub/${sub._id}`}
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
