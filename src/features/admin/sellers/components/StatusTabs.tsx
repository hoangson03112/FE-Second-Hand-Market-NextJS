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
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {STATUS_TABS.map((tab) => {
        const isActive = activeStatus === tab.value;
        return (
          <button
            key={tab.value || "all"}
            type="button"
            onClick={() => onStatusChange(tab.value)}
            className={`rounded-[2px] px-3.5 py-1.5 text-2xs font-bold uppercase tracking-[0.12em] whitespace-nowrap transition-all ${
              isActive
                ? "bg-luxury-ink text-luxury-ivory shadow-none"
                : "bg-white border border-luxury-ink/10 text-neutral-600 hover:bg-taupe-50 hover:text-luxury-ink"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
