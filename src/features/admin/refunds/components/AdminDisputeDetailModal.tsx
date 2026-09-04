"use client";

import { OrderStatusBadge } from "@/features/order/components";
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
import {
} from "@/components/ui";

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
  buyerId?: {
    _id: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  };
  sellerId?: {
    _id: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  };
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
    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
      {children}
    </p>
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
    if (!refund || !b?.buyerBankName?.trim() || !b?.buyerAccountNumber?.trim())
      return null;
    const oid =
      refund.orderId &&
      typeof refund.orderId === "object" &&
      "_id" in refund.orderId
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
    order?.confirmedAt && {
      label: "Seller xác nhận",
      value: order.confirmedAt,
    },
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
    refund?.refundedAt && {
      label: "Hoàn tiền hoàn tất",
      value: refund.refundedAt,
    },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-ink/60 overflow-y-auto">
      <div className="bg-white rounded-[2px] shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden border border-luxury-ink/10 flex flex-col">
        <header className="shrink-0 border-b border-luxury-ink/10 bg-cream-50/70 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink">
                <IconReceiptRefund className="h-5 w-5" stroke={1.75} />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2 gap-y-1">
                  <h2 className="font-droid-serif text-base font-bold tracking-tight text-luxury-ink sm:text-lg">
                    Khiếu nại{" "}
                    <span className="font-mono text-neutral-500">
                      #{refund?._id?.slice(-8).toUpperCase() ?? "—"}
                    </span>
                  </h2>
                  {refund?.status && (
                    <OrderStatusBadge status={refund.status} size="sm" />
                  )}
                </div>
                <p className="text-2xs text-neutral-500 font-medium">
                  {refund?.createdAt && (
                    <span>Tạo {format(refund.createdAt)}</span>
                  )}
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
              className="shrink-0 rounded-[2px] border border-luxury-ink/10 p-1.5 text-luxury-ink transition-colors hover:bg-taupe-50"
              aria-label="Đóng"
            >
              <IconX className="h-4 w-4" />
            </button>
          </div>
          {refund && (
            <div className="mt-4 flex flex-col gap-0.5 border-t border-luxury-ink/8 pt-3 sm:flex-row sm:items-end sm:justify-between">
              <SectionLabel>Số tiền hoàn</SectionLabel>
              <p className="font-droid-serif text-2xl font-bold tabular-nums text-luxury-ink sm:text-3xl">
                {formatPrice(refund.refundAmount)}
              </p>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 bg-luxury-ivory/40">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <IconLoader2 className="w-8 h-8 animate-spin text-luxury-ink" />
            </div>
          ) : !refund ? (
            <p className="text-neutral-500 text-center py-16 text-xs">
              Không tải được dữ liệu.
            </p>
          ) : (
            <div className="space-y-5">

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    role: "Người mua",
                    u: refund.buyerId,
                    fallback: "Người mua",
                    accent: "text-sky-600",
                    bg: "bg-sky-500/10",
                  },
                  {
                    role: "Người bán",
                    u: refund.sellerId,
                    fallback: "Người bán",
                    accent: "text-amber-700",
                    bg: "bg-amber-500/10",
                  },
                ].map(({ role, u, fallback, accent, bg }) => (
                  <div
                    key={role}
                    className="flex items-center gap-3 rounded-[2px] border border-luxury-ink/10 bg-white px-3.5 py-3 shadow-xs"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] ${bg}`}
                    >
                      <IconUser className={`h-4 w-4 ${accent}`} stroke={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <SectionLabel>{role}</SectionLabel>
                      <p className="truncate font-semibold text-xs text-luxury-ink">
                        {u?.fullName ?? "—"}
                      </p>
                      <p className="truncate text-2xs text-neutral-500">
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
                      className="shrink-0 rounded-[2px] border border-luxury-ink/20 bg-white px-2.5 py-1.5 text-2xs font-bold uppercase tracking-wider text-luxury-ink transition-colors hover:bg-taupe-50"
                    >
                      <IconMessage className="mr-1 inline h-3.5 w-3.5 align-text-bottom" />
                      Chat
                    </button>
                  </div>
                ))}
              </div>


              <section className="rounded-[2px] border border-luxury-ink/10 bg-white shadow-xs">
                <div className="flex items-center gap-2 border-b border-luxury-ink/10 bg-cream-50/50 px-4 py-3">
                  <IconPackage className="h-4 w-4 text-luxury-ink" />
                  <h3 className="font-droid-serif text-sm font-bold text-luxury-ink">
                    Yêu cầu hoàn tiền
                  </h3>
                </div>
                <div className="space-y-4 px-4 py-4">
                  <div>
                    <SectionLabel>Lý do</SectionLabel>
                    <p className="mt-1 text-sm font-medium text-luxury-ink">
                      {REASON_LABELS[refund.reason] ?? refund.reason}
                    </p>
                  </div>
                  {refund.description && (
                    <div>
                      <SectionLabel>Ghi chú từ người mua</SectionLabel>
                      <p className="mt-1.5 rounded-[2px] bg-cream-50/70 border border-luxury-ink/8 px-3.5 py-2.5 text-xs leading-relaxed text-neutral-600">
                        {refund.description}
                      </p>
                    </div>
                  )}
                  {refund.sellerResponse && (
                    <div
                      className={`flex gap-3 rounded-[2px] border px-3.5 py-3 ${
                        refund.sellerResponse.decision === "rejected"
                          ? "bg-blush-50/60 border-blush-200"
                          : "bg-emerald-50/60 border-emerald-200"
                      }`}
                    >
                      {refund.sellerResponse.decision === "rejected" ? (
                        <IconCircleX className="mt-0.5 h-4 w-4 shrink-0 text-blush-600" />
                      ) : (
                        <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-luxury-ink">
                          Seller{" "}
                          {refund.sellerResponse.decision === "rejected"
                            ? "từ chối"
                            : "chấp thuận"}
                          {refund.sellerResponse.respondedAt && (
                            <span className="ml-2 font-normal text-neutral-400 lowercase">
                              · {format(refund.sellerResponse.respondedAt)}
                            </span>
                          )}
                        </p>
                        {refund.sellerResponse.comment && (
                          <p className="mt-1 text-xs text-neutral-600">
                            {refund.sellerResponse.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {refund.buyerRefundBankInfo?.buyerAccountNumber && (
                <section className="overflow-hidden rounded-[2px] border border-luxury-ink/15 bg-cream-50/30 shadow-xs">
                  <div className="border-b border-luxury-ink/10 bg-cream-50/70 px-4 py-3 sm:flex sm:items-center sm:justify-between sm:gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] bg-luxury-ink text-luxury-ivory">
                        <IconQrcode className="h-4 w-4" stroke={1.5} />
                      </div>
                      <div>
                        <h3 className="font-droid-serif text-sm font-bold text-luxury-ink">
                          Thông tin tài khoản hoàn tiền
                        </h3>
                        <p className="mt-0.5 text-2xs text-neutral-500">
                          Quét mã VietQR hoặc chuyển khoản đúng số tiền{" "}
                          <span className="font-bold text-luxury-ink font-mono">
                            {formatPrice(refund.refundAmount)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-8">
                    <dl className="space-y-3 text-xs">
                      <div className="grid gap-0.5 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-x-4">
                        <dt className="text-neutral-500">Ngân hàng</dt>
                        <dd className="font-bold text-luxury-ink">
                          {refund.buyerRefundBankInfo.buyerBankName ?? "—"}
                        </dd>
                      </div>
                      <div className="grid gap-0.5 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-x-4">
                        <dt className="text-neutral-500">Số tài khoản</dt>
                        <dd className="font-mono font-bold text-luxury-ink">
                          {refund.buyerRefundBankInfo.buyerAccountNumber}
                        </dd>
                      </div>
                      <div className="grid gap-0.5 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-x-4">
                        <dt className="text-neutral-500">Chủ tài khoản</dt>
                        <dd className="font-bold uppercase text-luxury-ink">
                          {refund.buyerRefundBankInfo.buyerAccountHolder ?? "—"}
                        </dd>
                      </div>
                      {buyerRefundQr?.transferContent && (
                        <div className="border-t border-luxury-ink/10 pt-2.5">
                          <dt className="text-neutral-500">Nội dung chuyển khoản</dt>
                          <dd className="mt-1 break-all font-mono text-2xs font-bold text-luxury-ink bg-white p-2 rounded-[2px] border border-luxury-ink/8">
                            {buyerRefundQr.transferContent}
                          </dd>
                        </div>
                      )}
                      {refund.buyerRefundBankInfo.submittedAt && (
                        <p className="text-2xs text-neutral-400 pt-1">
                          Người mua gửi STK lúc{" "}
                          {format(refund.buyerRefundBankInfo.submittedAt)}
                        </p>
                      )}
                    </dl>
                    {buyerRefundQr?.url && (
                      <div className="flex flex-col items-center lg:items-end">
                        <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-3 shadow-xs">
                          <Image
                            src={buyerRefundQr.url}
                            alt="Mã VietQR hoàn tiền"
                            width={200}
                            height={200}
                            className="h-[180px] w-[180px] object-contain"
                            unoptimized
                          />
                        </div>
                        <p className="mt-1.5 max-w-[200px] text-center text-[10px] text-neutral-400 lg:text-right">
                          Quét app ngân hàng để điền nhanh
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {order && (
                  <section className="rounded-[2px] border border-luxury-ink/10 bg-white shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-luxury-ink/10 bg-cream-50/50 px-4 py-3">
                      <h3 className="font-droid-serif text-sm font-bold text-luxury-ink">
                        Đơn #{order._id?.slice(-8).toUpperCase()}
                      </h3>
                      <OrderStatusBadge
                        status={order.status ?? "pending"}
                        size="sm"
                      />
                    </div>
                    <div className="space-y-3 px-4 py-3 text-xs">
                      {(order.createdAt || order.updatedAt) && (
                        <p className="text-2xs text-neutral-400">
                          {order.createdAt && (
                            <>Đặt: {format(order.createdAt)}</>
                          )}
                          {order.createdAt && order.updatedAt && " · "}
                          {order.updatedAt && (
                            <>Cập nhật: {format(order.updatedAt)}</>
                          )}
                        </p>
                      )}
                      {order.shippingAddress &&
                        typeof order.shippingAddress === "object" && (
                          <div className="rounded-[2px] bg-cream-50/70 border border-luxury-ink/8 px-3 py-2.5 text-xs">
                            <p className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-neutral-500">
                              <IconMapPin className="h-3.5 w-3.5 text-luxury-ink" /> Địa chỉ giao hàng
                            </p>
                            <p className="mt-1 font-semibold text-luxury-ink">
                              {order.shippingAddress.fullName}
                            </p>
                            {order.shippingAddress.phoneNumber && (
                              <p className="text-2xs text-neutral-500 font-mono">
                                {order.shippingAddress.phoneNumber}
                              </p>
                            )}
                            <p className="mt-1 text-xs text-neutral-600">
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
                      <div className="divide-y divide-luxury-ink/6">
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
                            <div
                              key={i}
                              className="flex items-center gap-3 py-2.5 first:pt-0"
                            >
                              {imgUrl && (
                                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[2px] bg-taupe-50 border border-luxury-ink/8">
                                  <Image
                                    src={imgUrl}
                                    alt=""
                                    width={40}
                                    height={40}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                              <span className="min-w-0 flex-1 truncate text-xs text-luxury-ink font-medium">
                                {prod?.name ?? "Sản phẩm"}{" "}
                                <span className="text-neutral-400 font-mono">
                                  ×{item.quantity}
                                </span>
                              </span>
                              <span className="shrink-0 text-xs font-bold font-droid-serif tabular-nums text-luxury-ink">
                                {formatPrice(
                                  (item.price ?? 0) * (item.quantity ?? 1),
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between border-t border-luxury-ink/10 pt-3 text-xs font-bold">
                        <span className="text-neutral-500 uppercase tracking-wider text-2xs">Tổng đơn</span>
                        <span className="font-droid-serif text-sm font-bold text-luxury-ink tabular-nums">
                          {formatPrice(order.totalAmount ?? 0)}
                        </span>
                      </div>
                    </div>
                  </section>
                )}

                {((refund.evidence?.images?.length ?? 0) > 0 ||
                  (refund.evidence?.videos?.length ?? 0) > 0) && (
                  <section className="rounded-[2px] border border-luxury-ink/10 bg-white shadow-xs">
                    <div className="flex items-center gap-2 border-b border-luxury-ink/10 bg-cream-50/50 px-4 py-3">
                      <IconPhoto className="h-4 w-4 text-luxury-ink" />
                      <h3 className="font-droid-serif text-sm font-bold text-luxury-ink">
                        Bằng chứng người mua
                      </h3>
                    </div>
                    <div className="px-4 py-3">
                      {refund.evidence?.images &&
                        refund.evidence.images.length > 0 && (
                          <div className="mb-3 last:mb-0">
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                              {refund.evidence.images.map((img, i) => (
                                <a
                                  key={i}
                                  href={img.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group block aspect-square overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-taupe-50"
                                >
                                  <Image
                                    src={img.url}
                                    alt={
                                      img.originalName ?? `Bằng chứng ${i + 1}`
                                    }
                                    width={120}
                                    height={120}
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
                                  />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      {refund.evidence?.videos &&
                        refund.evidence.videos.length > 0 && (
                          <div className="space-y-2">
                            {refund.evidence.videos.map((v, i) => (
                              <a
                                key={i}
                                href={v.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 rounded-[2px] border border-luxury-ink/10 p-2.5 text-xs text-luxury-ink transition-colors hover:bg-taupe-50"
                              >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] bg-cream-50 border border-luxury-ink/10">
                                  <IconVideo className="h-4 w-4 text-luxury-ink" />
                                </div>
                                <span className="min-w-0 flex-1 truncate font-medium">
                                  {v.originalName ?? `Video ${i + 1}`}
                                </span>
                                <IconChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
                              </a>
                            ))}
                          </div>
                        )}
                    </div>
                  </section>
                )}
              </div>

              {timelineItems.length > 0 && (
                <section className="rounded-[2px] border border-luxury-ink/10 bg-white shadow-xs">
                  <div className="flex items-center gap-2 border-b border-luxury-ink/10 bg-cream-50/50 px-4 py-3">
                    <IconClock className="h-4 w-4 text-luxury-ink" />
                    <h3 className="font-droid-serif text-sm font-bold text-luxury-ink">
                      Tiến trình xử lý
                    </h3>
                  </div>
                  <ul className="divide-y divide-luxury-ink/6 px-3 py-1 text-xs">
                    {timelineItems.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 px-2 py-2.5"
                      >
                        <span className="mt-1.5">
                          <TimelineDot filled />
                        </span>
                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between sm:gap-4">
                          <span className="text-neutral-500">
                            {item.label}
                          </span>
                          <time className="font-mono text-2xs text-luxury-ink font-semibold">
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


        {refund?.status === "disputed" && (
          <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-luxury-ink/10 bg-cream-50/50 px-5 py-3 sm:px-6">
            <button
              type="button"
              onClick={onReject}
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-[2px] border border-rose-200 bg-white px-4 py-2 text-2xs font-bold uppercase tracking-[0.12em] text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-50"
            >
              <IconCircleX className="h-4 w-4" />
              Bác bỏ khiếu nại
            </button>
            <button
              type="button"
              onClick={onApprove}
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-[2px] bg-accent px-5 py-2 text-2xs font-bold uppercase tracking-[0.12em] text-white transition-all hover:opacity-90 disabled:opacity-50"
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
