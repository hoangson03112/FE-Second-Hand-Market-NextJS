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
    <div className="bg-cream-50 border border-border rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Tiến trình đơn hàng</span>
        <span className="text-xs font-mono text-muted-foreground">#{orderCode}</span>
      </div>
      <div className="px-5 py-4">
        <ul className="space-y-0">
          {progressSteps.map((step, i) => {
            const isDone = i < effectiveStepIdx;
            const isActive = i === effectiveStepIdx;
            const isLast = i === progressSteps.length - 1;
            return (
              <li key={step.key} className="flex items-start gap-3">
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isDone ? "bg-primary text-primary-foreground" : isActive ? "bg-primary/90 text-primary-foreground ring-2 ring-primary/30" : "bg-muted border border-border text-muted-foreground"
                    }`}
                  >
                    {isDone ? (
                      <IconCircleCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
                    ) : (
                      <IconCircle className={`w-3 h-3 ${isActive ? "fill-current" : ""}`} strokeWidth={2} />
                    )}
                  </div>
                  {!isLast && (
                    <div className={`w-0.5 min-h-[20px] mt-1 flex-shrink-0 ${i < effectiveStepIdx ? "bg-primary/50" : "bg-border"}`} />
                  )}
                </div>
                <div className={!isLast ? "pb-1" : ""}>
                  <p className={`text-sm font-medium ${isDone || isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.shortLabel}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 pt-4 border-t border-border flex gap-2 rounded-xl bg-background/60 p-3">
          <IconInfoCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-snug">{tip}</p>
        </div>
      </div>
    </div>
  );
}
