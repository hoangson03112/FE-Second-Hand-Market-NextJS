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
    <div className="sticky top-[73px] z-10 bg-background/95 backdrop-blur-sm border-b border-border">
      {/*
        Scroll happens on this wrapper (no px here — trailing padding would
        be swallowed by the browser and the last tab would be clipped).
        The inner flex row carries the px so padding is part of scroll width.
      */}
      <div className="max-w-7xl mx-auto overflow-x-auto scrollbar-hide -mb-px">
        <div
          role="tablist"
          aria-label="Trạng thái đơn hàng"
          className="inline-flex min-w-full pl-4 sm:pl-6"
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
                  // layout
                  "relative flex shrink-0 items-center gap-2 px-4 py-3",
                  // text
                  "text-sm whitespace-nowrap",
                  // bottom border acts as the underline indicator
                  "border-b-2 transition-colors duration-150",
                  // a11y
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0 rounded-t-sm",
                  isActive
                    ? "border-foreground font-semibold text-foreground"
                    : [
                        "border-transparent font-medium text-muted-foreground",
                        "hover:text-foreground hover:border-border",
                      ],
                )}
              >
                {tab.label}

                {count > 0 && (
                  <span
                    className={cn(
                      "inline-flex items-center justify-center",
                      "min-w-[20px] h-5 px-1.5 rounded-md",
                      "text-xs font-semibold tabular-nums",
                      "transition-colors duration-150",
                      isActive
                        ? "bg-foreground/[0.08] text-foreground"
                        : "bg-muted text-muted-foreground/70",
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
          {/* Trailing spacer — guarantees right padding is part of scroll width */}
          <div className="shrink-0 w-4 sm:w-6" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}