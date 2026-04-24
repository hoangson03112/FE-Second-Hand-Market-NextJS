import { REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER } from "./refund";

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: string; bgColor: string }
> = {
  pending: {
    label: "Chờ xác nhận",
    color: "text-primary/90",
    bgColor: "bg-primary/10 border-primary/30",
    icon: "⏳",
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "text-primary",
    bgColor: "bg-primary/15 border-primary/40",
    icon: "✓",
  },
  picked_up: {
    label: "Đã lấy hàng",
    color: "text-foreground/80",
    bgColor: "bg-secondary border-border",
    icon: "📦",
  },
  shipping: {
    label: "Đang vận chuyển",
    color: "text-primary",
    bgColor: "bg-primary/20 border-primary/50",
    icon: "🚛",
  },
  out_for_delivery: {
    label: "Sắp giao đến",
    color: "text-primary",
    bgColor: "bg-primary/20 border-primary/50",
    icon: "🛯️",
  },
  delivered: {
    label: "Đã giao",
    color: "text-foreground/70",
    bgColor: "bg-muted/60 border-border",
    icon: "✅",
  },
  completed: {
    label: "Hoàn thành",
    color: "text-foreground",
    bgColor: "bg-secondary border-border",
    icon: "🎉",
  },
  failed: {
    label: "Giao thất bại",
    color: "text-destructive",
    bgColor: "bg-destructive/10 border-destructive/30",
    icon: "⚠️",
  },
  returned: {
    label: "Đã hoàn hàng",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100 border-emerald-300",
    icon: "↩️",
  },
  cancelled: {
    label: "Đã hủy",
    color: "text-muted-foreground",
    bgColor: "bg-muted/60 border-border",
    icon: "✕",
  },
  delivery_failed: {
    label: "Giao thất bại",
    color: "text-destructive",
    bgColor: "bg-destructive/10 border-destructive/30",
    icon: "⚠️",
  },
  returning: {
    label: "Đang hoàn hàng",
    color: "text-amber-700",
    bgColor: "bg-amber-100 border-amber-300",
    icon: "↩️",
  },
  return_shipping: {
    label: "Đang hoàn hàng",
    color: "text-amber-700",
    bgColor: "bg-amber-100 border-amber-300",
    icon: "↩️",
  },
  refund: {
    label: "Đang xử lý hoàn tiền",
    color: "text-orange-700",
    bgColor: "bg-orange-100 border-orange-300",
    icon: "💰",
  },
  refund_requested: {
    label: "Yêu cầu hoàn tiền",
    color: "text-orange-700",
    bgColor: "bg-orange-100 border-orange-300",
    icon: "💰",
  },
  refund_approved: {
    label: "Hoàn tiền đã duyệt",
    color: "text-blue-700",
    bgColor: "bg-blue-100 border-blue-300",
    icon: "✔️",
  },
  refunded: {
    label: "Đã hoàn tiền",
    color: "text-violet-700",
    bgColor: "bg-violet-100 border-violet-300",
    icon: "💸",
  },
  /** Trạng thái Refund (admin / danh sách hoàn) */
  disputed: {
    label: "Khiếu nại",
    color: "text-purple-800",
    bgColor: "bg-purple-100 border-purple-300",
    icon: "⚖️",
  },
  processing: {
    label: "Chờ admin chuyển khoản",
    color: "text-blue-800",
    bgColor: "bg-blue-100 border-blue-300",
    icon: "🏦",
  },
  bank_info_required: {
    label: "Chờ STK người mua",
    color: "text-amber-900",
    bgColor: "bg-amber-100 border-amber-300",
    icon: "🏧",
  },
  approved: {
    label: "Đã duyệt — chờ hoàn hàng",
    color: "text-sky-800",
    bgColor: "bg-sky-100 border-sky-300",
    icon: "📦",
  },
  rejected: {
    label: "Từ chối hoàn",
    color: "text-destructive",
    bgColor: "bg-destructive/10 border-destructive/30",
    icon: "✕",
  },
};
// Simple labels map for backward compatibility
export const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  picked_up: "Đã lấy hàng",
  shipping: "Đang vận chuyển",
  out_for_delivery: "Sắp giao đến",
  delivered: "Đã giao",
  completed: "Hoàn thành",
  failed: "Giao thất bại",
  returned: "Đã hoàn hàng",
  cancelled: "Đã hủy",
  delivery_failed: "Giao thất bại",
  returning: "Đang hoàn hàng",
  return_shipping: "Đang hoàn hàng",
  refund: "Đang xử lý hoàn tiền",
  refund_requested: "Yêu cầu hoàn tiền",
  refund_approved: "Hoàn tiền đã duyệt",
  refunded: "Đã hoàn tiền",
};

// Simple colors map for backward compatibility
export const STATUS_COLORS: Record<string, string> = {
  pending: "bg-primary/10 text-primary/90 border-primary/30",
  confirmed: "bg-primary/15 text-primary border-primary/40",
  picked_up: "bg-secondary text-foreground/80 border-border",
  shipping: "bg-primary/20 text-primary border-primary/50",
  out_for_delivery: "bg-primary/20 text-primary border-primary/50",
  delivered: "bg-muted/60 text-foreground/70 border-border",
  completed: "bg-secondary text-foreground border-border",
  failed: "bg-destructive/10 text-destructive border-destructive/30",
  returned: "bg-accent/20 text-accent-foreground border-accent/40",
  cancelled: "bg-muted/60 text-muted-foreground border-border",
  delivery_failed: "bg-destructive/10 text-destructive border-destructive/30",
  returning: "bg-accent/20 text-accent-foreground border-accent/40",
  return_shipping: "bg-accent/20 text-accent-foreground border-accent/40",
  refund: "bg-primary/8 text-primary/80 border-primary/20",
  refund_requested: "bg-primary/8 text-primary/80 border-primary/20",
  refund_approved: "bg-primary/15 text-primary border-primary/30",
  refunded: "bg-muted/60 text-muted-foreground border-border",
};

export function getOrderStatusLabel(status: string | undefined | null): string {
  if (!status) return "Không xác định";
  return (
    STATUS_CONFIG[status]?.label ||
    STATUS_LABELS[status] ||
    status.replaceAll("_", " ").replace(/^\w/, (m) => m.toUpperCase())
  );
}

export interface RefundStatusNotice {
  title: string;
  description: string;
  tone: "warning" | "info" | "success";
}

export function getRefundStatusNotice(
  status: string | undefined | null,
  role: "buyer" | "seller"
): RefundStatusNotice | null {
  if (!status) return null;

  if (role === "buyer") {
    switch (status) {
      case "refund_requested":
        return {
          title: "Yêu cầu hoàn tiền đã được gửi",
          description: "Hệ thống đang chờ người bán phản hồi yêu cầu của bạn.",
          tone: "warning",
        };
      case "refund":
        return {
          title: "Đơn hàng đang trong quy trình hoàn tiền",
          description: "Vui lòng theo dõi hướng dẫn trả hàng và các bước tiếp theo.",
          tone: "info",
        };
      case "refund_approved":
        return {
          title: "Đơn hàng đang trong quy trình hoàn tiền",
          description:
            "Vui lòng theo dõi hướng dẫn trả hàng và các bước tiếp theo. " +
            REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER,
          tone: "info",
        };
      case "returning":
      case "return_shipping":
        return {
          title: "Hàng hoàn đang vận chuyển",
          description:
            "Sau khi người bán nhận được hàng, hồ sơ hoàn tiền sẽ được tiếp tục xử lý. " +
            REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER,
          tone: "info",
        };
      case "returned":
        return {
          title: "Người bán đã nhận hàng hoàn",
          description: "Nếu cần, vui lòng cập nhật thông tin nhận tiền hoàn để hoàn tất giao dịch.",
          tone: "warning",
        };
      case "refunded":
        return {
          title: "Đã hoàn tiền thành công",
          description: "Tiền hoàn đã được xử lý cho đơn hàng này.",
          tone: "success",
        };
      default:
        return null;
    }
  }

  switch (status) {
    case "refund_requested":
      return {
        title: "Có yêu cầu hoàn tiền mới",
        description: "Vui lòng xem lý do và quyết định duyệt hoặc từ chối sớm.",
        tone: "warning",
      };
    case "refund":
      return {
        title: "Đơn hàng đang trong quy trình hoàn tiền",
        description: "Theo dõi tiến trình trả hàng và cập nhật xử lý cho buyer.",
        tone: "info",
      };
    case "refund_approved":
      return {
        title: "Bạn đã duyệt yêu cầu hoàn tiền",
        description:
          "Chờ buyer gửi hàng hoàn để tiếp tục bước hoàn tiền. " + REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER,
        tone: "info",
      };
    case "returning":
    case "return_shipping":
      return {
        title: "Đang chờ nhận hàng hoàn",
        description:
          "Khi nhận được hàng, hãy xác nhận đúng quy trình. " + REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER,
        tone: "info",
      };
    case "returned":
      return {
        title: "Đã nhận hàng hoàn",
        description: "Đơn đang chờ bước xử lý hoàn tiền cuối cùng.",
        tone: "warning",
      };
    case "refunded":
      return {
        title: "Đơn đã hoàn tiền xong",
        description: "Giao dịch hoàn tiền đã hoàn tất.",
        tone: "success",
      };
    default:
      return null;
  }
}

export const ORDER_TABS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "picked_up", label: "Đã lấy hàng" },
  { key: "shipping", label: "Đang vận chuyển" },
  { key: "out_for_delivery", label: "Sắp giao đến" },
  { key: "delivered", label: "Đã giao" },
  { key: "completed", label: "Hoàn thành" },
  { key: "failed", label: "Giao thất bại" },
  { key: "returned", label: "Đã hoàn hàng" },
  { key: "return_shipping", label: "Đang hoàn hàng" },
  { key: "refund", label: "Đang xử lý hoàn tiền" },
  { key: "cancelled", label: "Đã hủy" },
  { key: "refund_requested", label: "Yêu cầu hoàn tiền" },
  { key: "refunded", label: "Đã hoàn tiền" },
] as const;

export type OrderStatus = keyof typeof STATUS_CONFIG;
