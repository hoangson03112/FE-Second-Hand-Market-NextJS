import type { SellerStatusFilter } from "../hooks/useAdminSellers";

const STATUS_TABS = [
  { value: "", label: "Tất cả" },
  { value: "pending", label: "Chờ xét duyệt" },
  { value: "approved", label: "Đã phê duyệt" },
  { value: "rejected", label: "Đã từ chối" },
  { value: "banned", label: "Đang bị khóa" },
] as const;

interface StatusTabsProps {
  activeStatus: SellerStatusFilter;
  onStatusChange: (status: SellerStatusFilter) => void;
}

export default function StatusTabs({
  activeStatus,
  onStatusChange,
}: StatusTabsProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
      {STATUS_TABS.map((tab) => {
        const isActive = activeStatus === tab.value;
        return (
          <button
            key={tab.value || "all"}
            type="button"
            onClick={() => onStatusChange(tab.value)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              isActive
                ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                : "bg-card border border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
