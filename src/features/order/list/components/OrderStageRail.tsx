import { cn } from "@/lib/utils";
import { microCaps } from "@/features/order/components";
import type { OrderStageInfo } from "../utils/orderStage";

interface OrderStageRailProps {
  stage: OrderStageInfo;
}

/**
 * A four-segment rule instead of a row of numbered nodes: at list density the
 * eye reads "how far along" from a filled bar far faster than from icons, and it
 * costs one line instead of four.
 *
 * Done segments are ink, the segment in progress is champagne, the rest are a
 * hairline — the same three-way distinction the detail trail makes.
 */
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

      {/* Labels are the nice-to-have here — dropped on narrow screens, where the
          headline above already names the current step. */}
      <div className="mt-2 hidden gap-1.5 sm:flex">
        {stages.map((s, index) => (
          <span
            key={s.key}
            className={cn(
              "flex-1 text-2xs font-bold uppercase tracking-[0.14em]",
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
