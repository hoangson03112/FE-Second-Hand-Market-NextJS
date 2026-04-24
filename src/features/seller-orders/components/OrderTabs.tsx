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

export default function OrderTabs({ activeTab, onTabChange, tabCounts }: OrderTabsProps) {
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeTab]);

  return (
    <div className="mb-5 overflow-hidden rounded-xl border border-border bg-muted/20 p-1">
      <div className="overflow-x-auto scrollbar-hide">
        <div
          role="tablist"
          aria-label="Lọc đơn hàng theo trạng thái"
          className="inline-flex min-w-full items-center gap-1"
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
                  "relative flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5",
                  "text-sm whitespace-nowrap",
                  "transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-inset",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-transparent font-medium text-muted-foreground hover:bg-background hover:text-foreground",
                )}
              >
                {label}

                {count > 0 && (
                  <span
                    className={cn(
                      "inline-flex items-center justify-center",
                      "min-w-[20px] h-5 px-1.5 rounded-md",
                      "text-xs font-semibold tabular-nums",
                      "transition-colors duration-150",
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-background text-muted-foreground/70",
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
          {/* Trailing spacer — ensures last tab is never clipped */}
          <div className="shrink-0 w-4" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}