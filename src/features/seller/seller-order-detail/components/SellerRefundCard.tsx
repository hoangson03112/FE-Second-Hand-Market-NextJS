"use client";

import Image from "next/image";
import {
  IconAlertTriangle,
  IconDots,
  IconFileSearch,
  IconMoodSad,
  IconPackage,
  IconRepeat,
  IconTool,
  IconVideo,
} from "@tabler/icons-react";
import { Panel, microCaps } from "@/features/order/components";
import { cn } from "@/lib/utils";
import { REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER } from "@/constants/refund";
import type { Order } from "@/types/order";

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

interface SellerRefundCardProps {
  refund: NonNullable<Order["refundRequestId"]>;
}

export function SellerRefundCard({ refund }: SellerRefundCardProps) {
  const reasonInfo = REASON_LABELS[refund.reason] ?? {
    label: refund.reason,
    Icon: IconAlertTriangle,
  };
  const ReasonIcon = reasonInfo.Icon;
  const images = refund.evidence?.images ?? [];
  const videos = refund.evidence?.videos ?? [];

  return (
    <Panel
      eyebrow="Hoàn tiền"
      title="Yêu cầu từ người mua"
      description="Xem bằng chứng trước khi chấp thuận hoặc từ chối."
      className="border-luxury-champagne/45"
    >
      {/* Reason */}
      <div className="flex items-center gap-3.5 rounded-[2px] border border-luxury-champagne/45 bg-cream-100/70 px-4 py-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-white">
          <ReasonIcon className="h-4 w-4 text-luxury-ink" />
        </span>
        <div className="min-w-0">
          <p className={cn(microCaps, "text-neutral-500")}>Lý do</p>
          <p className="mt-1 text-sm font-medium text-luxury-ink">
            {reasonInfo.label}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="mt-5">
        <p className={cn(microCaps, "text-neutral-500")}>
          Mô tả của người mua
        </p>
        <p className="mt-2 rounded-[2px] border border-luxury-ink/10 bg-cream-50/60 px-4 py-3.5 text-sm leading-relaxed text-luxury-ink">
          {refund.description || "—"}
        </p>
      </div>

      {/* Evidence images */}
      {images.length > 0 ? (
        <div className="mt-5">
          <p className={cn(microCaps, "text-neutral-500")}>
            Ảnh bằng chứng · {images.length}
          </p>
          <div className="mt-2.5 grid grid-cols-4 gap-2.5">
            {images.map((img, idx) => (
              <a
                key={idx}
                href={img.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/img relative aspect-square overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-taupe-50 transition-colors duration-300 hover:border-luxury-ink/30"
              >
                <Image
                  src={img.url}
                  alt={img.originalName ?? `Bằng chứng ${idx + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-luxury-ink/0 text-2xs font-bold uppercase tracking-[0.18em] text-transparent transition-all duration-300 group-hover/img:bg-luxury-ink/55 group-hover/img:text-cream-50">
                  Xem
                </span>
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {/* Evidence videos */}
      {videos.length > 0 ? (
        <div className="mt-5">
          <p className={cn(microCaps, "text-neutral-500")}>
            Video bằng chứng · {videos.length}
          </p>
          <div className="mt-2.5 space-y-2.5">
            {videos.map((vid, idx) => (
              <a
                key={idx}
                href={vid.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 rounded-[2px] border border-luxury-ink/10 bg-cream-50/60 px-4 py-3 transition-colors duration-300 hover:border-luxury-ink/30 hover:bg-cream-100"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-white">
                  <IconVideo className="h-4 w-4 text-luxury-ink" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-luxury-ink">
                    {vid.originalName ?? `Video ${idx + 1}`}
                  </span>
                  <span className="mt-1 block text-2xs text-neutral-500">
                    Nhấn để xem toàn bộ
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <p className="mt-5 border-t border-luxury-ink/8 pt-4 text-xs leading-relaxed text-neutral-500">
        {REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER}
      </p>
    </Panel>
  );
}
