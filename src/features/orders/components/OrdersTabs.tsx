"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/order";

interface OrderTab {
  key: string;
  label: string;
}

interface OrdersTabsProps {
  tabs: readonly OrderTab[];
  orders: Order[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export function OrdersTabs({
  tabs,
  orders,
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
    <div className="sticky top-[73px] z-10 bg-cream-50/95 backdrop-blur-sm border-b-2 border-border">
      <div className="max-w-9xl mx-auto overflow-x-auto scrollbar-hide">
        <div
          role="tablist"
          aria-label="Trạng thái đơn hàng"
          className="inline-flex min-w-full gap-2 px-4 sm:px-6 py-3"
        >
          {tabs.map((tab) => {
            const count =
              tab.key === "all"
                ? orders.length
                : orders.filter((o) => o.status === tab.key).length;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                ref={isActive ? activeRef : null}
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(tab.key)}
                className={cn(
                  "relative flex shrink-0 items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                  isActive
                    ? "bg-primary border-primary text-primary-foreground shadow-sm"
                    : "border-border bg-white text-taupe-600 hover:border-primary/40 hover:text-taupe-900",
                )}
              >
                <span className="text-xs font-semibold uppercase tracking-wide">
                  {tab.label}
                </span>

                {count > 0 && (
                  <span
                    className={cn(
                      "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold tabular-nums transition-colors duration-150",
                      isActive
                        ? "bg-white/25 text-primary-foreground"
                        : "bg-taupe-100 text-taupe-600",
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}