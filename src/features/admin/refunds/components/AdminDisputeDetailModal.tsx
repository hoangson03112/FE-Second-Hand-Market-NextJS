"use client";

import Image from "next/image";
import { useMemo, type ReactNode } from "react";
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
  IconQrcode,
} from "@tabler/icons-react";
import { generateBuyerRefundVietQRImageUrl } from "@/constants/payment";
import { format } from "@/utils/format/date";
import { formatPrice } from "@/utils/format/price";
import { openChat } from "@/utils/chat";
import { StatusBadge } from "@/components/shared";

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
  buyerRefundBankInfo?: {
    buyerBankName?: string;
    buyerAccountNumber?: string;
    buyerAccountHolder?: string;
    submittedAt?: string;
  } | null;
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

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{children}</p>
  );
}

function TimelineDot({ filled }: { filled?: boolean }) {
  return (
    <div
      className={`shrink-0 w-2.5 h-2.5 rounded-full ${
        filled ? "bg-primary" : "bg-muted-foreground/25"
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
  const buyerRefundQr = useMemo(() => {
    const b = refund?.buyerRefundBankInfo;
    if (!refund || !b?.buyerBankName?.trim() || !b?.buyerAccountNumber?.trim()) return null;
    const oid =
      refund.orderId && typeof refund.orderId === "object" && "_id" in refund.orderId
        ? String((refund.orderId as { _id: string })._id)
        : String(refund._id);
    const orderRef = oid.slice(-8).toUpperCase();
    const transferContent = `Hoan tien don ${orderRef}`;
    return {
      url: generateBuyerRefundVietQRImageUrl({
        bankName: b.buyerBankName,
        accountNumber: b.buyerAccountNumber,
        accountHolder: b.buyerAccountHolder,
        amountVnd: refund.refundAmount,
        transferContent,
      }),
      transferContent,
    };
  }, [refund]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm overflow-y-auto">
      <div className="bg-card rounded-2xl shadow-xl max-w-7xl w-full max-h-[92vh] overflow-hidden border border-border flex flex-col">
        {/* Header: trạng thái khiếu nại + số tiền (một lần, rõ ràng) */}
        <header className="shrink-0 border-b border-border bg-muted/20 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <IconReceiptRefund className="h-5 w-5" stroke={1.75} />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2 gap-y-1">
                  <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                    Khiếu nại{" "}
                    <span className="font-mono text-muted-foreground">
                      #{refund?._id?.slice(-8).toUpperCase() ?? "—"}
                    </span>
                  </h2>
                  {refund?.status && <StatusBadge status={refund.status} size="sm" />}
                </div>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {refund?.createdAt && <span>Tạo {format(refund.createdAt)}</span>}
                  {refund?.updatedAt && (
                    <span className={refund?.createdAt ? " · " : ""}>
                      Cập nhật {format(refund.updatedAt)}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Đóng"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>
          {refund && (
            <div className="mt-4 flex flex-col gap-0.5 border-t border-border/80 pt-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionLabel>Số tiền hoàn</SectionLabel>
              <p className="text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-3xl">
                {formatPrice(refund.refundAmount)}
              </p>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <IconLoader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : !refund ? (
            <p className="text-muted-foreground text-center py-16">Không tải được dữ liệu.</p>
          ) : (
            <div className="space-y-5">
              {/* Người tham gia — một hàng gọn */}
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    role: "Người mua",
                    u: refund.buyerId,
                    fallback: "Người mua",
                    accent: "text-sky-600 dark:text-sky-400",
                    bg: "bg-sky-500/10",
                  },
                  {
                    role: "Người bán",
                    u: refund.sellerId,
                    fallback: "Người bán",
                    accent: "text-amber-700 dark:text-amber-400",
                    bg: "bg-amber-500/10",
                  },
                ].map(({ role, u, fallback, accent, bg }) => (
                  <div
                    key={role}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-3"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bg}`}
                    >
                      <IconUser className={`h-5 w-5 ${accent}`} stroke={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <SectionLabel>{role}</SectionLabel>
                      <p className="truncate font-medium text-foreground">{u?.fullName ?? "—"}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {u?.phoneNumber ?? u?.email ?? "—"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        u?._id &&
                        openChat({
                          userId: u._id,
                          userName: u.fullName ?? fallback,
                          order: orderInfo,
                        })
                      }
                      className="shrink-0 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      <IconMessage className="mr-1 inline h-3.5 w-3.5 align-text-bottom" />
                      Chat
                    </button>
                  </div>
                ))}
              </div>

              {/* Nội dung khiếu nại — không lặp số tiền */}
              <section className="rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <IconPackage className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">Yêu cầu hoàn tiền</h3>
                </div>
                <div className="space-y-4 px-4 py-4">
                  <div>
                    <SectionLabel>Lý do</SectionLabel>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {REASON_LABELS[refund.reason] ?? refund.reason}
                    </p>
                  </div>
                  {refund.description && (
                    <div>
                      <SectionLabel>Ghi chú từ người mua</SectionLabel>
                      <p className="mt-1.5 rounded-lg bg-muted/50 px-3 py-2.5 text-sm leading-relaxed text-foreground">
                        {refund.description}
                      </p>
                    </div>
                  )}
                  {refund.sellerResponse && (
                    <div
                      className={`flex gap-3 rounded-lg px-3 py-3 ${
                        refund.sellerResponse.decision === "rejected"
                          ? "bg-destructive/5"
                          : "bg-emerald-500/10 dark:bg-emerald-500/15"
                      }`}
                    >
                      {refund.sellerResponse.decision === "rejected" ? (
                        <IconCircleX className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                      ) : (
                        <IconCircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          Seller {refund.sellerResponse.decision === "rejected" ? "từ chối" : "chấp thuận"}
                          {refund.sellerResponse.respondedAt && (
                            <span className="ml-2 font-normal text-muted-foreground">
                              · {format(refund.sellerResponse.respondedAt)}
                            </span>
                          )}
                        </p>
                        {refund.sellerResponse.comment && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {refund.sellerResponse.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {refund.buyerRefundBankInfo?.buyerAccountNumber && (
                <section className="overflow-hidden rounded-xl border border-primary/20 bg-primary/[0.03] dark:bg-primary/[0.06]">
                  <div className="border-b border-primary/15 bg-primary/5 px-4 py-3 sm:flex sm:items-center sm:justify-between sm:gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                        <IconQrcode className="h-5 w-5" stroke={1.5} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Bước tiếp theo: chuyển khoản</h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Quét VietQR — app sẽ điền sẵn số tiền và nội dung. Chuyển đúng{" "}
                          <span className="font-medium text-foreground">{formatPrice(refund.refundAmount)}</span>
                          {buyerRefundQr?.transferContent ? " và nội dung bên dưới." : "."}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-8">
                    <dl className="space-y-3 text-sm">
                      <div className="grid gap-0.5 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-x-4">
                        <dt className="text-muted-foreground">Ngân hàng</dt>
                        <dd className="font-medium text-foreground">
                          {refund.buyerRefundBankInfo.buyerBankName ?? "—"}
                        </dd>
                      </div>
                      <div className="grid gap-0.5 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-x-4">
                        <dt className="text-muted-foreground">Số tài khoản</dt>
                        <dd className="font-mono font-medium tracking-wide text-foreground">
                          {refund.buyerRefundBankInfo.buyerAccountNumber}
                        </dd>
                      </div>
                      <div className="grid gap-0.5 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-x-4">
                        <dt className="text-muted-foreground">Chủ TK</dt>
                        <dd className="font-medium text-foreground">
                          {refund.buyerRefundBankInfo.buyerAccountHolder ?? "—"}
                        </dd>
                      </div>
                      {buyerRefundQr?.transferContent && (
                        <div className="border-t border-border/80 pt-3">
                          <dt className="text-muted-foreground">Nội dung CK</dt>
                          <dd className="mt-1 break-all font-mono text-sm font-medium text-foreground">
                            {buyerRefundQr.transferContent}
                          </dd>
                        </div>
                      )}
                      {refund.buyerRefundBankInfo.submittedAt && (
                        <p className="text-xs text-muted-foreground pt-1">
                          Người mua gửi STK lúc {format(refund.buyerRefundBankInfo.submittedAt)}
                        </p>
                      )}
                    </dl>
                    {buyerRefundQr?.url && (
                      <div className="flex flex-col items-center lg:items-end">
                        <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
                          <Image
                            src={buyerRefundQr.url}
                            alt="Mã VietQR hoàn tiền"
                            width={216}
                            height={216}
                            className="h-[200px] w-[200px] object-contain sm:h-[216px] sm:w-[216px]"
                            unoptimized
                          />
                        </div>
                        <p className="mt-2 max-w-[220px] text-center text-[11px] leading-snug text-muted-foreground lg:text-right">
                          Lỗi QR? Chuyển thủ công theo thông tin bên trái.
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {order && (
                  <section className="rounded-xl border border-border bg-card">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
                      <h3 className="text-sm font-semibold text-foreground">
                        Đơn #{order._id?.slice(-8).toUpperCase()}
                      </h3>
                      <StatusBadge status={order.status ?? "pending"} size="sm" />
                    </div>
                    <div className="space-y-3 px-4 py-3">
                      {(order.createdAt || order.updatedAt) && (
                        <p className="text-xs text-muted-foreground">
                          {order.createdAt && <>Đặt {format(order.createdAt)}</>}
                          {order.createdAt && order.updatedAt && " · "}
                          {order.updatedAt && <>Cập nhật {format(order.updatedAt)}</>}
                        </p>
                      )}
                      {order.shippingAddress && typeof order.shippingAddress === "object" && (
                        <div className="rounded-lg bg-muted/40 px-3 py-2.5 text-sm">
                          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <IconMapPin className="h-3.5 w-3.5" /> Giao hàng
                          </p>
                          <p className="mt-1 font-medium">{order.shippingAddress.fullName}</p>
                          {order.shippingAddress.phoneNumber && (
                            <p className="text-xs text-muted-foreground font-mono">
                              {order.shippingAddress.phoneNumber}
                            </p>
                          )}
                          <p className="mt-1 text-xs leading-relaxed text-foreground">
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
                      <div className="divide-y divide-border">
                        {orderProducts.map((item, i) => {
                          const prod = item.productId as {
                            name?: string;
                            avatar?: string | { url?: string };
                          };
                          const avatar = prod?.avatar;
                          const imgUrl =
                            typeof avatar === "string"
                              ? avatar
                              : typeof avatar === "object" && avatar?.url
                                ? avatar.url
                                : null;
                          return (
                            <div key={i} className="flex items-center gap-3 py-2.5 first:pt-0">
                              {imgUrl && (
                                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                                  <Image
                                    src={imgUrl}
                                    alt=""
                                    width={44}
                                    height={44}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                              <span className="min-w-0 flex-1 truncate text-sm">
                                {prod?.name ?? "Sản phẩm"}{" "}
                                <span className="text-muted-foreground">×{item.quantity}</span>
                              </span>
                              <span className="shrink-0 text-sm font-medium tabular-nums">
                                {formatPrice((item.price ?? 0) * (item.quantity ?? 1))}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between border-t border-border pt-3 text-sm font-semibold">
                        <span className="text-muted-foreground">Tổng đơn</span>
                        <span className="tabular-nums text-foreground">
                          {formatPrice(order.totalAmount ?? 0)}
                        </span>
                      </div>
                    </div>
                  </section>
                )}

                {((refund.evidence?.images?.length ?? 0) > 0 ||
                  (refund.evidence?.videos?.length ?? 0) > 0) && (
                  <section className="rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                      <IconPhoto className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold text-foreground">Bằng chứng</h3>
                    </div>
                    <div className="px-4 py-3">
                      {refund.evidence?.images && refund.evidence.images.length > 0 && (
                        <div className="mb-3 last:mb-0">
                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {refund.evidence.images.map((img, i) => (
                              <a
                                key={i}
                                href={img.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block aspect-square overflow-hidden rounded-lg border border-border transition-colors hover:border-primary"
                              >
                                <Image
                                  src={img.url}
                                  alt={img.originalName ?? `Bằng chứng ${i + 1}`}
                                  width={120}
                                  height={120}
                                  className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
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
                              className="flex items-center gap-3 rounded-lg border border-border p-2.5 transition-colors hover:bg-muted/60"
                            >
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                                <IconVideo className="h-4 w-4 text-primary" />
                              </div>
                              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                {v.originalName ?? `Video ${i + 1}`}
                              </span>
                              <IconChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                )}
              </div>

              {timelineItems.length > 0 && (
                <section className="rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                    <IconClock className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">Mốc thời gian</h3>
                  </div>
                  <ul className="divide-y divide-border px-2 py-1">
                    {timelineItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 px-2 py-2.5">
                        <span className="mt-1.5">
                          <TimelineDot filled />
                        </span>
                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between sm:gap-4">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <time className="text-sm font-medium tabular-nums text-foreground">
                            {format(item.value)}
                          </time>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </div>

        {/* ─── STICKY ACTION BAR ─── */}
        {refund?.status === "disputed" && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border bg-muted/20 px-5 py-3 sm:px-6">
            <button
              type="button"
              onClick={onReject}
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-lg border border-destructive/50 px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/5 disabled:opacity-50"
            >
              <IconCircleX className="h-4 w-4" />
              Bác bỏ khiếu nại
            </button>
            <button
              type="button"
              onClick={onApprove}
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isProcessing ? (
                <IconLoader2 className="h-4 w-4 animate-spin" />
              ) : (
                <IconCircleCheck className="h-4 w-4" />
              )}
              Duyệt hoàn tiền
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
