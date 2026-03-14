type AccountStatusFilter = "active" | "inactive" | "banned" | "";

const STATUS_TABS: { value: AccountStatusFilter; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Chưa kích hoạt" },
  { value: "banned", label: "Bị khóa" },
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
