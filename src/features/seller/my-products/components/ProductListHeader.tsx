import {
  IconPlus,
  IconPackage,
  IconClock,
  IconCircleCheck,
  IconCircleX,
  IconCurrencyDollar,
  IconLayoutGrid,
  IconList,
  IconEye,
} from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ProductStatusFilter } from "@/types/myProducts";

interface ProductListHeaderProps {
  stats: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
    under_review: number;
    sold: number;
  };
  activeFilter: ProductStatusFilter | "all";
  onFilterChange: (filter: ProductStatusFilter | "all") => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
}

const FILTER_CONFIGS = [
  { value: "all" as const, label: "Tất cả", icon: IconPackage },
  { value: "pending" as const, label: "Chờ duyệt", icon: IconClock },
  { value: "approved" as const, label: "Đã duyệt", icon: IconCircleCheck },
  { value: "under_review" as const, label: "Đang xem xét", icon: IconEye },
  { value: "rejected" as const, label: "Từ chối", icon: IconCircleX },
  { value: "sold" as const, label: "Đã bán", icon: IconCurrencyDollar },
];

export function ProductListHeader({
  stats,
  activeFilter,
  onFilterChange,
  viewMode,
  onViewModeChange,
}: ProductListHeaderProps) {
  return (
    <div className="bg-cream-50/95 backdrop-blur-md border-b-2 border-border sticky top-0 z-20">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-taupe-900 mb-1">
              Sản phẩm của tôi
            </h1>
            <p className="text-sm text-taupe-500">{stats.all} sản phẩm</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center border-2 border-border rounded-xl p-1 bg-white">
              <button
                onClick={() => onViewModeChange("list")}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-taupe-500 hover:text-taupe-900",
                )}
              >
                <IconList className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange("grid")}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "text-taupe-500 hover:text-taupe-900",
                )}
              >
                <IconLayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
            >
              <IconPlus className="w-4 h-4" />
              Đăng tin
            </Link>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {FILTER_CONFIGS.map((config) => {
            const Icon = config.icon;
            const count = stats[config.value];
            const isActive = activeFilter === config.value;

            return (
              <button
                key={config.value}
                onClick={() => onFilterChange(config.value)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-full transition-all duration-200 shrink-0 text-sm font-bold border-2",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-white text-taupe-600 hover:border-primary/40 hover:text-taupe-900 border-border",
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{config.label}</span>
                <span
                  className={cn(
                    "ml-1 px-2 py-0.5 rounded-full text-xs font-bold tabular-nums",
                    isActive
                      ? "bg-white/25 text-primary-foreground"
                      : "bg-taupe-100 text-taupe-600",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
