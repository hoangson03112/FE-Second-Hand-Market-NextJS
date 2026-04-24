import { REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER } from "@/constants/refund";

export const GHN_PROGRESS_STEPS = [
  { key: "pending", shortLabel: "Chờ xác nhận" },
  { key: "confirmed", shortLabel: "Đã xác nhận" },
  { key: "picked_up", shortLabel: "Đã lấy hàng" },
  { key: "shipping", shortLabel: "Vận chuyển" },
  { key: "out_for_delivery", shortLabel: "Đang giao" },
  { key: "delivered", shortLabel: "Đã giao" },
  { key: "completed", shortLabel: "Hoàn tất" },
] as const;

export const REFUND_PROGRESS_STEPS = [
  { key: "refund_requested", shortLabel: "Gửi yêu cầu" },
  { key: "refund_reviewing", shortLabel: "Đang xét duyệt" },
  { key: "returning", shortLabel: "Hoàn trả hàng" },
  { key: "refunded", shortLabel: "Đã hoàn tiền" },
] as const;

export const LOCAL_PROGRESS_STEPS = [
  { key: "pending", shortLabel: "Chờ xác nhận" },
  { key: "confirmed", shortLabel: "Đã xác nhận" },
  { key: "delivered", shortLabel: "Đã giao" },
  { key: "completed", shortLabel: "Hoàn tất" },
] as const;

export const STATUS_DESCRIPTION_GHN: Record<string, string> = {
  pending: "Đơn hàng đang chờ người bán xác nhận.",
  confirmed: "Người bán đã xác nhận đơn hàng.",
  picked_up: "GHN đã lấy hàng thành công.",
  shipping: "Đơn hàng đang được vận chuyển.",
  out_for_delivery: "Shipper đang trên đười giao hàng.",
  delivered: "Đơn hàng đã được giao đến bạn.",
  completed: "Đơn hàng đã hoàn thành.",
  delivery_failed: "Giao hàng thất bại.",
  returned: "Hàng đã về người bán. Admin đang xử lý hoàn tiền.",
  cancelled: "Đơn hàng đã bị hủy.",
  returning: `Đơn hoàn trả đã được tạo. Vui lòng đến bưu cục GHN gần nhất để giao lại hàng. ${REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER}`,
  return_shipping: `Đơn hoàn trả đang được vận chuyển. ${REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER}`,
  refund_requested: "Người mua đã gửi yêu cầu hoàn tiền, đang chờ người bán xem xét.",
  refund: "Yêu cầu hoàn tiền đang được xử lý. Vui lòng theo dõi tiến trình hoàn trả hàng.",
  refund_approved: "Người bán đã chấp thuận hoàn tiền, quản trị viên đang xử lý.",
  refunded: "Hoàn tiền đã được xử lý thành công.",
};

export const STATUS_DESCRIPTION_LOCAL: Record<string, string> = {
  pending: "Đơn hàng đang chờ người bán xác nhận.",
  confirmed: "Người bán đã xác nhận • Liên hệ để sắp xếp gặp mặt trao hàng.",
  delivered: "Đơn hàng đã được giao trực tiếp.",
  completed: "Đơn hàng đã hoàn thành.",
  cancelled: "Đơn hàng đã bị hủy.",
  returning: "Người bán đã chấp thuận hoàn hàng. Liên hệ người bán để trả lại hàng trực tiếp.",
  return_shipping: "Hàng đang được trả lại người bán.",
  returned: "Người bán đã nhận lại hàng. Admin đang xử lý hoàn tiền.",
  refund_requested: "Người mua đã gửi yêu cầu hoàn tiền, đang chờ người bán xem xét.",
  refund: "Yêu cầu hoàn tiền đang được xử lý giữa người mua, người bán và hệ thống.",
  refund_approved: "Người bán đã chấp thuận hoàn tiền, quản trị viên đang xử lý.",
  refunded: "Hoàn tiền đã được xử lý thành công.",
};

export const TERMINAL_STATUSES = [
  "delivery_failed",
  "cancelled",
  "returning",
  "return_shipping",
  "returned",
  "refund_requested",
  "refund_approved",
  "refunded",
] as const;
