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
    <div className="bg-cream-50/90 backdrop-blur-md rounded-3xl border-2 border-neutral-200/60 shadow-lg shadow-neutral-200/50 p-12 text-center">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cream-50 flex items-center justify-center">
        <IconPackage className="w-12 h-12 text-neutral-400" />
      </div>
      <h3 className="text-xl font-bold text-neutral-900 mb-2">
        {activeTab === "all"
          ? "Chưa có đơn hàng nào"
          : `Không có đơn hàng ${tabs.find((tab) => tab.key === activeTab)?.label.toLowerCase()}`}
      </h3>
      <p className="text-neutral-600 mb-6">
        {activeTab === "all"
          ? "Hãy bắt đầu mua sắm và tạo đơn hàng đầu tiên của bạn!"
          : "Không tìm thấy đơn hàng nào trong trạng thái này"}
      </p>
      {activeTab === "all" && (
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all"
        >
          <IconShoppingBag className="w-5 h-5" />
          Mua sắm ngay
        </Link>
      )}
    </div>
  );
}
