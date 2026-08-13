import { IconPackage } from "@tabler/icons-react";

const TAB_EMPTY_MESSAGES: Record<string, { heading: string; sub: string }> = {
  all: { heading: "Chưa có đơn hàng nào", sub: "Đơn hàng sẽ hiển thị khi có người mua sản phẩm của bạn." },
  pending: { heading: "Không có đơn chờ xử lý", sub: "Các đơn mới sẽ xuất hiện ở đây để bạn xác nhận." },
  processing: { heading: "Không có đơn đang xử lý", sub: "Đơn đã xác nhận sẽ hiển thị tại đây." },
  shipped: { heading: "Không có đơn đang giao", sub: "Đơn hàng trên đường vận chuyển sẽ hiển thị ở đây." },
  delivered: { heading: "Không có đơn đã giao", sub: "Đơn giao thành công sẽ hiển thị ở đây." },
  refund: { heading: "Không có đơn hoàn trả", sub: "Các yêu cầu hoàn tiền/hoàn hàng sẽ hiển thị tại đây." },
  cancelled: { heading: "Không có đơn đã hủy", sub: "Đơn hàng bị hủy hoặc giao thất bại sẽ hiển thị ở đây." },
};

interface EmptyOrderStateProps {
  activeTab: string;
}

export default function EmptyOrderState({ activeTab }: EmptyOrderStateProps) {
  const msg = TAB_EMPTY_MESSAGES[activeTab] ?? TAB_EMPTY_MESSAGES.all;

  return (
    <div className="bg-muted/30 rounded-2xl border border-border p-12 text-center">
      <IconPackage className="w-14 h-14 text-muted-foreground/40 mx-auto mb-4" />
      <h3 className="text-base font-semibold text-foreground mb-1.5">{msg.heading}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mx-auto">{msg.sub}</p>
    </div>
  );
}