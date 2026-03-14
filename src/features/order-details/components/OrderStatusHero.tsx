import {
  IconCircleCheck,
  IconPackage,
  IconTruck,
} from "@tabler/icons-react";
import { format } from "@/utils/format/date";

interface ProgressStep {
  key: string;
  shortLabel: string;
}

interface OrderStatusHeroProps {
  status: string;
  statusConfig: { label: string; color: string; icon: string; bgColor: string };
  statusDescription: Record<string, string>;
  progressSteps: readonly ProgressStep[];
  effectiveStepIdx: number;
  isTerminal: boolean;
  updatedAt: string;
  ghnOrderCode?: string | null;
  ghnReturnOrderCode?: string | null;
}

export function OrderStatusHero({
  status,
  statusConfig,
  statusDescription,
  progressSteps,
  effectiveStepIdx,
  isTerminal,
  updatedAt,
  ghnOrderCode,
  ghnReturnOrderCode,
}: OrderStatusHeroProps) {
  const showGhnOrder = ghnOrderCode && ["confirmed", "picked_up", "shipping", "out_for_delivery", "delivered"].includes(status);
  const showGhnReturn = ghnReturnOrderCode && ["returning", "return_shipping", "returned", "refunded"].includes(status);

  return (
    <div className="bg-cream-50 border border-border rounded-2xl overflow-hidden">
      {/* Status row */}
      <div className="flex items-center gap-4 px-5 py-4 border-b border-border">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${statusConfig.bgColor}`}>
          {statusConfig.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold ${statusConfig.color}`}>{statusConfig.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
            {statusDescription[status] ?? "Đang xử lý đơn hàng."}
          </p>
        </div>
        <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">{format(updatedAt)}</span>
      </div>

      {/* GHN tracking codes */}
      {(ghnOrderCode || ghnReturnOrderCode) && (showGhnOrder || showGhnReturn) && (
        <div className="px-5 py-3 border-b border-border flex flex-wrap gap-x-6 gap-y-1.5">
          {showGhnOrder && (
            <p className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
              Vận đơn GHN:
              <span className="font-semibold text-primary">{ghnOrderCode}</span>
              <a
                href={`https://tracking.ghn.dev/?order_code=${ghnOrderCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Theo dõi →
              </a>
            </p>
          )}
          {showGhnReturn && (
            <p className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
              Vận đơn hoàn trả:
              <span className="font-semibold text-primary">{ghnReturnOrderCode}</span>
              <a
                href={`https://tracking.ghn.dev/?order_code=${ghnReturnOrderCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
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
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Tiến trình
          </p>
          <div className="flex items-center overflow-x-auto pb-1">
            {progressSteps.map((step, i) => {
              const isDone = i < effectiveStepIdx;
              const isActive = i === effectiveStepIdx;
              return (
                <div key={step.key} className="flex items-center flex-1 last:flex-none min-w-[72px]">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isDone || isActive ? "bg-primary border-primary" : "bg-card border-border"
                      }`}
                    >
                      {isDone ? (
                        <IconCircleCheck className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                      ) : isActive ? (
                        <IconTruck className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                      ) : (
                        <IconPackage className="w-3.5 h-3.5 text-border" strokeWidth={2} />
                      )}
                    </div>
                    <span
                      className={`text-[10px] text-center leading-tight w-[60px] ${
                        isDone || isActive ? "text-primary font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {step.shortLabel}
                    </span>
                  </div>
                  {i < progressSteps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mb-5 mx-0.5 transition-colors ${
                        i < effectiveStepIdx ? "bg-primary/60" : "bg-border"
                      }`}
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
