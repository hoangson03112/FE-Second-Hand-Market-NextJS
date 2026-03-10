"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const SELLER_TABS = [
  { key: "all",               label: "Tất cả" },
  { key: "pending",           label: "Chờ xác nhận" },
  { key: "confirmed",         label: "Đã xác nhận" },
  { key: "picked_up",         label: "Đã lấy hàng" },
  { key: "shipping",          label: "Đang vận chuyển" },
  { key: "out_for_delivery",  label: "Đang giao hàng" },
  { key: "delivered",         label: "Đã giao" },
  { key: "completed",         label: "Hoàn thành" },
  { key: "refund_requested",  label: "Yêu cầu hoàn" },
  { key: "refund_approved",   label: "Đã duyệt hoàn" },
  { key: "cancelled",         label: "Đã hủy" },
  { key: "delivery_failed",   label: "Giao thất bại" },
  { key: "returned",          label: "Đã hoàn hàng" },
  { key: "refunded",          label: "Đã hoàn tiền" },
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
    <div className="bg-background border border-border rounded-2xl mb-5 overflow-hidden">
      {/* overflow on this wrapper, no padding — trailing padding is swallowed by browsers */}
      <div className="overflow-x-auto scrollbar-hide">
        <div
          role="tablist"
          aria-label="Lọc đơn hàng theo trạng thái"
          className="inline-flex min-w-full border-b border-border"
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
                  "relative flex shrink-0 items-center gap-2 px-4 py-3",
                  "text-sm whitespace-nowrap",
                  "border-b-2 -mb-px",
                  "transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-inset",
                  isActive
                    ? "border-foreground font-semibold text-foreground"
                    : "border-transparent font-medium text-muted-foreground hover:text-foreground hover:border-border",
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
          {/* Trailing spacer — ensures last tab is never clipped */}
          <div className="shrink-0 w-4" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}