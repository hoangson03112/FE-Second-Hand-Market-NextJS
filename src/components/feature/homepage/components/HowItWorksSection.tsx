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
      className="border-b-2 border-taupe-300 bg-beige-50 py-16 md:py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 md:mb-20 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-lg">
            <p className="text-[10px] font-black tracking-[0.45em] uppercase text-taupe-400 mb-6">
              QUY TRÌNH
            </p>
            <h2
              className={cn(
                "text-[2.5rem] md:text-[3.25rem] lg:text-[4rem] font-black tracking-[-0.02em] text-taupe-900 leading-[0.9]",
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
              "max-w-sm text-[15px] text-taupe-600 leading-relaxed font-normal",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}
            style={{ transition: "all 420ms ease-out 60ms" }}
          >
            Từ đăng ký đến hoàn tất giao dịch — đơn giản, minh bạch, không
            phức tạp.
          </p>
        </div>

        {/* Steps - Swiss grid layout */}
        <div className="grid gap-0 md:grid-cols-3 border-t-2 border-taupe-300">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "border-b-2 md:border-b-0 md:border-r-2 border-taupe-200 last:border-r-0 pt-10 pb-12 pr-0 md:pr-10 lg:pr-16",
                "hover:bg-cream-100 transition-colors duration-200",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              )}
              style={{
                transition: `all 450ms ease-out ${isVisible ? index * 100 + 150 : 0}ms`,
              }}
            >
              {/* Large display number - Swiss style */}
              <div className="mb-8 flex items-start gap-4">
                <span
                  className="block text-[6rem] md:text-[7rem] font-black leading-none tracking-tighter select-none"
                  style={{ color: "var(--taupe-300)" }}
                >
                  {step.step}
                </span>
                <div className="mt-10 h-[3px] flex-1 bg-taupe-300" />
              </div>

              <h3 className="text-[16px] md:text-[18px] font-bold tracking-tight text-taupe-900 mb-3 uppercase">
                {step.title}
              </h3>
              <p className="text-[14px] text-taupe-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
