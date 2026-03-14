"use client";

import { useState, useEffect } from "react";
import {
  IconTruck,
  IconCircleCheck,
  IconX,
  IconBan,
  IconMessage,
  IconRefresh,
  IconClock,
  IconAlertTriangle,
  IconCheck,
  IconPackageImport,
  IconShoppingBag,
  IconEye,
  IconBuildingBank,
  IconLoader2,
  IconPackage,
  IconReceipt,
} from "@tabler/icons-react";
import { createPortal } from "react-dom";
import { CancelOrderReasonDialog } from "@/components/ui/CancelOrderReasonDialog";
import { ConfirmWithReasonDialog } from "@/components/ui/ConfirmWithReasonDialog";
import type { OrderStatus } from "@/types/order";

/* ── Countdown hook ──────────────────────────────────────────────── */
function useCountdown(expiresAt?: string) {
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    if (!expiresAt) return;
    const tick = () =>
      setMs(Math.max(0, new Date(expiresAt).getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);
  return ms;
}

function fmtCountdown(ms: number): string {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1_000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ── Button primitive ────────────────────────────────────────────── */
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: React.ReactNode;
  variant?: "primary" | "success" | "danger" | "outline";
  grow?: boolean;
}

const VARIANT_CLS: Record<NonNullable<BtnProps["variant"]>, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
  danger:
    "border border-destructive/40 text-destructive hover:bg-destructive/5",
  outline: "border border-border text-foreground hover:bg-muted/60",
};

function ActionBtn({
  children,
  icon,
  loading,
  variant = "primary",
  grow,
  className = "",
  disabled,
  ...rest
}: BtnProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        ${grow ? "flex-1" : "w-full"}
        ${VARIANT_CLS[variant]}
        ${className}`}
    >
      {loading ? <IconLoader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

/* ── Props ───────────────────────────────────────────────────────── */
export interface OrderActionsProps {
  role: "buyer" | "seller" | "admin";
  status: OrderStatus;
  orderId?: string;
  isLocalPickup?: boolean;
  returnWindowExpiresAt?: string;
  cancelReason?: string;
  refundStatus?: string;
  sellerRefundComment?: string;
  ghnOrderCode?: string;
  ghnReturnOrderCode?: string;
  isLoading?: boolean;

  /* Buyer */
  onCancelOrder?: (reason: string) => void;
  onTrackShipment?: () => void;
  onConfirmReceived?: () => void;
  onRequestRefund?: () => void;
  onViewRefundRequest?: () => void;
  onTrackReturnShipment?: () => void;
  onViewRefundDetails?: () => void;
  onBuyAgain?: () => void;

  /* Seller */
  onConfirmOrder?: () => void;
  onRejectOrder?: (reason: string) => void;
  onCreateShipping?: () => void;
  onApproveRefund?: () => void;
  onRejectRefund?: (reason: string) => void;
  onViewEvidence?: () => void;
  onConfirmReturnReceived?: () => void;

  /* Shared */
  onChatPartner?: () => void;

  /* Admin */
  onMarkRefunded?: () => void;
  onViewBankInfo?: () => void;
}

/* ── Component ───────────────────────────────────────────────────── */
export function OrderActions({
  role,
  status,
  orderId,
  isLocalPickup = false,
  returnWindowExpiresAt,
  cancelReason,
  refundStatus,
  sellerRefundComment,
  ghnOrderCode,
  ghnReturnOrderCode,
  isLoading = false,
  onCancelOrder,
  onTrackShipment,
  onConfirmReceived,
  onRequestRefund,
  onViewRefundRequest,
  onTrackReturnShipment,
  onViewRefundDetails,
  onBuyAgain,
  onConfirmOrder,
  onRejectOrder,
  onCreateShipping,
  onApproveRefund,
  onRejectRefund,
  onViewEvidence,
  onConfirmReturnReceived,
  onChatPartner,
  onMarkRefunded,
  onViewBankInfo,
}: OrderActionsProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [rejectOrderOpen, setRejectOrderOpen] = useState(false);
  const [approveRefundOpen, setApproveRefundOpen] = useState(false);
  const [rejectRefundOpen, setRejectRefundOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const msLeft = useCountdown(returnWindowExpiresAt);
  const windowExpired = msLeft === 0;

  const shortId = orderId ? orderId.slice(-8).toUpperCase() : "—";

  /* ────────────────────────────────────────────────────────────────
   * BUYER
   * ──────────────────────────────────────────────────────────────── */
  if (role === "buyer") {
    /* pending | confirmed → cancel */
    if (status === "pending" || status === "confirmed") {
      return (
        <>
          {mounted && (
            <CancelOrderReasonDialog
              isOpen={cancelDialogOpen}
              orderCode={shortId}
              onConfirm={(reason) => {
                setCancelDialogOpen(false);
                onCancelOrder?.(reason);
              }}
              onCancel={() => setCancelDialogOpen(false)}
              isLoading={isLoading}
            />
          )}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
            <ActionBtn
              variant="danger"
              icon={<IconX className="w-4 h-4" />}
              loading={isLoading}
              onClick={() => setCancelDialogOpen(true)}
            >
              Hủy đơn hàng
            </ActionBtn>
          </div>
        </>
      );
    }

    /* shipping / in-transit → track */
    if (
      status === "picked_up" ||
      status === "shipping" ||
      status === "out_for_delivery"
    ) {
      return (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
          {ghnOrderCode ? (
            <ActionBtn
              variant="primary"
              icon={<IconTruck className="w-4 h-4" />}
              onClick={onTrackShipment}
            >
              Theo dõi vận chuyển
            </ActionBtn>
          ) : (
            <p className="text-sm text-center text-muted-foreground">
              Đơn đang được vận chuyển
            </p>
          )}
        </div>
      );
    }

    /* delivered → 24 h inspection window */
    if (status === "delivered") {
      return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Inspection window banner */}
          <div
            className={`p-4 border-b ${
              windowExpired
                ? "bg-neutral-100 dark:bg-neutral-900/40 border-border"
                : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40"
            }`}
          >
            <div
              className={`flex items-center gap-2 ${windowExpired ? "text-neutral-500" : "text-amber-700 dark:text-amber-400"}`}
            >
              <IconClock className="w-4 h-4 shrink-0" />
              {windowExpired ? (
                <p className="text-sm font-medium">
                  Đã hết thời hạn kiểm tra hàng
                </p>
              ) : msLeft !== null ? (
                <p className="text-sm font-medium">
                  Còn lại để kiểm tra:{" "}
                  <span className="font-mono font-bold">
                    {fmtCountdown(msLeft)}
                  </span>
                </p>
              ) : (
                <p className="text-sm font-medium">
                  Bạn có 24 giờ để kiểm tra hàng
                </p>
              )}
            </div>
            {!windowExpired && (
              <p className="text-xs mt-1 ml-6 text-amber-600 dark:text-amber-500">
                Xác nhận nhận hàng hoặc yêu cầu hoàn tiền trước khi hết hạn.
              </p>
            )}
          </div>

          <div className="p-4 flex flex-col gap-2.5">
            <ActionBtn
              variant="success"
              icon={<IconCircleCheck className="w-4 h-4" />}
              loading={isLoading}
              onClick={onConfirmReceived}
            >
              Đã nhận hàng
            </ActionBtn>
            {ghnOrderCode && (
              <ActionBtn
                variant="outline"
                icon={<IconTruck className="w-4 h-4" />}
                onClick={onTrackShipment}
              >
                Theo dõi vận chuyển
              </ActionBtn>
            )}
            <ActionBtn
              variant="danger"
              icon={<IconRefresh className="w-4 h-4" />}
              disabled={windowExpired}
              onClick={!windowExpired ? onRequestRefund : undefined}
            >
              {windowExpired ? "Hết thời hạn hoàn tiền" : "Yêu cầu hoàn tiền"}
            </ActionBtn>
          </div>
        </div>
      );
    }

    /* refund_requested */
    if (status === "refund_requested") {
      return (
        <div className="bg-card rounded-2xl border border-orange-200 dark:border-orange-900/40 shadow-sm p-4 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 mb-1">
            <IconClock className="w-4 h-4 shrink-0" />
            <p className="text-sm font-medium">
              Yêu cầu hoàn tiền đang chờ người bán xem xét
            </p>
          </div>
          {onViewRefundRequest && (
            <ActionBtn
              variant="outline"
              icon={<IconReceipt className="w-4 h-4" />}
              onClick={onViewRefundRequest}
            >
              Xem yêu cầu hoàn tiền
            </ActionBtn>
          )}
          {onChatPartner && (
            <ActionBtn
              variant="outline"
              icon={<IconMessage className="w-4 h-4" />}
              onClick={onChatPartner}
            >
              Nhắn tin người bán
            </ActionBtn>
          )}
        </div>
      );
    }

    /* refund_approved → buyer must return item */
    if (status === "refund_approved") {
      return (
        <div className="bg-card rounded-2xl border border-blue-200 dark:border-blue-900/40 shadow-sm overflow-hidden">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-900/40">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <IconPackageImport className="w-4 h-4 shrink-0" />
              <p className="text-sm font-medium">
                Hoàn tiền đã được chấp thuận — gửi hàng về người bán
              </p>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-500 mt-1 ml-6">
              {isLocalPickup
                ? "Liên hệ người bán để hẹn gặp mặt trả lại hàng trực tiếp."
                : "Đến bưu cục GHN gần nhất và giao hàng theo vận đơn hoàn trả."}
            </p>
          </div>
          <div className="p-4 flex flex-col gap-2.5">
            {!isLocalPickup && onTrackReturnShipment && (
              <ActionBtn
                variant="primary"
                icon={<IconTruck className="w-4 h-4" />}
                onClick={onTrackReturnShipment}
              >
                Theo dõi vận đơn hoàn trả
              </ActionBtn>
            )}
          </div>
        </div>
      );
    }

    /* return_shipping → item in transit back to seller */
    if (status === "return_shipping" || status === "returning") {
      return (
        <div className="bg-card rounded-2xl border border-blue-200 dark:border-blue-900/40 shadow-sm p-4">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-3">
            <IconTruck className="w-4 h-4 shrink-0" />
            <p className="text-sm font-medium">
              Hàng đang trên đường hoàn về người bán
            </p>
          </div>
          {onTrackReturnShipment && (
            <ActionBtn
              variant="primary"
              icon={<IconTruck className="w-4 h-4" />}
              onClick={onTrackReturnShipment}
            >
              Theo dõi vận đơn hoàn trả
            </ActionBtn>
          )}
        </div>
      );
    }

    /* returned → waiting for admin to process refund */
    if (status === "returned") {
      return (
        <div className="bg-card rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-4">
          <ActionBtn
            variant="outline"
            disabled
            icon={<IconClock className="w-4 h-4" />}
          >
            Đang chờ admin xử lý hoàn tiền...
          </ActionBtn>
        </div>
      );
    }

    /* refunded */
    if (status === "refunded") {
      return (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 shadow-sm p-4">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 mb-3">
            <IconCircleCheck className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">Đã hoàn tiền thành công</p>
          </div>
          {onViewRefundDetails && (
            <ActionBtn
              variant="outline"
              icon={<IconReceipt className="w-4 h-4" />}
              onClick={onViewRefundDetails}
            >
              Xem chi tiết hoàn tiền
            </ActionBtn>
          )}
        </div>
      );
    }

    /* completed */
    if (status === "completed") {
      return (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
          {onBuyAgain && (
            <ActionBtn
              variant="primary"
              icon={<IconShoppingBag className="w-4 h-4" />}
              onClick={onBuyAgain}
            >
              Mua lại
            </ActionBtn>
          )}
        </div>
      );
    }

    /* cancelled */
    if (status === "cancelled") {
      return (
        <div className="bg-rose-50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/40 shadow-sm p-4 flex items-center gap-3">
          <IconBan className="w-5 h-5 text-rose-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-rose-700 dark:text-rose-400">
              Đơn hàng đã bị hủy
            </p>
            {cancelReason && (
              <p className="text-xs text-rose-600 dark:text-rose-500 mt-0.5">
                {cancelReason}
              </p>
            )}
          </div>
        </div>
      );
    }

    return null;
  }

  /* ────────────────────────────────────────────────────────────────
   * SELLER
   * ──────────────────────────────────────────────────────────────── */
  if (role === "seller") {
    /* pending → confirm / reject */
    if (status === "pending") {
      return (
        <>
          {mounted && (
            <ConfirmWithReasonDialog
              isOpen={rejectOrderOpen}
              title="Hủy đơn hàng"
              description={`Đơn hàng #${shortId}`}
              reasonLabel="Lý do hủy"
              reasonPlaceholder="Mô tả lý do hủy đơn hàng..."
              confirmText="Xác nhận hủy"
              variant="danger"
              onConfirm={(reason) => {
                setRejectOrderOpen(false);
                onRejectOrder?.(reason);
              }}
              onCancel={() => setRejectOrderOpen(false)}
              isLoading={isLoading}
            />
          )}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-900/40">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="w-4 h-4 shrink-0" />
                <p className="text-sm font-medium">
                  Đơn hàng mới đang chờ xác nhận
                </p>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-1 ml-6">
                Vui lòng xác nhận hoặc hủy đơn trong thời gian sớm nhất.
              </p>
            </div>
            <div className="p-4 flex gap-3">
              <ActionBtn
                variant="danger"
                grow
                icon={<IconX className="w-4 h-4" />}
                loading={isLoading}
                onClick={() => setRejectOrderOpen(true)}
              >
                Hủy đơn
              </ActionBtn>
              <ActionBtn
                variant="success"
                grow
                icon={<IconCheck className="w-4 h-4" />}
                loading={isLoading}
                onClick={onConfirmOrder}
                className="flex-[2]"
              >
                Xác nhận đơn
              </ActionBtn>
            </div>
          </div>
        </>
      );
    }

    /* confirmed → create shipping or mark delivered directly */
    if (status === "confirmed") {
      if (isLocalPickup) {
        return (
          <div className="bg-card rounded-2xl border border-border shadow-sm p-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-base">🤝</span>
              <p className="text-xs text-emerald-700">Liên hệ người mua để sắp xếp gặp mặt, sau đó xác nhận đã giao hàng tại trang chi tiết đơn.</p>
            </div>
            {onChatPartner && (
              <ActionBtn
                variant="outline"
                icon={<IconMessage className="w-4 h-4" />}
                onClick={onChatPartner}
              >
                Nhắn tin người mua
              </ActionBtn>
            )}
          </div>
        );
      }
      return (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4 flex flex-col gap-2.5">
          <ActionBtn
            variant="primary"
            icon={<IconTruck className="w-4 h-4" />}
            loading={isLoading}
            onClick={onCreateShipping}
          >
            Tạo đơn vận chuyển GHN
          </ActionBtn>
          {onChatPartner && (
            <ActionBtn
              variant="outline"
              icon={<IconMessage className="w-4 h-4" />}
              onClick={onChatPartner}
            >
              Nhắn tin người mua
            </ActionBtn>
          )}
        </div>
      );
    }

    /* in-transit → track */
    if (
      status === "picked_up" ||
      status === "shipping" ||
      status === "out_for_delivery"
    ) {
      return (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4 flex flex-col gap-2.5">
          {ghnOrderCode && (
            <ActionBtn
              variant="primary"
              icon={<IconTruck className="w-4 h-4" />}
              onClick={onTrackShipment}
            >
              Theo dõi vận chuyển
            </ActionBtn>
          )}
          {onChatPartner && (
            <ActionBtn
              variant="outline"
              icon={<IconMessage className="w-4 h-4" />}
              onClick={onChatPartner}
            >
              Nhắn tin người mua
            </ActionBtn>
          )}
        </div>
      );
    }

    /* delivered → no action, informational */
    if (status === "delivered") {
      return (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <IconClock className="w-4 h-4 shrink-0" />
            <p className="text-sm">
              Đơn đã giao — chờ người mua xác nhận hoặc yêu cầu hoàn tiền.
            </p>
          </div>
          {onChatPartner && (
            <ActionBtn
              variant="outline"
              icon={<IconMessage className="w-4 h-4" />}
              onClick={onChatPartner}
            >
              Nhắn tin người mua
            </ActionBtn>
          )}
        </div>
      );
    }

    /* refund_requested → approve / reject */
    if (status === "refund_requested") {
      if (refundStatus === "rejected") {
        return (
          <div className="bg-rose-50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/40 shadow-sm p-4 flex items-center gap-3">
            <IconX className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-rose-700 dark:text-rose-400">
                Đã từ chối yêu cầu hoàn tiền
              </p>
              {sellerRefundComment && (
                <p className="text-xs text-rose-600 dark:text-rose-500 mt-0.5">
                  Lý do: {sellerRefundComment}
                </p>
              )}
            </div>
          </div>
        );
      }

      return (
        <>
          {mounted && (
            <>
              <ConfirmWithReasonDialog
                isOpen={rejectRefundOpen}
                title="Từ chối hoàn tiền"
                description={`Đơn hàng #${shortId}`}
                reasonLabel="Lý do từ chối"
                reasonPlaceholder="Mô tả lý do từ chối yêu cầu hoàn tiền..."
                reasonHint="Người mua sẽ nhận được lý do từ chối này."
                confirmText="Từ chối"
                variant="danger"
                onConfirm={(reason) => {
                  setRejectRefundOpen(false);
                  onRejectRefund?.(reason);
                }}
                onCancel={() => setRejectRefundOpen(false)}
                isLoading={isLoading}
              />
              {approveRefundOpen &&
                createPortal(
                  <>
                    <div
                      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-in fade-in"
                      onClick={() => setApproveRefundOpen(false)}
                    />
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                      <div
                        className="bg-background rounded-2xl shadow-xl w-full max-w-sm border border-border animate-in zoom-in-95 slide-in-from-bottom-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-start gap-4 p-6 border-b border-border">
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                            <IconCircleCheck className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-foreground">
                              Chấp thuận hoàn tiền?
                            </h3>
            <p className="text-sm text-muted-foreground mt-1">
                              Đơn #{shortId} sẽ chuyển sang &ldquo;Đang hoàn
                              hàng&rdquo;.{" "}
                              {isLocalPickup
                                ? "Người mua sẽ trực tiếp trả lại hàng cho bạn."
                                : "GHN return shipment sẽ được tạo tự động."}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3 p-4">
                          <button
                            onClick={() => setApproveRefundOpen(false)}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 rounded-lg border border-border font-medium text-sm hover:bg-muted transition-colors disabled:opacity-50"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={() => {
                              setApproveRefundOpen(false);
                              onApproveRefund?.();
                            }}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors disabled:opacity-50"
                          >
                            {isLoading ? "Đang xử lý..." : "Chấp thuận"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>,
                  document.body,
                )}
            </>
          )}

          <div className="bg-card rounded-2xl border border-orange-200 dark:border-orange-900/40 shadow-sm overflow-hidden">
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border-b border-orange-200 dark:border-orange-900/40">
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                <IconRefresh className="w-4 h-4 shrink-0" />
                <p className="text-sm font-medium">
                  Người mua đã yêu cầu hoàn tiền
                </p>
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-500 mt-1 ml-6">
                Xem bằng chứng và chọn hành động phù hợp.
              </p>
            </div>
            <div className="p-4 flex flex-col gap-2.5">
              {onViewEvidence && (
                <ActionBtn
                  variant="outline"
                  icon={<IconEye className="w-4 h-4" />}
                  onClick={onViewEvidence}
                >
                  Xem bằng chứng
                </ActionBtn>
              )}
              <div className="flex gap-3">
                <ActionBtn
                  variant="danger"
                  grow
                  icon={<IconX className="w-4 h-4" />}
                  loading={isLoading}
                  onClick={() => setRejectRefundOpen(true)}
                >
                  Từ chối
                </ActionBtn>
                <ActionBtn
                  variant="success"
                  grow
                  icon={<IconCircleCheck className="w-4 h-4" />}
                  loading={isLoading}
                  onClick={() => setApproveRefundOpen(true)}
                  className="flex-[2]"
                >
                  Chấp thuận
                </ActionBtn>
              </div>
            </div>
          </div>
        </>
      );
    }

    /* refund_approved / return_shipping → track return */
    if (
      status === "refund_approved" ||
      status === "return_shipping" ||
      status === "returning"
    ) {
      return (
        <div className="bg-card rounded-2xl border border-blue-200 dark:border-blue-900/40 shadow-sm overflow-hidden">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-900/40">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <IconTruck className="w-4 h-4 shrink-0" />
              <p className="text-sm font-medium">
                {status === "refund_approved"
                  ? "Đơn vận chuyển hoàn đã được tạo"
                  : "Người mua đang gửi hàng hoàn về"}
              </p>
            </div>
            {status !== "refund_approved" && (
              <p className="text-xs text-blue-600 dark:text-blue-500 mt-1 ml-6">
                Theo dõi vận đơn hoàn, rồi xác nhận khi hàng đến.
              </p>
            )}
          </div>
          <div className="p-4 flex flex-col gap-2.5">
            {ghnReturnOrderCode && (
              <ActionBtn
                variant="primary"
                icon={<IconTruck className="w-4 h-4" />}
                onClick={onTrackReturnShipment}
              >
                Theo dõi vận đơn hoàn trả
              </ActionBtn>
            )}
            {onChatPartner && (
              <ActionBtn
                variant="outline"
                icon={<IconMessage className="w-4 h-4" />}
                onClick={onChatPartner}
              >
                Nhắn tin người mua
              </ActionBtn>
            )}
          </div>
        </div>
      );
    }

    /* returned → confirm received so admin can release refund */
    if (status === "returned") {
      return (
        <div className="bg-card rounded-2xl border border-emerald-200 dark:border-emerald-900/40 shadow-sm overflow-hidden">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border-b border-emerald-200 dark:border-emerald-900/40">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <IconPackage className="w-4 h-4 shrink-0" />
              <p className="text-sm font-medium">
                Hàng hoàn đã về tới người bán
              </p>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1 ml-6">
              Xác nhận để admin tiến hành hoàn tiền cho người mua.
            </p>
          </div>
          <div className="p-4 flex flex-col gap-2.5">
            <ActionBtn
              variant="success"
              icon={<IconCircleCheck className="w-4 h-4" />}
              loading={isLoading}
              onClick={onConfirmReturnReceived}
            >
              Xác nhận đã nhận hàng hoàn
            </ActionBtn>
            {onChatPartner && (
              <ActionBtn
                variant="outline"
                icon={<IconMessage className="w-4 h-4" />}
                onClick={onChatPartner}
              >
                Nhắn tin người mua
              </ActionBtn>
            )}
          </div>
        </div>
      );
    }

    /* refunded */
    if (status === "refunded") {
      return (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 shadow-sm p-4 flex items-center gap-3">
          <IconCircleCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            Đơn hàng đã được hoàn tiền.
          </p>
        </div>
      );
    }

    /* completed */
    if (status === "completed") {
      return (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 shadow-sm p-4 flex items-center gap-3">
          <IconCircleCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            Đơn hàng đã hoàn thành thành công.
          </p>
        </div>
      );
    }

    /* cancelled */
    if (status === "cancelled") {
      return (
        <div className="bg-rose-50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/40 shadow-sm p-4 flex items-center gap-3">
          <IconBan className="w-5 h-5 text-rose-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-rose-700 dark:text-rose-400">
              Đơn hàng đã bị hủy
            </p>
            {cancelReason && (
              <p className="text-xs text-rose-600 dark:text-rose-500 mt-0.5">
                Lý do: {cancelReason}
              </p>
            )}
          </div>
        </div>
      );
    }

    return null;
  }

  /* ────────────────────────────────────────────────────────────────
   * ADMIN
   * ──────────────────────────────────────────────────────────────── */
  if (role === "admin") {
    if (status === "returned") {
      return (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4 flex flex-col gap-2.5">
          {onViewBankInfo && (
            <ActionBtn
              variant="outline"
              icon={<IconBuildingBank className="w-4 h-4" />}
              onClick={onViewBankInfo}
            >
              Xem thông tin ngân hàng
            </ActionBtn>
          )}
          <ActionBtn
            variant="success"
            icon={<IconCircleCheck className="w-4 h-4" />}
            loading={isLoading}
            onClick={onMarkRefunded}
          >
            Xác nhận đã hoàn tiền
          </ActionBtn>
        </div>
      );
    }

    if (status === "refunded") {
      return (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 shadow-sm p-4 flex items-center gap-3">
          <IconCircleCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            Đã hoàn tiền cho người mua.
          </p>
        </div>
      );
    }

    return null;
  }

  return null;
}
