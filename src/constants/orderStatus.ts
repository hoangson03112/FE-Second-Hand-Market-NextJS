import type { OrderStatus } from "@/types/order";
import { REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER } from "./refund";

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: string; bgColor: string }
> = {
  pending: {
    label: "Chờ xác nhận",
    color: "text-neutral-600",
    bgColor: "bg-cream-50 border-luxury-ink/12",
    icon: "⏳",
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "text-luxury-ink",
    bgColor: "bg-white border-luxury-ink/20",
    icon: "✓",
  },
  picked_up: {
    label: "Đã lấy hàng",
    color: "text-luxury-ink",
    bgColor: "bg-white border-luxury-ink/20",
    icon: "📦",
  },
  shipping: {
    label: "Đang vận chuyển",
    color: "text-luxury-ink",
    bgColor: "bg-white border-luxury-ink/20",
    icon: "🚛",
  },
  out_for_delivery: {
    label: "Sắp giao đến",
    color: "text-luxury-ink",
    bgColor: "bg-white border-luxury-ink/20",
    icon: "🛯️",
  },
  delivered: {
    label: "Đã giao",
    color: "text-luxury-ink",
    bgColor: "bg-white border-luxury-ink/20",
    icon: "✅",
  },
  completed: {
    label: "Hoàn thành",
    color: "text-taupe-700",
    bgColor: "bg-taupe-50 border-accent/35",
    icon: "🎉",
  },
  failed: {
    label: "Giao thất bại",
    color: "text-blush-800",
    bgColor: "bg-blush-50 border-blush-300",
    icon: "⚠️",
  },
  returned: {
    label: "Đã hoàn hàng",
    color: "text-taupe-700",
    bgColor: "bg-taupe-50 border-accent/35",
    icon: "↩️",
  },
  cancelled: {
    label: "Đã hủy",
    color: "text-blush-800",
    bgColor: "bg-blush-50 border-blush-300",
    icon: "✕",
  },
  delivery_failed: {
    label: "Giao thất bại",
    color: "text-blush-800",
    bgColor: "bg-blush-50 border-blush-300",
    icon: "⚠️",
  },
  returning: {
    label: "Đang hoàn hàng",
    color: "text-neutral-700",
    bgColor: "bg-cream-100 border-luxury-champagne/50",
    icon: "↩️",
  },
  return_shipping: {
    label: "Đang hoàn hàng",
    color: "text-neutral-700",
    bgColor: "bg-cream-100 border-luxury-champagne/50",
    icon: "↩️",
  },
  refund: {
    label: "Đang xử lý hoàn tiền",
    color: "text-neutral-700",
    bgColor: "bg-cream-100 border-luxury-champagne/50",
    icon: "💰",
  },
  refund_requested: {
    label: "Yêu cầu hoàn tiền",
    color: "text-neutral-700",
    bgColor: "bg-cream-100 border-luxury-champagne/50",
    icon: "💰",
  },
  refund_approved: {
    label: "Hoàn tiền đã duyệt",
    color: "text-neutral-700",
    bgColor: "bg-cream-100 border-luxury-champagne/50",
    icon: "✔️",
  },
  refunded: {
    label: "Đã hoàn tiền",
    color: "text-taupe-700",
    bgColor: "bg-taupe-50 border-accent/35",
    icon: "💸",
  },

  disputed: {
    label: "Khiếu nại",
    color: "text-blush-800",
    bgColor: "bg-blush-50 border-blush-300",
    icon: "⚖️",
  },
  processing: {
    label: "Chờ admin chuyển khoản",
    color: "text-neutral-700",
    bgColor: "bg-cream-100 border-luxury-champagne/50",
    icon: "🏦",
  },
  bank_info_required: {
    label: "Chờ STK người mua",
    color: "text-neutral-700",
    bgColor: "bg-cream-100 border-luxury-champagne/50",
    icon: "🏧",
  },
  approved: {
    label: "Đã duyệt — chờ hoàn hàng",
    color: "text-neutral-700",
    bgColor: "bg-cream-100 border-luxury-champagne/50",
    icon: "📦",
  },
  rejected: {
    label: "Từ chối hoàn",
    color: "text-blush-800",
    bgColor: "bg-blush-50 border-blush-300",
    icon: "✕",
  },
};

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


export const STATUS_COLORS: Record<string, string> = {
  pending: "bg-cream-50 text-neutral-600 border-luxury-ink/12",
  confirmed: "bg-white text-luxury-ink border-luxury-ink/20",
  picked_up: "bg-white text-luxury-ink border-luxury-ink/20",
  shipping: "bg-white text-luxury-ink border-luxury-ink/20",
  out_for_delivery: "bg-white text-luxury-ink border-luxury-ink/20",
  delivered: "bg-white text-luxury-ink border-luxury-ink/20",
  completed: "bg-taupe-50 text-taupe-700 border-accent/35",
  failed: "bg-blush-50 text-blush-800 border-blush-300",
  returned: "bg-taupe-50 text-taupe-700 border-accent/35",
  cancelled: "bg-blush-50 text-blush-800 border-blush-300",
  delivery_failed: "bg-blush-50 text-blush-800 border-blush-300",
  returning: "bg-cream-100 text-neutral-700 border-luxury-champagne/50",
  return_shipping: "bg-cream-100 text-neutral-700 border-luxury-champagne/50",
  refund: "bg-cream-100 text-neutral-700 border-luxury-champagne/50",
  refund_requested: "bg-cream-100 text-neutral-700 border-luxury-champagne/50",
  refund_approved: "bg-cream-100 text-neutral-700 border-luxury-champagne/50",
  refunded: "bg-taupe-50 text-taupe-700 border-accent/35",
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


export const ORDER_STATUS_KEYS: readonly OrderStatus[] = [
  "pending",
  "confirmed",
  "picked_up",
  "shipping",
  "out_for_delivery",
  "delivered",
  "completed",
  "delivery_failed",
  "returning",
  "returned",
  "refund",
  "refunded",
  "cancelled",
] as const;

export interface OrderTab {
  key: string;
  label: string;
}


export const ORDER_TABS: readonly OrderTab[] = [
  { key: "all", label: "Tất cả" },
  ...ORDER_STATUS_KEYS.map((key) => ({ key, label: getOrderStatusLabel(key) })),
];


export const BUYER_TAB_STATUSES: Record<string, readonly string[]> = {
  all: [],
  action: [],
  active: [
    "pending",
    "confirmed",
    "picked_up",
    "shipping",
    "out_for_delivery",
  ],
  received: ["delivered", "completed"],
  refund: [
    "refund",
    "refund_requested",
    "refund_approved",
    "returning",
    "return_shipping",
    "returned",
    "refunded",
  ],
  cancelled: ["cancelled", "delivery_failed"],
};

export const BUYER_ORDER_TABS: readonly OrderTab[] = [
  { key: "all", label: "Tất cả" },
  { key: "action", label: "Cần xử lý" },
  { key: "active", label: "Đang đến" },
  { key: "received", label: "Đã nhận" },
  { key: "refund", label: "Hoàn trả" },
  { key: "cancelled", label: "Đã hủy" },
];


export function sellerDisplayStatusFromRefund(
  orderStatus: string,
  refundStatus: string | null | undefined,
): string {
  if (orderStatus !== "refund" || !refundStatus) return orderStatus;
  switch (refundStatus) {
    case "pending":
      return "refund_requested";
    case "approved":
      return "refund_approved";
    case "return_shipping":
    case "returning":
      return "return_shipping";
    case "returned":
    case "processing":
    case "bank_info_required":
      return "returned";
    case "completed":
      return "refunded";
    default:
      return orderStatus;
  }
}
