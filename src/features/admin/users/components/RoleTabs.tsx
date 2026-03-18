type RoleFilter = "buyer" | "seller" | "admin" | "all";

const ROLE_TABS: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "buyer", label: "Người mua" },
  { value: "seller", label: "Seller" },
  { value: "admin", label: "Quản trị" },
];

interface RoleTabsProps {
  activeRole: RoleFilter;
  onRoleChange: (role: RoleFilter) => void;
}

export default function RoleTabs({ activeRole, onRoleChange }: RoleTabsProps) {
  return (
    <div className="flex flex-wrap gap-1.5 border-b border-border pb-2">
      <span className="text-xs text-muted-foreground self-center mr-2">Vai trò:</span>
      {ROLE_TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onRoleChange(tab.value)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            activeRole === tab.value
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
