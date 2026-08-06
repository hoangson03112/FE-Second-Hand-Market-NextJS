"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { IProductFilters } from "@/types/product";
import type { Province } from "@/types/address";
import {
  IconX,
  IconCheck,
  IconChevronDown,
  IconMapPin,
  IconTruck,
  IconAdjustmentsHorizontal,
} from "@tabler/icons-react";

export interface FilterSidebarProps {
  filters: IProductFilters;
  onFilterChange: (updater: (prev: IProductFilters) => IProductFilters) => void;
  provinces?: Province[];
}

const TRANSACTION_OPTIONS = [
  { value: "meeting", label: "Gặp mặt trực tiếp", icon: IconMapPin },
  { value: "shipping", label: "Giao hàng tận nơi", icon: IconTruck },
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

/* ── Accordion section, đồng bộ eyebrow style của SectionHeader ── */
function FilterGroup({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-luxury-ink/6 pt-5 first:border-t-0 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
          {title}
        </span>
        <IconChevronDown
          className={cn(
            "h-3.5 w-3.5 text-taupe-400 transition-transform duration-300",
            open ? "rotate-180" : "rotate-0",
          )}
          strokeWidth={1.75}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

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

  const provinceName = provinces.find(
    (p) => String(p.ProvinceID) === String(filters.provinceId),
  )?.ProvinceName;

  const conditionLabel = CONDITION_OPTIONS.find(
    (c) => c.value === filters.condition,
  )?.label;

  const transactionLabel = TRANSACTION_OPTIONS.find(
    (t) => t.value === filters.transactionMethod,
  )?.label;

  /* Chip tóm tắt filter đang active — cải thiện UX: user thấy & bỏ nhanh từng filter */
  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (provinceName) {
    activeChips.push({
      label: provinceName,
      onRemove: () => update({ provinceId: undefined }),
    });
  }
  if (transactionLabel) {
    activeChips.push({
      label: transactionLabel,
      onRemove: () => update({ transactionMethod: undefined }),
    });
  }
  if (conditionLabel) {
    activeChips.push({
      label: conditionLabel,
      onRemove: () => update({ condition: undefined }),
    });
  }
  if (filters.minPrice || filters.maxPrice) {
    activeChips.push({
      label: `${filters.minPrice ? `${(filters.minPrice / 1000).toLocaleString()}k` : "0"} - ${
        filters.maxPrice ? `${(filters.maxPrice / 1000).toLocaleString()}k` : "∞"
      }`,
      onRemove: () => {
        setMinPrice("");
        setMaxPrice("");
        update({ minPrice: undefined, maxPrice: undefined });
      },
    });
  }

  return (
    <div className="w-full bg-white/40 font-sans text-luxury-ink">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between border-b border-luxury-ink/6 pb-4">
        <div className="flex items-center gap-2.5">
          <IconAdjustmentsHorizontal className="h-4 w-4 text-luxury-champagne" strokeWidth={1.75} />
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-luxury-ink">
            Bộ lọc
          </h2>
          {activeFilterCount > 0 && (
            <span
              className="flex h-4 min-w-4 items-center justify-center bg-luxury-champagne px-1 text-[10px] font-bold text-luxury-ink"
              style={{ borderRadius: "2px" }}
            >
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="text-[10px] font-semibold uppercase tracking-[0.14em] text-taupe-400 transition-colors hover:text-accent"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {/* ── CHIP TÓM TẮT FILTER ĐANG ÁP DỤNG ── */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-b border-luxury-ink/6 py-4">
          {activeChips.map((chip) => (
            <button
              key={chip.label}
              onClick={chip.onRemove}
              className="group inline-flex items-center gap-1.5 border border-luxury-ink/15 bg-cream-50 py-1 pl-2.5 pr-1.5 text-[10px] font-medium text-luxury-ink transition-colors hover:border-luxury-champagne"
              style={{ borderRadius: "2px" }}
            >
              {chip.label}
              <IconX className="h-3 w-3 text-taupe-400 transition-colors group-hover:text-luxury-ink" strokeWidth={2} />
            </button>
          ))}
        </div>
      )}

      <div className="space-y-5 pt-5">
        {/* ── KHU VỰC ── */}
        {provinces.length > 0 && (
          <FilterGroup title="Khu vực">
            <div className="relative group">
              <select
                value={filters.provinceId != null ? String(filters.provinceId) : ""}
                onChange={(e) =>
                  update({
                    provinceId: e.target.value === "" ? undefined : Number(e.target.value),
                  })
                }
                className="w-full appearance-none border border-luxury-ink/15 bg-white/60 py-2.5 pl-4 pr-10 text-[13px] font-medium text-luxury-ink outline-none transition-colors duration-300 hover:border-luxury-ink/25 focus:border-luxury-champagne focus:bg-white"
                style={{ borderRadius: "2px" }}
              >
                <option value="">Toàn quốc</option>
                {provinces.map((p) => (
                  <option key={p.ProvinceID} value={p.ProvinceID}>
                    {p.ProvinceName}
                  </option>
                ))}
              </select>
              <IconChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-taupe-400 transition-colors group-hover:text-luxury-ink" strokeWidth={1.75} />
            </div>
          </FilterGroup>
        )}

        {/* ── HÌNH THỨC GIAO DỊCH ── */}
        <FilterGroup title="Hình thức nhận hàng">
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
                    "flex flex-col items-center justify-center gap-2 border p-3.5 transition-all duration-300",
                    isActive
                      ? "border-luxury-ink bg-luxury-ink text-cream-50"
                      : "border-luxury-ink/15 bg-white/50 text-neutral-600 hover:border-luxury-champagne/60 hover:bg-cream-50",
                  )}
                  style={{ borderRadius: "2px" }}
                >
                  <Icon
                    className={cn("h-[18px] w-[18px]", isActive ? "text-luxury-champagne" : "text-taupe-400")}
                    strokeWidth={1.5}
                  />
                  <span className="text-center text-[11px] font-medium leading-tight">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </FilterGroup>

        {/* ── TÌNH TRẠNG ── */}
        <FilterGroup title="Tình trạng sản phẩm">
          <div className="space-y-1">
            {CONDITION_OPTIONS.map((opt) => {
              const isActive = opt.value === filters.condition;
              return (
                <button
                  key={opt.value}
                  onClick={() =>
                    update({ condition: isActive ? undefined : opt.value })
                  }
                  className="group -mx-2 flex w-full items-center justify-between p-2 transition-colors hover:bg-cream-50"
                  style={{ borderRadius: "2px" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center border transition-all duration-200",
                        isActive
                          ? "border-luxury-ink bg-luxury-ink"
                          : "border-luxury-ink/25 bg-white group-hover:border-luxury-ink/50",
                      )}
                      style={{ borderRadius: "2px" }}
                    >
                      {isActive && <IconCheck className="h-3 w-3 text-luxury-champagne" strokeWidth={3} />}
                    </div>
                    <span
                      className={cn(
                        "text-[13px] transition-colors",
                        isActive ? "font-medium text-luxury-ink" : "text-neutral-600",
                      )}
                    >
                      {opt.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-taupe-400">
                    {opt.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </FilterGroup>

        {/* ── MỨC GIÁ ── */}
        <FilterGroup title="Khoảng giá">
          <div className="mb-3 flex flex-wrap gap-2">
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
                    "rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition-all duration-300",
                    isActive
                      ? "border-luxury-ink bg-luxury-ink text-cream-50"
                      : "border-luxury-ink/15 bg-white/50 text-neutral-600 hover:border-luxury-ink/30 hover:text-luxury-ink",
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <div
            className="flex items-center overflow-hidden border border-luxury-ink/15 bg-white/60 transition-colors duration-300 focus-within:border-luxury-champagne"
            style={{ borderRadius: "2px" }}
          >
            <input
              type="number"
              placeholder="Thấp nhất"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={handlePriceApply}
              onKeyDown={(e) => e.key === "Enter" && handlePriceApply()}
              className="w-full bg-transparent px-3 py-2.5 text-center text-[13px] font-medium text-luxury-ink outline-none placeholder:text-taupe-400/80"
            />
            <div className="h-4 w-px shrink-0 bg-luxury-ink/15" />
            <input
              type="number"
              placeholder="Cao nhất"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={handlePriceApply}
              onKeyDown={(e) => e.key === "Enter" && handlePriceApply()}
              className="w-full bg-transparent px-3 py-2.5 text-center text-[13px] font-medium text-luxury-ink outline-none placeholder:text-taupe-400/80"
            />
          </div>
        </FilterGroup>
      </div>
    </div>
  );
}