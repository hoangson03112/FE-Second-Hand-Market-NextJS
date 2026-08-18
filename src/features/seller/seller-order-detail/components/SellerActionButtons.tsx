"use client";

import { Dispatch, SetStateAction } from "react";
import {
  IconAlertTriangle,
  IconBan,
  IconCheck,
  IconCircleCheck,
  IconHandStop,
  IconMessage,
  IconTruck,
  IconX,
} from "@tabler/icons-react";
import { createPortal } from "react-dom";
import {
  CancelOrderReasonDialog,
  Eyebrow,
  dangerAction,
  outlineAction,
  primaryAction,
} from "@/features/order/components";
import { ConfirmWithReasonDialog } from "@/components/ui";
import { sellerDisplayStatusFromRefund } from "@/constants/orderStatus";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/order";

interface SellerActionButtonsProps {
  order: Order;
  updatingStatus: boolean;
  cancelOpen: boolean;
  setCancelOpen: Dispatch<SetStateAction<boolean>>;
  rejectOpen: boolean;
  setRejectOpen: Dispatch<SetStateAction<boolean>>;
  approveOpen: boolean;
  setApproveOpen: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void;
  onCancel: (reason: string) => void;
  onApproveRefund: () => void;
  onRejectRefund: (reason: string) => void;
  onTrackingClick?: () => void;
  onReturnTrackingClick?: () => void;
  onConfirmReturnReceived?: () => void;
  onMarkDelivered?: () => void;
  isLocalPickup?: boolean;
  onChatClick?: () => void;
}

type Tone = "attention" | "info" | "success" | "failed";

const TONE_BORDER: Record<Tone, string> = {
  attention: "border-luxury-champagne/45",
  info: "border-luxury-ink/10",
  success: "border-accent/35",
  failed: "border-blush-300",
};

const TONE_GROUND: Record<Tone, string> = {
  attention: "border-luxury-champagne/45 bg-cream-100/70",
  info: "border-luxury-ink/10 bg-cream-50/70",
  success: "border-accent/25 bg-taupe-50",
  failed: "border-blush-200 bg-blush-50",
};

/**
 * One shape for every state the order can be in: a tonal header saying where
 * things stand, and the actions that state allows underneath. Nine near-identical
 * card variants used to be spelled out by hand, each drifting a little.
 */
function ActionPanel({
  tone,
  eyebrow,
  title,
  description,
  children,
}: {
  tone: Tone;
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[2px] border bg-white",
        TONE_BORDER[tone],
      )}
    >
      <header className={cn("border-b px-5 py-4 sm:px-6", TONE_GROUND[tone])}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <p className="mt-2.5 text-sm font-medium text-luxury-ink">{title}</p>
        {description ? (
          <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
            {description}
          </p>
        ) : null}
      </header>

      {children ? (
        <div className="flex flex-wrap gap-3 px-5 py-5 sm:px-6">{children}</div>
      ) : null}
    </section>
  );
}

export function SellerActionButtons({
  order,
  updatingStatus,
  cancelOpen,
  setCancelOpen,
  rejectOpen,
  setRejectOpen,
  approveOpen,
  setApproveOpen,
  onConfirm,
  onCancel,
  onApproveRefund,
  onRejectRefund,
  onTrackingClick,
  onReturnTrackingClick,
  onConfirmReturnReceived,
  onMarkDelivered,
  isLocalPickup,
  onChatClick,
}: SellerActionButtonsProps) {
  // The server parks `order.status` at "refund" for the whole refund
  // lifecycle and advances `refundRequestId.status` instead, so reading
  // `order.status` directly left every refund branch below unreachable and the
  // seller with no actions at all after a reload.
  const status = sellerDisplayStatusFromRefund(
    order.status,
    order.refundRequestId?.status,
  );

  const chatButton = onChatClick ? (
    <button type="button" onClick={onChatClick} className={outlineAction}>
      <IconMessage className="h-4 w-4" />
      Nhắn tin người mua
    </button>
  ) : null;

  /* ── Dialogs always rendered ─────────────────────────────────── */
  const dialogs = (
    <>
      <CancelOrderReasonDialog
        isOpen={cancelOpen}
        orderCode={order._id.slice(-8).toUpperCase()}
        onConfirm={onCancel}
        onCancel={() => setCancelOpen(false)}
        isLoading={updatingStatus}
      />
      <ConfirmWithReasonDialog
        isOpen={rejectOpen}
        title="Từ chối hoàn tiền"
        description={`Đơn hàng #${order._id.slice(-8).toUpperCase()}`}
        reasonLabel="Lý do từ chối"
        reasonPlaceholder="Mô tả lý do bạn từ chối yêu cầu hoàn tiền của người mua..."
        reasonHint="Người mua sẽ nhận được lý do từ chối này."
        confirmText="Xác nhận từ chối"
        variant="danger"
        onConfirm={onRejectRefund}
        onCancel={() => setRejectOpen(false)}
        isLoading={updatingStatus}
      />
      {approveOpen &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[9999] bg-luxury-ink/50 backdrop-blur-sm"
              onClick={() => setApproveOpen(false)}
            />
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <div
                className="relative w-full max-w-md overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white shadow-[0_24px_64px_color-mix(in_srgb,var(--luxury-ink)_18%,transparent)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="border-b border-luxury-ink/10 bg-cream-50/70 px-6 py-5">
                  <Eyebrow>Hoàn tiền</Eyebrow>
                  <h3 className="font-droid-serif mt-2.5 text-lg tracking-tight text-luxury-ink">
                    Chấp thuận hoàn tiền?
                  </h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-neutral-600">
                    Đơn #{order._id.slice(-8).toUpperCase()} sẽ chuyển sang
                    trạng thái &ldquo;Đang hoàn hàng&rdquo;.{" "}
                    {isLocalPickup
                      ? "Người mua sẽ trực tiếp trả lại hàng cho bạn."
                      : "Vận đơn hoàn GHN sẽ được tạo tự động."}
                  </p>
                </div>
                <div className="flex gap-3 px-6 py-5">
                  <button
                    type="button"
                    onClick={() => setApproveOpen(false)}
                    disabled={updatingStatus}
                    className={cn(outlineAction, "flex-1")}
                  >
                    Để sau
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setApproveOpen(false);
                      onApproveRefund();
                    }}
                    disabled={updatingStatus}
                    className={cn(primaryAction, "flex-1")}
                  >
                    {updatingStatus ? "Đang xử lý…" : "Chấp thuận"}
                  </button>
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );

  /* ── pending ─────────────────────────────────────────────────── */
  if (status === "pending") {
    return (
      <>
        {dialogs}
        <ActionPanel
          tone="attention"
          eyebrow="Việc cần làm"
          title="Đơn hàng mới đang chờ bạn xác nhận"
          description="Xác nhận hoặc hủy đơn trong thời gian sớm nhất để không quá SLA xử lý."
        >
          <button
            type="button"
            onClick={onConfirm}
            disabled={updatingStatus}
            className={cn(primaryAction, "flex-1")}
          >
            <IconCheck className="h-4 w-4" />
            {updatingStatus ? "Đang xử lý…" : "Xác nhận đơn"}
          </button>
          <button
            type="button"
            onClick={() => setCancelOpen(true)}
            disabled={updatingStatus}
            className={dangerAction}
          >
            <IconX className="h-4 w-4" />
            Hủy đơn
          </button>
        </ActionPanel>
      </>
    );
  }

  /* ── confirmed / in-transit statuses ────────────────────────── */
  if (
    status === "confirmed" ||
    status === "picked_up" ||
    status === "shipping" ||
    status === "out_for_delivery"
  ) {
    const showMarkDelivered =
      isLocalPickup && status === "confirmed" && !!onMarkDelivered;

    return (
      <>
        {dialogs}
        <ActionPanel
          tone={showMarkDelivered ? "attention" : "info"}
          eyebrow={showMarkDelivered ? "Việc cần làm" : "Đang xử lý"}
          title={
            showMarkDelivered
              ? "Hẹn gặp người mua để trao hàng"
              : "Đơn hàng đang trên đường tới người mua"
          }
          description={
            showMarkDelivered
              ? "Sau khi gặp mặt và trao hàng, nhấn xác nhận đã giao hàng."
              : "Theo dõi vận đơn để biết đơn đã tới đâu."
          }
        >
          {showMarkDelivered ? (
            <button
              type="button"
              onClick={onMarkDelivered}
              disabled={updatingStatus}
              className={cn(primaryAction, "flex-1")}
            >
              <IconHandStop className="h-4 w-4" />
              {updatingStatus ? "Đang xử lý…" : "Xác nhận đã giao hàng"}
            </button>
          ) : null}
          {onTrackingClick ? (
            <button
              type="button"
              onClick={onTrackingClick}
              className={showMarkDelivered ? outlineAction : primaryAction}
            >
              <IconTruck className="h-4 w-4" />
              Theo dõi vận chuyển
            </button>
          ) : null}
          {chatButton}
        </ActionPanel>
      </>
    );
  }

  /* ── refund_requested ────────────────────────────────────────── */
  if (status === "refund_requested") {
    // Seller already rejected — nothing left to act on.
    if (order.refundRequestId?.status === "rejected") {
      return (
        <>
          {dialogs}
          <ActionPanel
            tone="failed"
            eyebrow="Hoàn tiền"
            title="Bạn đã từ chối yêu cầu hoàn tiền"
            description={
              order.refundRequestId.sellerResponse?.comment
                ? `Lý do: ${order.refundRequestId.sellerResponse.comment}`
                : "Người mua có thể khiếu nại lên admin. Theo dõi thông báo nếu có tranh chấp."
            }
          >
            {chatButton}
          </ActionPanel>
        </>
      );
    }

    return (
      <>
        {dialogs}
        <ActionPanel
          tone="attention"
          eyebrow="Việc cần làm"
          title="Người mua đã yêu cầu hoàn tiền"
          description="Xem bằng chứng ở phần yêu cầu hoàn tiền, rồi chọn chấp thuận hoặc từ chối."
        >
          <button
            type="button"
            onClick={() => setApproveOpen(true)}
            disabled={updatingStatus}
            className={cn(primaryAction, "flex-1")}
          >
            <IconCircleCheck className="h-4 w-4" />
            {updatingStatus ? "Đang xử lý…" : "Chấp thuận hoàn tiền"}
          </button>
          <button
            type="button"
            onClick={() => setRejectOpen(true)}
            disabled={updatingStatus}
            className={dangerAction}
          >
            <IconX className="h-4 w-4" />
            Từ chối
          </button>
        </ActionPanel>
      </>
    );
  }

  /* ── delivered ───────────────────────────────────────────────── */
  if (status === "delivered") {
    return (
      <>
        {dialogs}
        <ActionPanel
          tone="info"
          eyebrow="Đang chờ"
          title="Đã giao tới người mua"
          description="Đang chờ người mua xác nhận hoàn thành đơn hàng."
        >
          {chatButton}
        </ActionPanel>
      </>
    );
  }

  /* ── completed ───────────────────────────────────────────────── */
  if (status === "completed") {
    return (
      <>
        {dialogs}
        <ActionPanel
          tone="success"
          eyebrow="Hoàn tất"
          title="Đơn hàng đã hoàn thành"
          description="Doanh thu của đơn này sẽ vào kỳ đối soát gần nhất."
        />
      </>
    );
  }

  /* ── cancelled ───────────────────────────────────────────────── */
  if (status === "cancelled") {
    return (
      <>
        {dialogs}
        <div className="flex gap-4 rounded-[2px] border border-blush-300 bg-blush-50 px-5 py-4 sm:px-6">
          <IconBan className="mt-0.5 h-4 w-4 shrink-0 text-blush-600" />
          <div>
            <p className="text-sm font-medium text-blush-800">
              Đơn hàng đã bị hủy
            </p>
            {order.cancelReason ? (
              <p className="mt-1.5 text-xs leading-relaxed text-blush-800/80">
                Lý do: {order.cancelReason}
              </p>
            ) : null}
          </div>
        </div>
      </>
    );
  }

  /* ── returning / return_shipping (buyer is sending item back) ── */
  if (status === "returning" || status === "return_shipping") {
    return (
      <>
        {dialogs}
        <ActionPanel
          tone="attention"
          eyebrow="Việc cần làm"
          title={
            isLocalPickup
              ? "Người mua đang chuẩn bị trả hàng"
              : "Người mua đang gửi hàng hoàn"
          }
          description={
            isLocalPickup
              ? "Liên hệ người mua để thống nhất thời gian nhận lại hàng trực tiếp."
              : "Theo dõi vận đơn hoàn để biết khi hàng đến nơi, rồi xác nhận đã nhận lại."
          }
        >
          {onConfirmReturnReceived ? (
            <button
              type="button"
              onClick={onConfirmReturnReceived}
              disabled={updatingStatus}
              className={cn(primaryAction, "flex-1")}
            >
              <IconCircleCheck className="h-4 w-4" />
              {updatingStatus ? "Đang xử lý…" : "Xác nhận đã nhận lại hàng"}
            </button>
          ) : null}
          {!isLocalPickup && onReturnTrackingClick ? (
            <button
              type="button"
              onClick={onReturnTrackingClick}
              className={outlineAction}
            >
              <IconTruck className="h-4 w-4" />
              Xem vận đơn hoàn
            </button>
          ) : null}
          {chatButton}
        </ActionPanel>
      </>
    );
  }

  /* ── returned (seller received item, waiting for refund release) */
  if (status === "returned") {
    return (
      <>
        {dialogs}
        <ActionPanel
          tone="success"
          eyebrow="Đang chờ"
          title="Đã nhận hàng hoàn — chờ xử lý hoàn tiền"
          description="Người mua sẽ gửi số tài khoản để hoàn tiền. Theo dõi thông báo để hoàn tất."
        >
          {chatButton}
        </ActionPanel>
      </>
    );
  }

  /* ── refund terminal states ──────────────────────────────────── */
  if (status === "refund_approved" || status === "refunded") {
    return (
      <>
        {dialogs}
        <ActionPanel
          tone={status === "refunded" ? "success" : "info"}
          eyebrow="Hoàn tiền"
          title={
            status === "refunded"
              ? "Đơn hàng đã được hoàn tiền"
              : "Yêu cầu hoàn tiền đã được chấp thuận"
          }
          description={
            status === "refunded"
              ? undefined
              : "Chờ người mua gửi hàng hoàn về theo vận đơn."
          }
        >
          {chatButton}
        </ActionPanel>
      </>
    );
  }

  /* ── fallback ────────────────────────────────────────────────── */
  return (
    <>
      {dialogs}
      <div className="flex gap-4 rounded-[2px] border border-luxury-ink/10 bg-cream-50/70 px-5 py-4 sm:px-6">
        <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-luxury-ink/40" />
        <p className="text-xs leading-relaxed text-neutral-600">
          Đơn hàng hiện không có thao tác nhanh nào.
        </p>
      </div>
    </>
  );
}
