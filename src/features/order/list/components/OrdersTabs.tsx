"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { OrderTab } from "@/constants/orderStatus";
import type { Order } from "@/types/order";

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
    <div className="border-t border-luxury-ink/6">
      <div className="mx-auto w-full max-w-9xl overflow-x-auto scrollbar-hide">
        <div
          role="tablist"
          aria-label="Trạng thái đơn hàng"
          className="inline-flex min-w-full gap-2 px-4 py-3 sm:px-6"
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
                  "relative flex shrink-0 items-center gap-2 rounded-[2px] border px-4 py-2 transition-all duration-300",
                  "focus-visible:border-luxury-champagne focus-visible:outline-none",
                  isActive
                    ? "border-luxury-ink bg-luxury-ink text-luxury-ivory"
                    : "border-luxury-ink/12 bg-white text-neutral-500 hover:border-luxury-ink/40 hover:text-luxury-ink",
                )}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  {tab.label}
                </span>

                {count > 0 ? (
                  <span
                    style={{ fontFamily: "var(--font-droid-serif), serif" }}
                    className={cn(
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
        </div>
      </div>
    </div>
  );
}
