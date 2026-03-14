"use client";

import Image from "next/image";
import {
  IconLoader2,
  IconMessage,
  IconPhoto,
  IconVideo,
  IconCircleCheck,
  IconCircleX,
  IconPackage,
  IconUser,
  IconMapPin,
  IconClock,
  IconX,
  IconChevronRight,
  IconReceiptRefund,
} from "@tabler/icons-react";
import { format } from "@/utils/format/date";
import { formatPrice } from "@/utils/format/price";
import { openChat } from "@/utils/chat";
import { StatusBadge } from "@/components/ui/StatusBadge";

const REASON_LABELS: Record<string, string> = {
  damaged: "Hàng bị hỏng",
  wrong_item: "Giao sai hàng",
  not_as_described: "Không đúng mô tả",
  missing_parts: "Thiếu phụ kiện",
  quality_issue: "Chất lượng kém",
  other: "Lý do khác",
};

interface EvidenceImage {
  url: string;
  originalName?: string;
}

interface EvidenceVideo {
  url: string;
  originalName?: string;
}

interface RefundDetail {
  _id: string;
  reason: string;
  description?: string;
  refundAmount: number;
  status: string;
  evidence?: {
    images?: EvidenceImage[];
    videos?: EvidenceVideo[];
  };
  sellerResponse?: {
    decision: string;
    comment?: string;
    respondedAt?: string;
  };
  adminIntervention?: {
    decision: string;
    comment?: string;
    handledAt?: string;
  };
  escalatedToAdmin?: boolean;
  escalatedAt?: string;
  refundedAt?: string;
  buyerId?: { _id: string; fullName?: string; email?: string; phoneNumber?: string };
  sellerId?: { _id: string; fullName?: string; email?: string; phoneNumber?: string };
  orderId?: {
    _id: string;
    totalAmount?: number;
    productAmount?: number;
    shippingFee?: number;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    confirmedAt?: string;
    deliveredAt?: string;
    products?: Array<{
      productId?: { name?: string; avatar?: string | { url: string } };
      quantity?: number;
      price?: number;
    }>;
    shippingAddress?: {
      fullName?: string;
      phoneNumber?: string;
      specificAddress?: string;
      ward?: string;
      district?: string;
      province?: string;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

interface AdminDisputeDetailModalProps {
  open: boolean;
  refund: RefundDetail | null;
  isLoading: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
}

function TimelineDot({ filled }: { filled?: boolean }) {
  return (
    <div
      className={`shrink-0 w-3 h-3 rounded-full border-2 ${
        filled ? "border-primary bg-primary" : "border-border bg-muted/50"
      }`}
    />
  );
}

export function AdminDisputeDetailModal({
  open,
  refund,
  isLoading,
  onClose,
  onApprove,
  onReject,
  isProcessing,
}: AdminDisputeDetailModalProps) {
  if (!open) return null;

  const order = refund?.orderId;
  const orderProducts = order?.products ?? [];
  const orderInfo = order
    ? {
        _id: order._id,
        status: order.status ?? "",
        products: orderProducts.map((p) => ({
          name: (p.productId as { name?: string })?.name ?? "Sản phẩm",
          quantity: p.quantity ?? 0,
          price: p.price ?? 0,
        })),
        totalAmount: order.totalAmount ?? 0,
      }
    : undefined;

  const timelineItems = [
    { label: "Tạo yêu cầu hoàn tiền", value: refund?.createdAt },
    order?.createdAt && { label: "Đặt hàng", value: order.createdAt },
    order?.confirmedAt && { label: "Seller xác nhận", value: order.confirmedAt },
    order?.deliveredAt && { label: "Đã giao hàng", value: order.deliveredAt },
    refund?.sellerResponse?.respondedAt && {
      label: "Seller phản hồi",
      value: refund.sellerResponse.respondedAt,
    },
    refund?.escalatedAt && {
      label: "Khiếu nại lên Admin",
      value: refund.escalatedAt,
    },
    refund?.adminIntervention?.handledAt && {
      label: "Admin xử lý",
      value: refund.adminIntervention.handledAt,
    },
    refund?.refundedAt && { label: "Hoàn tiền hoàn tất", value: refund.refundedAt },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md overflow-y-auto">
      <div className="bg-card rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden border border-border flex flex-col">
        {/* ─── HERO STRIP ─── */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-primary/10 to-transparent" />
          <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2" />
          <div className="relative px-6 py-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <IconReceiptRefund className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    Khiếu nại
                  </p>
                  <h2 className="text-xl font-bold text-foreground font-mono">
                    #{refund?._id?.slice(-8).toUpperCase() ?? "—"}
                  </h2>
                </div>
              </div>
              <div className="h-10 w-px bg-border hidden sm:block" />
              <div>
                <p className="text-xs text-muted-foreground">Số tiền yêu cầu</p>
                <p className="text-2xl font-bold text-primary tabular-nums">
                  {refund ? formatPrice(refund.refundAmount) : "—"}
                </p>
              </div>
              {(refund?.createdAt || refund?.updatedAt) && (
                <div className="text-sm text-muted-foreground">
                  <span>Tạo {refund?.createdAt && format(refund.createdAt)}</span>
                  {refund?.updatedAt && (
                    <span className="ml-2">· Cập nhật {format(refund.updatedAt)}</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {order && <StatusBadge status={order.status ?? "pending"} size="md" />}
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <IconLoader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : !refund ? (
            <p className="text-muted-foreground text-center py-16">Không tải được dữ liệu.</p>
          ) : (
            <div className="space-y-6">
              {/* ─── BENTO: Parties + Request ─── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Buyer vs Seller — 2 cols */}
                <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-border bg-gradient-to-br from-blue-500/5 to-transparent hover:border-blue-500/30 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <IconUser className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Người mua
                      </span>
                    </div>
                    <p className="font-bold text-foreground truncate">
                      {refund.buyerId?.fullName ?? "—"}
                    </p>
                    {refund.buyerId?.phoneNumber && (
                      <p className="text-sm text-muted-foreground mt-0.5 font-mono">
                        {refund.buyerId.phoneNumber}
                      </p>
                    )}
                    {refund.buyerId?.email && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {refund.buyerId.email}
                      </p>
                    )}
                    <button
                      onClick={() =>
                        refund.buyerId?._id &&
                        openChat({
                          userId: refund.buyerId._id,
                          userName: refund.buyerId.fullName ?? "Người mua",
                          order: orderInfo,
                        })
                      }
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
                    >
                      <IconMessage className="w-4 h-4" />
                      Nhắn tin
                    </button>
                  </div>
                  <div className="p-4 rounded-2xl border border-border bg-gradient-to-br from-amber-500/5 to-transparent hover:border-amber-500/30 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <IconUser className="w-4 h-4 text-amber-600" />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Người bán
                      </span>
                    </div>
                    <p className="font-bold text-foreground truncate">
                      {refund.sellerId?.fullName ?? "—"}
                    </p>
                    {refund.sellerId?.phoneNumber && (
                      <p className="text-sm text-muted-foreground mt-0.5 font-mono">
                        {refund.sellerId.phoneNumber}
                      </p>
                    )}
                    {refund.sellerId?.email && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {refund.sellerId.email}
                      </p>
                    )}
                    <button
                      onClick={() =>
                        refund.sellerId?._id &&
                        openChat({
                          userId: refund.sellerId._id,
                          userName: refund.sellerId.fullName ?? "Người bán",
                          order: orderInfo,
                        })
                      }
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm font-semibold hover:bg-amber-500/20 transition-colors"
                    >
                      <IconMessage className="w-4 h-4" />
                      Nhắn tin
                    </button>
                  </div>
                </div>

                {/* Request summary — 1 col */}
                <div className="lg:col-span-7 p-5 rounded-2xl border border-border bg-card">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <IconPackage className="w-4 h-4" />
                    Yêu cầu hoàn tiền
                  </h3>
                  <div className="flex flex-wrap gap-6 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Lý do</p>
                      <p className="font-semibold text-foreground">
                        {REASON_LABELS[refund.reason] ?? refund.reason}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Số tiền</p>
                      <p className="font-bold text-primary text-lg">{formatPrice(refund.refundAmount)}</p>
                    </div>
                  </div>
                  {refund.description && (
                    <div className="p-4 rounded-xl bg-muted/40 border border-border">
                      <p className="text-sm text-foreground leading-relaxed">{refund.description}</p>
                    </div>
                  )}
                  {refund.sellerResponse && (
                    <div
                      className={`mt-4 p-4 rounded-xl border-2 flex items-start gap-3 ${
                        refund.sellerResponse.decision === "rejected"
                          ? "bg-red-500/5 border-red-500/30 dark:border-red-500/20"
                          : "bg-emerald-500/5 border-emerald-500/30 dark:border-emerald-500/20"
                      }`}
                    >
                      {refund.sellerResponse.decision === "rejected" ? (
                        <IconCircleX className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      ) : (
                        <IconCircleCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold">
                          Seller {refund.sellerResponse.decision === "rejected" ? "từ chối" : "chấp thuận"}
                          {refund.sellerResponse.respondedAt && (
                            <span className="text-muted-foreground font-normal font-mono text-sm ml-2">
                              {format(refund.sellerResponse.respondedAt)}
                            </span>
                          )}
                        </p>
                        {refund.sellerResponse.comment && (
                          <p className="mt-1 text-sm text-foreground/90">
                            &ldquo;{refund.sellerResponse.comment}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ─── ORDER + EVIDENCE SIDE BY SIDE ─── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order card */}
                {order && (
                  <div className="p-5 rounded-2xl border border-border bg-card">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                        <IconPackage className="w-4 h-4" />
                        Đơn hàng #{order._id?.slice(-8).toUpperCase()}
                      </h3>
                      <StatusBadge status={order.status ?? "pending"} size="sm" />
                    </div>
                    {(order.createdAt || order.updatedAt) && (
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
                        {order.createdAt && <span>Đặt: {format(order.createdAt)}</span>}
                        {order.updatedAt && <span>Cập nhật: {format(order.updatedAt)}</span>}
                      </div>
                    )}
                    {order.shippingAddress && typeof order.shippingAddress === "object" && (
                      <div className="mb-4 p-4 rounded-xl bg-muted/30 border border-border">
                        <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                          <IconMapPin className="w-4 h-4" /> Địa chỉ giao hàng
                        </p>
                        <p className="font-medium">{order.shippingAddress.fullName}</p>
                        {order.shippingAddress.phoneNumber && (
                          <p className="text-sm text-muted-foreground font-mono">
                            {order.shippingAddress.phoneNumber}
                          </p>
                        )}
                        <p className="text-sm text-foreground mt-1">
                          {[
                            order.shippingAddress.specificAddress,
                            order.shippingAddress.ward,
                            order.shippingAddress.district,
                            order.shippingAddress.province,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    )}
                    <div className="space-y-2">
                      {orderProducts.map((item, i) => {
                        const prod = item.productId as { name?: string; avatar?: string | { url?: string } };
                        const avatar = prod?.avatar;
                        const imgUrl =
                          typeof avatar === "string"
                            ? avatar
                            : typeof avatar === "object" && avatar?.url
                              ? avatar.url
                              : null;
                        return (
                          <div
                            key={i}
                            className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0"
                          >
                            {imgUrl && (
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted shrink-0">
                                <Image
                                  src={imgUrl}
                                  alt=""
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <span className="text-sm truncate flex-1">
                              {prod?.name ?? "Sản phẩm"} ×{item.quantity}
                            </span>
                            <span className="text-sm font-semibold shrink-0 tabular-nums">
                              {formatPrice((item.price ?? 0) * (item.quantity ?? 1))}
                            </span>
                          </div>
                        );
                      })}
                      <div className="flex justify-between font-bold text-base pt-3 border-t-2 border-border">
                        <span>Tổng cộng</span>
                        <span className="text-primary tabular-nums">
                          {formatPrice(order.totalAmount ?? 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Evidence */}
                {((refund.evidence?.images?.length ?? 0) > 0 ||
                  (refund.evidence?.videos?.length ?? 0) > 0) && (
                  <div className="p-5 rounded-2xl border border-border bg-card">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                      <IconPhoto className="w-4 h-4" />
                      Bằng chứng từ người mua
                    </h3>
                    {refund.evidence?.images && refund.evidence.images.length > 0 && (
                      <div className="mb-4">
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {refund.evidence.images.map((img, i) => (
                            <a
                              key={i}
                              href={img.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block aspect-square rounded-xl overflow-hidden border border-border hover:border-primary hover:ring-2 hover:ring-primary/20 transition-all group"
                            >
                              <Image
                                src={img.url}
                                alt={img.originalName ?? `Bằng chứng ${i + 1}`}
                                width={120}
                                height={120}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    {refund.evidence?.videos && refund.evidence.videos.length > 0 && (
                      <div className="space-y-2">
                        {refund.evidence.videos.map((v, i) => (
                          <a
                            key={i}
                            href={v.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 hover:border-primary/50 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <IconVideo className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-sm font-medium truncate flex-1">
                              {v.originalName ?? `Video ${i + 1}`}
                            </span>
                            <IconChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ─── TIMELINE (horizontal on desktop, vertical on mobile) ─── */}
              {timelineItems.length > 0 && (
                <div className="p-5 rounded-2xl border border-border bg-card">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <IconClock className="w-4 h-4" />
                    Mốc thời gian
                  </h3>
                  <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border hidden sm:block" />
                    <div className="space-y-0">
                      {timelineItems.map((item, i) => (
                        <div key={i} className="relative flex items-start gap-4 py-3 sm:py-2">
                          <div className="relative z-10 mt-1 sm:mt-1.5">
                            <TimelineDot filled />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="text-sm text-muted-foreground">{item.label}</span>
                            <span className="text-sm font-semibold text-foreground font-mono tabular-nums">
                              {format(item.value)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── STICKY ACTION BAR ─── */}
        {refund?.status === "disputed" && (
          <div className="sticky bottom-0 border-t border-border bg-card/95 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={onReject}
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-destructive text-destructive font-semibold hover:bg-destructive/5 disabled:opacity-50 transition-colors"
            >
              <IconCircleX className="w-5 h-5" />
              Bác bỏ khiếu nại
            </button>
            <button
              onClick={onApprove}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-lg shadow-primary/20"
            >
              {isProcessing ? (
                <IconLoader2 className="w-5 h-5 animate-spin" />
              ) : (
                <IconCircleCheck className="w-5 h-5" />
              )}
              Duyệt hoàn tiền
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
