import Link from "next/link";
import { Plus, Package, Clock, CheckCircle, XCircle, DollarSign, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductStatusFilter } from "@/types/myProducts";

interface ProductListHeaderProps {
  stats: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
    sold: number;
  };
  activeFilter: ProductStatusFilter | "all";
  onFilterChange: (filter: ProductStatusFilter | "all") => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
}

const FILTER_CONFIGS = [
  { value: "all" as const, label: "Tất cả", icon: Package },
  { value: "pending" as const, label: "Chờ duyệt", icon: Clock },
  { value: "approved" as const, label: "Đã duyệt", icon: CheckCircle },
  { value: "rejected" as const, label: "Từ chối", icon: XCircle },
  { value: "sold" as const, label: "Đã bán", icon: DollarSign },
];

export function ProductListHeader({
  stats,
  activeFilter,
  onFilterChange,
  viewMode,
  onViewModeChange,
}: ProductListHeaderProps) {
  return (
    <div className="bg-card border-b border-border sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              Sản phẩm của tôi
            </h1>
            <p className="text-sm text-muted-foreground">
              {stats.all} sản phẩm
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border rounded-lg p-1">
              <button
                onClick={() => onViewModeChange("list")}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange("grid")}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
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
                  "flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors shrink-0 text-sm font-medium border",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground hover:bg-muted border-border"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{config.label}</span>
                <span className={cn(
                  "ml-1 px-2 py-0.5 rounded-md text-xs font-semibold tabular-nums",
                  isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                )}>
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
