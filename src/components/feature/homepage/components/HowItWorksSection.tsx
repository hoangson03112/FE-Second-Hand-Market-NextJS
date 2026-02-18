"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "../hooks";

interface Step {
  step: string;
  title: string;
  description: string;
  icon: string;
}

interface HowItWorksSectionProps {
  steps: Step[];
}

export default function HowItWorksSection({ steps }: HowItWorksSectionProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.05 });

  return (
    <section
      ref={ref}
      className="border-b border-taupe-200 bg-taupe-50 py-16 md:py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 md:mb-16 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-[0.4em] uppercase text-taupe-400">
              QUY TRÌNH
            </p>
            <h2
              className={cn(
                "mt-4 text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-taupe-900 leading-[1.05]",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transition: "all 420ms ease-out" }}
            >
              Chỉ 3 bước
              <br />
              <span className="text-primary">để bắt đầu.</span>
            </h2>
          </div>

          <p
            className={cn(
              "max-w-xs text-sm text-taupe-500 leading-relaxed",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}
            style={{ transition: "all 420ms ease-out 60ms" }}
          >
            Từ đăng ký đến hoàn tất giao dịch — đơn giản, minh bạch, không
            phức tạp.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-0 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "border-t-2 border-taupe-200 pt-6 pb-10 md:pr-10 lg:pr-16",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              )}
              style={{
                transition: `all 450ms ease-out ${isVisible ? index * 100 + 150 : 0}ms`,
                borderTopColor: index === 0 ? "var(--color-primary)" : undefined,
              }}
            >
              {/* Large display number */}
              <span
                className="block text-[4.5rem] md:text-[5.5rem] font-black leading-none tracking-tight select-none mb-5"
                style={{ color: "var(--taupe-200)" }}
              >
                {step.step}
              </span>

              <h3 className="text-base md:text-lg font-bold tracking-tight text-taupe-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-taupe-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
