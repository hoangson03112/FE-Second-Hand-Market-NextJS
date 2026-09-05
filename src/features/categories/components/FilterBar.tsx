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
      transactionMethod:
        filters.transactionMethod === value ? undefined : value,
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
    (p) => p.min === filters.minPrice && p.max === filters.maxPrice,
  );

  const selectedProvince = provinces.find(
    (p) => String(p.ProvinceID) === String(filters.provinceId),
  );

  return (
    <div className="sticky top-[60px] z-[45] border-b border-luxury-ink/10 bg-luxury-ivory/90 backdrop-blur-md">
      <div className="mx-auto w-full max-w-9xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto py-4 no-scrollbar">
          {provinces.length > 0 && (
            <div className="relative shrink-0">
              <select
                value={
                  filters.provinceId != null ? String(filters.provinceId) : ""
                }
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="h-10 min-w-[150px] cursor-pointer appearance-none rounded-[2px] border border-luxury-ink/10 bg-white pl-4 pr-9 text-[13px] font-medium text-luxury-ink transition-all hover:border-luxury-ink/30 focus:border-luxury-ink focus:outline-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231a1816'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 14px center",
                  backgroundSize: "14px",
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

          <div className="mx-1 h-6 w-px shrink-0 bg-luxury-ink/10" />

          <div className="flex shrink-0 gap-2">
            {TRANSACTION_OPTIONS.map((opt) => {
              const isActive = filters.transactionMethod === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleTransactionChange(opt.value)}
                  className={cn(
                    "h-10 whitespace-nowrap rounded-[2px] border px-4 text-[13px] font-medium transition-all",
                    isActive
                      ? "border-luxury-ink bg-luxury-ink text-luxury-ivory shadow-[0_10px_22px_rgba(26,24,22,0.12)]"
                      : "border-luxury-ink/10 bg-white text-neutral-600 hover:border-luxury-ink/25 hover:text-luxury-ink",
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="mx-1 h-6 w-px shrink-0 bg-luxury-ink/10" />

          <div className="flex shrink-0 gap-2">
            {SORT_OPTIONS.map((opt) => {
              const isActive = filters.sortBy === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() =>
                    handleSortChange(opt.value as IProductFilters["sortBy"])
                  }
                  className={cn(
                    "h-10 whitespace-nowrap rounded-[2px] border px-4 text-[13px] font-medium transition-all",
                    isActive
                      ? "border-luxury-ink bg-luxury-ink text-luxury-ivory shadow-[0_10px_22px_rgba(26,24,22,0.12)]"
                      : "border-luxury-ink/10 bg-white text-neutral-600 hover:border-luxury-ink/25 hover:text-luxury-ink",
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "ml-2 flex h-10 shrink-0 items-center gap-2 rounded-[2px] border px-4 text-[13px] font-medium transition-all",
              showFilters || activeFilterCount > 0
                ? "border-luxury-ink bg-luxury-ink text-luxury-ivory shadow-[0_10px_22px_rgba(26,24,22,0.12)]"
                : "border-luxury-ink/10 bg-white text-neutral-600 hover:border-luxury-ink/25 hover:text-luxury-ink",
            )}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Bộ lọc
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-[2px] bg-white/20 text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="min-w-4 flex-1" />

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="shrink-0 text-[12px] font-medium text-neutral-500 underline-offset-4 transition-colors hover:text-luxury-ink"
            >
              Xóa bộ lọc
            </button>
          )}

          {totalProducts !== undefined && (
            <span className="ml-3 hidden shrink-0 text-[12px] text-neutral-500 sm:inline-block">
              <span className="font-bold text-luxury-ink">
                {totalProducts.toLocaleString("vi-VN")}
              </span>{" "}
              kết quả
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 pb-4">
            {filters.search && (
              <span className="inline-flex h-7 items-center gap-1.5 rounded-[2px] border border-luxury-ink/10 bg-white pl-3 pr-2 text-[12px] font-medium text-luxury-ink">
                {filters.search}
                <button
                  onClick={() =>
                    onFilterChange({ ...filters, search: undefined, page: 1 })
                  }
                  className="transition-colors hover:text-destructive"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            )}
            {selectedProvince && (
              <span className="inline-flex h-7 items-center gap-1.5 rounded-[2px] border border-luxury-ink/10 bg-white pl-3 pr-2 text-[12px] font-medium text-luxury-ink">
                {selectedProvince.ProvinceName}
                <button
                  onClick={() => handleProvinceChange("")}
                  className="transition-colors hover:text-destructive"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            )}
            {filters.transactionMethod && (
              <span className="inline-flex h-7 items-center gap-1.5 rounded-[2px] border border-luxury-ink/10 bg-white pl-3 pr-2 text-[12px] font-medium text-luxury-ink">
                {
                  TRANSACTION_OPTIONS.find(
                    (o) => o.value === filters.transactionMethod,
                  )?.label
                }
                <button
                  onClick={() =>
                    handleTransactionChange(filters.transactionMethod!)
                  }
                  className="transition-colors hover:text-destructive"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            )}
            {filters.condition && (
              <span className="inline-flex h-7 items-center gap-1.5 rounded-[2px] border border-luxury-ink/10 bg-white pl-3 pr-2 text-[12px] font-medium text-luxury-ink">
                {
                  CONDITION_OPTIONS.find((c) => c.value === filters.condition)
                    ?.label
                }
                <button
                  onClick={() => handleConditionChange(filters.condition!)}
                  className="transition-colors hover:text-destructive"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex h-7 items-center gap-1.5 rounded-[2px] border border-luxury-ink/10 bg-white pl-3 pr-2 text-[12px] font-medium text-luxury-ink">
                {activePricePreset?.label ??
                  `${filters.minPrice ? (filters.minPrice / 1000).toFixed(0) + "k" : "0"}-${filters.maxPrice ? (filters.maxPrice / 1000).toFixed(0) + "k" : "∞"}`}
                <button
                  onClick={() => handlePriceRangeChange(undefined, undefined)}
                  className="transition-colors hover:text-destructive"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}

        {showFilters && (
          <div className="border-t border-luxury-ink/10 pb-6 pt-3">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
              <div>
                <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.2em] text-luxury-ink">
                  Khoảng giá
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {PRICE_PRESETS.map((preset) => {
                    const isActive =
                      preset.min === filters.minPrice &&
                      preset.max === filters.maxPrice;
                    return (
                      <button
                        key={preset.label}
                        onClick={() =>
                          handlePriceRangeChange(
                            isActive ? undefined : preset.min,
                            isActive ? undefined : preset.max,
                          )
                        }
                        className={cn(
                          "h-9 rounded-[2px] border px-4 text-[13px] font-medium transition-all",
                          isActive
                            ? "border-luxury-ink bg-luxury-ink text-luxury-ivory shadow-[0_10px_22px_rgba(26,24,22,0.12)]"
                            : "border-luxury-ink/10 bg-white text-neutral-600 hover:border-luxury-ink/25 hover:text-luxury-ink",
                        )}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                      Từ
                    </span>
                    <input
                      type="number"
                      placeholder="0đ"
                      value={filters.minPrice || ""}
                      onChange={(e) =>
                        handlePriceRangeChange(
                          e.target.value ? Number(e.target.value) : undefined,
                          filters.maxPrice,
                        )
                      }
                      className="h-11 w-full rounded-[2px] border border-luxury-ink/10 bg-white pl-10 pr-4 text-sm text-luxury-ink transition-colors focus:border-luxury-ink focus:outline-none focus:ring-1 focus:ring-luxury-ink"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                      Đến
                    </span>
                    <input
                      type="number"
                      placeholder="∞"
                      value={filters.maxPrice || ""}
                      onChange={(e) =>
                        handlePriceRangeChange(
                          filters.minPrice,
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                      className="h-11 w-full rounded-[2px] border border-luxury-ink/10 bg-white pl-12 pr-4 text-sm text-luxury-ink transition-colors focus:border-luxury-ink focus:outline-none focus:ring-1 focus:ring-luxury-ink"
                    />
                  </div>
                </div>
              </div>
              <div>
                <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.2em] text-luxury-ink">
                  Tình trạng
                </p>
                <div className="flex flex-wrap gap-2">
                  {CONDITION_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleConditionChange(value)}
                      className={cn(
                        "h-9 rounded-[2px] border px-4 text-[13px] font-medium transition-all",
                        filters.condition === value
                          ? "border-luxury-ink bg-luxury-ink text-luxury-ivory shadow-[0_10px_22px_rgba(26,24,22,0.12)]"
                          : "border-luxury-ink/10 bg-white text-neutral-600 hover:border-luxury-ink/25 hover:text-luxury-ink",
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
