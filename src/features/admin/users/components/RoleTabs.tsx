type RoleFilter = "buyer" | "seller" | "admin" | "all";

const ROLE_TABS: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "Tất cả vai trò" },
  { value: "buyer", label: "Người mua" },
  { value: "seller", label: "Người bán (Seller)" },
  { value: "admin", label: "Quản trị viên" },
];

interface RoleTabsProps {
  activeRole: RoleFilter;
  onRoleChange: (role: RoleFilter) => void;
}

export default function RoleTabs({ activeRole, onRoleChange }: RoleTabsProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
      {ROLE_TABS.map((tab) => {
        const isActive = activeRole === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onRoleChange(tab.value)}
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
