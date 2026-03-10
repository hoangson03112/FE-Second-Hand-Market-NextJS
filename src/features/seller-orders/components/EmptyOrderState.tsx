import { IconPackage } from "@tabler/icons-react";

const TAB_EMPTY_MESSAGES: Record<string, { heading: string; sub: string }> = {
  all:              { heading: "Chưa có đơn hàng nào",          sub: "Đơn hàng sẽ hiển thị khi có người mua sản phẩm của bạn." },
  pending:          { heading: "Không có đơn chờ xác nhận",     sub: "Tất cả đơn hàng mới đã được xử lý." },
  confirmed:        { heading: "Không có đơn đã xác nhận",      sub: "Đơn hàng sau khi xác nhận sẽ hiển thị ở đây." },
  picked_up:        { heading: "Không có đơn đã lấy hàng",      sub: "Đơn hàng sau khi được lấy sẽ hiển thị ở đây." },
  shipping:         { heading: "Không có đơn đang vận chuyển",  sub: "Đơn hàng đang trên đường giao sẽ hiển thị ở đây." },
  out_for_delivery: { heading: "Không có đơn đang giao hàng",   sub: "Đơn hàng đang được giao đến khách sẽ hiển thị ở đây." },
  delivered:        { heading: "Không có đơn đã giao",          sub: "Đơn hàng đã giao thành công sẽ hiển thị ở đây." },
  completed:        { heading: "Chưa có đơn hoàn thành",        sub: "Đơn hàng sau khi người mua xác nhận nhận hàng sẽ hiển thị ở đây." },
  refund_requested: { heading: "Không có yêu cầu hoàn tiền",    sub: "Yêu cầu hoàn tiền từ người mua sẽ hiển thị ở đây." },
  refund_approved:  { heading: "Không có hoàn tiền đã duyệt",   sub: "Yêu cầu hoàn tiền đã được duyệt sẽ hiển thị ở đây." },
  cancelled:        { heading: "Không có đơn đã hủy",           sub: "Đơn hàng bị hủy sẽ hiển thị ở đây." },
  delivery_failed:  { heading: "Không có đơn giao thất bại",    sub: "Đơn hàng không giao được sẽ hiển thị ở đây." },
  returned:         { heading: "Không có đơn đã hoàn hàng",     sub: "Đơn hàng đã hoàn trả sẽ hiển thị ở đây." },
  refunded:         { heading: "Không có đơn đã hoàn tiền",     sub: "Đơn hàng đã hoàn tiền thành công sẽ hiển thị ở đây." },
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