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
    <div className="rounded-xl border border-destructive/20 bg-destructive/8 dark:bg-destructive/15 p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-full bg-destructive/10 dark:bg-destructive/20 flex items-center justify-center">
          <IconAlertCircle className="w-5 h-5 text-destructive" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-destructive mb-1">
            Sản phẩm bị từ chối
          </h4>
          {rejectionReason && (
            <p className="text-xs text-destructive/80 mb-3">
              <span className="font-medium">Lý do:</span> {rejectionReason}
            </p>
          )}
          {humanReviewRequested ? (
            <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-400">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Đã yêu cầu duyệt lại. Admin sẽ xem xét trong 24h.
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Bạn có thể chỉnh sửa sản phẩm theo yêu cầu, sau đó nhấn
              &ldquo;Lưu và yêu cầu duyệt lại&rdquo; để admin xem xét.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
