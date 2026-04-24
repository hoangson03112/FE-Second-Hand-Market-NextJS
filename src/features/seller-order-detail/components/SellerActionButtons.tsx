"use client";

import { Dispatch, SetStateAction } from "react";
import {
  IconCheck,
  IconX,
  IconTruck,
  IconMessage,
  IconAlertTriangle,
  IconCircleCheck,
  IconBan,
  IconRefresh,
  IconHandStop,
} from "@tabler/icons-react";
import { createPortal } from "react-dom";
import { CancelOrderReasonDialog } from "@/components/shared";
import { ConfirmWithReasonDialog } from "@/components/shared";
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
  const { status } = order;

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
      {approveOpen && createPortal(
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-in fade-in"
            onClick={() => setApproveOpen(false)}
          />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
              className="relative bg-background rounded-2xl shadow-xl w-full max-w-sm border border-border animate-in zoom-in-95 slide-in-from-bottom-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 p-6 border-b border-border">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <IconCircleCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Chấp thuận hoàn tiền?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Đơn hàng #{order._id.slice(-8).toUpperCase()} sẽ chuyển sang trạng thái
                    &ldquo;Đang hoàn hàng&rdquo;.{" "}
                    {isLocalPickup
                      ? "Người mua sẽ trực tiếp trả lại hàng cho bạn."
                      : "GHN return shipment sẽ được tạo tự động."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4">
                <button
                  type="button"
                  onClick={() => setApproveOpen(false)}
                  disabled={updatingStatus}
                  className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => { setApproveOpen(false); onApproveRefund(); }}
                  disabled={updatingStatus}
                  className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors disabled:opacity-50"
                >
                  {updatingStatus ? "Đang xử lý..." : "Chấp thuận"}
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );

  /* ── pending ─────────────────────────────────────────────────── */
  if (status === "pending") {
    return (
      <>
        {dialogs}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-900/40">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <IconAlertTriangle className="w-4 h-4 shrink-0" />
              <p className="text-sm font-medium">Đơn hàng mới đang chờ xác nhận</p>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-1 ml-6">
              Vui lòng xác nhận hoặc hủy đơn trong thời gian sớm nhất.
            </p>
          </div>
          <div className="p-4 flex gap-3">
            <button
              onClick={() => setCancelOpen(true)}
              disabled={updatingStatus}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-destructive/40 text-destructive hover:bg-destructive/5 font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconX className="w-4 h-4" />
              Hủy đơn
            </button>
            <button
              onClick={onConfirm}
              disabled={updatingStatus}
              className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <IconCheck className="w-4 h-4" />
              {updatingStatus ? "Đang xử lý..." : "Xác nhận đơn"}
            </button>
          </div>
        </div>
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
    const showMarkDelivered = isLocalPickup && status === "confirmed" && !!onMarkDelivered;
    return (
      <>
        {dialogs}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4 flex flex-col gap-3">
          {showMarkDelivered && (
            <>
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-base">🤝</span>
                <p className="text-xs text-emerald-700">
                  Sau khi gặp mặt và trao hàng cho người mua, nhấn nút bên dưới để xác nhận.
                </p>
              </div>
              <button
                onClick={onMarkDelivered}
                disabled={updatingStatus}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IconHandStop className="w-4 h-4" />
                {updatingStatus ? "Đang xử lý..." : "Xác nhận đã giao hàng"}
              </button>
            </>
          )}
          {onTrackingClick && (
            <button
              onClick={onTrackingClick}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm transition-colors shadow-sm"
            >
              <IconTruck className="w-4 h-4" />
              Theo dõi vận chuyển
            </button>
          )}
          {onChatClick && (
            <button
              onClick={onChatClick}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-border hover:bg-muted/50 font-semibold text-sm transition-colors"
            >
              <IconMessage className="w-4 h-4" />
              Nhắn tin người mua
            </button>
          )}
        </div>
      </>
    );
  }

  /* ── refund_requested ────────────────────────────────────────── */
  if (status === "refund_requested") {
    // Seller already rejected — show info banner
    if (order.refundRequestId?.status === "rejected") {
      return (
        <>
          {dialogs}
          <div className="bg-rose-50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/40 shadow-sm p-4 flex items-center gap-3">
            <IconX className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-rose-700 dark:text-rose-400">Đã từ chối yêu cầu hoàn tiền</p>
              {order.refundRequestId.sellerResponse?.comment && (
                <p className="text-xs text-rose-600 dark:text-rose-500 mt-0.5">
                  Lý do: {order.refundRequestId.sellerResponse.comment}
                </p>
              )}
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        {dialogs}
        <div className="bg-card rounded-2xl border border-orange-200 dark:border-orange-900/40 shadow-sm overflow-hidden">
          <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border-b border-orange-200 dark:border-orange-900/40">
            <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <IconRefresh className="w-4 h-4 shrink-0" />
              <p className="text-sm font-medium">Người mua đã yêu cầu hoàn tiền</p>
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-500 mt-1 ml-6">
              Xem yêu cầu bên dưới và chọn hành động phù hợp.
            </p>
          </div>
          <div className="p-4 flex gap-3">
            <button
              onClick={() => setRejectOpen(true)}
              disabled={updatingStatus}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-destructive/40 text-destructive hover:bg-destructive/5 font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconX className="w-4 h-4" />
              Từ chối
            </button>
            <button
              onClick={() => setApproveOpen(true)}
              disabled={updatingStatus}
              className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <IconCircleCheck className="w-4 h-4" />
              {updatingStatus ? "Đang xử lý..." : "Chấp thuận hoàn tiền"}
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ── delivered ───────────────────────────────────────────────── */
  if (status === "delivered") {
    return (
      <>
        {dialogs}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconTruck className="w-4 h-4 shrink-0" />
            <p className="text-sm">Đơn hàng đã giao tới người mua. Đang chờ xác nhận hoàn thành.</p>
          </div>
          {onChatClick && (
            <button
              onClick={onChatClick}
              className="flex items-center justify-center gap-2 w-full mt-3 px-4 py-2.5 rounded-xl border border-border hover:bg-muted/50 font-semibold text-sm transition-colors"
            >
              <IconMessage className="w-4 h-4" />
              Nhắn tin người mua
            </button>
          )}
        </div>
      </>
    );
  }

  /* ── completed ───────────────────────────────────────────────── */
  if (status === "completed") {
    return (
      <>
        {dialogs}
        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 shadow-sm p-4 flex items-center gap-3">
          <IconCircleCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Đơn hàng đã hoàn thành thành công.</p>
        </div>
      </>
    );
  }

  /* ── cancelled ───────────────────────────────────────────────── */
  if (status === "cancelled") {
    return (
      <>
        {dialogs}
        <div className="bg-rose-50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/40 shadow-sm p-4 flex items-center gap-3">
          <IconBan className="w-5 h-5 text-rose-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-rose-700 dark:text-rose-400">Đơn hàng đã bị hủy</p>
            {order.cancelReason && (
              <p className="text-xs text-rose-600 dark:text-rose-500 mt-0.5">Lý do: {order.cancelReason}</p>
            )}
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
        <div className="bg-card rounded-2xl border border-blue-200 dark:border-blue-900/40 shadow-sm overflow-hidden">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-900/40">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <IconRefresh className="w-4 h-4 shrink-0" />
              <p className="text-sm font-medium">
                {isLocalPickup ? "Người mua đang chuẩn bị trả hàng" : "Người mua đang gửi hàng hoàn"}
              </p>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-500 mt-1 ml-6">
              {isLocalPickup
                ? "Liên hệ người mua để thống nhất thời gian nhận lại hàng trực tiếp."
                : "Theo dõi vận đơn hoàn để biết khi hàng đến nơi, rồi xác nhận nhận hàng."}
            </p>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {!isLocalPickup && onReturnTrackingClick && (
              <button
                onClick={onReturnTrackingClick}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold text-sm transition-colors shadow-sm"
              >
                <IconTruck className="w-4 h-4" />
                Xem vận đơn hoàn
              </button>
            )}
            {onConfirmReturnReceived && (
              <button
                onClick={onConfirmReturnReceived}
                disabled={updatingStatus}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IconCircleCheck className="w-4 h-4" />
                {updatingStatus ? "Đang xử lý..." : "Xác nhận đã nhận lại hàng"}
              </button>
            )}
            {onChatClick && (
              <button
                onClick={onChatClick}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-border hover:bg-muted/50 font-semibold text-sm transition-colors"
              >
                <IconMessage className="w-4 h-4" />
                Nhắn tin người mua
              </button>
            )}
          </div>
        </div>
      </>
    );
  }

  /* ── returned (seller received item, waiting for refund release) */
  if (status === "returned") {
    return (
      <>
        {dialogs}
        <div className="bg-card rounded-2xl border border-emerald-200 dark:border-emerald-900/40 shadow-sm overflow-hidden">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border-b border-emerald-200 dark:border-emerald-900/40">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <IconCircleCheck className="w-4 h-4 shrink-0" />
              <p className="text-sm font-medium">Đã nhận hàng hoàn — chờ admin xử lý hoàn tiền</p>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1 ml-6">
              Admin sẽ xử lý hoàn tiền cho người mua trong thời gian sớm nhất.
            </p>
          </div>
          {onChatClick && (
            <div className="p-4">
              <button
                onClick={onChatClick}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-border hover:bg-muted/50 font-semibold text-sm transition-colors"
              >
                <IconMessage className="w-4 h-4" />
                Nhắn tin người mua
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  /* ── refund terminal states ──────────────────────────────────── */
  if (status === "refund_approved" || status === "refunded") {
    return (
      <>
        {dialogs}
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-200 dark:border-blue-900/40 shadow-sm p-4 flex items-center gap-3">
          <IconRefresh className="w-5 h-5 text-blue-500 shrink-0" />
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
            {status === "refunded" ? "Đơn hàng đã được hoàn tiền." : "Yêu cầu hoàn tiền đã được chấp thuận."}
          </p>
        </div>
      </>
    );
  }

  /* ── fallback ────────────────────────────────────────────────── */
  return <>{dialogs}</>;
}
