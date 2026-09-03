import { getShippingMethodType } from "@/utils/format";
import type { Order } from "@/types/order";


export interface Stage {
  key: string;
  label: string;
}

const DELIVERY_STAGES: readonly Stage[] = [
  { key: "placed", label: "Đặt hàng" },
  { key: "confirmed", label: "Xác nhận" },
  { key: "shipping", label: "Vận chuyển" },
  { key: "received", label: "Đã nhận" },
];

const PICKUP_STAGES: readonly Stage[] = [
  { key: "placed", label: "Đặt hàng" },
  { key: "confirmed", label: "Xác nhận" },
  { key: "handover", label: "Trao hàng" },
  { key: "received", label: "Hoàn tất" },
];

const REFUND_STAGES: readonly Stage[] = [
  { key: "requested", label: "Gửi yêu cầu" },
  { key: "reviewing", label: "Xét duyệt" },
  { key: "returning", label: "Hoàn hàng" },
  { key: "refunded", label: "Hoàn tiền" },
];

const REFUND_ORDER_STATUSES = new Set([
  "refund",
  "refund_requested",
  "refund_approved",
  "returning",
  "return_shipping",
  "returned",
  "refunded",
]);

const BROKEN_STATUSES = new Set(["cancelled", "delivery_failed"]);

export interface OrderStageInfo {

  flow: "delivery" | "pickup" | "refund";
  stages: readonly Stage[];

  currentIndex: number;

  isComplete: boolean;
}

function refundStageIndex(
  orderStatus: string,
  refundStatus: string | null | undefined,
): { index: number; isComplete: boolean } {
  if (orderStatus === "refunded" || refundStatus === "completed") {
    return { index: 3, isComplete: true };
  }
  if (
    orderStatus === "returning" ||
    orderStatus === "return_shipping" ||
    orderStatus === "returned" ||
    (refundStatus &&
      [
        "approved",
        "returning",
        "return_shipping",
        "returned",
        "bank_info_required",
        "processing",
        "failed",
      ].includes(refundStatus))
  ) {
    return { index: 2, isComplete: false };
  }
  if (
    orderStatus === "refund_approved" ||
    (refundStatus && ["rejected", "disputed"].includes(refundStatus))
  ) {
    return { index: 1, isComplete: false };
  }
  return { index: 0, isComplete: false };
}


export function getOrderStage(order: Order): OrderStageInfo | null {
  if (BROKEN_STATUSES.has(order.status)) return null;

  const refund =
    order.refundRequestId && typeof order.refundRequestId === "object"
      ? order.refundRequestId
      : null;

  if (REFUND_ORDER_STATUSES.has(order.status) || refund) {
    const { index, isComplete } = refundStageIndex(order.status, refund?.status);
    return {
      flow: "refund",
      stages: REFUND_STAGES,
      currentIndex: index,
      isComplete,
    };
  }

  const isPickup =
    getShippingMethodType(order.shippingMethod) === "local_pickup";
  const base = {
    flow: isPickup ? ("pickup" as const) : ("delivery" as const),
    stages: isPickup ? PICKUP_STAGES : DELIVERY_STAGES,
  };

  if (order.status === "completed") {
    return { ...base, currentIndex: 3, isComplete: true };
  }
  if (order.status === "delivered") {
    return { ...base, currentIndex: isPickup ? 2 : 3, isComplete: false };
  }
  if (order.status === "shipping" || order.status === "out_for_delivery") {
    return { ...base, currentIndex: 2, isComplete: false };
  }
  if (order.status === "confirmed" || order.status === "picked_up") {
    return { ...base, currentIndex: 1, isComplete: false };
  }
  return { ...base, currentIndex: 0, isComplete: false };
}

export interface BuyerTodo {

  label: string;

  hint?: string;

  inlineAction?: boolean;
}


export function getBuyerTodo(order: Order): BuyerTodo | null {
  const refund =
    order.refundRequestId && typeof order.refundRequestId === "object"
      ? order.refundRequestId
      : null;
  const refundStatus = refund?.status;
  const hasBankInfo = Boolean(order.refundBankInfo?.buyerAccountNumber);

  if (refundStatus === "bank_info_required" && !hasBankInfo) {
    return { label: "Bổ sung số tài khoản nhận hoàn tiền" };
  }

  if (refundStatus === "rejected") {
    return {
      label: "Yêu cầu hoàn tiền bị từ chối",
      hint: "Mở chi tiết để khiếu nại nếu bạn không đồng ý.",
    };
  }

  if (
    refundStatus === "approved" ||
    refundStatus === "return_shipping" ||
    refundStatus === "returning" ||
    order.status === "returning" ||
    order.status === "return_shipping"
  ) {
    return {
      label: "Gửi hàng hoàn về người bán",
      hint: "Làm theo vận đơn hoàn trả trong trang chi tiết.",
    };
  }

  if (
    (order.status === "returned" || refundStatus === "returned") &&
    !hasBankInfo
  ) {
    return { label: "Bổ sung số tài khoản nhận hoàn tiền" };
  }

  if (order.status === "delivered") {
    return { label: "Xác nhận đã nhận hàng", inlineAction: true };
  }

  return null;
}
