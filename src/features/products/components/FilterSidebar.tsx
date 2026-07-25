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
    <div className="bg-white/60 backdrop-blur-md border border-taupe-200/60 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
      <div className="flex items-end justify-between border-b border-taupe-200/50 pb-4">
        <h2 className="text-xl font-bold text-luxury-ink" style={{ fontFamily: "var(--font-droid-serif), serif", letterSpacing: "-0.02em" }}>Bộ lọc</h2>
        {activeFilterCount > 0 && (
          <button onClick={clearAll} className="text-[13px] font-medium text-taupe-400 hover:text-luxury-ink underline underline-offset-4 transition-colors">
            Xóa tất cả
          </button>
        )}
      </div>

      {provinces.length > 0 && (
        <div>
          <p className="text-[12px] font-semibold text-taupe-500 uppercase tracking-widest mb-3">Khu vực</p>
          <div className="relative">
            <select
              value={filters.provinceId != null ? String(filters.provinceId) : ""}
              onChange={(e) =>
                update({ provinceId: e.target.value === "" ? undefined : Number(e.target.value) })
              }
              className="w-full h-11 pl-4 pr-10 rounded-xl text-sm font-medium bg-white border border-taupe-200 text-luxury-ink appearance-none cursor-pointer hover:border-luxury-ink/30 transition-all focus:outline-none focus:ring-1 focus:ring-luxury-ink shadow-sm"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%230b0b0a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
                backgroundSize: "16px"
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
        </div>
      )}

      <div>
        <p className="text-[12px] font-semibold text-taupe-500 uppercase tracking-widest mb-3">Hình thức giao dịch</p>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => update({ transactionMethod: undefined })}
            className={cn(
              "w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all",
              !filters.transactionMethod
                ? "bg-luxury-ink text-background font-medium shadow-md shadow-luxury-ink/10"
                : "text-taupe-600 hover:bg-taupe-100 hover:text-luxury-ink"
            )}
          >
            Tất cả hình thức
          </button>
          {TRANSACTION_OPTIONS.map((opt) => {
            const isActive = filters.transactionMethod === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => update({ transactionMethod: isActive ? undefined : opt.value })}
                className={cn(
                  "w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all",
                  isActive
                    ? "bg-luxury-ink text-background font-medium shadow-md shadow-luxury-ink/10"
                    : "text-taupe-600 hover:bg-taupe-100 hover:text-luxury-ink"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[12px] font-semibold text-taupe-500 uppercase tracking-widest mb-3">Tình trạng sản phẩm</p>
        <div className="flex flex-col gap-1.5">
          {CONDITION_OPTIONS.map((opt) => {
            const isActive = opt.value === filters.condition;
            return (
              <button
                key={opt.value}
                onClick={() => update({ condition: isActive ? undefined : opt.value })}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all",
                  isActive
                    ? "bg-luxury-ink text-background font-medium shadow-md shadow-luxury-ink/10"
                    : "text-taupe-600 hover:bg-taupe-100 hover:text-luxury-ink"
                )}
              >
                {opt.label}
                {isActive && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[12px] font-semibold text-taupe-500 uppercase tracking-widest mb-3">Khoảng giá</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
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
                  "h-10 px-3 rounded-xl text-[13px] font-medium transition-all border",
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
        {(filters.minPrice || filters.maxPrice) && !activePricePreset && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-taupe-100/50 text-luxury-ink text-[13px] font-medium border border-taupe-200 flex justify-between items-center">
            <span>{filters.minPrice ? (filters.minPrice / 1000).toFixed(0) + "k" : "0"} – {filters.maxPrice ? (filters.maxPrice / 1000).toFixed(0) + "k" : "∞"}</span>
            <button onClick={() => update({ minPrice: undefined, maxPrice: undefined })} className="hover:text-destructive transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe-400 text-sm">Từ</span>
            <input
              type="number"
              placeholder="0đ"
              value={filters.minPrice || ""}
              onChange={(e) =>
                update({ minPrice: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full h-11 pl-12 pr-4 rounded-xl text-sm bg-white border border-taupe-200 focus:border-luxury-ink focus:ring-0 transition-colors shadow-sm"
            />
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe-400 text-sm">Đến</span>
            <input
              type="number"
              placeholder="∞"
              value={filters.maxPrice || ""}
              onChange={(e) =>
                update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full h-11 pl-12 pr-4 rounded-xl text-sm bg-white border border-taupe-200 focus:border-luxury-ink focus:ring-0 transition-colors shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
