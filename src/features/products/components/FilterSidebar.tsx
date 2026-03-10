"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { IProductFilters } from "@/types/product";
import type { ICategory } from "@/types/category";

export interface FilterSidebarProps {
  filters: IProductFilters;
  onFilterChange: (updater: (prev: IProductFilters) => IProductFilters) => void;
  categories?: ICategory[];
}

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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-black uppercase tracking-[0.12em] text-taupe-400 mb-3">
      {children}
    </p>
  );
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  categories = [],
}: FilterSidebarProps) {
  const update = (partial: Partial<IProductFilters>) =>
    onFilterChange((prev) => ({ ...prev, ...partial, page: 1 }));

  const activeFilterCount = [
    filters.minPrice || filters.maxPrice,
    filters.condition,
    filters.categorySlug,
  ].filter(Boolean).length;

  const activePricePreset = PRICE_PRESETS.find(
    (p) => p.min === filters.minPrice && p.max === filters.maxPrice
  );

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-taupe-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm font-bold text-taupe-800">Bộ lọc</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-black min-w-[18px] text-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={() => onFilterChange((prev) => ({ sortBy: prev.sortBy, limit: prev.limit, page: 1 }))}
            className="text-xs text-taupe-400 hover:text-primary transition-colors font-medium"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      <div className="h-px bg-taupe-100 mb-5" />

      {/* Category */}
      {categories.length > 0 && (
        <div className="mb-6">
          <SectionTitle>Danh mục</SectionTitle>
          <div className="space-y-0.5">
            <button
              onClick={() => update({ categorySlug: undefined, subCategorySlug: undefined })}
              className={cn(
                "w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150",
                !filters.categorySlug
                  ? "bg-primary/15 text-foreground font-semibold"
                  : "text-taupe-600 hover:bg-taupe-50 hover:text-taupe-900"
              )}
            >
              <span className="flex items-center justify-between">
                Tất cả danh mục
                {!filters.categorySlug && (
                  <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() =>
                  update({
                    categorySlug: cat.slug === filters.categorySlug ? undefined : cat.slug,
                    subCategorySlug: undefined,
                  })
                }
                className={cn(
                  "w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150",
                  cat.slug === filters.categorySlug
                    ? "bg-primary/15 text-foreground font-semibold"
                    : "text-taupe-600 hover:bg-taupe-50 hover:text-taupe-900"
                )}
              >
                <span className="flex items-center justify-between">
                  {cat.name}
                  {cat.slug === filters.categorySlug && (
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="h-px bg-taupe-100 mb-5" />

      {/* Condition */}
      <div className="mb-6">
        <SectionTitle>Tình trạng</SectionTitle>
        <div className="space-y-0.5">
          {CONDITION_OPTIONS.map((opt) => {
            const isActive = opt.value === filters.condition;
            return (
              <button
                key={opt.value}
                onClick={() => update({ condition: isActive ? undefined : opt.value })}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 flex items-center gap-2",
                  isActive
                    ? "bg-primary/15 text-foreground font-semibold"
                    : "text-taupe-600 hover:bg-taupe-50 hover:text-taupe-900"
                )}
              >
                <span>{opt.emoji}</span>
                <span className="flex-1">{opt.label}</span>
                {isActive && (
                  <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-taupe-100 mb-5" />

      {/* Price range */}
      <div className="mb-6">
        <SectionTitle>Khoảng giá</SectionTitle>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {PRICE_PRESETS.map((preset) => {
            const isActive = preset.min === filters.minPrice && preset.max === filters.maxPrice;
            return (
              <button
                key={preset.label}
                onClick={() =>
                  update({
                    minPrice: isActive ? undefined : preset.min,
                    maxPrice: isActive ? undefined : preset.max,
                  })
                }
                className={cn(
                  "h-8 px-2 rounded-lg text-xs font-semibold border transition-all duration-150 text-center",
                  isActive
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-taupe-200 bg-white text-taupe-600 hover:border-primary/50 hover:text-primary"
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Active price display */}
        {(filters.minPrice || filters.maxPrice) && !activePricePreset && (
          <div className="mb-2 px-3 py-1.5 rounded-lg bg-primary/8 border border-primary/15 text-xs text-primary font-semibold flex items-center justify-between">
            <span>
              {filters.minPrice ? (filters.minPrice / 1000).toFixed(0) + "k" : "0"}
              {" – "}
              {filters.maxPrice ? (filters.maxPrice / 1000).toFixed(0) + "k" : "∞"}
            </span>
            <button onClick={() => update({ minPrice: undefined, maxPrice: undefined })} className="opacity-60 hover:opacity-100">✕</button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Từ (đ)"
            value={filters.minPrice || ""}
            onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="flex-1 h-9 px-3 rounded-xl border-2 border-taupe-200 focus:border-primary focus:outline-none text-xs text-taupe-700 bg-white placeholder:text-taupe-300 w-0"
          />
          <span className="text-taupe-300 text-xs shrink-0">—</span>
          <input
            type="number"
            placeholder="Đến (đ)"
            value={filters.maxPrice || ""}
            onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="flex-1 h-9 px-3 rounded-xl border-2 border-taupe-200 focus:border-primary focus:outline-none text-xs text-taupe-700 bg-white placeholder:text-taupe-300 w-0"
          />
        </div>
      </div>
    </div>
  );
}
