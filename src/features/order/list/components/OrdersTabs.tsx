"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { OrderTab } from "@/constants/orderStatus";

interface OrdersTabsProps {
  tabs: readonly OrderTab[];
  /** Pre-computed per-tab counts — "Cần xử lý" is not a status, so the list owns this. */
  counts: Record<string, number>;
  activeTab: string;
  onChange: (tab: string) => void;
}

export function OrdersTabs({
  tabs,
  counts,
  activeTab,
  onChange,
}: OrdersTabsProps) {
  const activeRef = useRef<HTMLButtonElement | null>(null);

  // Scroll active tab into view when it changes
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
          aria-label="Trạng thái đơn hàng"
          className="inline-flex min-w-full gap-2 px-4 py-3 sm:px-6"
        >
          {tabs.map((tab) => {
            const count = counts[tab.key] ?? 0;
            const isActive = activeTab === tab.key;
            const isPending = tab.key === "action" && count > 0;

            return (
              <button
                key={tab.key}
                ref={isActive ? activeRef : null}
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(tab.key)}
                className={cn(
                  "relative flex shrink-0 items-center gap-2 rounded-[2px] border px-4 py-2 transition-all duration-300",
                  "focus-visible:border-luxury-champagne focus-visible:outline-none",
                  isActive
                    ? "border-luxury-ink bg-luxury-ink text-luxury-ivory"
                    : isPending
                      ? "border-luxury-champagne bg-cream-100 text-luxury-ink hover:bg-cream-200"
                      : "border-luxury-ink/12 bg-white text-neutral-500 hover:border-luxury-ink/40 hover:text-luxury-ink",
                )}
              >
                <span className="text-2xs font-bold uppercase tracking-[0.15em]">
                  {tab.label}
                </span>

                {count > 0 ? (
                  <span
                    className={cn(
                      "font-droid-serif",
                      "text-sm leading-none tabular-nums transition-colors duration-300",
                      isActive
                        ? "text-luxury-champagne"
                        : isPending
                          ? "text-luxury-ink"
                          : "text-luxury-ink/40",
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
