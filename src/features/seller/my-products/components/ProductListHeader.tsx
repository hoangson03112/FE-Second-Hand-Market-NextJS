"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconArrowUpRight,
  IconLayoutGrid,
  IconList,
  IconPlus,
} from "@tabler/icons-react";
import { Eyebrow, microCaps } from "@/features/order/components";
import { cn } from "@/lib/utils";

interface ProductListHeaderProps {
  /** Total listing count, shown as an editorial figure beside the title. */
  totalCount: number;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
}

export function ProductListHeader({
  totalCount,
  viewMode,
  onViewModeChange,
}: ProductListHeaderProps) {
  const router = useRouter();

  const viewButton = (mode: "list" | "grid", Icon: React.ElementType) => (
    <button
      type="button"
      onClick={() => onViewModeChange(mode)}
      aria-label={mode === "grid" ? "Xem dạng lưới" : "Xem dạng danh sách"}
      aria-pressed={viewMode === mode}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center transition-all duration-300",
        viewMode === mode
          ? "bg-luxury-ink text-luxury-ivory"
          : "text-neutral-500 hover:text-luxury-ink",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="mx-auto w-full max-w-9xl px-4 sm:px-6">
      <div className="flex flex-col gap-6 py-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Quay lại"
            className="-ml-2 mt-1 shrink-0 rounded-[2px] p-2 text-luxury-ink transition-colors hover:bg-taupe-50"
          >
            <IconArrowLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <Eyebrow>Kênh người bán</Eyebrow>
            <h1 className="font-droid-serif mt-2.5 text-[clamp(1.5rem,3vw,2rem)] leading-[1.1] tracking-tight text-luxury-ink">
              Sản phẩm của tôi
            </h1>
            <p className="mt-2.5 max-w-md text-sm leading-relaxed text-neutral-600">
              Quản lý tin đăng, ưu đãi và trạng thái kiểm duyệt.
            </p>
            <Link
              href="/seller/orders"
              className="group mt-4 inline-flex items-center gap-2 text-2xs font-bold uppercase tracking-[0.22em] text-luxury-ink transition-colors hover:text-taupe-700"
            >
              Quản lý đơn hàng
              <IconArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-6 lg:justify-end lg:gap-8">
          <div>
            <p className={cn(microCaps, "text-neutral-500")}>Tổng tin đăng</p>
            <p className="font-droid-serif mt-2 text-2xl leading-none tabular-nums text-luxury-ink">
              {totalCount}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center overflow-hidden rounded-[2px] border border-luxury-ink/15 bg-white">
              {viewButton("grid", IconLayoutGrid)}
              <span
                aria-hidden
                className="h-9 w-px shrink-0 bg-luxury-ink/10"
              />
              {viewButton("list", IconList)}
            </div>

            <Link
              href="/sell"
              className="inline-flex h-9 items-center gap-2 rounded-[2px] bg-luxury-ink px-5 text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800"
            >
              <IconPlus className="h-3.5 w-3.5" />
              Đăng tin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
