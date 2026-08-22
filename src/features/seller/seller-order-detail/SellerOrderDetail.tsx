"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IconArrowUpRight, IconPackage, IconTruck } from "@tabler/icons-react";
import { Container } from "@/components/layout/Container";
import { ReturnInspectionModal } from "@/features/seller/components";
import { Eyebrow, OrderTracking, microCaps } from "@/features/order/components";
import { cn } from "@/lib/utils";
import { getShippingMethodType } from "@/utils/format";
import { openChatWithOrder } from "@/utils/chat";
import { getAvatarUrl } from "@/utils";
import { SellerOrderDetailHeader } from "./components/SellerOrderDetailHeader";
import { SellerOrderTimeline } from "./components/SellerOrderTimeline";
import { SellerProductsCard } from "./components/SellerProductsCard";
import { SellerShippingCard } from "./components/SellerShippingCard";
import { SellerBuyerCard } from "./components/SellerBuyerCard";
import { SellerPaymentSummary } from "./components/SellerPaymentSummary";
import { SellerRefundCard } from "./components/SellerRefundCard";
import { SellerPaymentProofCard } from "./components/SellerPaymentProofCard";
import { SellerActionButtons } from "./components/SellerActionButtons";
import { useSellerOrderDetail } from "./hooks/useSellerOrderDetail";
import type { TimelineStep } from "./components/SellerOrderTimeline";

const STATUS_TO_TS: Record<string, string> = {
  pending: "createdAt",
  confirmed: "confirmedAt",
  picked_up: "pickedUpAt",
  shipping: "shippingAt",
  out_for_delivery: "outForDeliveryAt",
  delivered: "deliveredAt",
  completed: "completedAt",
};

const GHN_STEPS: Array<{ key: string; label: string }> = [
  { key: "pending", label: "Đặt hàng" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "picked_up", label: "Đã lấy hàng" },
  { key: "shipping", label: "Vận chuyển" },
  { key: "out_for_delivery", label: "Đang giao" },
  { key: "delivered", label: "Đã giao" },
  { key: "completed", label: "Hoàn thành" },
];

const LOCAL_STEPS: Array<{ key: string; label: string }> = [
  { key: "pending", label: "Đặt hàng" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "delivered", label: "Đã giao" },
  { key: "completed", label: "Hoàn thành" },
];

/** Statuses that leave the fulfilment rail rather than advancing along it. */
const OFF_RAIL: Record<string, string> = {
  cancelled: "Đơn hàng đã bị hủy nên không còn tiến trình giao nhận.",
  delivery_failed:
    "Giao hàng thất bại. Kiểm tra vận đơn hoặc liên hệ người mua để xử lý.",
};

function buildTimeline(
  order: NonNullable<ReturnType<typeof useSellerOrderDetail>["order"]>,
  isLocalPickup: boolean,
): { steps: TimelineStep[]; currentIndex: number } {
  const STEPS = isLocalPickup ? LOCAL_STEPS : GHN_STEPS;
  const ORDER = STEPS.map((s) => s.key);

  const statusHistory: Array<{ status: string; updatedAt: string }> =
    (
      order as unknown as {
        statusHistory?: Array<{ status: string; updatedAt: string }>;
      }
    ).statusHistory ?? [];
  const orderRaw = order as unknown as Record<string, unknown>;
  const currentStatus = String(order.status || "");
  const currIdx = ORDER.indexOf(currentStatus);

  const steps = STEPS.map(({ key, label }) => {
    const historyEntry = statusHistory.find((h) => h.status === key);
    const tsField = STATUS_TO_TS[key] || key + "At";
    let at = historyEntry?.updatedAt ?? orderRaw[tsField];

    // No explicit timestamp, but the order has already moved past this step —
    // fall back to the last update so the step does not read as "not reached".
    if (!at && currIdx >= 0) {
      const idx = ORDER.indexOf(key);
      if (idx >= 0 && idx <= currIdx) {
        at = (order.updatedAt || order.createdAt) as string;
      }
    }
    return { key, label, at: at as string | undefined };
  });

  return { steps, currentIndex: currIdx >= 0 ? currIdx : 0 };
}

/** Centered ivory state for loading and not-found. */
function DetailPlaceholder({
  title,
  subtitle,
  spinner = false,
  action,
}: {
  title: string;
  subtitle?: string;
  spinner?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-luxury-ivory px-4">
      <div className="flex flex-col items-center gap-5 text-center">
        {spinner ? (
          <span className="h-4 w-4 animate-spin rounded-full border border-luxury-ink/20 border-t-luxury-ink" />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-white">
            <IconPackage className="h-6 w-6 text-luxury-ink" />
          </span>
        )}
        <p className={cn(microCaps, "text-neutral-500")}>{title}</p>
        {subtitle ? (
          <p className="max-w-xs text-sm leading-relaxed text-neutral-600">
            {subtitle}
          </p>
        ) : null}
        {action}
      </div>
    </div>
  );
}

interface SellerOrderDetailProps {
  orderId: string;
}

export default function SellerOrderDetail({ orderId }: SellerOrderDetailProps) {
  const trackingRef = useRef<HTMLDivElement>(null);
  const returnTrackingRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const {
    order,
    isLoading,
    updatingStatus,
    cancelOpen,
    setCancelOpen,
    rejectOpen,
    setRejectOpen,
    approveOpen,
    setApproveOpen,
    isBankTransfer,
    paymentProof,
    proofLoading,
    verifyingProof,
    handleConfirm,
    handleCancel,
    handleApproveRefund,
    handleRejectRefund,
    handleConfirmReturnReceived,
    handleMarkDelivered,
    handleVerifyProof,
    handleRejectProof,
  } = useSellerOrderDetail(orderId);

  // Seller must inspect the returned parcel before the refund can proceed.
  const [inspectionOpen, setInspectionOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    const frame = window.requestAnimationFrame(() => setIsRevealed(true));
    return () => window.cancelAnimationFrame(frame);
  }, [isLoading]);

  const handleTrackingClick = () => {
    trackingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleReturnTrackingClick = () => {
    returnTrackingRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleChatClick = () => {
    if (!order) return;
    openChatWithOrder(
      {
        _id: order.buyerId._id,
        fullName: order.buyerId.fullName,
        avatar:
          getAvatarUrl(
            (order.buyerId as { avatar?: { url?: string } })?.avatar,
          ) ?? undefined,
      },
      {
        _id: order._id,
        status: order.status,
        totalAmount: order.totalAmount,
        products: order.products.map((p) => ({
          name: p.productId?.name ?? "",
          quantity: p.quantity,
          price: p.price,
        })),
      },
    );
  };

  if (isLoading) {
    return <DetailPlaceholder title="Đang tải đơn hàng" spinner />;
  }

  if (!order) {
    return (
      <DetailPlaceholder
        title="Không tìm thấy đơn hàng"
        subtitle="Đơn hàng này không tồn tại hoặc không thuộc shop của bạn."
        action={
          <Link
            href="/my/orders"
            className="group mt-2 inline-flex items-center gap-2 rounded-[2px] bg-luxury-ink px-7 py-3.5 text-2xs font-bold uppercase tracking-[0.22em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800"
          >
            Về danh sách đơn hàng
            <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        }
      />
    );
  }

  const isLocalPickup =
    getShippingMethodType(order.shippingMethod) === "local_pickup";
  const { steps, currentIndex } = buildTimeline(order, isLocalPickup);
  const hasTracking = !isLocalPickup && Boolean(order.ghnOrderCode);
  const hasReturnTracking = !isLocalPickup && Boolean(order.ghnReturnOrderCode);

  const revealClass = cn(
    "transition-all duration-700 ease-out",
    isRevealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
  );
  const delay = (ms: number) => ({ transitionDelay: `${ms}ms` });

  return (
    <div className="min-h-screen bg-luxury-ivory">
      <SellerOrderDetailHeader
        orderId={order._id}
        status={order.status}
        paymentStatus={order.paymentStatus}
        createdAt={order.createdAt}
        totalAmount={order.totalAmount}
      />

      <Container maxWidth="9xl" paddingX="md" paddingY="lg">
        <div className="space-y-6">
          <div className={revealClass}>
            <SellerOrderTimeline
              steps={steps}
              currentIndex={currentIndex}
              brokenNotice={OFF_RAIL[order.status] ?? null}
            />
          </div>

          <div
            style={delay(80)}
            className={cn(
              revealClass,
              "grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8",
            )}
          >
            {/* Left column — what is in the order and what to do about it */}
            <div className="space-y-6 lg:col-span-7">
              <SellerActionButtons
                order={order}
                updatingStatus={updatingStatus}
                cancelOpen={cancelOpen}
                setCancelOpen={setCancelOpen}
                rejectOpen={rejectOpen}
                setRejectOpen={setRejectOpen}
                approveOpen={approveOpen}
                setApproveOpen={setApproveOpen}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onApproveRefund={handleApproveRefund}
                onRejectRefund={handleRejectRefund}
                onTrackingClick={hasTracking ? handleTrackingClick : undefined}
                onReturnTrackingClick={
                  hasReturnTracking ? handleReturnTrackingClick : undefined
                }
                onConfirmReturnReceived={() => setInspectionOpen(true)}
                onMarkDelivered={
                  isLocalPickup ? handleMarkDelivered : undefined
                }
                isLocalPickup={isLocalPickup}
                onChatClick={handleChatClick}
              />

              {order.refundRequestId ? (
                <SellerRefundCard refund={order.refundRequestId} />
              ) : null}

              {/* Bank transfer proof — người bán tự đối soát vì tiền vào thẳng
                  tài khoản của họ. Đơn đã hủy thì không còn gì để đối soát. */}
              {isBankTransfer && order.status !== "cancelled" ? (
                <SellerPaymentProofCard
                  proof={paymentProof}
                  loading={proofLoading}
                  amount={order.totalAmount}
                  submitting={verifyingProof}
                  onVerify={handleVerifyProof}
                  onReject={handleRejectProof}
                />
              ) : null}

              <SellerProductsCard order={order} />
            </div>

            {/* Right column — who and how much */}
            <div className="lg:col-span-5">
              <div className="space-y-6 lg:sticky lg:top-6">
                <SellerPaymentSummary order={order} />
                <SellerBuyerCard
                  order={order}
                  isLocalPickup={isLocalPickup}
                  onChatClick={handleChatClick}
                />
                <SellerShippingCard
                  order={order}
                  isLocalPickup={isLocalPickup}
                />

                {hasTracking ? (
                  <div ref={trackingRef}>
                    <OrderTracking
                      orderId={order._id}
                      ghnOrderCode={order.ghnOrderCode}
                    />
                  </div>
                ) : null}

                {hasReturnTracking ? (
                  <div ref={returnTrackingRef}>
                    <div className="mb-3 flex items-center gap-2.5">
                      <IconTruck className="h-4 w-4 text-luxury-ink" />
                      <Eyebrow>Vận đơn hoàn hàng</Eyebrow>
                    </div>
                    <OrderTracking
                      orderId={order._id}
                      ghnOrderCode={order.ghnReturnOrderCode}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Container>

      <ReturnInspectionModal
        isOpen={inspectionOpen}
        submitting={updatingStatus}
        onClose={() => setInspectionOpen(false)}
        onSubmit={async (payload) => {
          await handleConfirmReturnReceived(payload);
          setInspectionOpen(false);
        }}
      />
    </div>
  );
}
