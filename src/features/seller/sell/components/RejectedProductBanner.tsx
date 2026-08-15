"use client";

import { IconAlertCircle } from "@tabler/icons-react";

interface RejectedProductBannerProps {
  rejectionReason?: string | null;
  humanReviewRequested?: boolean;
}

export function RejectedProductBanner({
  rejectionReason,
  humanReviewRequested,
}: RejectedProductBannerProps) {
  return (
    <div className="mb-4 rounded-[2px] border border-blush-300 bg-blush-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] border border-blush-300 bg-white">
          <IconAlertCircle className="h-4 w-4 text-blush-700" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-blush-800">
            Sản phẩm bị từ chối
          </h4>
          {rejectionReason && (
            <p className="mt-1.5 mb-3 text-xs leading-relaxed text-blush-800/90">
              <span className="font-medium">Lý do:</span> {rejectionReason}
            </p>
          )}
          {humanReviewRequested ? (
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
              <div className="h-1 w-1 animate-pulse rounded-full bg-luxury-champagne" />
              Đã yêu cầu duyệt lại. Admin sẽ xem xét trong 24h.
            </div>
          ) : (
            <p className="text-xs text-neutral-500">
              Bạn có thể chỉnh sửa sản phẩm theo yêu cầu, sau đó nhấn &ldquo;Lưu
              và yêu cầu duyệt lại&rdquo; để admin xem xét.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
