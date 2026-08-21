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
import { Eyebrow } from "@/features/order/components";
import type { Order } from "@/types/order";
import { cn } from "@/lib/utils";

type RefundDoc = NonNullable<Order["refundRequestId"]>;

const REASON_LABELS: Record<
  string,
  { label: string; Icon: React.ElementType }
> = {
  damaged: { label: "Hàng bị hỏng", Icon: IconTool },
  wrong_item: { label: "Giao sai hàng", Icon: IconRepeat },
  not_as_described: { label: "Không đúng mô tả", Icon: IconFileSearch },
  missing_parts: { label: "Thiếu phụ kiện", Icon: IconPackage },
  quality_issue: { label: "Chất lượng kém", Icon: IconMoodSad },
  other: { label: "Lý do khác", Icon: IconDots },
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

/**
 * The same five tones `OrderStatusChip` uses. The refund flow used to reach for
 * amber / sky / blue / purple / green straight out of Tailwind, which put six
 * palettes on a page built from ivory, ink, champagne and one green.
 */
type Tone = "progress" | "settled" | "attention" | "failed" | "neutral";

const TONE: Record<Tone, { surface: string; border: string; text: string }> = {
  progress: {
    surface: "bg-luxury-ink/[0.04]",
    border: "border-luxury-ink/15",
    text: "text-luxury-ink",
  },
  settled: {
    surface: "bg-taupe-50",
    border: "border-accent/35",
    text: "text-taupe-700",
  },
  attention: {
    surface: "bg-cream-100",
    border: "border-luxury-champagne/50",
    text: "text-neutral-700",
  },
  failed: {
    surface: "bg-blush-50",
    border: "border-blush-300",
    text: "text-blush-800",
  },
  neutral: {
    surface: "bg-cream-50",
    border: "border-luxury-ink/12",
    text: "text-neutral-600",
  },
};

interface StatusStyle {
  label: string;
  sublabel: string;
  tone: Tone;
  Icon: React.ElementType;
}

const STATUS_STYLES: Record<StatusKey, StatusStyle> = {
  pending: {
    label: "Đang chờ người bán xem xét",
    sublabel: "Yêu cầu sẽ được xử lý trong vòng 48 giờ làm việc",
    tone: "attention",
    Icon: IconClock,
  },
  approved: {
    label: "Yêu cầu được chấp thuận",
    sublabel: `Người bán đã chấp thuận, vui lòng gửi hàng hoàn theo hướng dẫn. ${REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER}`,
    tone: "progress",
    Icon: IconCircleCheck,
  },
  return_shipping: {
    label: "Đã tạo đơn hoàn trả",
    sublabel: `Vui lòng gửi hàng hoàn theo vận đơn để tiếp tục xử lý hoàn tiền. ${REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER}`,
    tone: "progress",
    Icon: IconPackage,
  },
  returning: {
    label: "Hàng hoàn đang vận chuyển",
    sublabel: `Đơn vị vận chuyển đang chuyển hàng hoàn về cho người bán. ${REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER}`,
    tone: "progress",
    Icon: IconPackage,
  },
  returned: {
    label: "Người bán đã nhận hàng hoàn",
    sublabel: "Đang chờ xử lý bước hoàn tiền cuối cùng",
    tone: "progress",
    Icon: IconCircleCheck,
  },
  bank_info_required: {
    label: "Cần bổ sung thông tin nhận tiền",
    sublabel: "Vui lòng cung cấp thông tin tài khoản để hoàn tất hoàn tiền",
    tone: "attention",
    Icon: IconAlertTriangle,
  },
  processing: {
    label: "Admin đang xử lý hoàn tiền",
    sublabel: "Hệ thống đang xử lý giao dịch hoàn tiền cho bạn",
    tone: "progress",
    Icon: IconLoader2,
  },
  completed: {
    label: "Đã hoàn tiền thành công",
    sublabel: "Số tiền đã được hoàn về ví của bạn",
    tone: "settled",
    Icon: IconCircleCheck,
  },
  rejected: {
    label: "Người bán từ chối hoàn tiền",
    sublabel: "Bạn có thể yêu cầu admin can thiệp nếu không đồng ý",
    tone: "failed",
    Icon: IconCircleX,
  },
  disputed: {
    label: "Đang tranh chấp · Admin xem xét",
    sublabel: "Quản trị viên đang xem xét và sẽ đưa ra quyết định cuối",
    tone: "attention",
    Icon: IconShield,
  },
  failed: {
    label: "Hoàn tiền tạm thời thất bại",
    sublabel: "Hệ thống đang yêu cầu xử lý lại giao dịch hoàn tiền",
    tone: "failed",
    Icon: IconAlertTriangle,
  },
  cancelled: {
    label: "Yêu cầu đã bị hủy",
    sublabel: "",
    tone: "neutral",
    Icon: IconCircleX,
  },
};

const MICRO_LABEL =
  "text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500";

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[2px] border border-luxury-ink/10 bg-cream-50 px-4 py-3.5">
      <p className={MICRO_LABEL}>{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

interface RefundDetailCardProps {
  refund: RefundDoc;
  onEscalateToAdmin?: () => void;
  isEscalating?: boolean;
}

export function RefundDetailCard({
  refund,
  onEscalateToAdmin,
  isEscalating,
}: RefundDetailCardProps) {
  const style =
    STATUS_STYLES[refund.status as StatusKey] ?? STATUS_STYLES.pending;
  const tone = TONE[style.tone];
  const StatusIcon = style.Icon;
  const reasonInfo = REASON_LABELS[refund.reason] ?? {
    label: refund.reason,
    Icon: IconAlertTriangle,
  };
  const ReasonIcon = reasonInfo.Icon;

  const showApprovedSellerBannerDupe =
    refund.sellerResponse?.decision === "approved" &&
    [
      "approved",
      "return_shipping",
      "returning",
      "returned",
      "bank_info_required",
      "processing",
      "completed",
      "failed",
    ].includes(refund.status);

  const sellerApproved = refund.sellerResponse?.decision === "approved";
  const sellerTone = sellerApproved ? TONE.settled : TONE.failed;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[2px] border bg-white",
        tone.border,
      )}
    >
      <header
        className={cn(
          "flex flex-wrap items-start justify-between gap-x-6 gap-y-4 border-b px-5 py-5 sm:px-6",
          tone.surface,
          tone.border,
        )}
      >
        <div className="flex min-w-0 items-start gap-4">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] border bg-white",
              tone.border,
            )}
          >
            <StatusIcon
              className={cn("h-5 w-5", tone.text)}
              strokeWidth={1.75}
            />
          </span>
          <div className="min-w-0">
            <Eyebrow>Hoàn tiền</Eyebrow>
            <h2

              className={cn(
"font-droid-serif","mt-3 text-lg leading-snug tracking-tight", tone.text)}
            >
              {style.label}
            </h2>
            {style.sublabel && (
              <p className="mt-2 max-w-xl text-xs leading-relaxed text-neutral-600">
                {style.sublabel}
              </p>
            )}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className={MICRO_LABEL}>Số tiền hoàn</p>
          <p

            className="font-droid-serif mt-1.5 tabular-nums text-lg leading-none text-luxury-ink"
          >
            {formatPrice(refund.refundAmount)}
          </p>
        </div>
      </header>

      <div className="space-y-5 px-5 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Fact label="Lý do hoàn tiền">
            <div className="flex items-center gap-2">
              <ReasonIcon
                className="h-4 w-4 shrink-0 text-luxury-champagne"
                strokeWidth={1.75}
              />
              <p className="text-sm font-medium text-luxury-ink">
                {reasonInfo.label}
              </p>
            </div>
          </Fact>
          <Fact label="Ngày gửi yêu cầu">
            <p className="text-sm font-medium text-luxury-ink">
              {format(refund.createdAt)}
            </p>
          </Fact>
        </div>

        <Fact label="Mô tả vấn đề">
          <p className="text-sm leading-relaxed text-neutral-700">
            {refund.description}
          </p>
        </Fact>

        {(refund.evidence?.images?.length ?? 0) > 0 && (
          <div>
            <p className={cn(MICRO_LABEL, "flex items-center gap-2")}>
              <IconPhoto className="h-3.5 w-3.5" strokeWidth={1.75} />
              Ảnh bằng chứng ({refund.evidence!.images!.length})
            </p>
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {refund.evidence!.images!.map((img, idx) => (
                <a
                  key={idx}
                  href={img.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/img block"
                >
                  <div className="relative aspect-square overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-cream-100 transition-colors duration-300 group-hover/img:border-luxury-champagne/60">
                    <Image
                      src={img.url}
                      alt={img.originalName ?? `Bằng chứng ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-[1.2s] ease-out group-hover/img:scale-105"
                      sizes="80px"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {(refund.evidence?.videos?.length ?? 0) > 0 && (
          <div>
            <p className={cn(MICRO_LABEL, "flex items-center gap-2")}>
              <IconVideo className="h-3.5 w-3.5" strokeWidth={1.75} />
              Video bằng chứng ({refund.evidence!.videos!.length})
            </p>
            <div className="mt-3 space-y-2">
              {refund.evidence!.videos!.map((vid, idx) => (
                <a
                  key={idx}
                  href={vid.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 rounded-[2px] border border-luxury-ink/10 bg-cream-50 px-4 py-3 transition-colors duration-300 hover:border-luxury-champagne/60 hover:bg-cream-100"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-white">
                    <IconVideo
                      className="h-4 w-4 text-luxury-champagne"
                      strokeWidth={1.75}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-luxury-ink">
                      {vid.originalName ?? `Video ${idx + 1}`}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      Video bằng chứng · Nhấn để xem
                    </p>[0.15em]
                  </div>
                  <span className="shrink-0 text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ink">
                    Xem
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {refund.sellerResponse && !showApprovedSellerBannerDupe && (
          <div
            className={cn(
              "rounded-[2px] border px-4 py-4",
              sellerTone.border,
              sellerTone.surface,
            )}
          >
            <div className="flex items-center gap-2">
              {sellerApproved ? (
                <IconCircleCheck
                  className={cn("h-4 w-4 shrink-0", sellerTone.text)}
                  strokeWidth={1.75}
                />
              ) : (
                <IconCircleX
                  className={cn("h-4 w-4 shrink-0", sellerTone.text)}
                  strokeWidth={1.75}
                />
              )}
              <p className={cn("text-sm font-bold", sellerTone.text)}>
                Người bán đã{" "}
                {sellerApproved ? "chấp thuận hoàn tiền" : "từ chối hoàn tiền"}
                {refund.sellerResponse.respondedAt && (
                  <span className="ml-1.5 font-normal opacity-70">
                    · {format(refund.sellerResponse.respondedAt)}
                  </span>
                )}
              </p>
            </div>

            {refund.sellerResponse.comment && (
              <p className="mt-2 pl-6 text-sm leading-relaxed text-neutral-700">
                &ldquo;{refund.sellerResponse.comment}&rdquo;
              </p>
            )}

            {refund.sellerResponse.decision === "rejected" &&
              !refund.escalatedToAdmin &&
              onEscalateToAdmin && (
                <div className="mt-4 border-t border-blush-300/60 pt-4">
                  <p className="text-xs leading-relaxed text-blush-800/90">
                    Bạn không đồng ý với quyết định của người bán? Gửi khiếu nại
                    để Admin xem xét.
                  </p>
                  <button
                    type="button"
                    onClick={onEscalateToAdmin}[0.15em]
                    disabled={isEscalating}
                    className="mt-3 inline-flex items-center gap-2 rounded-[2px] bg-luxury-ink px-5 py-2.5 text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800 disabled:opacity-50"
                  >
                    {isEscalating ? (
                      <IconLoader2 className="h-4 w-4 animate-spin text-luxury-champagne" />
                    ) : (
                      <IconShield className="h-4 w-4 text-luxury-champagne" />
                    )}
                    Khiếu nại lên Admin
                  </button>
                </div>
              )}
          </div>
        )}

        {refund.adminIntervention && (
          <div className="rounded-[2px] border border-luxury-champagne/50 bg-cream-100 px-4 py-4">
            <div className="flex items-center gap-2">
              <IconShield
                className="h-4 w-4 shrink-0 text-luxury-champagne"
                strokeWidth={1.75}
              />
              <p className="text-sm font-bold text-neutral-700">
                Admin can thiệp ·{" "}
                {refund.adminIntervention.decision === "refund"
                  ? "Hoàn tiền"
                  : "Từ chối"}
                {refund.adminIntervention.handledAt && (
                  <span className="ml-1.5 font-normal opacity-70">
                    · {format(refund.adminIntervention.handledAt)}
                  </span>
                )}
              </p>
            </div>
            {refund.adminIntervention.comment && (
              <p className="mt-2 pl-6 text-sm leading-relaxed text-neutral-700">
                &ldquo;{refund.adminIntervention.comment}&rdquo;
              </p>
            )}
          </div>
        )}

        {refund.refundedAt && (
          <div className="flex items-center gap-3.5 rounded-[2px] border border-accent/35 bg-taupe-50 px-4 py-4">
            <IconCircleCheck
              className="h-5 w-5 shrink-0 text-accent"
              strokeWidth={1.75}
            />
            <div>
              <p className="text-sm font-bold text-taupe-700">
                Đã hoàn tiền thành công
              </p>
              <p className="mt-0.5 text-xs text-neutral-600">
                {formatPrice(refund.refundAmount)} · {format(refund.refundedAt)}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
