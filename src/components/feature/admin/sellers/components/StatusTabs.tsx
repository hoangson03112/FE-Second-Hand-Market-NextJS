import type { SellerStatusFilter } from "../hooks/useAdminSellers";

const STATUS_TABS = [
  { value: "", label: "Tất cả" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
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
    <div className="flex flex-wrap gap-1.5 border-b border-border pb-2">
      {STATUS_TABS.map((tab) => (
        <button
          key={tab.value || "all"}
          type="button"
          onClick={() => onStatusChange(tab.value)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            activeStatus === tab.value
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
