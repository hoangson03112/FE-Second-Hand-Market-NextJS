type AccountStatusFilter = "active" | "inactive" | "banned" | "";

const STATUS_TABS: { value: AccountStatusFilter; label: string }[] = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Chưa kích hoạt" },
  { value: "banned", label: "Đang bị khóa" },
];

interface AccountStatusTabsProps {
  activeStatus: AccountStatusFilter;
  onStatusChange: (status: AccountStatusFilter) => void;
}

export default function AccountStatusTabs({
  activeStatus,
  onStatusChange,
}: AccountStatusTabsProps) {
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
