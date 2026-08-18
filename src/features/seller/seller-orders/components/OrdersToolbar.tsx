"use client";

import { IconChevronDown, IconSearch, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { microCaps } from "@/features/order/components";
import type { DateFilter, SortOption } from "../hooks/useSellerOrders";

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "Tất cả thời gian" },
  { value: "today", label: "Hôm nay" },
  { value: "week", label: "7 ngày qua" },
  { value: "month", label: "30 ngày qua" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "highest", label: "Giá trị cao" },
  { value: "lowest", label: "Giá trị thấp" },
];

const FIELD =
  "h-11 w-full rounded-[2px] border border-luxury-ink/15 bg-white text-sm text-luxury-ink outline-none transition-colors duration-300 focus:border-luxury-ink";

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

/** Hairline select with its label as a micro-caps overline, not a boxed prefix. */
function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps<T>) {
  return (
    <label className="block">
      <span className={cn(microCaps, "mb-2 block text-neutral-500")}>
        {label}
      </span>
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className={cn(FIELD, "cursor-pointer appearance-none pl-3.5 pr-10")}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <IconChevronDown
          aria-hidden
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-luxury-ink/40"
        />
      </span>
    </label>
  );
}

interface OrdersToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  dateFilter: DateFilter;
  onDateFilterChange: (value: DateFilter) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  /** Result count, shown as an editorial figure beside the filters. */
  resultCount: number;
}

export default function OrdersToolbar({
  searchQuery,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  sortBy,
  onSortChange,
  resultCount,
}: OrdersToolbarProps) {
  return (
    <div className="mb-8 border-b border-luxury-ink/6 pb-8">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_repeat(2,minmax(0,13rem))] md:items-end">
        <label className="block">
          <span className={cn(microCaps, "mb-2 block text-neutral-500")}>
            Tìm kiếm
          </span>
          <span className="relative block">
            <IconSearch
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-luxury-ink/40"
            />
            <input
              type="text"
              placeholder="Mã đơn, tên người mua hoặc tên sản phẩm…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={cn(
                FIELD,
                "pl-10 placeholder:text-neutral-400",
                searchQuery ? "pr-10" : "pr-3.5",
              )}
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Xóa từ khóa"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-[2px] p-1.5 text-luxury-ink/40 transition-colors hover:bg-cream-100 hover:text-luxury-ink"
              >
                <IconX className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </span>
        </label>

        <SelectField
          label="Thời gian"
          value={dateFilter}
          options={DATE_OPTIONS}
          onChange={onDateFilterChange}
        />
        <SelectField
          label="Sắp xếp"
          value={sortBy}
          options={SORT_OPTIONS}
          onChange={onSortChange}
        />
      </div>

      <p className={cn(microCaps, "mt-5 text-neutral-500")}>
        Kết quả{" "}
        <span className="font-droid-serif text-sm tabular-nums text-luxury-ink">
          {resultCount}
        </span>{" "}
        đơn hàng
      </p>
    </div>
  );
}
