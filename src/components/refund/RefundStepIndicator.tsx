"use client";

import { IconCheck } from "@tabler/icons-react";

interface RefundStepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function RefundStepIndicator({ steps, currentStep }: RefundStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 px-6 py-4 border-b border-neutral-200/60 bg-cream-50">
      {steps.map((label, idx) => {
        const s = idx + 1;
        const isDone = s < currentStep;
        const isActive = s === currentStep;
        return (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${isDone
                    ? "bg-primary text-primary-foreground"
                    : isActive
                    ? "bg-foreground text-background"
                    : "bg-neutral-200 text-neutral-400"
                  }`}
              >
                {isDone ? <IconCheck className="w-3.5 h-3.5" /> : s}
              </div>
              <span
                className={`text-[10px] font-medium whitespace-nowrap
                  ${isActive ? "text-neutral-900" : isDone ? "text-primary" : "text-neutral-400"}`}
              >
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`w-16 h-px mx-1.5 mb-4 transition-all
                  ${s < currentStep ? "bg-primary" : "bg-neutral-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
