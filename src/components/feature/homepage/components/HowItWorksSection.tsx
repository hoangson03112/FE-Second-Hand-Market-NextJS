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
      className="relative overflow-hidden border-b-2 border-taupe-700 bg-taupe-800 py-12 md:py-16"
    >
      {/* Subtle noise overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundSize: "256px 256px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 md:mb-12 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-3">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-taupe-500">
                QUY TRÌNH
              </p>
              <div
                className={cn(
                  "h-px bg-taupe-600 transition-all duration-700",
                  isVisible ? "w-12 opacity-100" : "w-0 opacity-0"
                )}
              />
            </div>
            <h2
              className={cn(
                "text-3xl md:text-4xl lg:text-5xl font-medium text-cream-100 leading-[1.1] tracking-tight",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transition: "all 420ms ease-out" }}
            >
              Chỉ 3 bước
              <br />
              <span className="text-blush-300">để bắt đầu.</span>
            </h2>
          </div>

          <p
            className={cn(
              "max-w-sm text-sm text-taupe-400 leading-relaxed",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}
            style={{ transition: "all 420ms ease-out 60ms" }}
          >
            Từ đăng ký đến hoàn tất giao dịch — đơn giản, minh bạch, không
            phức tạp.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-0 md:grid-cols-3 border-t border-taupe-700">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "group relative border-b md:border-b-0 md:border-r border-taupe-700 last:border-r-0",
                "pt-8 pb-10 pr-0 md:pr-8 lg:pr-12",
                "cursor-default overflow-hidden",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              )}
              style={{
                transition: `all 450ms ease-out ${isVisible ? index * 100 + 150 : 0}ms`,
              }}
            >
              {/* Hover accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blush-400 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />

              {/* Display number */}
              <div className="mb-6 flex items-start gap-3">
                <span className="block text-6xl md:text-8xl font-medium leading-none text-taupe-600 select-none group-hover:text-taupe-500 transition-colors duration-300">
                  {step.step}
                </span>
                <div className="mt-10 h-px flex-1 bg-taupe-700 group-hover:bg-blush-600 transition-colors duration-300" />
              </div>

              <h3 className="text-base md:text-lg font-medium text-cream-100 mb-2 group-hover:text-cream-50 transition-colors">
                {step.title}
              </h3>
              <p className="text-sm text-taupe-400 leading-relaxed group-hover:text-taupe-300 transition-colors">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

