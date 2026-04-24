import { useMemo } from "react";
import { getShippingMethodType } from "@/utils/format";
import { STATUS_CONFIG } from "@/constants/orderStatus";
import {
  GHN_PROGRESS_STEPS,
  REFUND_PROGRESS_STEPS,
  LOCAL_PROGRESS_STEPS,
  STATUS_DESCRIPTION_GHN,
  STATUS_DESCRIPTION_LOCAL,
  TERMINAL_STATUSES,
} from "../constants";

type RefundStatusLike =
  | "pending"
  | "approved"
  | "rejected"
  | "disputed"
  | "returning"
  | "return_shipping"
  | "returned"
  | "bank_info_required"
  | "processing"
  | "failed"
  | "completed"
  | null;

/**
 * Backend keeps order.status as "refund" until payout; granular phase is Refund.status.
 * Hero timeline must follow refund doc, not only order.status.
 */
function getRefundStepKey(orderStatus: string, refundStatus: RefundStatusLike): string {
  if (orderStatus === "refunded" || refundStatus === "completed") return "refunded";
  if (
    ["returning", "return_shipping", "returned"].includes(orderStatus) ||
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
    return "returning";
  }
  if (
    orderStatus === "refund_approved" ||
    (refundStatus && ["rejected", "disputed"].includes(refundStatus))
  ) {
    return "refund_reviewing";
  }
  return "refund_requested";
}

export function useOrderDetailView(order: {
  status: string;
  shippingMethod?: string;
  refundStatus?: string | null;
}) {
  return useMemo(() => {
    const isLocalPickup = getShippingMethodType(order.shippingMethod) === "local_pickup";
    const isRefundFlow =
      ["refund", "refund_requested", "refund_approved", "returning", "return_shipping", "returned", "refunded"]
        .includes(order.status) || Boolean(order.refundStatus);
    const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
    const progressSteps = isRefundFlow
      ? REFUND_PROGRESS_STEPS
      : isLocalPickup
      ? LOCAL_PROGRESS_STEPS
      : GHN_PROGRESS_STEPS;
    const statusDescription = isLocalPickup ? STATUS_DESCRIPTION_LOCAL : STATUS_DESCRIPTION_GHN;
    const currentStepKey = isRefundFlow
      ? getRefundStepKey(order.status, (order.refundStatus as RefundStatusLike) ?? null)
      : order.status;
    const currentStepIdx = progressSteps.findIndex((s) => s.key === currentStepKey);
    const effectiveStepIdx = currentStepIdx >= 0 ? currentStepIdx : 0;
    const isTerminal = isRefundFlow
      ? order.status === "refunded" || order.refundStatus === "completed"
      : TERMINAL_STATUSES.includes(order.status as (typeof TERMINAL_STATUSES)[number]);

    return {
      statusConfig,
      progressSteps,
      statusDescription,
      effectiveStepIdx,
      isTerminal,
      isLocalPickup,
    };
  }, [order.status, order.shippingMethod, order.refundStatus]);
}
