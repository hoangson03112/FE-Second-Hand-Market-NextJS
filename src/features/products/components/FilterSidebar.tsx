"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { IProductFilters } from "@/types/product";
import type { Province } from "@/types/address";
import { X, Check, ChevronDown, MapPin, Truck } from "lucide-react";

export interface FilterSidebarProps {
  filters: IProductFilters;
  onFilterChange: (updater: (prev: IProductFilters) => IProductFilters) => void;
  provinces?: Province[];
}

const TRANSACTION_OPTIONS = [
  { value: "meeting", label: "Gặp mặt trực tiếp", icon: MapPin },
  { value: "shipping", label: "Giao hàng tận nơi", icon: Truck },
] as const;

const CONDITION_OPTIONS = [
  { value: "new", label: "Mới nguyên bản", badge: "100%" },
  { value: "like_new", label: "Như mới", badge: "99%" },
  { value: "good", label: "Chất lượng tốt", badge: "90%" },
  { value: "fair", label: "Có vết xước", badge: "80%" },
  { value: "poor", label: "Cổ điển / Cũ", badge: "Vintage" },
];

const PRICE_PRESETS = [
  { label: "< 100k", min: undefined, max: 100000 },
  { label: "100 - 500k", min: 100000, max: 500000 },
  { label: "500 - 1Tr", min: 500000, max: 1000000 },
  { label: "> 1 Triệu", min: 1000000, max: undefined },
];

export default function FilterSidebar({
  filters,
  onFilterChange,
  provinces = [],
}: FilterSidebarProps) {
  const [minPrice, setMinPrice] = useState<string>(
    filters.minPrice ? String(filters.minPrice) : "",
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    filters.maxPrice ? String(filters.maxPrice) : "",
  );

  useEffect(() => {
    if (!filters.minPrice) setMinPrice("");
    if (!filters.maxPrice) setMaxPrice("");
  }, [filters.minPrice, filters.maxPrice]);

  const update = (partial: Partial<IProductFilters>) =>
    onFilterChange((prev) => ({ ...prev, ...partial, page: 1 }));

  const activeFilterCount = [
    filters.minPrice || filters.maxPrice,
    filters.condition,
    filters.transactionMethod,
    filters.provinceId != null,
  ].filter(Boolean).length;

  const clearAll = () => {
    setMinPrice("");
    setMaxPrice("");
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
  };

  const handlePriceApply = () => {
    const min = minPrice ? Number(minPrice) : undefined;
    const max = maxPrice ? Number(maxPrice) : undefined;
    update({ minPrice: min, maxPrice: max });
  };

  return (
    <div className="w-full pr-4 text-zinc-900 bg-transparent font-sans">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200/60 mb-6">
        <h2 className="text-[13px] font-bold uppercase tracking-widest text-zinc-900">
          Bộ Lọc
        </h2>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center text-[11px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Xóa bộ lọc ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* ── KHU VỰC ── */}
        {provinces.length > 0 && (
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">
              Khu vực
            </h3>
            <div className="relative group">
              <select
                value={filters.provinceId != null ? String(filters.provinceId) : ""}
                onChange={(e) =>
                  update({
                    provinceId: e.target.value === "" ? undefined : Number(e.target.value),
                  })
                }
                className="w-full bg-white/50 border border-zinc-200 rounded-xl py-2.5 pl-4 pr-10 text-[13px] font-medium text-zinc-800 appearance-none cursor-pointer outline-none transition-all hover:border-zinc-300 focus:border-zinc-900 focus:bg-white"
              >
                <option value="">Toàn quốc</option>
                {provinces.map((p) => (
                  <option key={p.ProvinceID} value={p.ProvinceID}>
                    {p.ProvinceName}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 group-hover:text-zinc-600 transition-colors">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}

        {/* ── HÌNH THỨC GIAO DỊCH (CARD STYLE) ── */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">
            Hình thức nhận hàng
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {TRANSACTION_OPTIONS.map((opt) => {
              const isActive = filters.transactionMethod === opt.value;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() =>
                    update({ transactionMethod: isActive ? undefined : opt.value })
                  }
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300",
                    isActive
                      ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
                      : "border-zinc-200 bg-white/50 text-zinc-500 hover:border-zinc-300 hover:bg-white hover:text-zinc-900"
                  )}
                >
                  <Icon className={cn("w-5 h-5 mb-2", isActive ? "text-white" : "text-zinc-400")} strokeWidth={1.5} />
                  <span className="text-[11px] font-medium text-center">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── TÌNH TRẠNG (MINIMAL CHECKBOX) ── */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">
            Tình trạng sản phẩm
          </h3>
          <div className="space-y-1.5">
            {CONDITION_OPTIONS.map((opt) => {
              const isActive = opt.value === filters.condition;
              return (
                <button
                  key={opt.value}
                  onClick={() =>
                    update({ condition: isActive ? undefined : opt.value })
                  }
                  className="group w-full flex items-center justify-between p-2 -mx-2 rounded-lg transition-colors hover:bg-zinc-100/50"
                >
                  <div className="flex items-center gap-3">
                    {/* Ô Checkbox custom tinh tế */}
                    <div
                      className={cn(
                        "w-4 h-4 rounded-[5px] border flex items-center justify-center transition-all duration-200",
                        isActive
                          ? "bg-zinc-900 border-zinc-900"
                          : "bg-white border-zinc-300 group-hover:border-zinc-400"
                      )}
                    >
                      {isActive && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                    <span className={cn(
                      "text-[13px] transition-colors",
                      isActive ? "text-zinc-900 font-medium" : "text-zinc-600"
                    )}>
                      {opt.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-zinc-400">
                    {opt.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── MỨC GIÁ (UNIFIED INPUT) ── */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">
            Khoảng giá
          </h3>
          
          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2 mb-3">
            {PRICE_PRESETS.map((preset) => {
              const isActive = preset.min === filters.minPrice && preset.max === filters.maxPrice;
              return (
                <button
                  key={preset.label}
                  onClick={() => {
                    setMinPrice(preset.min ? String(preset.min) : "");
                    setMaxPrice(preset.max ? String(preset.max) : "");
                    update({
                      minPrice: isActive ? undefined : preset.min,
                      maxPrice: isActive ? undefined : preset.max,
                    });
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-300 border",
                    isActive
                      ? "bg-zinc-900 border-zinc-900 text-white"
                      : "bg-white/50 border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Ô Input gộp chung hiện đại */}
          <div className="flex items-center bg-white/50 border border-zinc-200 rounded-xl overflow-hidden focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900 transition-all">
            <input
              type="number"
              placeholder="Thấp nhất"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={handlePriceApply}
              onKeyDown={(e) => e.key === "Enter" && handlePriceApply()}
              className="w-full bg-transparent py-2.5 px-3 text-[13px] font-medium text-zinc-900 placeholder:text-zinc-400 outline-none text-center"
            />
            <div className="w-[1px] h-4 bg-zinc-200 shrink-0" />
            <input
              type="number"
              placeholder="Cao nhất"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={handlePriceApply}
              onKeyDown={(e) => e.key === "Enter" && handlePriceApply()}
              className="w-full bg-transparent py-2.5 px-3 text-[13px] font-medium text-zinc-900 placeholder:text-zinc-400 outline-none text-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}