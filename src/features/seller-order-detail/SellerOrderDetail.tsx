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
  IconPackage,
  IconMessage,
} from "@tabler/icons-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OrderTracking } from "@/components/order";
import { SellerProductsCard } from "./components/SellerProductsCard";
import { SellerRefundCard } from "./components/SellerRefundCard";
import { SellerActionButtons } from "./components/SellerActionButtons";
import { useSellerOrderDetail } from "./hooks/useSellerOrderDetail";
import { formatPrice } from "@/utils/format/price";
import { format, formatTimeAgo } from "@/utils/format/date";
import { openChatWithOrder } from "@/utils/chat";

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  COD: "Thanh toán khi nhận hàng (COD)",
  BANK_TRANSFER: "Chuyển khoản ngân hàng",
  MOMO: "Ví MoMo",
  VNPAY: "VNPay",
};

interface TimelineEntry {
  status: string;
  label: string;
  at?: string;
}

function buildTimeline(order: NonNullable<ReturnType<typeof useSellerOrderDetail>["order"]>): TimelineEntry[] {
  const STEPS: Array<{ key: string; field: keyof typeof order; label: string }> = [
    { key: "pending",          field: "createdAt",            label: "Đặt hàng" },
    { key: "confirmed",        field: "confirmedAt" as never,  label: "Đã xác nhận" },
    { key: "picked_up",        field: "pickedUpAt" as never,   label: "Đã lấy hàng" },
    { key: "shipping",         field: "shippingAt" as never,   label: "Đang vận chuyển" },
    { key: "out_for_delivery", field: "outForDeliveryAt" as never, label: "Đang giao hàng" },
    { key: "delivered",        field: "deliveredAt" as never,  label: "Đã giao hàng" },
    { key: "completed",        field: "completedAt" as never,  label: "Hoàn thành" },
  ];

  const statusHistory: Array<{ status: string; updatedAt: string }> =
    (order as unknown as { statusHistory?: Array<{ status: string; updatedAt: string }> })
      .statusHistory ?? [];

  return STEPS.map(({ key, label }) => {
    const historyEntry = statusHistory.find((h) => h.status === key);
    const at = historyEntry?.updatedAt ?? (order as unknown as Record<string, string | undefined>)[key + "At"];
    return { status: key, label, at };
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
  const timeline = buildTimeline(order);
  const hasTracking = Boolean(order.ghnOrderCode);
  const hasReturnTracking = Boolean(order.ghnReturnOrderCode);
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT column ─────────────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-5">

            {/* Products */}
            <SellerProductsCard order={order} />

            {/* Shipping address */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/20">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <IconMapPin className="w-4.5 h-4.5 text-primary" />
                </div>
                <h2 className="text-sm font-bold text-foreground">Địa chỉ giao hàng</h2>
              </div>
              <div className="p-5">
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
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">
                      {order.buyerId.fullName?.charAt(0)?.toUpperCase() ?? "?"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{order.buyerId.fullName}</p>
                  </div>
                </div>
                <div className="space-y-2 ml-0.5">
                  {order.buyerId.email && (
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <IconMail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{order.buyerId.email}</span>
                    </div>
                  )}
                  {order.buyerId.phoneNumber && (
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <IconPhone className="w-3.5 h-3.5 shrink-0" />
                      <span>{order.buyerId.phoneNumber}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleChatClick}
                  className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-border hover:bg-muted/50 font-semibold text-sm transition-colors"
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
                    {PAYMENT_METHOD_LABEL[order.paymentMethod] ?? order.paymentMethod}
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

            {/* Order timeline */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/20">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <IconClock className="w-4.5 h-4.5 text-primary" />
                </div>
                <h2 className="text-sm font-bold text-foreground">Lịch sử đơn hàng</h2>
              </div>
              <div className="px-5 py-4">
                <ol className="relative border-l border-border ml-3 space-y-5">
                  {timeline.map(({ status, label, at }, idx) => {
                    const isDone = Boolean(at);
                    const isCurrent =
                      !isDone &&
                      idx > 0 &&
                      Boolean(timeline[idx - 1]?.at);
                    return (
                      <li key={status} className="ml-5">
                        <span
                          className={`absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full ring-2 ring-background ${
                            isDone
                              ? "bg-primary"
                              : isCurrent
                              ? "bg-primary/30 ring-primary/30"
                              : "bg-muted"
                          }`}
                        >
                          {isDone && <IconCircleCheck className="w-2.5 h-2.5 text-primary-foreground" />}
                        </span>
                        <div>
                          <p
                            className={`text-sm font-semibold leading-tight ${
                              isDone ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {label}
                          </p>
                          {at && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {format(at)} · {formatTimeAgo(at)}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
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
