"use client";

import { IconCheck } from "@tabler/icons-react";
import { Panel, microCaps } from "@/features/order/components";
import { cn } from "@/lib/utils";
import { format } from "@/utils/format/date";

export interface TimelineStep {
  key: string;
  label: string;
  at?: string;
}

interface SellerOrderTimelineProps {
  steps: TimelineStep[];
  /** Index of the step the order is currently sitting on. */
  currentIndex: number;
  /** Cancelled / failed orders came off the rail — say so instead of drawing it. */
  brokenNotice?: string | null;
}

type NodeState = "done" | "active" | "todo";

const twoDigits = (value: number) => String(value).padStart(2, "0");

/**
 * Square 2px node with a serif ordinal — the same vocabulary as the buyer's
 * `OrderProgressTrail`, so both sides of a transaction read the same trail. The
 * seller version adds the timestamp per step, because that is the operational
 * detail they actually need when a buyer asks "where is my order".
 */
function Node({ state, index }: { state: NodeState; index: number }) {
  return (
    <span
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] border transition-colors duration-500",
        state === "todo"
          ? "border-luxury-ink/15 bg-white text-neutral-400"
          : "border-luxury-ink bg-luxury-ink text-luxury-ivory",
        state === "active" &&
          "ring-1 ring-luxury-champagne/70 ring-offset-2 ring-offset-white",
      )}
    >
      {state === "done" ? (
        <IconCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
      ) : (
        <span className="font-droid-serif text-[13px] leading-none">
          {twoDigits(index + 1)}
        </span>
      )}
    </span>
  );
}

function stateFor(index: number, currentIndex: number): NodeState {
  if (index < currentIndex) return "done";
  if (index === currentIndex) return "active";
  return "todo";
}

export function SellerOrderTimeline({
  steps,
  currentIndex,
  brokenNotice,
}: SellerOrderTimelineProps) {
  const currentLabel = steps[currentIndex]?.label ?? "Đang xử lý";

  return (
    <Panel
      eyebrow="Tiến trình"
      title="Lịch sử đơn hàng"
      aside={
        brokenNotice ? null : (
          <p className={cn(microCaps, "text-neutral-500")}>
            Hiện tại · <span className="text-luxury-ink">{currentLabel}</span>
          </p>
        )
      }
    >
      {brokenNotice ? (
        <div className="rounded-[2px] border border-blush-300 bg-blush-50 px-4 py-3.5">
          <p className="text-xs leading-relaxed text-blush-800">
            {brokenNotice}
          </p>
        </div>
      ) : (
        <>
          {/* Horizontal rail from md up */}
          <ol className="hidden md:flex md:items-start">
            {steps.map((step, index) => {
              const state = stateFor(index, currentIndex);
              const isLast = index === steps.length - 1;

              return (
                <li
                  key={step.key}
                  className={cn(
                    "flex min-w-0 items-start",
                    isLast ? "shrink-0" : "flex-1",
                  )}
                >
                  <div className="flex w-20 shrink-0 flex-col items-center gap-2.5">
                    <Node state={state} index={index} />
                    <span
                      className={cn(
                        "text-center text-[9px] font-bold uppercase leading-tight tracking-[0.14em]",
                        state === "todo"
                          ? "text-neutral-400"
                          : "text-luxury-ink",
                      )}
                    >
                      {step.label}
                    </span>
                    <span className="min-h-[1rem] text-center text-2xs tabular-nums text-neutral-500">
                      {step.at ? format(step.at) : ""}
                    </span>
                  </div>

                  {!isLast ? (
                    <span
                      aria-hidden
                      className={cn(
                        "mt-4 h-px flex-1 transition-colors duration-500",
                        index < currentIndex
                          ? "bg-luxury-champagne"
                          : "bg-luxury-ink/12",
                      )}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>

          {/* Vertical trail below md — no sideways scrolling to read a status */}
          <ol className="md:hidden">
            {steps.map((step, index) => {
              const state = stateFor(index, currentIndex);
              const isLast = index === steps.length - 1;

              return (
                <li key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <Node state={state} index={index} />
                    {!isLast ? (
                      <span
                        aria-hidden
                        className={cn(
                          "w-px flex-1 transition-colors duration-500",
                          index < currentIndex
                            ? "bg-luxury-champagne"
                            : "bg-luxury-ink/12",
                        )}
                      />
                    ) : null}
                  </div>

                  <div className={cn("pt-1.5", isLast ? "pb-0" : "pb-6")}>
                    <p
                      className={cn(
                        "text-xs font-medium",
                        state === "todo"
                          ? "text-neutral-400"
                          : "text-luxury-ink",
                      )}
                    >
                      {step.label}
                    </p>
                    {step.at ? (
                      <p className="mt-1 text-2xs tabular-nums text-neutral-500">
                        {format(step.at)}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </Panel>
  );
}
