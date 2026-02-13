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
  { value: "all" as const, label: "Tất cả", icon: Package, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
  { value: "pending" as const, label: "Chờ duyệt", icon: Clock, color: "text-amber-600", bgColor: "bg-amber-50", borderColor: "border-amber-200" },
  { value: "approved" as const, label: "Đã duyệt", icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
  { value: "rejected" as const, label: "Từ chối", icon: XCircle, color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" },
  { value: "sold" as const, label: "Đã bán", icon: DollarSign, color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
];

export function ProductListHeader({
  stats,
  activeFilter,
  onFilterChange,
  viewMode,
  onViewModeChange,
}: ProductListHeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Top section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-medium text-gray-900 mb-1">
              Sản phẩm của tôi
            </h1>
            <p className="text-sm text-gray-500">
              {stats.all} sản phẩm
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View toggle - minimal */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onViewModeChange("list")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "list"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => onViewModeChange("grid")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "grid"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>

            <Link
              href="/sell"
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium",
                "bg-gray-900 text-white rounded-lg",
                "hover:bg-gray-800 transition-colors"
              )}
            >
              <Plus className="w-4 h-4" />
              Đăng tin
            </Link>
          </div>
        </div>

        {/* Stats & Filters - minimal pills */}
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
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all shrink-0 text-sm font-medium",
                  isActive
                    ? "bg-gray-900 text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{config.label}</span>
                <span className={cn(
                  "ml-1 px-2 py-0.5 rounded-full text-xs tabular-nums",
                  isActive ? "bg-white/20" : "bg-gray-200"
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
