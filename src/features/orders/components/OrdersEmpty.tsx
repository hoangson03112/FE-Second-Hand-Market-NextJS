import Link from "next/link";
import { IconPackage, IconShoppingBag } from "@tabler/icons-react";

interface OrderTab {
  key: string;
  label: string;
}

interface OrdersEmptyProps {
  activeTab: string;
  tabs: readonly OrderTab[];
}

export function OrdersEmpty({ activeTab, tabs }: OrdersEmptyProps) {
  return (
    <div className="bg-gradient-to-br from-cream-50 to-white border-2 border-border rounded-3xl shadow-md p-12 text-center">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
        <IconPackage className="w-12 h-12 text-primary" />
      </div>
      <h3 className="text-xl font-bold text-taupe-900 mb-2">
        {activeTab === "all"
          ? "Chưa có đơn hàng nào"
          : `Không có đơn hàng ${tabs.find((tab) => tab.key === activeTab)?.label.toLowerCase()}`}
      </h3>
      <p className="text-taupe-600 mb-6">
        {activeTab === "all"
          ? "Hãy bắt đầu mua sắm và tạo đơn hàng đầu tiên của bạn!"
          : "Không tìm thấy đơn hàng nào trong trạng thái này"}
      </p>
      {activeTab === "all" && (
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm tracking-wide hover:bg-primary/90 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
        >
          <IconShoppingBag className="w-5 h-5" />
          Mua sắm ngay
        </Link>
      )}
    </div>
  );
}