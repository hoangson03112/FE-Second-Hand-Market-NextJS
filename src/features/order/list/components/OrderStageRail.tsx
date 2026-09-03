import { cn } from "@/lib/utils";
import { microCaps } from "@/features/order/components";
import type { OrderStageInfo } from "../utils/orderStage";

interface OrderStageRailProps {
  stage: OrderStageInfo;
}


export function OrderStageRail({ stage }: OrderStageRailProps) {
  const { stages, currentIndex, isComplete } = stage;
  const currentLabel = stages[currentIndex]?.label ?? "";

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className={cn(microCaps, "text-neutral-500")}>
          {isComplete ? "Đã xong" : "Đang ở bước"}{" "}
          <span className="text-luxury-ink">{currentLabel}</span>
        </p>
        <p className={cn(microCaps, "shrink-0 tabular-nums text-neutral-400")}>
          <span className="font-droid-serif text-[13px] text-luxury-ink">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          {" / "}
          {String(stages.length).padStart(2, "0")}
        </p>
      </div>

      <div className="mt-2.5 flex gap-1.5" aria-hidden>
        {stages.map((s, index) => (
          <span
            key={s.key}
            className={cn(
              "h-[3px] flex-1 rounded-full transition-colors duration-500",
              index < currentIndex || (isComplete && index === currentIndex)
                ? "bg-luxury-ink"
                : index === currentIndex
                  ? "bg-luxury-champagne"
                  : "bg-luxury-ink/12",
            )}
          />
        ))}
      </div>


      <div className="mt-2 hidden gap-1.5 sm:flex">
        {stages.map((s, index) => (
          <span
            key={s.key}
            className={cn(
              "flex-1 text-2xs font-medium uppercase tracking-[0.14em]",
              index <= currentIndex ? "text-luxury-ink" : "text-neutral-400",
            )}
          >
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
