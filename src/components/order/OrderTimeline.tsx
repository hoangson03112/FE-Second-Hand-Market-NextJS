import { IconCheck, IconCircleDashed } from "@tabler/icons-react";

const TIMELINE_STEPS = [
  { key: "pending", label: "Chờ xác nhận" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "picked_up", label: "Đã lấy hàng" },
  { key: "shipping", label: "Đang vận chuyển" },
  { key: "out_for_delivery", label: "Đang giao hàng" },
  { key: "delivered", label: "Đã giao" },
  { key: "completed", label: "Hoàn thành" },
] as const;

const CANCEL_STATUSES = new Set([
  "cancelled",
  "delivery_failed",
  "returning",
  "returned",
  "refund_requested",
  "refund_approved",
  "refunded",
]);

const STATUS_ORDER = TIMELINE_STEPS.map((s) => s.key);

function getStepIndex(status: string): number {
  return STATUS_ORDER.indexOf(status as (typeof STATUS_ORDER)[number]);
}

interface OrderTimelineProps {
  status: string;
  className?: string;
}

export function OrderTimeline({ status, className = "" }: OrderTimelineProps) {
  const isCancelled = CANCEL_STATUSES.has(status);
  const currentIdx = isCancelled ? -1 : getStepIndex(status);

  return (
    <div className={`w-full ${className}`}>
      {isCancelled ? (
        <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-destructive/8 border border-destructive/20">
          <div className="w-7 h-7 rounded-full bg-destructive flex items-center justify-center shrink-0">
            <span className="text-destructive-foreground text-sm font-bold">✕</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-destructive">
              {status === "cancelled"
                ? "Đơn hàng đã bị hủy"
                : status === "delivery_failed"
                  ? "Giao hàng thất bại"
                  : status === "returning"
                    ? "Đang hoàn hàng về người bán"
                    : status === "returned"
                      ? "Hàng đã được hoàn trả"
                      : status === "refund_requested"
                        ? "Đang chờ duyệt hoàn tiền"
                        : status === "refund_approved"
                          ? "Hoàn tiền đã được duyệt"
                          : "Đã hoàn tiền"}
            </p>
          </div>
        </div>
      ) : (
        <ol className="relative flex flex-col gap-0">
          {TIMELINE_STEPS.map((step, idx) => {
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const isPending = idx > currentIdx;

            return (
              <li key={step.key} className="flex gap-3 relative pb-4 last:pb-0">
                {/* Vertical connector */}
                {idx < TIMELINE_STEPS.length - 1 && (
                  <div
                    className={`absolute left-[13px] top-7 w-0.5 h-full ${isDone || isCurrent ? "bg-primary" : "bg-neutral-200"}`}
                  />
                )}

                {/* Step icon */}
                <div
                  className={`z-10 flex w-7 h-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    isDone
                      ? "bg-primary border-primary"
                      : isCurrent
                        ? "bg-primary/10 border-primary"
                        : "bg-neutral-100 border-neutral-300"
                  }`}
                >
                  {isDone ? (
                    <IconCheck className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  ) : isCurrent ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  ) : (
                    <IconCircleDashed className="w-3.5 h-3.5 text-neutral-400" />
                  )}
                </div>

                {/* Label */}
                <div className="pt-0.5">
                  <p
                    className={`text-sm font-medium leading-none ${
                      isDone
                        ? "text-neutral-600"
                        : isCurrent
                          ? "text-primary font-semibold"
                          : "text-neutral-400"
                    }`}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-primary/70 mt-1">Trạng thái hiện tại</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
