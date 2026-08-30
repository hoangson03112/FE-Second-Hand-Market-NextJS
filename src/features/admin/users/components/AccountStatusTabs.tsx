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
