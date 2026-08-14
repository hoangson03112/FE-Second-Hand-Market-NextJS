"use client";

import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { cn } from "@/lib/utils";
import type { ProgressStep } from "../hooks/useCheckoutSuccess";

interface OrderProgressTrailProps {
  steps: ProgressStep[];
  currentIndex: number;
  failedNotice?: string | null;
}

const serif = { fontFamily: "var(--font-droid-serif), serif" };

const twoDigits = (value: number) => String(value).padStart(2, "0");

type NodeState = "done" | "active" | "todo";

function nodeStateFor(index: number, currentIndex: number): NodeState {
  if (index < currentIndex) return "done";
  if (index === currentIndex) return "active";
  return "todo";
}

/** Square 2px node with a serif ordinal — filled once reached, hairline before. */
function Node({ state, index }: { state: NodeState; index: number }) {
  return (
    <span
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] border transition-colors duration-500",
        state === "todo"
          ? "border-luxury-ink/15 bg-white text-neutral-400"
          : "border-luxury-ink bg-luxury-ink text-luxury-ivory",
        state === "active" &&
          "ring-1 ring-luxury-champagne/70 ring-offset-2 ring-offset-luxury-ivory",
      )}
    >
      {state === "done" ? (
        <IconCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
      ) : (
        <span style={serif} className="text-[13px] leading-none">
          {twoDigits(index + 1)}
        </span>
      )}
    </span>
  );
}

export default function OrderProgressTrail({
  steps,
  currentIndex,
  failedNotice,
}: OrderProgressTrailProps) {
  const currentLabel = steps[currentIndex]?.label ?? "Đang xử lý";

  return (
    <section className="rounded-[2px] border border-luxury-ink/10 bg-white px-5 py-6 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Eyebrow>Tiến trình đơn hàng</Eyebrow>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">
          Hiện tại · <span className="text-luxury-ink">{currentLabel}</span>
        </p>
      </div>

      {/* Horizontal rail on desktop */}
      <ol className="mt-8 hidden md:flex md:items-start">
        {steps.map((step, index) => {
          const state = nodeStateFor(index, currentIndex);
          const isLast = index === steps.length - 1;
          return (
            <li
              key={step.key}
              className={cn(
                "flex min-w-0 items-start",
                isLast ? "shrink-0" : "flex-1",
              )}
            >
              <div className="flex w-16 shrink-0 flex-col items-center gap-3">
                <Node state={state} index={index} />
                <span
                  className={cn(
                    "text-center text-[9px] font-bold uppercase leading-tight tracking-[0.14em]",
                    state === "todo" ? "text-neutral-400" : "text-luxury-ink",
                  )}
                >
                  {step.shortLabel}
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

      {/* Vertical trail on mobile — no horizontal scrolling to read status */}
      <ol className="mt-7 space-y-0 md:hidden">
        {steps.map((step, index) => {
          const state = nodeStateFor(index, currentIndex);
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
              <span
                className={cn(
                  "pt-2 text-xs font-medium",
                  isLast ? "pb-0" : "pb-6",
                  state === "todo" ? "text-neutral-400" : "text-luxury-ink",
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>

      {failedNotice ? (
        <div className="mt-7 flex items-start gap-3 rounded-[2px] border border-blush-300 bg-blush-50 px-4 py-3.5">
          <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-blush-700" />
          <p className="text-xs leading-relaxed text-blush-800">
            {failedNotice}
          </p>
        </div>
      ) : null}
    </section>
  );
}
