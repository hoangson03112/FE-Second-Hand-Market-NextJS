"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { IProductFilters } from "@/types/product";
import type { ICategory } from "@/types/category";

export interface AllProductsFilterBarProps {
  filters: IProductFilters;
  onFilterChange: (updater: (prev: IProductFilters) => IProductFilters) => void;
  totalProducts?: number;
  categories?: ICategory[];
}

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price_low", label: "Giá thấp" },
  { value: "price_high", label: "Giá cao" },
  { value: "popular", label: "Phổ biến" },
] as const;

const CONDITION_OPTIONS = [
  { value: "new", label: "Mới", emoji: "✨" },
  { value: "like_new", label: "Như mới", emoji: "🌟" },
  { value: "good", label: "Tốt", emoji: "👍" },
  { value: "fair", label: "Khá", emoji: "🙂" },
  { value: "poor", label: "Cũ", emoji: "🔧" },
];

const PRICE_PRESETS = [
  { label: "Dưới 100k", min: undefined, max: 100000 },
  { label: "100k – 500k", min: 100000, max: 500000 },
  { label: "500k – 1tr", min: 500000, max: 1000000 },
  { label: "Trên 1tr", min: 1000000, max: undefined },
];

export default function AllProductsFilterBar({
  filters,
  onFilterChange,
  totalProducts,
  categories = [],
}: AllProductsFilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || "");

  const update = (partial: Partial<IProductFilters>) =>
    onFilterChange((prev) => ({ ...prev, ...partial, page: 1 }));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    update({ search: searchInput || undefined });
  };

  const clearFilters = () => {
    setSearchInput("");
    onFilterChange(() => ({ sortBy: "newest", limit: filters.limit, page: 1 }));
  };

  const activeFilterCount = [
    filters.minPrice || filters.maxPrice,
    filters.condition,
    filters.categorySlug,
    filters.search,
  ].filter(Boolean).length;

  const activePricePreset = PRICE_PRESETS.find(
    (p) => p.min === filters.minPrice && p.max === filters.maxPrice
  );

  const activeCategory = categories.find((c) => c.slug === filters.categorySlug);

  return (
    <div className="bg-white/90 backdrop-blur-md border-b border-taupe-200/70 shadow-sm sticky top-28 z-40">
      {/* Main bar */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-3 overflow-x-auto scrollbar-none">

          {/* Search input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[180px] max-w-xs">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="w-full h-9 pl-9 pr-3 rounded-xl border-2 border-taupe-200 focus:border-primary focus:outline-none text-sm text-taupe-700 bg-white placeholder:text-taupe-300 transition-colors"
              />
              <button type="submit" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-taupe-400 hover:text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          <div className="w-px h-5 bg-taupe-200 shrink-0" />

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "shrink-0 h-9 px-3.5 rounded-xl border-2 text-sm font-semibold flex items-center gap-2 transition-all duration-200",
              showFilters || activeFilterCount > 0
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-taupe-200 bg-white text-taupe-700 hover:border-primary/60 hover:text-primary"
            )}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Lọc
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white/30 text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="w-px h-5 bg-taupe-200 shrink-0" />

          {/* Sort chips */}
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update({ sortBy: opt.value as IProductFilters["sortBy"] })}
              className={cn(
                "shrink-0 h-9 px-3.5 rounded-xl border text-sm font-medium transition-all duration-200",
                filters.sortBy === opt.value
                  ? "border-primary bg-primary text-primary-foreground font-semibold"
                  : "border-taupe-200 bg-white text-taupe-600 hover:border-taupe-300 hover:text-taupe-900"
              )}
            >
              {opt.label}
            </button>
          ))}

          <div className="ml-auto shrink-0 flex items-center gap-3">
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="h-9 px-3 rounded-xl text-sm text-taupe-500 hover:text-primary hover:bg-primary/5 transition-all duration-200 flex items-center gap-1.5 font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Xóa lọc
              </button>
            )}
            {totalProducts !== undefined && (
              <span className="text-sm text-taupe-400 font-medium whitespace-nowrap">
                <span className="text-taupe-700 font-bold">{totalProducts.toLocaleString("vi-VN")}</span> sản phẩm
              </span>
            )}
          </div>
        </div>

        {/* Active filter tags */}
        {(filters.condition || filters.minPrice || filters.maxPrice || filters.categorySlug || filters.search) && (
          <div className="flex items-center gap-2 pb-2.5 overflow-x-auto scrollbar-none">
            <span className="text-xs text-taupe-400 shrink-0">Đang lọc:</span>
            {filters.search && (
              <span className="shrink-0 h-6 px-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold flex items-center gap-1">
                🔍 {filters.search}
                <button onClick={() => { setSearchInput(""); update({ search: undefined }); }} className="ml-1 opacity-60 hover:opacity-100">✕</button>
              </span>
            )}
            {filters.categorySlug && activeCategory && (
              <span className="shrink-0 h-6 px-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold flex items-center gap-1">
                📂 {activeCategory.name}
                <button onClick={() => update({ categorySlug: undefined, subCategorySlug: undefined })} className="ml-1 opacity-60 hover:opacity-100">✕</button>
              </span>
            )}
            {filters.condition && (
              <span className="shrink-0 h-6 px-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold flex items-center gap-1">
                {CONDITION_OPTIONS.find((c) => c.value === filters.condition)?.emoji}{" "}
                {CONDITION_OPTIONS.find((c) => c.value === filters.condition)?.label}
                <button onClick={() => update({ condition: undefined })} className="ml-1 opacity-60 hover:opacity-100">✕</button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="shrink-0 h-6 px-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold flex items-center gap-1">
                {activePricePreset
                  ? activePricePreset.label
                  : `${filters.minPrice ? (filters.minPrice / 1000).toFixed(0) + "k" : "0"} – ${filters.maxPrice ? (filters.maxPrice / 1000).toFixed(0) + "k" : "∞"}`}
                <button onClick={() => update({ minPrice: undefined, maxPrice: undefined })} className="ml-1 opacity-60 hover:opacity-100">✕</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expanded filter panel */}
      {showFilters && (
        <div className="border-t border-taupe-100 bg-gradient-to-b from-taupe-50/60 to-white">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Category */}
            {categories.length > 0 && (
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.15em] text-taupe-400 mb-3">Danh mục</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => update({ categorySlug: undefined, subCategorySlug: undefined })}
                    className={cn(
                      "h-8 px-3 rounded-lg text-xs font-semibold border transition-all duration-200",
                      !filters.categorySlug
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-taupe-200 bg-white text-taupe-600 hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    Tất cả
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => update({ categorySlug: cat.slug === filters.categorySlug ? undefined : cat.slug, subCategorySlug: undefined })}
                      className={cn(
                        "h-8 px-3 rounded-lg text-xs font-semibold border transition-all duration-200",
                        cat.slug === filters.categorySlug
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-taupe-200 bg-white text-taupe-600 hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.15em] text-taupe-400 mb-3">Khoảng giá</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {PRICE_PRESETS.map((preset) => {
                  const isActive = preset.min === filters.minPrice && preset.max === filters.maxPrice;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => update({ minPrice: isActive ? undefined : preset.min, maxPrice: isActive ? undefined : preset.max })}
                      className={cn(
                        "h-8 px-3 rounded-lg text-xs font-semibold border transition-all duration-200",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-taupe-200 bg-white text-taupe-600 hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                      )}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Từ (đ)"
                  value={filters.minPrice || ""}
                  onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                  className="flex-1 h-9 px-3 rounded-xl border-2 border-taupe-200 focus:border-primary focus:outline-none text-sm text-taupe-700 bg-white placeholder:text-taupe-300"
                />
                <span className="text-taupe-300 font-light">—</span>
                <input
                  type="number"
                  placeholder="Đến (đ)"
                  value={filters.maxPrice || ""}
                  onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                  className="flex-1 h-9 px-3 rounded-xl border-2 border-taupe-200 focus:border-primary focus:outline-none text-sm text-taupe-700 bg-white placeholder:text-taupe-300"
                />
              </div>
            </div>

            {/* Condition */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.15em] text-taupe-400 mb-3">Tình trạng</p>
              <div className="flex flex-wrap gap-2">
                {CONDITION_OPTIONS.map((opt) => {
                  const isActive = opt.value === filters.condition;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => update({ condition: isActive ? undefined : opt.value })}
                      className={cn(
                        "h-8 px-3 rounded-lg text-xs font-semibold border transition-all duration-200",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-taupe-200 bg-white text-taupe-600 hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                      )}
                    >
                      {opt.emoji} {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
