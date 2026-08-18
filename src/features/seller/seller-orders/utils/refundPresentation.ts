import { REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER } from "@/constants/refund";
import type { NoticeTone } from "@/features/order/components";

/** Refund lifecycle, phrased for the seller who has to act on it. */
export const REFUND_REQUEST_STATUS_LABELS: Record<string, string> = {
  pending: "Chờ bạn xét duyệt",
  approved: "Đã chấp thuận (chờ tạo / gửi hàng hoàn)",
  rejected: "Đã từ chối",
  return_shipping: "Đang hoàn trả hàng (buyer gửi về)",
  returning: "Hàng hoàn đang vận chuyển",
  returned: "Đã nhận hàng hoàn",
  bank_info_required: "Chờ buyer cung cấp STK",
  processing: "Đang xử lý hoàn tiền",
  completed: "Đã hoàn tiền",
  failed: "Hoàn tiền lỗi — cần xử lý lại",
  disputed: "Đang tranh chấp",
};

/** Short form used inside the list rows, where there is no space for a sentence. */
export const REFUND_PHASE_SHORT_LABELS: Record<string, string> = {
  pending: "Chờ xét duyệt",
  approved: "Chờ gửi hàng hoàn",
  rejected: "Đã từ chối",
  return_shipping: "Buyer đang gửi về",
  returning: "Hàng hoàn đang đi",
  returned: "Đã nhận hàng hoàn",
  bank_info_required: "Chờ STK buyer",
  processing: "Đang hoàn tiền",
  completed: "Đã hoàn tiền",
  failed: "Lỗi hoàn tiền",
  disputed: "Tranh chấp",
};

export interface SellerRefundTodo {
  tone: NoticeTone;
  title: string;
  description: string;
}

/**
 * `order.status` usually stays "refund" for the whole return flow — the step the
 * seller is actually on lives on the Refund document, so both are read together.
 */
export function getSellerRefundTodo(
  orderStatus: string,
  refundStatus: string | null | undefined,
): SellerRefundTodo | null {
  if (orderStatus === "refunded") {
    return {
      tone: "success",
      title: "Hoàn tiền đã hoàn tất",
      description: "Đơn hàng này đã được hoàn tiền thành công cho buyer.",
    };
  }
  if (refundStatus === "rejected") {
    return {
      tone: "warning",
      title: "Bạn đã từ chối yêu cầu",
      description:
        "Buyer có thể khiếu nại lên admin. Theo dõi thông báo nếu có tranh chấp.",
    };
  }
  if (refundStatus === "disputed") {
    return {
      tone: "warning",
      title: "Đang tranh chấp",
      description: "Admin đang xem xét. Không cần bấm duyệt lại trên đơn này.",
    };
  }
  if (
    refundStatus === "pending" ||
    ((orderStatus === "refund" || orderStatus === "refund_requested") &&
      !refundStatus)
  ) {
    return {
      tone: "warning",
      title: "Việc cần làm ngay",
      description:
        "Kiểm tra lý do hoàn tiền, sau đó chọn Chấp thuận hoặc Từ chối để không quá SLA xử lý.",
    };
  }
  if (
    refundStatus === "approved" ||
    refundStatus === "return_shipping" ||
    refundStatus === "returning"
  ) {
    return {
      tone: "info",
      title: "Việc cần làm ngay",
      description:
        "Theo dõi vận đơn hoàn và xác nhận đã nhận lại hàng khi buyer trả hàng thành công. " +
        REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER,
    };
  }
  if (
    refundStatus === "returned" ||
    refundStatus === "processing" ||
    refundStatus === "bank_info_required"
  ) {
    return {
      tone: "warning",
      title: "Đơn đã sẵn sàng hoàn tiền",
      description:
        "Hệ thống đang xử lý chuyển tiền hoàn cho buyer (hoặc chờ thông tin từ buyer).",
    };
  }
  if (refundStatus === "completed") {
    return {
      tone: "success",
      title: "Hoàn tiền đã hoàn tất",
      description: "Đơn hàng này đã được hoàn tiền thành công cho buyer.",
    };
  }
  switch (orderStatus) {
    case "returning":
    case "return_shipping":
      return {
        tone: "info",
        title: "Việc cần làm ngay",
        description:
          "Theo dõi vận đơn hoàn và xác nhận đã nhận lại hàng khi buyer trả hàng thành công. " +
          REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER,
      };
    case "returned":
      return {
        tone: "warning",
        title: "Đơn đã sẵn sàng hoàn tiền",
        description:
          "Bạn đã nhận lại hàng. Hệ thống đang chờ admin xử lý hoàn tiền cho buyer.",
      };
    default:
      return null;
  }
}
