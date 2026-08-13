"use client";

import { IconCircleCheck, IconCircle, IconInfoCircle } from "@tabler/icons-react";

interface Step {
  key: string;
  shortLabel: string;
}

interface OrderProgressCardProps {
  progressSteps: readonly Step[];
  effectiveStepIdx: number;
  orderId: string;
  status: string;
  statusDescription: Record<string, string>;
}

const TIPS_BY_STATUS: Record<string, string> = {
  pending: "Người bán sẽ xác nhận đơn. Bạn có thể nhắn tin để nhắc nhanh.",
  confirmed: "Đã xác nhận. Nếu chưa thanh toán, chuyển khoản theo thông tin bên phải.",
  picked_up: "Đơn đã được GHN lấy hàng. Bạn có thể theo dõi vận đơn ở trên trang.",
  shipping: "Đơn đang trên đường. Theo dõi vận đơn để biết vị trí hàng.",
  out_for_delivery: "Shipper đang giao đến bạn. Chuẩn bị nhận hàng.",
  delivered: "Đã giao. Xác nhận đã nhận hàng và đánh giá để hoàn tất đơn.",
  completed: "Đơn đã hoàn tất. Cảm ơn bạn đã mua sắm.",
};

export function OrderProgressCard({
  progressSteps,
  effectiveStepIdx,
  orderId,
  status,
  statusDescription,
}: OrderProgressCardProps) {
  const orderCode = orderId.slice(-8).toUpperCase();
  const tip = TIPS_BY_STATUS[status] || statusDescription[status] || "Đang xử lý đơn hàng.";

  return (
    <div className="overflow-hidden border border-luxury-ink/8 bg-white/60" style={{ borderRadius: "2px" }}>
      <div className="flex items-center justify-between border-b border-luxury-ink/8 px-5 py-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600">Tiến trình đơn hàng</span>
        <span className="font-mono text-xs text-taupe-400">#{orderCode}</span>
      </div>
      <div className="px-5 py-4">
        <ul className="space-y-0">
          {progressSteps.map((step, i) => {
            const isDone = i < effectiveStepIdx;
            const isActive = i === effectiveStepIdx;
            const isLast = i === progressSteps.length - 1;
            return (
              <li key={step.key} className="flex items-start gap-3">
                <div className="flex shrink-0 flex-col items-center">
                  <div
                    className={
                      isDone
                        ? "flex h-6 w-6 items-center justify-center bg-luxury-ink"
                        : isActive
                          ? "flex h-6 w-6 items-center justify-center bg-luxury-ink ring-2 ring-luxury-champagne/40"
                          : "flex h-6 w-6 items-center justify-center border border-luxury-ink/15 bg-white"
                    }
                    style={{ borderRadius: "2px" }}
                  >
                    {isDone || isActive ? (
                      <IconCircleCheck className="h-3.5 w-3.5 text-luxury-champagne" strokeWidth={2.5} />
                    ) : (
                      <IconCircle className="h-3 w-3 text-taupe-300" strokeWidth={2} />
                    )}
                  </div>
                  {!isLast && (
                    <div className={i < effectiveStepIdx ? "mt-1 min-h-[20px] w-px flex-shrink-0 bg-luxury-champagne/50" : "mt-1 min-h-[20px] w-px flex-shrink-0 bg-luxury-ink/10"} />
                  )}
                </div>
                <div className={!isLast ? "pb-1" : ""}>
                  <p className={isDone || isActive ? "text-sm font-medium text-luxury-ink" : "text-sm text-taupe-400"}>
                    {step.shortLabel}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex gap-2 border-t border-luxury-ink/8 bg-cream-50 p-3 pt-4" style={{ borderRadius: "2px" }}>
          <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0 text-luxury-champagne" strokeWidth={1.75} />
          <p className="text-xs leading-snug text-neutral-600">{tip}</p>
        </div>
      </div>
    </div>
  );
}