"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { IProductFilters } from "@/types/product";

interface FilterBarProps {
  filters: IProductFilters;
  onFilterChange: (filters: IProductFilters) => void;
  totalProducts?: number;
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

export default function FilterBar({ filters, onFilterChange, totalProducts }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleSortChange = (sortBy: IProductFilters["sortBy"]) => {
    onFilterChange({ ...filters, sortBy });
  };

  const handlePriceRangeChange = (min?: number, max?: number) => {
    onFilterChange({ ...filters, minPrice: min, maxPrice: max, page: 1 });
  };

  const handleConditionChange = (condition: string) => {
    onFilterChange({
      ...filters,
      condition: condition === filters.condition ? undefined : condition,
      page: 1,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      ...filters,
      minPrice: undefined,
      maxPrice: undefined,
      condition: undefined,
      sortBy: "newest",
      page: 1,
    });
  };

  const activeFilterCount = [filters.minPrice || filters.maxPrice, filters.condition].filter(Boolean).length;

  const activePricePreset = PRICE_PRESETS.find(
    (p) => p.min === filters.minPrice && p.max === filters.maxPrice
  );

  return (
    <div className="bg-white/90 backdrop-blur-md border-b border-taupe-200/70 shadow-sm sticky top-28 z-40">
      {/* Main bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-3 overflow-x-auto scrollbar-none">

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "shrink-0 h-9 px-3.5 rounded-xl border-2 text-sm font-semibold flex items-center gap-2 transition-all duration-200",
              showFilters || activeFilterCount > 0
                ? "border-primary bg-primary text-white shadow-sm"
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
              onClick={() => handleSortChange(opt.value as IProductFilters["sortBy"])}
              className={cn(
                "shrink-0 h-9 px-3.5 rounded-xl border text-sm font-medium transition-all duration-200",
                filters.sortBy === opt.value
                  ? "border-primary/30 bg-primary/10 text-primary font-semibold"
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
                <span className="text-taupe-700 font-bold">{totalProducts.toLocaleString()}</span> sản phẩm
              </span>
            )}
          </div>
        </div>

        {/* Active filter tags */}
        {(filters.condition || filters.minPrice || filters.maxPrice) && (
          <div className="flex items-center gap-2 pb-2.5 overflow-x-auto scrollbar-none">
            <span className="text-xs text-taupe-400 shrink-0">Đang lọc:</span>
            {filters.condition && (
              <span className="shrink-0 h-6 px-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold flex items-center gap-1">
                {CONDITION_OPTIONS.find(c => c.value === filters.condition)?.emoji}{" "}
                {CONDITION_OPTIONS.find(c => c.value === filters.condition)?.label}
                <button onClick={() => handleConditionChange(filters.condition!)} className="ml-1 opacity-60 hover:opacity-100">✕</button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="shrink-0 h-6 px-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold flex items-center gap-1">
                {activePricePreset
                  ? activePricePreset.label
                  : `${filters.minPrice ? (filters.minPrice / 1000).toFixed(0) + "k" : "0"} – ${filters.maxPrice ? (filters.maxPrice / 1000).toFixed(0) + "k" : "∞"}`}
                <button onClick={() => handlePriceRangeChange(undefined, undefined)} className="ml-1 opacity-60 hover:opacity-100">✕</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expanded filter panel */}
      {showFilters && (
        <div className="border-t border-taupe-100 bg-gradient-to-b from-taupe-50/60 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Price */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.15em] text-taupe-400 mb-3">Khoảng giá</p>
              {/* Quick presets */}
              <div className="flex flex-wrap gap-2 mb-3">
                {PRICE_PRESETS.map((preset) => {
                  const isActive = preset.min === filters.minPrice && preset.max === filters.maxPrice;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => handlePriceRangeChange(isActive ? undefined : preset.min, isActive ? undefined : preset.max)}
                      className={cn(
                        "h-8 px-3 rounded-lg text-xs font-semibold border transition-all duration-200",
                        isActive
                          ? "border-primary bg-primary text-white shadow-sm"
                          : "border-taupe-200 bg-white text-taupe-600 hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                      )}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
              {/* Custom range */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Từ (đ)"
                    value={filters.minPrice || ""}
                    onChange={(e) => handlePriceRangeChange(e.target.value ? Number(e.target.value) : undefined, filters.maxPrice)}
                    className="w-full h-9 pl-3 pr-3 rounded-xl border-2 border-taupe-200 focus:border-primary focus:outline-none text-sm text-taupe-700 bg-white placeholder:text-taupe-300"
                  />
                </div>
                <span className="text-taupe-300 font-light">—</span>
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Đến (đ)"
                    value={filters.maxPrice || ""}
                    onChange={(e) => handlePriceRangeChange(filters.minPrice, e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full h-9 pl-3 pr-3 rounded-xl border-2 border-taupe-200 focus:border-primary focus:outline-none text-sm text-taupe-700 bg-white placeholder:text-taupe-300"
                  />
                </div>
              </div>
            </div>

            {/* Condition */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.15em] text-taupe-400 mb-3">Tình trạng sản phẩm</p>
              <div className="flex flex-wrap gap-2">
                {CONDITION_OPTIONS.map(({ value, label, emoji }) => (
                  <button
                    key={value}
                    onClick={() => handleConditionChange(value)}
                    className={cn(
                      "h-9 px-4 rounded-xl text-sm font-semibold border-2 transition-all duration-200 flex items-center gap-1.5",
                      filters.condition === value
                        ? "border-primary bg-primary text-white shadow-sm scale-[1.02]"
                        : "border-taupe-200 bg-white text-taupe-600 hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    <span>{emoji}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
