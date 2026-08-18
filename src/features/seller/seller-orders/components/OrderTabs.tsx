"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const SELLER_TABS = [
  { key: "all", label: "Tất cả đơn" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "processing", label: "Đang xử lý" },
  { key: "shipped", label: "Đang giao" },
  { key: "delivered", label: "Đã giao" },
  { key: "refund", label: "Hoàn tiền" },
  { key: "cancelled", label: "Đã hủy" },
] as const;

interface OrderTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabCounts: Record<string, number>;
}

/**
 * Hairline 2px chips with a serif count — the same tab language as the buyer
 * order list, so both sides of a transaction are navigated the same way.
 */
export default function OrderTabs({
  activeTab,
  onTabChange,
  tabCounts,
}: OrderTabsProps) {
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeTab]);

  return (
    <div className="border-t border-luxury-ink/6">
      <div className="mx-auto w-full max-w-9xl overflow-x-auto scrollbar-hide">
        <div
          role="tablist"
          aria-label="Lọc đơn hàng theo trạng thái"
          className="inline-flex min-w-full gap-2 px-4 py-3 sm:px-6"
        >
          {SELLER_TABS.map(({ key, label }) => {
            const count = tabCounts[key] ?? 0;
            const isActive = activeTab === key;

            return (
              <button
                key={key}
                ref={isActive ? activeRef : null}
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange(key)}
                className={cn(
                  "relative flex shrink-0 items-center gap-2 rounded-[2px] border px-4 py-2 transition-all duration-300",
                  "focus-visible:border-luxury-champagne focus-visible:outline-none",
                  isActive
                    ? "border-luxury-ink bg-luxury-ink text-luxury-ivory"
                    : "border-luxury-ink/12 bg-white text-neutral-500 hover:border-luxury-ink/40 hover:text-luxury-ink",
                )}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
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
          {/* Trailing spacer — ensures the last tab is never clipped */}
          <div className="w-2 shrink-0" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
