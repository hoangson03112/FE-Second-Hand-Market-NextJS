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
    <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <IconAlertCircle className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-red-700 mb-1">
            Sản phẩm bị từ chối
          </h4>
          {rejectionReason && (
            <p className="text-xs text-red-600/90 mb-3">
              <span className="font-medium">Lý do:</span> {rejectionReason}
            </p>
          )}
          {humanReviewRequested ? (
            <div className="flex items-center gap-2 text-xs text-sky-700">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
              Đã yêu cầu duyệt lại. Admin sẽ xem xét trong 24h.
            </div>
          ) : (
            <p className="text-xs text-taupe-500">
              Bạn có thể chỉnh sửa sản phẩm theo yêu cầu, sau đó nhấn &ldquo;Lưu
              và yêu cầu duyệt lại&rdquo; để admin xem xét.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
