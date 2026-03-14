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
      className="sticky top-[60px] z-[45] border-b border-taupe-100 bg-white"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 py-3 overflow-x-auto">
          {/* Province - compact */}
          {provinces.length > 0 && (
            <select
              value={filters.provinceId != null ? String(filters.provinceId) : ""}
              onChange={(e) => handleProvinceChange(e.target.value)}
              className="h-9 min-w-[120px] pl-3 pr-8 rounded-full text-sm bg-taupe-50 text-taupe-700 border-0 appearance-none cursor-pointer hover:bg-taupe-100 transition-colors bg-no-repeat bg-[length:12px] bg-[right_10px_center]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
              }}
            >
              <option value="">Tỉnh thành</option>
              {provinces.map((p) => (
                <option key={p.ProvinceID} value={p.ProvinceID}>
                  {p.ProvinceName}
                </option>
              ))}
            </select>
          )}

          {/* Transaction pills */}
          <div className="flex gap-1 shrink-0">
            {TRANSACTION_OPTIONS.map((opt) => {
              const isActive = filters.transactionMethod === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleTransactionChange(opt.value)}
                  className={cn(
                    "h-9 px-4 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    isActive
                      ? "bg-[#1A1714] text-white"
                      : "bg-taupe-50 text-taupe-600 hover:bg-taupe-100"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Sort pills */}
          <div className="flex gap-1 shrink-0">
            {SORT_OPTIONS.map((opt) => {
              const isActive = filters.sortBy === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSortChange(opt.value as IProductFilters["sortBy"])}
                  className={cn(
                    "h-9 px-4 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    isActive
                      ? "bg-[#1A1714] text-white"
                      : "bg-taupe-50 text-taupe-600 hover:bg-taupe-100"
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
              "h-9 px-4 rounded-full text-sm font-medium flex items-center gap-1.5 shrink-0 transition-colors",
              showFilters || activeFilterCount > 0
                ? "bg-[#1A1714] text-white"
                : "bg-taupe-50 text-taupe-600 hover:bg-taupe-100"
            )}
          >
            Lọc
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white/25 flex items-center justify-center text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex-1 min-w-4" />

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-taupe-400 hover:text-taupe-700 shrink-0"
            >
              Xóa lọc
            </button>
          )}
          {totalProducts !== undefined && (
            <span className="text-sm text-taupe-400 shrink-0">
              <span className="font-semibold text-taupe-700">{totalProducts.toLocaleString()}</span> SP
            </span>
          )}
        </div>

        {/* Active tags - minimal */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 pb-2">
            {filters.search && (
              <span className="inline-flex items-center gap-1 h-6 pl-2.5 pr-1.5 rounded-full bg-taupe-100 text-taupe-700 text-xs">
                {filters.search}
                <button onClick={() => onFilterChange({ ...filters, search: undefined, page: 1 })} className="hover:bg-taupe-200 rounded-full p-0.5">×</button>
              </span>
            )}
            {selectedProvince && (
              <span className="inline-flex items-center gap-1 h-6 pl-2.5 pr-1.5 rounded-full bg-taupe-100 text-taupe-700 text-xs">
                {selectedProvince.ProvinceName}
                <button onClick={() => handleProvinceChange("")} className="hover:bg-taupe-200 rounded-full p-0.5">×</button>
              </span>
            )}
            {filters.transactionMethod && (
              <span className="inline-flex items-center gap-1 h-6 pl-2.5 pr-1.5 rounded-full bg-taupe-100 text-taupe-700 text-xs">
                {TRANSACTION_OPTIONS.find((o) => o.value === filters.transactionMethod)?.label}
                <button onClick={() => handleTransactionChange(filters.transactionMethod!)} className="hover:bg-taupe-200 rounded-full p-0.5">×</button>
              </span>
            )}
            {filters.condition && (
              <span className="inline-flex items-center gap-1 h-6 pl-2.5 pr-1.5 rounded-full bg-taupe-100 text-taupe-700 text-xs">
                {CONDITION_OPTIONS.find((c) => c.value === filters.condition)?.label}
                <button onClick={() => handleConditionChange(filters.condition!)} className="hover:bg-taupe-200 rounded-full p-0.5">×</button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center gap-1 h-6 pl-2.5 pr-1.5 rounded-full bg-taupe-100 text-taupe-700 text-xs">
                {activePricePreset?.label ?? `${filters.minPrice ? (filters.minPrice / 1000).toFixed(0) + "k" : "0"}-${filters.maxPrice ? (filters.maxPrice / 1000).toFixed(0) + "k" : "∞"}`}
                <button onClick={() => handlePriceRangeChange(undefined, undefined)} className="hover:bg-taupe-200 rounded-full p-0.5">×</button>
              </span>
            )}
          </div>
        )}

        {/* Expandable */}
        {showFilters && (
          <div className="pb-4 pt-2 border-t border-taupe-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-taupe-500 mb-2">Khoảng giá</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {PRICE_PRESETS.map((preset) => {
                    const isActive = preset.min === filters.minPrice && preset.max === filters.maxPrice;
                    return (
                      <button
                        key={preset.label}
                        onClick={() => handlePriceRangeChange(isActive ? undefined : preset.min, isActive ? undefined : preset.max)}
                        className={cn(
                          "h-8 px-3 rounded-full text-xs font-medium transition-colors",
                          isActive ? "bg-[#1A1714] text-white" : "bg-taupe-50 text-taupe-600 hover:bg-taupe-100"
                        )}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <input
                    type="number"
                    placeholder="Từ (đ)"
                    value={filters.minPrice || ""}
                    onChange={(e) => handlePriceRangeChange(e.target.value ? Number(e.target.value) : undefined, filters.maxPrice)}
                    className="w-full min-w-0 h-8 px-3 rounded-full text-sm bg-taupe-50 border-0 focus:ring-2 focus:ring-taupe-200"
                  />
                  <input
                    type="number"
                    placeholder="Đến (đ)"
                    value={filters.maxPrice || ""}
                    onChange={(e) => handlePriceRangeChange(filters.minPrice, e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full min-w-0 h-8 px-3 rounded-full text-sm bg-taupe-50 border-0 focus:ring-2 focus:ring-taupe-200"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-taupe-500 mb-2">Tình trạng</p>
                <div className="flex flex-wrap gap-2">
                  {CONDITION_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleConditionChange(value)}
                      className={cn(
                        "h-8 px-3 rounded-full text-xs font-medium transition-colors",
                        filters.condition === value ? "bg-[#1A1714] text-white" : "bg-taupe-50 text-taupe-600 hover:bg-taupe-100"
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
