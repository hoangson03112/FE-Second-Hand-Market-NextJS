import { IconCircleCheck, IconPackage, IconTruck } from "@tabler/icons-react";
import { format } from "@/utils/format/date";

interface ProgressStep {
  key: string;
  shortLabel: string;
}

interface OrderStatusHeroProps {
  status: string;
  statusConfig: { label: string; color: string; icon: string; bgColor: string };
  statusDescription: Record<string, string>;
  /** When set (e.g. refund flow + Refund.status), overrides statusDescription[status]. */
  descriptionOverride?: string;
  progressSteps: readonly ProgressStep[];
  effectiveStepIdx: number;
  isTerminal: boolean;
  updatedAt: string;
  ghnOrderCode?: string | null;
  ghnReturnOrderCode?: string | null;
  ghnReturnTrackingUrl?: string | null;
}

export function OrderStatusHero({
  status,
  statusConfig,
  statusDescription,
  descriptionOverride,
  progressSteps,
  effectiveStepIdx,
  isTerminal,
  updatedAt,
  ghnOrderCode,
  ghnReturnOrderCode,
  ghnReturnTrackingUrl,
}: OrderStatusHeroProps) {
  const showGhnOrder =
    ghnOrderCode &&
    [
      "confirmed",
      "picked_up",
      "shipping",
      "out_for_delivery",
      "delivered",
    ].includes(status);
  const showGhnReturn =
    ghnReturnOrderCode &&
    ["refund", "returning", "return_shipping", "returned", "refunded"].includes(
      status,
    );

  return (
    <div
      className="overflow-hidden border border-luxury-ink/8 bg-white/60"
      style={{ borderRadius: "2px" }}
    >
      {/* Status row */}
      <div className="flex items-center gap-4 border-b border-luxury-ink/8 px-5 py-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center text-xl ${statusConfig.bgColor}`}
          style={{ borderRadius: "2px" }}
        >
          {statusConfig.icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-bold ${statusConfig.color}`}>
            {statusConfig.label}
          </p>
          <p className="mt-0.5 text-xs leading-snug text-neutral-500">
            {descriptionOverride ??
              statusDescription[status] ??
              "Đang xử lý đơn hàng."}
          </p>
        </div>
        <span className="hidden shrink-0 text-xs text-taupe-400 sm:block">
          {format(updatedAt)}
        </span>
      </div>

      {/* GHN tracking codes */}
      {(ghnOrderCode || ghnReturnOrderCode) &&
        (showGhnOrder || showGhnReturn) && (
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 border-b border-luxury-ink/8 px-5 py-3">
            {showGhnOrder && (
              <p className="flex items-center gap-1.5 font-mono text-xs text-neutral-500">
                Vận đơn GHN:
                <span className="font-bold text-luxury-ink">
                  {ghnOrderCode}
                </span>
                <a
                  href={`https://tracking.ghn.dev/?order_code=${ghnOrderCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-luxury-ink underline decoration-luxury-champagne underline-offset-2 hover:text-accent"
                >
                  Theo dõi →
                </a>
              </p>
            )}
            {showGhnReturn && (
              <p className="flex items-center gap-1.5 font-mono text-xs text-neutral-500">
                Vận đơn hoàn trả:
                <span className="font-bold text-luxury-ink">
                  {ghnReturnOrderCode}
                </span>
                <a
                  href={
                    ghnReturnTrackingUrl?.trim() ||
                    `https://tracking.ghn.dev/?order_code=${ghnReturnOrderCode}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-luxury-ink underline decoration-luxury-champagne underline-offset-2 hover:text-accent"
                >
                  Theo dõi →
                </a>
              </p>
            )}
          </div>
        )}

      {/* Progress stepper */}
      {!isTerminal && (
        <div className="px-5 py-4">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-taupe-400">
            Tiến trình
          </p>
          <div className="flex items-center overflow-x-auto pb-1">
            {progressSteps.map((step, i) => {
              const isDone = i < effectiveStepIdx;
              const isActive = i === effectiveStepIdx;
              return (
                <div
                  key={step.key}
                  className="flex min-w-[72px] flex-1 items-center last:flex-none"
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={
                        isDone || isActive
                          ? "flex h-7 w-7 items-center justify-center border border-luxury-ink bg-luxury-ink transition-colors"
                          : "flex h-7 w-7 items-center justify-center border border-luxury-ink/15 bg-white transition-colors"
                      }
                      style={{ borderRadius: "2px" }}
                    >
                      {isDone ? (
                        <IconCircleCheck
                          className="h-3.5 w-3.5 text-luxury-champagne"
                          strokeWidth={2.5}
                        />
                      ) : isActive ? (
                        <IconTruck
                          className="h-3.5 w-3.5 text-luxury-champagne"
                          strokeWidth={1.75}
                        />
                      ) : (
                        <IconPackage
                          className="h-3.5 w-3.5 text-taupe-300"
                          strokeWidth={1.75}
                        />
                      )}
                    </div>
                    <span
                      className={
                        isDone || isActive
                          ? "w-[60px] text-center text-[10px] font-medium leading-tight text-luxury-ink"
                          : "w-[60px] text-center text-[10px] leading-tight text-taupe-400"
                      }
                    >
                      {step.shortLabel}
                    </span>
                  </div>
                  {i < progressSteps.length - 1 && (
                    <div
                      className={
                        i < effectiveStepIdx
                          ? "mx-0.5 mb-5 h-px flex-1 bg-luxury-champagne"
                          : "mx-0.5 mb-5 h-px flex-1 bg-luxury-ink/10"
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
