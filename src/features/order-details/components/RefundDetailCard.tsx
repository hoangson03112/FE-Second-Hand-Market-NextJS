"use client";

import Image from "next/image";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconDots,
  IconFileSearch,
  IconLoader2,
  IconMoodSad,
  IconPackage,
  IconPhoto,
  IconRepeat,
  IconShield,
  IconTool,
  IconVideo,
} from "@tabler/icons-react";
import { REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER } from "@/constants/refund";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import type { Order } from "@/types/order";
import { cn } from "@/lib/utils";

type RefundDoc = NonNullable<Order["refundRequestId"]>;

const REASON_LABELS: Record<string, { label: string; Icon: React.ElementType }> = {
  damaged:          { label: "Hàng bị hỏng",       Icon: IconTool },
  wrong_item:       { label: "Giao sai hàng",       Icon: IconRepeat },
  not_as_described: { label: "Không đúng mô tả",   Icon: IconFileSearch },
  missing_parts:    { label: "Thiếu phụ kiện",      Icon: IconPackage },
  quality_issue:    { label: "Chất lượng kém",       Icon: IconMoodSad },
  other:            { label: "Lý do khác",           Icon: IconDots },
};

type StatusKey =
  | "pending"
  | "approved"
  | "return_shipping"
  | "returning"
  | "returned"
  | "bank_info_required"
  | "processing"
  | "completed"
  | "failed"
  | "rejected"
  | "disputed"
  | "cancelled";

interface StatusStyle {
  label: string;
  sublabel: string;
  headerBg: string;
  headerBorder: string;
  textColor: string;
  Icon: React.ElementType;
}

const STATUS_STYLES: Record<StatusKey, StatusStyle> = {
  pending: {
    label: "Đang chờ người bán xem xét",
    sublabel: "Yêu cầu sẽ được xử lý trong vòng 48 giờ làm việc",
    headerBg: "bg-amber-50",
    headerBorder: "border-amber-200",
    textColor: "text-amber-700",
    Icon: IconClock,
  },
  approved: {
    label: "Yêu cầu được chấp thuận",
    sublabel: `Người bán đã chấp thuận, vui lòng gửi hàng hoàn theo hướng dẫn. ${REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER}`,
    headerBg: "bg-blue-50",
    headerBorder: "border-blue-200",
    textColor: "text-blue-700",
    Icon: IconCircleCheck,
  },
  return_shipping: {
    label: "Đã tạo đơn hoàn trả",
    sublabel: `Vui lòng gửi hàng hoàn theo vận đơn để tiếp tục xử lý hoàn tiền. ${REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER}`,
    headerBg: "bg-sky-50",
    headerBorder: "border-sky-200",
    textColor: "text-sky-700",
    Icon: IconPackage,
  },
  returning: {
    label: "Hàng hoàn đang vận chuyển",
    sublabel: `Đơn vị vận chuyển đang chuyển hàng hoàn về cho người bán. ${REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER}`,
    headerBg: "bg-sky-50",
    headerBorder: "border-sky-200",
    textColor: "text-sky-700",
    Icon: IconPackage,
  },
  returned: {
    label: "Người bán đã nhận hàng hoàn",
    sublabel: "Đang chờ xử lý bước hoàn tiền cuối cùng",
    headerBg: "bg-blue-50",
    headerBorder: "border-blue-200",
    textColor: "text-blue-700",
    Icon: IconCircleCheck,
  },
  bank_info_required: {
    label: "Cần bổ sung thông tin nhận tiền",
    sublabel: "Vui lòng cung cấp thông tin tài khoản để hoàn tất hoàn tiền",
    headerBg: "bg-amber-50",
    headerBorder: "border-amber-200",
    textColor: "text-amber-700",
    Icon: IconAlertTriangle,
  },
  processing: {
    label: "Admin đang xử lý hoàn tiền",
    sublabel: "Hệ thống đang xử lý giao dịch hoàn tiền cho bạn",
    headerBg: "bg-blue-50",
    headerBorder: "border-blue-200",
    textColor: "text-blue-700",
    Icon: IconLoader2,
  },
  completed: {
    label: "Đã hoàn tiền thành công",
    sublabel: "Số tiền đã được hoàn về ví của bạn",
    headerBg: "bg-green-50",
    headerBorder: "border-green-200",
    textColor: "text-green-700",
    Icon: IconCircleCheck,
  },
  rejected: {
    label: "Người bán từ chối hoàn tiền",
    sublabel: "Bạn có thể yêu cầu admin can thiệp nếu không đồng ý",
    headerBg: "bg-red-50",
    headerBorder: "border-red-200",
    textColor: "text-red-700",
    Icon: IconCircleX,
  },
  disputed: {
    label: "Đang tranh chấp · Admin xem xét",
    sublabel: "Quản trị viên đang xem xét và sẽ đưa ra quyết định cuối",
    headerBg: "bg-purple-50",
    headerBorder: "border-purple-200",
    textColor: "text-purple-700",
    Icon: IconShield,
  },
  failed: {
    label: "Hoàn tiền tạm thời thất bại",
    sublabel: "Hệ thống đang yêu cầu xử lý lại giao dịch hoàn tiền",
    headerBg: "bg-red-50",
    headerBorder: "border-red-200",
    textColor: "text-red-700",
    Icon: IconAlertTriangle,
  },
  cancelled: {
    label: "Yêu cầu đã bị hủy",
    sublabel: "",
    headerBg: "bg-cream-100",
    headerBorder: "border-luxury-ink/10",
    textColor: "text-taupe-500",
    Icon: IconCircleX,
  },
};

interface RefundDetailCardProps {
  refund: RefundDoc;
  onEscalateToAdmin?: () => void;
  isEscalating?: boolean;
}

export function RefundDetailCard({ refund, onEscalateToAdmin, isEscalating }: RefundDetailCardProps) {
  const style = STATUS_STYLES[refund.status as StatusKey] ?? STATUS_STYLES.pending;
  const StatusIcon = style.Icon;
  const reasonInfo = REASON_LABELS[refund.reason] ?? { label: refund.reason, Icon: IconAlertTriangle };
  const ReasonIcon = reasonInfo.Icon;

  const showApprovedSellerBannerDupe =
    refund.sellerResponse?.decision === "approved" &&
    ["approved", "return_shipping", "returning", "returned", "bank_info_required", "processing", "completed", "failed"].includes(
      refund.status,
    );

  return (
    <div className={cn("overflow-hidden border", style.headerBorder)} style={{ borderRadius: "2px" }}>
      {/* ── STATUS HEADER ── */}
      <div className={cn("flex items-start gap-4 px-5 py-4", style.headerBg)}>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center border", style.headerBorder)} style={{ borderRadius: "2px" }}>
          <StatusIcon className={cn("h-5 w-5", style.textColor)} strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn("text-base font-semibold leading-snug", style.textColor)}>
            {style.label}
          </p>
          {style.sublabel && (
            <p className={cn("mt-0.5 text-sm opacity-80", style.textColor)}>
              {style.sublabel}
            </p>
          )}
        </div>
        <div
          className={cn("shrink-0 border px-3 py-1.5 text-sm font-bold", style.headerBorder, style.textColor, style.headerBg)}
          style={{ borderRadius: "2px" }}
        >
          {formatPrice(refund.refundAmount)}
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="space-y-4 bg-white p-5">
        {/* Reason + Date row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-luxury-ink/8 bg-cream-50 p-3.5" style={{ borderRadius: "2px" }}>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-taupe-400">
              Lý do hoàn tiền
            </p>
            <div className="flex items-center gap-2">
              <ReasonIcon className="h-4 w-4 shrink-0 text-taupe-500" strokeWidth={1.75} />
              <p className="text-sm font-semibold text-luxury-ink">{reasonInfo.label}</p>
            </div>
          </div>
          <div className="border border-luxury-ink/8 bg-cream-50 p-3.5" style={{ borderRadius: "2px" }}>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-taupe-400">
              Ngày gửi yêu cầu
            </p>
            <p className="text-sm font-semibold text-luxury-ink">
              {format(refund.createdAt)}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="border border-luxury-ink/8 bg-cream-50 p-3.5" style={{ borderRadius: "2px" }}>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-taupe-400">
            Mô tả vấn đề
          </p>
          <p className="text-sm leading-relaxed text-neutral-700">{refund.description}</p>
        </div>

        {/* Evidence images */}
        {(refund.evidence?.images?.length ?? 0) > 0 && (
          <div>
            <div className="mb-2.5 flex items-center gap-1.5">
              <IconPhoto className="h-3.5 w-3.5 text-taupe-400" strokeWidth={1.75} />
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-taupe-400">
                Ảnh bằng chứng ({refund.evidence!.images!.length})
              </p>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {refund.evidence!.images!.map((img, idx) => (
                <a key={idx} href={img.url} target="_blank" rel="noopener noreferrer" className="group/img block">
                  <div className="relative aspect-square overflow-hidden border border-luxury-ink/10 bg-cream-100" style={{ borderRadius: "2px" }}>
                    <Image
                      src={img.url}
                      alt={img.originalName ?? `Bằng chứng ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover/img:scale-105"
                      sizes="80px"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Evidence videos */}
        {(refund.evidence?.videos?.length ?? 0) > 0 && (
          <div>
            <div className="mb-2.5 flex items-center gap-1.5">
              <IconVideo className="h-3.5 w-3.5 text-taupe-400" strokeWidth={1.75} />
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-taupe-400">
                Video bằng chứng ({refund.evidence!.videos!.length})
              </p>
            </div>
            <div className="space-y-2">
              {refund.evidence!.videos!.map((vid, idx) => (
                <a
                  key={idx}
                  href={vid.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 border border-luxury-ink/8 bg-cream-50 p-3 transition-colors hover:bg-cream-100"
                  style={{ borderRadius: "2px" }}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-luxury-ink/5" style={{ borderRadius: "2px" }}>
                    <IconVideo className="h-4 w-4 text-taupe-500" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-luxury-ink">
                      {vid.originalName ?? `Video ${idx + 1}`}
                    </p>
                    <p className="text-xs text-taupe-400">Video bằng chứng · Nhấn để xem</p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-luxury-ink">Xem →</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Seller response */}
        {refund.sellerResponse && !showApprovedSellerBannerDupe && (
          <div
            className={cn(
              "border p-4",
              refund.sellerResponse.decision === "approved"
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50",
            )}
            style={{ borderRadius: "2px" }}
          >
            <div className="mb-1.5 flex items-center gap-2">
              {refund.sellerResponse.decision === "approved"
                ? <IconCircleCheck className="h-4 w-4 shrink-0 text-green-600" strokeWidth={1.75} />
                : <IconCircleX    className="h-4 w-4 shrink-0 text-red-600" strokeWidth={1.75} />}
              <p className={cn("text-sm font-semibold", refund.sellerResponse.decision === "approved" ? "text-green-700" : "text-red-700")}>
                Người bán đã{" "}
                {refund.sellerResponse.decision === "approved" ? "chấp thuận hoàn tiền" : "từ chối hoàn tiền"}
                {refund.sellerResponse.respondedAt && (
                  <span className="ml-1.5 font-normal opacity-70">
                    · {format(refund.sellerResponse.respondedAt)}
                  </span>
                )}
              </p>
            </div>
            {refund.sellerResponse.comment && (
              <p className="pl-6 text-sm leading-relaxed text-neutral-700">
                &ldquo;{refund.sellerResponse.comment}&rdquo;
              </p>
            )}
            {refund.sellerResponse.decision === "rejected" &&
             !refund.escalatedToAdmin &&
             onEscalateToAdmin && (
              <div className="mt-3 border-t border-red-200/60 pt-3">
                <p className="mb-2 text-xs text-red-700/80">
                  Bạn không đồng ý với quyết định của người bán? Gửi khiếu nại để Admin xem xét.
                </p>
                <button
                  type="button"
                  onClick={onEscalateToAdmin}
                  disabled={isEscalating}
                  className="inline-flex items-center gap-2 bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                  style={{ borderRadius: "2px" }}
                >
                  {isEscalating ? (
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <IconShield className="h-4 w-4" />
                  )}
                  Khiếu nại lên Admin
                </button>
              </div>
            )}
          </div>
        )}

        {/* Admin intervention */}
        {refund.adminIntervention && (
          <div className="border border-purple-200 bg-purple-50 p-4" style={{ borderRadius: "2px" }}>
            <div className="mb-1.5 flex items-center gap-2">
              <IconShield className="h-4 w-4 shrink-0 text-purple-600" strokeWidth={1.75} />
              <p className="text-sm font-semibold text-purple-700">
                Admin can thiệp ·{" "}
                {refund.adminIntervention.decision === "refund" ? "Hoàn tiền" : "Từ chối"}
                {refund.adminIntervention.handledAt && (
                  <span className="ml-1.5 font-normal opacity-70">
                    · {format(refund.adminIntervention.handledAt)}
                  </span>
                )}
              </p>
            </div>
            {refund.adminIntervention.comment && (
              <p className="pl-6 text-sm leading-relaxed text-neutral-700">
                &ldquo;{refund.adminIntervention.comment}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* Refunded confirmation */}
        {refund.refundedAt && (
          <div className="flex items-center gap-3 border border-green-200 bg-green-50 p-3.5" style={{ borderRadius: "2px" }}>
            <IconCircleCheck className="h-5 w-5 shrink-0 text-green-600" strokeWidth={1.75} />
            <div>
              <p className="text-sm font-semibold text-green-700">
                Đã hoàn tiền thành công
              </p>
              <p className="mt-0.5 text-xs text-green-600">
                {formatPrice(refund.refundAmount)} · {format(refund.refundedAt)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}