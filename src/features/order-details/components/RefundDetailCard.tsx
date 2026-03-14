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

type StatusKey = "pending" | "approved" | "rejected" | "completed" | "disputed" | "cancelled";

interface StatusStyle {
  label: string;
  sublabel: string;
  headerBg: string;
  headerBorder: string;
  textColor: string;
  Icon: React.ElementType;
  progressStep: number; // last completed step (0=none, 1=sent, 2=reviewed, 3=done)
}

const STATUS_STYLES: Record<StatusKey, StatusStyle> = {
  pending: {
    label: "Đang chờ người bán xem xét",
    sublabel: "Yêu cầu sẽ được xử lý trong vòng 48 giờ làm việc",
    headerBg: "bg-amber-50",
    headerBorder: "border-amber-200",
    textColor: "text-amber-700",
    Icon: IconClock,
    progressStep: 1,
  },
  approved: {
    label: "Yêu cầu được chấp thuận",
    sublabel: "Quản trị viên đang xử lý hoàn tiền, vui lòng chờ",
    headerBg: "bg-blue-50",
    headerBorder: "border-blue-200",
    textColor: "text-blue-700",
    Icon: IconCircleCheck,
    progressStep: 2,
  },
  completed: {
    label: "Đã hoàn tiền thành công",
    sublabel: "Số tiền đã được hoàn về ví của bạn",
    headerBg: "bg-green-50",
    headerBorder: "border-green-200",
    textColor: "text-green-700",
    Icon: IconCircleCheck,
    progressStep: 3,
  },
  rejected: {
    label: "Người bán từ chối hoàn tiền",
    sublabel: "Bạn có thể yêu cầu admin can thiệp nếu không đồng ý",
    headerBg: "bg-red-50",
    headerBorder: "border-red-200",
    textColor: "text-red-700",
    Icon: IconCircleX,
    progressStep: 1,
  },
  disputed: {
    label: "Đang tranh chấp · Admin xem xét",
    sublabel: "Quản trị viên đang xem xét và sẽ đưa ra quyết định cuối",
    headerBg: "bg-purple-50",
    headerBorder: "border-purple-200",
    textColor: "text-purple-700",
    Icon: IconShield,
    progressStep: 2,
  },
  cancelled: {
    label: "Yêu cầu đã bị hủy",
    sublabel: "",
    headerBg: "bg-muted",
    headerBorder: "border-border",
    textColor: "text-muted-foreground",
    Icon: IconCircleX,
    progressStep: 0,
  },
};

const PROGRESS_STEPS = [
  { label: "Đã gửi", sublabel: "yêu cầu" },
  { label: "Đang xem xét" , sublabel: "người bán / admin" },
  { label: "Hoàn tất", sublabel: "hoàn tiền" },
];

interface RefundDetailCardProps {
  refund: RefundDoc;
  /** Called when buyer escalates a rejected refund to admin (dispute) */
  onEscalateToAdmin?: () => void;
  isEscalating?: boolean;
}

export function RefundDetailCard({ refund, onEscalateToAdmin, isEscalating }: RefundDetailCardProps) {
  const style = STATUS_STYLES[refund.status as StatusKey] ?? STATUS_STYLES.pending;
  const StatusIcon = style.Icon;
  const reasonInfo = REASON_LABELS[refund.reason] ?? { label: refund.reason, Icon: IconAlertTriangle };
  const ReasonIcon = reasonInfo.Icon;

  const isStepDone   = (n: number) => n < style.progressStep;
  const isStepActive = (n: number) => n === style.progressStep;

  return (
    <div className={cn("rounded-2xl overflow-hidden border", style.headerBorder)}>

      {/* ── STATUS HEADER ─────────────────────────────────────────────── */}
      <div className={cn("flex items-start gap-4 px-5 py-4", style.headerBg)}>
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
          style.headerBorder,
        )}>
          <StatusIcon className={cn("w-5 h-5", style.textColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("font-bold text-base leading-snug", style.textColor)}>
            {style.label}
          </p>
          {style.sublabel && (
            <p className={cn("text-sm mt-0.5 opacity-80", style.textColor)}>
              {style.sublabel}
            </p>
          )}
        </div>
        <div className={cn(
          "shrink-0 px-3 py-1.5 rounded-full text-sm font-bold border",
          style.headerBorder,
          style.textColor,
          style.headerBg,
        )}>
          {formatPrice(refund.refundAmount)}
        </div>
      </div>

      {/* ── PROGRESS ──────────────────────────────────────────────────── */}
      <div className="px-5 py-4 border-b border-border bg-background">
        <div className="flex items-start">
          {PROGRESS_STEPS.map(({ label, sublabel }, idx) => {
            const n = idx + 1;
            const done   = isStepDone(n);
            const active = isStepActive(n);
            return (
              <div key={n} className="flex items-start flex-1">
                <div className="flex flex-col items-center gap-1.5 w-full">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all",
                    done   ? "bg-primary text-primary-foreground"
                    : active ? "ring-2 ring-primary bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground",
                  )}>
                    {done ? <IconCircleCheck className="w-4 h-4" /> : n}
                  </div>
                  <div className="text-center">
                    <p className={cn(
                      "text-[12px] font-semibold leading-tight",
                      done || active ? "text-primary" : "text-muted-foreground",
                    )}>
                      {label}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                      {sublabel}
                    </p>
                  </div>
                </div>
                {idx < PROGRESS_STEPS.length - 1 && (
                  <div className={cn(
                    "flex-shrink-0 w-full h-px mt-4 transition-all max-w-[80px] mx-1",
                    done ? "bg-primary" : "bg-border",
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────────────────────── */}
      <div className="p-5 bg-background space-y-4">

        {/* Reason + Date row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl border border-border bg-muted/30">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Lý do hoàn tiền
            </p>
            <div className="flex items-center gap-2">
              <ReasonIcon className="w-4 h-4 text-foreground/60 shrink-0" />
              <p className="text-sm font-semibold text-foreground">{reasonInfo.label}</p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-border bg-muted/30">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Ngày gửi yêu cầu
            </p>
            <p className="text-sm font-semibold text-foreground">
              {format(refund.createdAt)}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="p-3.5 rounded-xl border border-border bg-muted/30">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Mô tả vấn đề
          </p>
          <p className="text-sm text-foreground leading-relaxed">{refund.description}</p>
        </div>

        {/* Evidence images */}
        {(refund.evidence?.images?.length ?? 0) > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <IconPhoto className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Ảnh bằng chứng ({refund.evidence!.images!.length})
              </p>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {refund.evidence!.images!.map((img, idx) => (
                <a
                  key={idx}
                  href={img.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group/img"
                >
                  <div className="aspect-square rounded-xl overflow-hidden border border-border bg-muted relative">
                    <Image
                      src={img.url}
                      alt={img.originalName ?? `Bằng chứng ${idx + 1}`}
                      fill
                      className="object-cover group-hover/img:scale-105 transition-transform duration-300"
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
            <div className="flex items-center gap-1.5 mb-2.5">
              <IconVideo className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
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
                  className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <IconVideo className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {vid.originalName ?? `Video ${idx + 1}`}
                    </p>
                    <p className="text-xs text-muted-foreground">Video bằng chứng · Nhấn để xem</p>
                  </div>
                  <span className="text-xs text-primary font-semibold shrink-0">Xem →</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Seller response */}
        {refund.sellerResponse && (
          <div className={cn(
            "p-4 rounded-xl border",
            refund.sellerResponse.decision === "approved"
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200",
          )}>
            <div className="flex items-center gap-2 mb-1.5">
              {refund.sellerResponse.decision === "approved"
                ? <IconCircleCheck className="w-4 h-4 text-green-600 shrink-0" />
                : <IconCircleX    className="w-4 h-4 text-red-600 shrink-0" />}
              <p className={cn(
                "text-sm font-semibold",
                refund.sellerResponse.decision === "approved" ? "text-green-700" : "text-red-700",
              )}>
                Người bán đã{" "}
                {refund.sellerResponse.decision === "approved"
                  ? "chấp thuận hoàn tiền"
                  : "từ chối hoàn tiền"}
                {refund.sellerResponse.respondedAt && (
                  <span className="font-normal opacity-70 ml-1.5">
                    · {format(refund.sellerResponse.respondedAt)}
                  </span>
                )}
              </p>
            </div>
            {refund.sellerResponse.comment && (
              <p className="text-sm text-foreground/80 pl-6 leading-relaxed">
                &ldquo;{refund.sellerResponse.comment}&rdquo;
              </p>
            )}
            {/* Buyer escalate to admin when seller rejects */}
            {refund.sellerResponse.decision === "rejected" &&
             !refund.escalatedToAdmin &&
             onEscalateToAdmin && (
              <div className="mt-3 pt-3 border-t border-red-200/50">
                <p className="text-xs text-red-700/80 mb-2">
                  Bạn không đồng ý với quyết định của người bán? Gửi khiếu nại để Admin xem xét.
                </p>
                <button
                  type="button"
                  onClick={onEscalateToAdmin}
                  disabled={isEscalating}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {isEscalating ? (
                    <IconLoader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <IconShield className="w-4 h-4" />
                  )}
                  Khiếu nại lên Admin
                </button>
              </div>
            )}
          </div>
        )}

        {/* Admin intervention */}
        {refund.adminIntervention && (
          <div className="p-4 rounded-xl border bg-purple-50 border-purple-200">
            <div className="flex items-center gap-2 mb-1.5">
              <IconShield className="w-4 h-4 text-purple-600 shrink-0" />
              <p className="text-sm font-semibold text-purple-700">
                Admin can thiệp ·{" "}
                {refund.adminIntervention.decision === "refund" ? "Hoàn tiền" : "Từ chối"}
                {refund.adminIntervention.handledAt && (
                  <span className="font-normal opacity-70 ml-1.5">
                    · {format(refund.adminIntervention.handledAt)}
                  </span>
                )}
              </p>
            </div>
            {refund.adminIntervention.comment && (
              <p className="text-sm text-foreground/80 pl-6 leading-relaxed">
                &ldquo;{refund.adminIntervention.comment}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* Refunded confirmation */}
        {refund.refundedAt && (
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-green-50 border border-green-200">
            <IconCircleCheck className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-700">
                Đã hoàn tiền thành công
              </p>
              <p className="text-xs text-green-600 mt-0.5">
                {formatPrice(refund.refundAmount)} · {format(refund.refundedAt)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
