"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  IconArrowLeft,
  IconUser,
  IconMapPin,
  IconCreditCard,
  IconTruck,
  IconClock,
  IconCircleCheck,
  IconExternalLink,
  IconLoader2,
  IconMail,
  IconPhone,
  IconPhoneCall,
  IconPackage,
  IconMessage,
  IconCopy,
  IconCalendar,
} from "@tabler/icons-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OrderTracking } from "@/components/order";
import { SellerProductsCard } from "./components/SellerProductsCard";
import { SellerRefundCard } from "./components/SellerRefundCard";
import { SellerActionButtons } from "./components/SellerActionButtons";
import { useSellerOrderDetail } from "./hooks/useSellerOrderDetail";
import { formatPrice } from "@/utils/format/price";
import { format, formatTimeAgo } from "@/utils/format/date";
import { AvatarOrInitials } from "@/components/common/AvatarOrInitials";
import { formatShippingMethod, getShippingMethodType, formatPaymentMethod } from "@/utils/format";
import { openChatWithOrder } from "@/utils/chat";
import { getAvatarUrl } from "@/utils";

interface TimelineEntry {
  status: string;
  label: string;
  at?: string;
}

const STATUS_TO_TS: Record<string, string> = {
  pending: "createdAt",
  confirmed: "confirmedAt",
  picked_up: "pickedUpAt",
  shipping: "shippingAt",
  out_for_delivery: "outForDeliveryAt",
  delivered: "deliveredAt",
  completed: "completedAt",
};
const GHN_ORDER: string[] = ["pending", "confirmed", "picked_up", "shipping", "out_for_delivery", "delivered", "completed"];
const LOCAL_ORDER: string[] = ["pending", "confirmed", "delivered", "completed"];

function buildTimeline(
  order: NonNullable<ReturnType<typeof useSellerOrderDetail>["order"]>,
  isLocalPickup: boolean
): TimelineEntry[] {
  const GHN_STEPS: Array<{ key: string; label: string }> = [
    { key: "pending",          label: "Đặt hàng" },
    { key: "confirmed",        label: "Đã xác nhận" },
    { key: "picked_up",        label: "Đã lấy hàng" },
    { key: "shipping",         label: "Đang vận chuyển" },
    { key: "out_for_delivery", label: "Đang giao hàng" },
    { key: "delivered",        label: "Đã giao hàng" },
    { key: "completed",        label: "Hoàn thành" },
  ];
  const LOCAL_STEPS: Array<{ key: string; label: string }> = [
    { key: "pending",   label: "Đặt hàng" },
    { key: "confirmed", label: "Đã xác nhận" },
    { key: "delivered", label: "Đã giao hàng" },
    { key: "completed", label: "Hoàn thành" },
  ];
  const STEPS = isLocalPickup ? LOCAL_STEPS : GHN_STEPS;
  const ORDER = isLocalPickup ? LOCAL_ORDER : GHN_ORDER;

  const statusHistory: Array<{ status: string; updatedAt: string }> =
    (order as unknown as { statusHistory?: Array<{ status: string; updatedAt: string }> })
      .statusHistory ?? [];
  const orderRaw = order as unknown as Record<string, unknown>;
  const currentStatus = String(order.status || "");

  return STEPS.map(({ key, label }) => {
    const historyEntry = statusHistory.find((h) => h.status === key);
    const tsField = STATUS_TO_TS[key] || key + "At";
    const atFromTs = orderRaw[tsField];
    let at = historyEntry?.updatedAt ?? atFromTs;
    if (!at && currentStatus) {
      const idx = ORDER.indexOf(key);
      const currIdx = ORDER.indexOf(currentStatus);
      if (idx >= 0 && currIdx >= 0 && idx <= currIdx) {
        at = (order.updatedAt || order.createdAt) as string;
      }
    }
    return { status: key, label, at: at as string | undefined };
  });
}

interface SellerOrderDetailProps {
  orderId: string;
}

export default function SellerOrderDetail({ orderId }: SellerOrderDetailProps) {
  const trackingRef = useRef<HTMLDivElement>(null);
  const returnTrackingRef = useRef<HTMLDivElement>(null);

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
    handleConfirm,
    handleCancel,
    handleApproveRefund,
    handleRejectRefund,
    handleConfirmReturnReceived,
    handleMarkDelivered,
  } = useSellerOrderDetail(orderId);

  const handleTrackingClick = () => {
    trackingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleReturnTrackingClick = () => {
    returnTrackingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleChatClick = () => {
    if (!order) return;
    openChatWithOrder(
      {
        _id: order.buyerId._id,
        fullName: order.buyerId.fullName,
        avatar: getAvatarUrl((order.buyerId as { avatar?: { url?: string } })?.avatar) ?? undefined,
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
      }
    );
  };

  /* ── Loading skeleton ─────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <IconLoader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <IconPackage className="w-12 h-12 text-muted-foreground" />
        <p className="text-lg font-semibold text-foreground">Không tìm thấy đơn hàng</p>
        <Link href="/my/orders" className="text-sm text-primary hover:underline">
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  const orderCode = `#${order._id.slice(-8).toUpperCase()}`;
  const isLocalPickup = getShippingMethodType(order.shippingMethod) === "local_pickup";
  const timeline = buildTimeline(order, isLocalPickup);
  const hasTracking = !isLocalPickup && Boolean(order.ghnOrderCode);
  const hasReturnTracking = !isLocalPickup && Boolean(order.ghnReturnOrderCode);
  const hasRefundRequest = Boolean(order.refundRequestId);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Sticky Header ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <Link
            href="/my/orders"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <IconArrowLeft className="w-4 h-4" />
            Đơn hàng
          </Link>
          <span className="text-muted-foreground/40 text-sm">/</span>
          <span className="text-sm font-semibold text-foreground truncate">{orderCode}</span>
          <div className="ml-auto">
            <StatusBadge status={order.status} size="sm" />
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Lịch sử đơn hàng */}
        <div className="mb-6 rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <IconClock className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Lịch sử đơn hàng</h2>
          </div>
          <div className="px-4 py-4">
            <div className="flex w-full items-start gap-0">
              {timeline.map(({ status, label, at }, idx) => {
                const currentOrderStatus = String(order.status || "");
                const stepOrder = isLocalPickup ? LOCAL_ORDER : GHN_ORDER;
                const stepIdx = stepOrder.indexOf(status);
                const currIdx = stepOrder.indexOf(currentOrderStatus);
                const isDone = stepIdx >= 0 && currIdx >= 0 && stepIdx < currIdx;
                const isCurrent = stepIdx >= 0 && currIdx >= 0 && stepIdx === currIdx;
                const isLast = idx === timeline.length - 1;
                return (
                  <div key={status} className="contents">
                    <div className="flex flex-1 min-w-0 flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isDone || isCurrent
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {(isDone || isCurrent) ? (
                          <IconCircleCheck className="w-4 h-4" strokeWidth={2.5} />
                        ) : (
                          <IconPackage className="w-4 h-4" strokeWidth={2} />
                        )}
                      </div>
                      <span
                        className={`mt-1.5 text-[11px] text-center leading-tight ${
                          isDone || isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                        }`}
                      >
                        {label}
                      </span>
                      {at && (
                        <span className="mt-0.5 text-[10px] text-muted-foreground text-center block" title={format(at)}>
                          {format(at)}
                        </span>
                      )}
                    </div>
                    {!isLast && (
                      <div
                        className={`mt-4 h-0.5 flex-1 min-w-[12px] ${
                          isDone || isCurrent ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT column ─────────────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-5">

            {/* Products */}
            <SellerProductsCard order={order} />

            {/* Shipping / pickup info */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/20">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  {isLocalPickup ? (
                    <IconUser className="w-4.5 h-4.5 text-primary" />
                  ) : (
                    <IconMapPin className="w-4.5 h-4.5 text-primary" />
                  )}
                </div>
                <h2 className="text-sm font-bold text-foreground">
                  {isLocalPickup ? "Giao hàng trực tiếp" : "Địa chỉ giao hàng"}
                </h2>
                {isLocalPickup && (
                  <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">
                    Gặp mặt trực tiếp
                  </span>
                )}
                {!isLocalPickup && (
                  <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-300">
                    {formatShippingMethod(order.shippingMethod)}
                  </span>
                )}
              </div>
              <div className="p-5">
                {isLocalPickup ? (
                  <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-lg">🤝</span>
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">Người mua tự đến lấy hàng</p>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        Liên hệ người mua để thống nhất thời gian và địa điểm gặp mặt, sau đó xác nhận đã giao hàng.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-semibold text-foreground">{order.shippingAddress.fullName}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{order.shippingAddress.phoneNumber}</p>
                    <p className="text-sm text-foreground mt-2 leading-relaxed">
                      {[
                        order.shippingAddress.specificAddress,
                        order.shippingAddress.ward,
                        order.shippingAddress.district,
                        order.shippingAddress.province,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {order.ghnOrderCode && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                        <IconTruck className="w-3.5 h-3.5 shrink-0" />
                        <span>Mã GHN:</span>
                        <span className="font-mono font-semibold text-foreground">{order.ghnOrderCode}</span>
                        <a
                          href={`https://tracking.ghn.dev/?order_code=${order.ghnOrderCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto flex items-center gap-1 text-primary hover:underline shrink-0"
                        >
                          <IconExternalLink className="w-3 h-3" />
                          Theo dõi
                        </a>
                      </div>
                    )}
                    {order.ghnReturnOrderCode && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 rounded-lg px-3 py-2">
                        <IconTruck className="w-3.5 h-3.5 shrink-0 text-blue-500" />
                        <span className="text-blue-600 dark:text-blue-400">Mã hoàn:</span>
                        <span className="font-mono font-semibold text-blue-700 dark:text-blue-300">{order.ghnReturnOrderCode}</span>
                        <a
                          href={`https://tracking.ghn.dev/?order_code=${order.ghnReturnOrderCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto flex items-center gap-1 text-blue-600 hover:underline shrink-0"
                        >
                          <IconExternalLink className="w-3 h-3" />
                          Theo dõi
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Refund section */}
            {hasRefundRequest && order.refundRequestId && (
              <SellerRefundCard refund={order.refundRequestId} />
            )}

            {/* Action buttons */}
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
              onReturnTrackingClick={hasReturnTracking ? handleReturnTrackingClick : undefined}
              onConfirmReturnReceived={handleConfirmReturnReceived}
              onMarkDelivered={isLocalPickup ? handleMarkDelivered : undefined}
              isLocalPickup={isLocalPickup}
              onChatClick={handleChatClick}
            />
          </div>

          {/* RIGHT column ────────────────────────────────────────────── */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20 lg:self-start">

            {/* Buyer info */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/20">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <IconUser className="w-4.5 h-4.5 text-primary" />
                </div>
                <h2 className="text-sm font-bold text-foreground">Thông tin người mua</h2>
              </div>
              <div className="p-5 space-y-4">
                {/* Avatar + name */}
                <div className="flex items-center gap-3">
                  <AvatarOrInitials
                    avatar={(order.buyerId as { avatar?: { url?: string } })?.avatar}
                    fullName={order.buyerId.fullName}
                    size={44}
                    className="ring-2 ring-primary/20"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{order.buyerId.fullName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <IconCalendar className="w-3 h-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Đặt lúc {format(order.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Contact buttons */}
                <div className="space-y-2">
                  {order.buyerId.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${order.buyerId.phoneNumber}`}
                        className="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors group"
                      >
                        <IconPhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-sm font-semibold text-emerald-700 truncate">{order.buyerId.phoneNumber}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(order.buyerId.phoneNumber)}
                        className="p-2.5 rounded-xl border border-border hover:bg-muted/60 transition-colors shrink-0"
                        title="Sao chép số điện thoại"
                      >
                        <IconCopy className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  )}
                  {order.buyerId.email && (
                    <a
                      href={`mailto:${order.buyerId.email}`}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-muted/50 border border-border hover:bg-muted/80 transition-colors"
                    >
                      <IconMail className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-sm text-foreground truncate">{order.buyerId.email}</span>
                    </a>
                  )}
                </div>

                {/* Shipping recipient (may differ from buyer account) */}
                {order.shippingAddress && (
                  <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {isLocalPickup ? "Liên hệ nhận hàng" : "Người nhận hàng"}
                    </p>
                    <div className="flex items-center gap-2">
                      <IconUser className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="text-sm font-semibold text-foreground">{order.shippingAddress.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconPhone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <a
                        href={`tel:${order.shippingAddress.phoneNumber}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {order.shippingAddress.phoneNumber}
                      </a>
                    </div>
                    {!isLocalPickup && (
                      <div className="flex items-start gap-2 mt-1">
                        <IconMapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-xs text-muted-foreground leading-relaxed">
                          {[
                            order.shippingAddress.specificAddress,
                            order.shippingAddress.ward,
                            order.shippingAddress.district,
                            order.shippingAddress.province,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleChatClick}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-border hover:bg-muted/50 font-semibold text-sm transition-colors"
                >
                  <IconMessage className="w-4 h-4" />
                  Nhắn tin người mua
                </button>
              </div>
            </div>

            {/* Payment summary */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/20">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <IconCreditCard className="w-4.5 h-4.5 text-primary" />
                </div>
                <h2 className="text-sm font-bold text-foreground">Thanh toán</h2>
              </div>
              <div className="p-5 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phương thức</span>
                  <span className="font-medium text-foreground text-right max-w-[55%]">
                    {formatPaymentMethod(order.paymentMethod, { shippingMethod: order.shippingMethod })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Trạng thái</span>
                  <span
                    className={`font-semibold ${
                      order.paymentStatus === "paid"
                        ? "text-emerald-600"
                        : order.paymentStatus === "refunded"
                        ? "text-blue-500"
                        : "text-amber-500"
                    }`}
                  >
                    {order.paymentStatus === "paid"
                      ? "Đã thanh toán"
                      : order.paymentStatus === "refunded"
                      ? "Đã hoàn tiền"
                      : "Chờ thanh toán"}
                  </span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tiền hàng</span>
                  <span>{formatPrice(order.productAmount || 0)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Phí vận chuyển</span>
                  <span>{formatPrice(order.shippingFee || 0)}</span>
                </div>
                {(order.codFee ?? 0) > 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Phí COD</span>
                    <span>{formatPrice(order.codFee!)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="font-bold text-foreground text-sm">Tổng cộng</span>
                  <span className="font-bold text-primary text-base">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* GHN tracking */}
            {hasTracking && (
              <div ref={trackingRef}>
                <OrderTracking orderId={order._id} ghnOrderCode={order.ghnOrderCode} />
              </div>
            )}

            {/* GHN return tracking */}
            {hasReturnTracking && (
              <div ref={returnTrackingRef}>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-400">
                  <IconTruck className="w-4 h-4" />
                  Vận đơn hoàn hàng
                </div>
                <OrderTracking orderId={order._id} ghnOrderCode={order.ghnReturnOrderCode} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
