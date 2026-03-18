import { useMemo } from "react";
import { getShippingMethodType } from "@/utils/format";
import { STATUS_CONFIG } from "@/constants/orderStatus";
import {
  GHN_PROGRESS_STEPS,
  LOCAL_PROGRESS_STEPS,
  STATUS_DESCRIPTION_GHN,
  STATUS_DESCRIPTION_LOCAL,
  TERMINAL_STATUSES,
} from "../constants";

export function useOrderDetailView(order: { status: string; shippingMethod?: string }) {
  return useMemo(() => {
    const isLocalPickup = getShippingMethodType(order.shippingMethod) === "local_pickup";
    const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
    const progressSteps = isLocalPickup ? LOCAL_PROGRESS_STEPS : GHN_PROGRESS_STEPS;
    const statusDescription = isLocalPickup ? STATUS_DESCRIPTION_LOCAL : STATUS_DESCRIPTION_GHN;
    const currentStepIdx = progressSteps.findIndex((s) => s.key === order.status);
    const effectiveStepIdx = currentStepIdx >= 0 ? currentStepIdx : 0;
    const isTerminal = TERMINAL_STATUSES.includes(order.status as (typeof TERMINAL_STATUSES)[number]);

    return {
      statusConfig,
      progressSteps,
      statusDescription,
      effectiveStepIdx,
      isTerminal,
      isLocalPickup,
    };
  }, [order.status, order.shippingMethod]);
}
