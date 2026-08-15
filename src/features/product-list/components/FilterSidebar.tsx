"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  /** Optional: hiển thị số kết quả trực tiếp trong sidebar để phản hồi UX ngay lập tức */
  resultCount?: number;
}

const TRANSACTION_OPTIONS = [
  { value: "meeting", label: "Gặp mặt trực tiếp", icon: IconMapPin },
  { value: "shipping", label: "Giao hàng tận nơi", icon: IconTruck },
] as const;

const CONDITION_OPTIONS = [
  { value: "new", label: "Mới nguyên bản", percent: 100 },
  { value: "like_new", label: "Như mới", percent: 99 },
  { value: "good", label: "Chất lượng tốt", percent: 90 },
  { value: "fair", label: "Có vết xước", percent: 80 },
  { value: "poor", label: "Cổ điển / Cũ", percent: 60 },
];

const PRICE_PRESETS = [
  { label: "< 100k", min: undefined, max: 100000 },
  { label: "100 - 500k", min: 100000, max: 500000 },
  { label: "500 - 1Tr", min: 500000, max: 1000000 },
  { label: "> 1 Triệu", min: 1000000, max: undefined },
];

const PRICE_SLIDER_MAX = 5000000;
const PRICE_SLIDER_STEP = 10000;

function formatCompactVnd(value: number) {
  if (value >= 1000000) {
    const millions = value / 1000000;
    return `${millions % 1 === 0 ? millions : millions.toFixed(1)}tr`;
  }
  if (value >= 1000) return `${Math.round(value / 1000)}k`;
  return `${value}đ`;
}

/* ── Numbered accordion section — motif "01, 02, 03" lấy từ PhilosophySection ── */
function FilterGroup({
  index,
  title,
  children,
  defaultOpen = true,
}: {
  index: number;
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
        className="group flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <span
            className="font-ny text-[13px] italic text-luxury-champagne/90 transition-colors"
            aria-hidden
          >
            {String(index).padStart(2, "0")}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-600 transition-colors group-hover:text-luxury-ink">
            {title}
          </span>
        </div>
        <IconChevronDown
          className={cn(
            "h-3.5 w-3.5 text-taupe-400 transition-transform duration-300 ease-out",
            open ? "rotate-180" : "rotate-0",
          )}
          strokeWidth={1.75}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          open
            ? "mt-4 grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

/* ── Dual-range price slider — kéo trực tiếp thay vì gõ số mù mờ ── */
function PriceRangeSlider({
  min,
  max,
  onCommit,
}: {
  min: number;
  max: number;
  onCommit: (min: number, max: number) => void;
}) {
  const [localMin, setLocalMin] = useState(min);
  const [localMax, setLocalMax] = useState(max);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => setLocalMin(min), [min]);
  useEffect(() => setLocalMax(max), [max]);

  const minPct = (localMin / PRICE_SLIDER_MAX) * 100;
  const maxPct = (localMax / PRICE_SLIDER_MAX) * 100;

  const handleMinChange = (value: number) => {
    const clamped = Math.min(value, localMax - PRICE_SLIDER_STEP);
    setLocalMin(Math.max(0, clamped));
  };

  const handleMaxChange = (value: number) => {
    const clamped = Math.max(value, localMin + PRICE_SLIDER_STEP);
    setLocalMax(Math.min(PRICE_SLIDER_MAX, clamped));
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-[13px] font-medium text-luxury-ink">
        <span
          className="border border-luxury-ink/12 bg-cream-50 px-2.5 py-1 text-[12px]"
          style={{ borderRadius: "2px" }}
        >
          {formatCompactVnd(localMin)}
        </span>
        <span className="h-px w-3 bg-taupe-400/60" aria-hidden />
        <span
          className="border border-luxury-ink/12 bg-cream-50 px-2.5 py-1 text-[12px]"
          style={{ borderRadius: "2px" }}
        >
          {localMax >= PRICE_SLIDER_MAX
            ? `${formatCompactVnd(PRICE_SLIDER_MAX)}+`
            : formatCompactVnd(localMax)}
        </span>
      </div>

      <div ref={trackRef} className="relative h-4">
        <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-luxury-ink/10" />
        <div
          className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-luxury-champagne"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />

        <input
          type="range"
          min={0}
          max={PRICE_SLIDER_MAX}
          step={PRICE_SLIDER_STEP}
          value={localMin}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          onMouseUp={() => onCommit(localMin, localMax)}
          onTouchEnd={() => onCommit(localMin, localMax)}
          className="range-thumb pointer-events-none absolute inset-0 w-full appearance-none bg-transparent"
          style={{ zIndex: minPct > 90 ? 5 : 3 }}
          aria-label="Giá thấp nhất"
        />
        <input
          type="range"
          min={0}
          max={PRICE_SLIDER_MAX}
          step={PRICE_SLIDER_STEP}
          value={localMax}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          onMouseUp={() => onCommit(localMin, localMax)}
          onTouchEnd={() => onCommit(localMin, localMax)}
          className="range-thumb pointer-events-none absolute inset-0 w-full appearance-none bg-transparent"
          style={{ zIndex: 4 }}
          aria-label="Giá cao nhất"
        />
      </div>

      <style jsx>{`
        .range-thumb::-webkit-slider-thumb {
          pointer-events: auto;
          appearance: none;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid var(--luxury-ink);
          cursor: pointer;
          margin-top: 0px;
          transition:
            border-color 0.2s ease,
            transform 0.2s ease;
        }
        .range-thumb::-webkit-slider-thumb:hover {
          border-color: var(--luxury-champagne);
          transform: scale(1.15);
        }
        .range-thumb::-moz-range-thumb {
          pointer-events: auto;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid var(--luxury-ink);
          cursor: pointer;
        }
        .range-thumb::-webkit-slider-runnable-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  provinces = [],
  resultCount,
}: FilterSidebarProps) {
  const update = useCallback(
    (partial: Partial<IProductFilters>) =>
      onFilterChange((prev) => ({ ...prev, ...partial, page: 1 })),
    [onFilterChange],
  );

  const activeFilterCount = [
    filters.minPrice || filters.maxPrice,
    filters.condition,
    filters.transactionMethod,
    filters.provinceId != null,
  ].filter(Boolean).length;

  const clearAll = () => {
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

  const provinceName = provinces.find(
    (p) => String(p.ProvinceID) === String(filters.provinceId),
  )?.ProvinceName;

  const conditionLabel = CONDITION_OPTIONS.find(
    (c) => c.value === filters.condition,
  )?.label;
  const transactionLabel = TRANSACTION_OPTIONS.find(
    (t) => t.value === filters.transactionMethod,
  )?.label;

  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (provinceName)
    activeChips.push({
      label: provinceName,
      onRemove: () => update({ provinceId: undefined }),
    });
  if (transactionLabel)
    activeChips.push({
      label: transactionLabel,
      onRemove: () => update({ transactionMethod: undefined }),
    });
  if (conditionLabel)
    activeChips.push({
      label: conditionLabel,
      onRemove: () => update({ condition: undefined }),
    });
  if (filters.minPrice || filters.maxPrice) {
    activeChips.push({
      label: `${filters.minPrice ? formatCompactVnd(filters.minPrice) : "0đ"} - ${
        filters.maxPrice ? formatCompactVnd(filters.maxPrice) : "∞"
      }`,
      onRemove: () => update({ minPrice: undefined, maxPrice: undefined }),
    });
  }

  return (
    <div className="w-full text-luxury-ink pb-5 ">
      <div className="flex items-center justify-between border-b border-luxury-ink/6 pb-4">
        <div className="flex items-center gap-2.5">
          <IconAdjustmentsHorizontal
            className="h-4 w-4 text-luxury-champagne"
            strokeWidth={1.75}
          />
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-luxury-ink">
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
            className="group inline-flex items-center gap-1 text-2xs font-bold uppercase tracking-[0.14em] text-charcoal-700 transition-colors hover:text-taupe-700"
          >
            Xóa tất cả
            <IconX
              className="h-3 w-3 transition-transform group-hover:rotate-90"
              strokeWidth={2}
            />
          </button>
        )}
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-b border-luxury-ink/6 py-4">
          {activeChips.map((chip, i) => (
            <button
              key={chip.label}
              onClick={chip.onRemove}
              className="group inline-flex animate-[fadeInUp_0.35s_ease-out_backwards] items-center gap-1.5 border border-luxury-ink/15 bg-cream-50 py-1 pl-2.5 pr-1.5 text-[10px] font-medium text-luxury-ink transition-all duration-300 hover:border-luxury-champagne hover:bg-white"
              style={{ borderRadius: "2px", animationDelay: `${i * 60}ms` }}
            >
              {chip.label}
              <IconX
                className="h-3 w-3 text-red-700 transition-colors"
                strokeWidth={2}
              />
            </button>
          ))}
        </div>
      )}

      {typeof resultCount === "number" && (
        <p className="border-b border-luxury-ink/6 py-3 text-[11px] text-neutral-500">
          <span className="font-bold text-luxury-ink">
            {resultCount.toLocaleString("vi-VN")}
          </span>{" "}
          sản phẩm phù hợp
        </p>
      )}

      <div className="space-y-5 pt-5">
        {provinces.length > 0 && (
          <FilterGroup index={1} title="Khu vực">
            <div className="relative group">
              <select
                value={
                  filters.provinceId != null ? String(filters.provinceId) : ""
                }
                onChange={(e) =>
                  update({
                    provinceId:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
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
              <IconChevronDown
                className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-taupe-400 transition-colors group-hover:text-luxury-ink"
                strokeWidth={1.75}
              />
            </div>
          </FilterGroup>
        )}

        {/* ── HÌNH THỨC GIAO DỊCH ── */}
        <FilterGroup
          index={provinces.length > 0 ? 2 : 1}
          title="Hình thức nhận hàng"
        >
          <div className="grid grid-cols-2 gap-2">
            {TRANSACTION_OPTIONS.map((opt) => {
              const isActive = filters.transactionMethod === opt.value;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() =>
                    update({
                      transactionMethod: isActive ? undefined : opt.value,
                    })
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
                    className={cn(
                      "h-[18px] w-[18px]",
                      isActive ? "text-luxury-champagne" : "text-red-700",
                    )}
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

        {/* ── TÌNH TRẠNG — thước đo chất lượng dạng vạch ── */}
        <FilterGroup
          index={provinces.length > 0 ? 3 : 2}
          title="Tình trạng sản phẩm"
        >
          <div className="space-y-1">
            {CONDITION_OPTIONS.map((opt) => {
              const isActive = opt.value === filters.condition;
              return (
                <button
                  key={opt.value}
                  onClick={() =>
                    update({ condition: isActive ? undefined : opt.value })
                  }
                  className="group -mx-2 flex w-full items-center gap-3 p-2 transition-colors hover:bg-cream-50"
                  style={{ borderRadius: "2px" }}
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center border transition-all duration-200",
                      isActive
                        ? "border-luxury-ink bg-luxury-ink"
                        : "border-luxury-ink/25 bg-white group-hover:border-luxury-ink/50",
                    )}
                    style={{ borderRadius: "2px" }}
                  >
                    {isActive && (
                      <IconCheck
                        className="h-3 w-3 text-luxury-champagne"
                        strokeWidth={3}
                      />
                    )}
                  </div>

                  <span
                    className={cn(
                      "flex-1 text-left text-[13px] transition-colors",
                      isActive
                        ? "font-medium text-luxury-ink"
                        : "text-neutral-600",
                    )}
                  >
                    {opt.label}
                  </span>

                  {/* Vạch chất lượng — 5 vạch, tô theo % */}
                  <div className="flex items-center gap-[3px]" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-2.5 w-[3px] transition-colors duration-300",
                          i < Math.round((opt.percent / 100) * 5)
                            ? isActive
                              ? "bg-luxury-champagne"
                              : "bg-luxury-ink/70"
                            : "bg-luxury-ink/10",
                        )}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </FilterGroup>

        {/* ── MỨC GIÁ — preset + dual-range slider ── */}
        <FilterGroup index={provinces.length > 0 ? 4 : 3} title="Khoảng giá">
          <div className="mb-5 flex flex-wrap gap-2">
            {PRICE_PRESETS.map((preset) => {
              const isActive =
                preset.min === filters.minPrice &&
                preset.max === filters.maxPrice;
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

          <PriceRangeSlider
            min={filters.minPrice ?? 0}
            max={filters.maxPrice ?? PRICE_SLIDER_MAX}
            onCommit={(min, max) =>
              update({
                minPrice: min > 0 ? min : undefined,
                maxPrice: max < PRICE_SLIDER_MAX ? max : undefined,
              })
            }
          />
        </FilterGroup>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
