"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { IProductFilters } from "@/types/product";
import type { Province } from "@/types/address";

export interface FilterSidebarProps {
  filters: IProductFilters;
  onFilterChange: (updater: (prev: IProductFilters) => IProductFilters) => void;
  provinces?: Province[];
}

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

export default function FilterSidebar({
  filters,
  onFilterChange,
  provinces = [],
}: FilterSidebarProps) {
  const update = (partial: Partial<IProductFilters>) =>
    onFilterChange((prev) => ({ ...prev, ...partial, page: 1 }));

  const activeFilterCount = [
    filters.minPrice || filters.maxPrice,
    filters.condition,
    filters.transactionMethod,
    filters.provinceId != null,
  ].filter(Boolean).length;

  const activePricePreset = PRICE_PRESETS.find(
    (p) => p.min === filters.minPrice && p.max === filters.maxPrice
  );

  const clearAll = () =>
    onFilterChange((prev) => ({
      sortBy: prev.sortBy,
      limit: prev.limit,
      search: prev.search,
      transactionMethod: undefined,
      provinceId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      condition: undefined,
      page: 1,
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-taupe-800">Bộ lọc</span>
        {activeFilterCount > 0 && (
          <button onClick={clearAll} className="text-xs text-taupe-500 hover:text-taupe-800">
            Xóa tất cả
          </button>
        )}
      </div>

      {provinces.length > 0 && (
        <div>
          <p className="text-xs font-medium text-taupe-500 mb-2">Tỉnh thành</p>
          <select
            value={filters.provinceId != null ? String(filters.provinceId) : ""}
            onChange={(e) =>
              update({ provinceId: e.target.value === "" ? undefined : Number(e.target.value) })
            }
            className="w-full h-9 pl-3 pr-8 rounded-full text-sm bg-taupe-50 text-taupe-700 border-0 appearance-none cursor-pointer"
          >
            <option value="">Tất cả</option>
            {provinces.map((p) => (
              <option key={p.ProvinceID} value={p.ProvinceID}>
                {p.ProvinceName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <p className="text-xs font-medium text-taupe-500 mb-2">Giao dịch</p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => update({ transactionMethod: undefined })}
            className={cn(
              "w-full text-left px-3 py-2 rounded-full text-sm transition-colors",
              !filters.transactionMethod ? "bg-[#1A1714] text-white font-medium" : "text-taupe-600 hover:bg-taupe-50"
            )}
          >
            Tất cả
          </button>
          {TRANSACTION_OPTIONS.map((opt) => {
            const isActive = filters.transactionMethod === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => update({ transactionMethod: isActive ? undefined : opt.value })}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-full text-sm transition-colors",
                  isActive ? "bg-[#1A1714] text-white font-medium" : "text-taupe-600 hover:bg-taupe-50"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-taupe-500 mb-2">Tình trạng</p>
        <div className="flex flex-col gap-1">
          {CONDITION_OPTIONS.map((opt) => {
            const isActive = opt.value === filters.condition;
            return (
              <button
                key={opt.value}
                onClick={() => update({ condition: isActive ? undefined : opt.value })}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-full text-sm transition-colors",
                  isActive ? "bg-[#1A1714] text-white font-medium" : "text-taupe-600 hover:bg-taupe-50"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-taupe-500 mb-2">Khoảng giá</p>
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          {PRICE_PRESETS.map((preset) => {
            const isActive =
              preset.min === filters.minPrice && preset.max === filters.maxPrice;
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
                  "h-8 px-2 rounded-full text-xs font-medium transition-colors",
                  isActive ? "bg-[#1A1714] text-white" : "bg-taupe-50 text-taupe-600 hover:bg-taupe-100"
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        {(filters.minPrice || filters.maxPrice) && !activePricePreset && (
          <div className="mb-2 px-3 py-2 rounded-full bg-taupe-100 text-taupe-700 text-xs flex justify-between items-center">
            {filters.minPrice ? (filters.minPrice / 1000).toFixed(0) + "k" : "0"} –{" "}
            {filters.maxPrice ? (filters.maxPrice / 1000).toFixed(0) + "k" : "∞"}
            <button onClick={() => update({ minPrice: undefined, maxPrice: undefined })}>×</button>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Từ"
            value={filters.minPrice || ""}
            onChange={(e) =>
              update({ minPrice: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full min-w-0 h-8 px-3 rounded-full text-sm bg-taupe-50 border-0 focus:ring-2 focus:ring-taupe-200"
          />
          <input
            type="number"
            placeholder="Đến"
            value={filters.maxPrice || ""}
            onChange={(e) =>
              update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full min-w-0 h-8 px-3 rounded-full text-sm bg-taupe-50 border-0 focus:ring-2 focus:ring-taupe-200"
          />
        </div>
      </div>
    </div>
  );
}
