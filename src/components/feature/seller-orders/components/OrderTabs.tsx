import type { Order } from "@/types/order";
import { ORDER_TABS } from "@/constants/orderStatus";

interface OrderTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  orders: Order[];
}

export default function OrderTabs({
  activeTab,
  onTabChange,
  orders,
}: OrderTabsProps) {
  return (
    <div className="bg-cream-50 rounded-2xl border border-border p-1 mb-6 flex gap-1 overflow-x-auto">
      {ORDER_TABS.map((tab) => {
        const count =
          tab.key === "all"
            ? orders.length
            : orders.filter((o) => o.status === tab.key).length;

        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? "bg-primary text-white shadow-md"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
            {count > 0 && (
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key
                    ? "bg-cream-100/30"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
