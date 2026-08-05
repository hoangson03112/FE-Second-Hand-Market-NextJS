"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { IProductFilters } from "@/types/product";
import type { Province } from "@/types/address";

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price_low", label: "Giá tăng" },
  { value: "price_high", label: "Giá giảm" },
  { value: "popular", label: "Phổ biến" },
] as const;

const TRANSACTION_OPTIONS = [
  { value: "meeting", label: "Gặp mặt" },
  { value: "shipping", label: "Giao hàng" },
] as const;

const CONDITION_OPTIONS = [
  { value: "new", label: "Mới" },
  { value: "like_new", label: "Như mới" },
  { value: "good", label: "Tốt" },
  { value: "fair", label: "Khá" },
  { value: "poor", label: "Cũ" },
];

const PRICE_PRESETS = [
  { label: "< 100k", min: undefined, max: 100000 },
  { label: "100k-500k", min: 100000, max: 500000 },
  { label: "500k-1tr", min: 500000, max: 1000000 },
  { label: "> 1tr", min: 1000000, max: undefined },
];

interface FilterBarProps {
  filters: IProductFilters;
  onFilterChange: (filters: IProductFilters) => void;
  totalProducts?: number;
  provinces?: Province[];
}

export default function FilterBar({
  filters,
  onFilterChange,
  totalProducts,
  provinces = [],
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleSortChange = (sortBy: IProductFilters["sortBy"]) => {
    onFilterChange({ ...filters, sortBy });
  };

  const handleTransactionChange = (value: "meeting" | "shipping") => {
    onFilterChange({
      ...filters,
      transactionMethod: filters.transactionMethod === value ? undefined : value,
      page: 1,
    });
  };

  const handleProvinceChange = (provinceId: string) => {
    onFilterChange({
      ...filters,
      provinceId: provinceId === "" ? undefined : Number(provinceId),
      page: 1,
    });
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
      transactionMethod: undefined,
      provinceId: undefined,
      search: undefined,
      sortBy: "newest",
      page: 1,
    });
  };

  const activeFilterCount = [
    filters.minPrice || filters.maxPrice,
    filters.condition,
    filters.transactionMethod,
    filters.provinceId != null,
    filters.search,
  ].filter(Boolean).length;

  const activePricePreset = PRICE_PRESETS.find(
    (p) => p.min === filters.minPrice && p.max === filters.maxPrice
  );

  const selectedProvince = provinces.find(
    (p) => String(p.ProvinceID) === String(filters.provinceId)
  );

  return (
    <div
      className="sticky top-[60px] z-[45] border-b border-taupe-200/50 bg-background/90 backdrop-blur-md"
    >
      <div className="max-w-8xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 py-4 overflow-x-auto no-scrollbar">
          {/* Province - compact */}
          {provinces.length > 0 && (
            <div className="relative shrink-0">
              <select
                value={filters.provinceId != null ? String(filters.provinceId) : ""}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="h-10 min-w-[140px] pl-4 pr-10 rounded-full text-[13px] font-medium bg-white border border-taupe-200 text-luxury-ink appearance-none cursor-pointer hover:border-luxury-ink/30 transition-all focus:outline-none focus:ring-1 focus:ring-luxury-ink"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%230b0b0a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 14px center",
                  backgroundSize: "14px"
                }}
              >
                <option value="">Toàn quốc</option>
                {provinces.map((p) => (
                  <option key={p.ProvinceID} value={p.ProvinceID}>
                    {p.ProvinceName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="h-6 w-px bg-taupe-200 shrink-0 mx-1"></div>

          {/* Transaction pills */}
          <div className="flex gap-2 shrink-0">
            {TRANSACTION_OPTIONS.map((opt) => {
              const isActive = filters.transactionMethod === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleTransactionChange(opt.value)}
                  className={cn(
                    "h-10 px-5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all border",
                    isActive
                      ? "bg-luxury-ink border-luxury-ink text-background shadow-md shadow-luxury-ink/10"
                      : "bg-white border-taupe-200 text-taupe-600 hover:border-luxury-ink/30 hover:text-luxury-ink"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="h-6 w-px bg-taupe-200 shrink-0 mx-1"></div>

          {/* Sort pills */}
          <div className="flex gap-2 shrink-0">
            {SORT_OPTIONS.map((opt) => {
              const isActive = filters.sortBy === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSortChange(opt.value as IProductFilters["sortBy"])}
                  className={cn(
                    "h-10 px-5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all border",
                    isActive
                      ? "bg-luxury-ink border-luxury-ink text-background shadow-md shadow-luxury-ink/10"
                      : "bg-white border-taupe-200 text-taupe-600 hover:border-luxury-ink/30 hover:text-luxury-ink"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "h-10 px-5 rounded-full text-[13px] font-medium flex items-center gap-2 shrink-0 transition-all border ml-2",
              showFilters || activeFilterCount > 0
                ? "bg-luxury-ink border-luxury-ink text-background shadow-md shadow-luxury-ink/10"
                : "bg-white border-taupe-200 text-taupe-600 hover:border-luxury-ink/30 hover:text-luxury-ink"
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Bộ lọc
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex-1 min-w-4" />

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-[13px] font-medium text-taupe-400 hover:text-luxury-ink shrink-0 underline underline-offset-4"
            >
              Xóa bộ lọc
            </button>
          )}
          {totalProducts !== undefined && (
            <span className="text-[13px] text-taupe-500 shrink-0 ml-4 hidden sm:inline-block">
              <span className="font-semibold text-luxury-ink">{totalProducts.toLocaleString("vi-VN")}</span> kết quả
            </span>
          )}
        </div>

        {/* Active tags - minimal */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 pb-4">
            {filters.search && (
              <span className="inline-flex items-center gap-1.5 h-7 pl-3 pr-2 rounded-full bg-taupe-100/50 text-luxury-ink text-[12px] font-medium border border-taupe-200">
                {filters.search}
                <button onClick={() => onFilterChange({ ...filters, search: undefined, page: 1 })} className="hover:text-destructive transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </span>
            )}
            {selectedProvince && (
              <span className="inline-flex items-center gap-1.5 h-7 pl-3 pr-2 rounded-full bg-taupe-100/50 text-luxury-ink text-[12px] font-medium border border-taupe-200">
                {selectedProvince.ProvinceName}
                <button onClick={() => handleProvinceChange("")} className="hover:text-destructive transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </span>
            )}
            {filters.transactionMethod && (
              <span className="inline-flex items-center gap-1.5 h-7 pl-3 pr-2 rounded-full bg-taupe-100/50 text-luxury-ink text-[12px] font-medium border border-taupe-200">
                {TRANSACTION_OPTIONS.find((o) => o.value === filters.transactionMethod)?.label}
                <button onClick={() => handleTransactionChange(filters.transactionMethod!)} className="hover:text-destructive transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </span>
            )}
            {filters.condition && (
              <span className="inline-flex items-center gap-1.5 h-7 pl-3 pr-2 rounded-full bg-taupe-100/50 text-luxury-ink text-[12px] font-medium border border-taupe-200">
                {CONDITION_OPTIONS.find((c) => c.value === filters.condition)?.label}
                <button onClick={() => handleConditionChange(filters.condition!)} className="hover:text-destructive transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center gap-1.5 h-7 pl-3 pr-2 rounded-full bg-taupe-100/50 text-luxury-ink text-[12px] font-medium border border-taupe-200">
                {activePricePreset?.label ?? `${filters.minPrice ? (filters.minPrice / 1000).toFixed(0) + "k" : "0"}-${filters.maxPrice ? (filters.maxPrice / 1000).toFixed(0) + "k" : "∞"}`}
                <button onClick={() => handlePriceRangeChange(undefined, undefined)} className="hover:text-destructive transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </span>
            )}
          </div>
        )}

        {/* Expandable */}
        {showFilters && (
          <div className="pb-6 pt-2 border-t border-taupe-200/50 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
              <div>
                <p className="text-[13px] font-semibold text-luxury-ink uppercase tracking-widest mb-4">Khoảng giá</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {PRICE_PRESETS.map((preset) => {
                    const isActive = preset.min === filters.minPrice && preset.max === filters.maxPrice;
                    return (
                      <button
                        key={preset.label}
                        onClick={() => handlePriceRangeChange(isActive ? undefined : preset.min, isActive ? undefined : preset.max)}
                        className={cn(
                          "h-9 px-4 rounded-full text-[13px] font-medium transition-all border",
                          isActive
                            ? "bg-luxury-ink border-luxury-ink text-background shadow-md shadow-luxury-ink/10"
                            : "bg-white border-taupe-200 text-taupe-600 hover:border-luxury-ink/30 hover:text-luxury-ink"
                        )}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe-400 text-sm">Từ</span>
                    <input
                      type="number"
                      placeholder="0đ"
                      value={filters.minPrice || ""}
                      onChange={(e) => handlePriceRangeChange(e.target.value ? Number(e.target.value) : undefined, filters.maxPrice)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl text-sm bg-white border border-taupe-200 focus:border-luxury-ink focus:ring-0 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe-400 text-sm">Đến</span>
                    <input
                      type="number"
                      placeholder="∞"
                      value={filters.maxPrice || ""}
                      onChange={(e) => handlePriceRangeChange(filters.minPrice, e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full h-11 pl-12 pr-4 rounded-xl text-sm bg-white border border-taupe-200 focus:border-luxury-ink focus:ring-0 transition-colors"
                    />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-luxury-ink uppercase tracking-widest mb-4">Tình trạng</p>
                <div className="flex flex-wrap gap-2">
                  {CONDITION_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleConditionChange(value)}
                      className={cn(
                        "h-9 px-4 rounded-full text-[13px] font-medium transition-all border",
                        filters.condition === value
                          ? "bg-luxury-ink border-luxury-ink text-background shadow-md shadow-luxury-ink/10"
                          : "bg-white border-taupe-200 text-taupe-600 hover:border-luxury-ink/30 hover:text-luxury-ink"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
