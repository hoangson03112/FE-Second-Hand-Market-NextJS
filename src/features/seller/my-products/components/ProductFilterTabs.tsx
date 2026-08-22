"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { MyListingTabKey } from "@/types/myProducts";

const FILTERS: { value: MyListingTabKey; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "under_review", label: "Đang xem xét" },
  { value: "rejected", label: "Từ chối" },
  { value: "sold", label: "Đã bán" },
];

interface ProductFilterTabsProps {
  stats: Record<MyListingTabKey, number>;
  activeFilter: MyListingTabKey;
  onFilterChange: (filter: MyListingTabKey) => void;
}

/**
 * The same hairline chip strip as the order screens — one navigation language
 * across every seller surface, with the count set in serif.
 */
export function ProductFilterTabs({
  stats,
  activeFilter,
  onFilterChange,
}: ProductFilterTabsProps) {
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeFilter]);

  return (
    <div className="border-t border-luxury-ink/6">
      <div className="mx-auto w-full max-w-9xl overflow-x-auto scrollbar-hide">
        <div
          role="tablist"
          aria-label="Lọc sản phẩm theo trạng thái"
          className="inline-flex min-w-full gap-2 px-4 py-3 sm:px-6"
        >
          {FILTERS.map(({ value, label }) => {
            const count = stats[value] ?? 0;
            const isActive = activeFilter === value;

            return (
              <button
                key={value}
                ref={isActive ? activeRef : null}
                role="tab"
                aria-selected={isActive}
                onClick={() => onFilterChange(value)}
                className={cn(
                  "relative flex shrink-0 items-center gap-2 rounded-[2px] border px-4 py-2 transition-all duration-300",
                  "focus-visible:border-luxury-champagne focus-visible:outline-none",
                  isActive
                    ? "border-luxury-ink bg-luxury-ink text-luxury-ivory"
                    : "border-luxury-ink/12 bg-white text-neutral-500 hover:border-luxury-ink/40 hover:text-luxury-ink",
                )}
              >
                <span className="text-2xs font-medium uppercase tracking-[0.12em]">
                  {label}
                </span>

                {count > 0 ? (
                  <span
                    className={cn(
                      "font-droid-serif",
                      "text-[13px] leading-none tabular-nums transition-colors duration-300",
                      isActive ? "text-luxury-champagne" : "text-luxury-ink/40",
                    )}
                  >
                    {count}
                  </span>
                ) : null}
              </button>
            );
          })}
          {/* Trailing spacer — ensures the last chip is never clipped */}
          <div className="w-2 shrink-0" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
