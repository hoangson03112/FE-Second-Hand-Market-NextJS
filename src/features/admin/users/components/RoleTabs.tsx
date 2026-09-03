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
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {ROLE_TABS.map((tab) => {
        const isActive = activeRole === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onRoleChange(tab.value)}
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
