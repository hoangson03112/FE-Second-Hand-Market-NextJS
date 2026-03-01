import { IconPackage } from "@tabler/icons-react";
import { STATUS_LABELS } from "@/constants/orderStatus";

interface EmptyOrderStateProps {
  activeTab: string;
}

export default function EmptyOrderState({ activeTab }: EmptyOrderStateProps) {
  return (
    <div className="bg-cream-50 rounded-2xl border border-border p-12 text-center">
      <IconPackage className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {activeTab === "all"
          ? "Chưa có đơn hàng nào"
          : `Không có đơn hàng ${STATUS_LABELS[activeTab]?.toLowerCase()}`}
      </h3>
      <p className="text-sm text-muted-foreground">
        {activeTab === "all"
          ? "Đơn hàng sẽ hiển thị khi có người mua sản phẩm của bạn"
          : "Không tìm thấy đơn hàng nào trong trạng thái này"}
      </p>
    </div>
  );
}
