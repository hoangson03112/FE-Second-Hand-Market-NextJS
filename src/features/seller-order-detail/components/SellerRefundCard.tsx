"use client";

import Image from "next/image";
import {
  IconAlertTriangle,
  IconDots,
  IconFileSearch,
  IconMoodSad,
  IconPackage,
  IconPhoto,
  IconRepeat,
  IconTool,
  IconVideo,
} from "@tabler/icons-react";
import type { Order } from "@/types/order";

const REASON_LABELS: Record<string, { label: string; Icon: React.ElementType }> = {
  damaged:          { label: "Hàng bị hỏng",     Icon: IconTool },
  wrong_item:       { label: "Giao sai hàng",     Icon: IconRepeat },
  not_as_described: { label: "Không đúng mô tả", Icon: IconFileSearch },
  missing_parts:    { label: "Thiếu phụ kiện",    Icon: IconPackage },
  quality_issue:    { label: "Chất lượng kém",     Icon: IconMoodSad },
  other:            { label: "Lý do khác",         Icon: IconDots },
};

interface SellerRefundCardProps {
  refund: NonNullable<Order["refundRequestId"]>;
}

export function SellerRefundCard({ refund }: SellerRefundCardProps) {
  const reasonInfo = REASON_LABELS[refund.reason] ?? { label: refund.reason, Icon: IconAlertTriangle };
  const ReasonIcon = reasonInfo.Icon;

  return (
    <div className="bg-card rounded-2xl border border-orange-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-orange-50 border-b border-orange-100">
        <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
          <IconAlertTriangle className="w-4.5 h-4.5 text-orange-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-orange-800">Yêu cầu hoàn tiền</p>
          <p className="text-xs text-orange-500 mt-0.5">Người mua đã gửi yêu cầu, vui lòng xem xét</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Reason */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 border border-border">
          <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
            <ReasonIcon className="w-4 h-4 text-foreground/60" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Lý do</p>
            <p className="text-sm font-semibold text-foreground">{reasonInfo.label}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Mô tả của người mua
          </p>
          <p className="text-sm text-foreground bg-muted/30 border border-border rounded-xl px-4 py-3 leading-relaxed">
            {refund.description || "—"}
          </p>
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
            <div className="grid grid-cols-4 gap-2">
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
                      sizes="80px"
                      className="object-cover group-hover/img:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="text-white text-xs font-medium opacity-0 group-hover/img:opacity-100 transition-opacity">Xem</span>
                    </div>
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
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <IconVideo className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {vid.originalName ?? `Video ${idx + 1}`}
                    </p>
                    <p className="text-xs text-muted-foreground">Nhấn để xem toàn bộ video</p>
                  </div>
                  <span className="text-xs text-primary font-semibold shrink-0">Xem →</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
