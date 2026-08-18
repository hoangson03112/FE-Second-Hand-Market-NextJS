"use client";

import { IconSearch, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { microCaps } from "@/features/order/components";

interface OrdersSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

/**
 * One field, no dropdowns. Past a dozen orders the useful question is "where is
 * the lamp I bought", not "show me every order sorted by value" — so the list
 * gets a search box and keeps the tab strip as the only other control.
 */
export function OrdersSearch({
  value,
  onChange,
  resultCount,
}: OrdersSearchProps) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-luxury-ink/6 pb-8">
      <label className="relative min-w-0 flex-1 sm:max-w-md">
        <IconSearch
          aria-hidden
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-luxury-ink/40"
        />
        <input
          type="text"
          placeholder="Tìm mã đơn, sản phẩm hoặc người bán…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Tìm đơn hàng"
          className={cn(
            "h-11 w-full rounded-[2px] border border-luxury-ink/15 bg-white pl-10 text-sm text-luxury-ink outline-none",
            "transition-colors duration-300 placeholder:text-neutral-400 focus:border-luxury-ink",
            value ? "pr-10" : "pr-3.5",
          )}
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Xóa từ khóa"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-[2px] p-1.5 text-luxury-ink/40 transition-colors hover:bg-cream-100 hover:text-luxury-ink"
          >
            <IconX className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </label>

      <p className={cn(microCaps, "shrink-0 text-neutral-500")}>
        <span className="font-droid-serif text-sm tabular-nums text-luxury-ink">
          {resultCount}
        </span>{" "}
        đơn hàng
      </p>
    </div>
  );
}
