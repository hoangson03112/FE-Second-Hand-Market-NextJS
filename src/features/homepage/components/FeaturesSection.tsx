"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "../hooks";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  features: Feature[];
}

export default function FeaturesSection({ features }: FeaturesSectionProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.05 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b-2 border-taupe-200 py-12 md:py-16"
      style={{
        background: "linear-gradient(135deg, var(--cream-50) 0%, var(--taupe-50) 50%, var(--cream-100) 100%)",
      }}
    >
      {/* Dot grid decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(circle, var(--taupe-300) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 md:mb-12 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-3">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-taupe-400">
                LỢI THẾ
              </p>
              <div
                className={cn(
                  "h-px bg-taupe-300 transition-all duration-700",
                  isVisible ? "w-12 opacity-100" : "w-0 opacity-0"
                )}
              />
            </div>
            <h2
              className={cn(
                "text-3xl md:text-4xl lg:text-5xl font-medium text-taupe-900 leading-[1.1] tracking-tight",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transition: "all 420ms ease-out" }}
            >
              Tại sao chọn
              <br />
              <span className="text-primary">nền tảng này.</span>
            </h2>
          </div>

          <p
            className={cn(
              "max-w-sm text-sm text-taupe-600 leading-relaxed",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}
            style={{ transition: "all 420ms ease-out 60ms" }}
          >
            Được xây dựng với trọng tâm là sự tin tưởng, tốc độ và trải nghiệm
            người dùng thực sự.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t-2 border-taupe-200">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "group relative flex flex-col gap-5 pt-7 pb-8",
                "border-b-2 border-taupe-200 sm:border-b-0",
                "sm:border-r-2 border-taupe-200 last:border-r-0",
                "px-0 sm:px-6 first:pl-0 last:pr-0",
                "cursor-default overflow-hidden",
                "transition-all duration-200",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{
                transition: `opacity 420ms ease-out ${isVisible ? index * 70 + 150 : 0}ms,
                             transform 420ms ease-out ${isVisible ? index * 70 + 150 : 0}ms`,
              }}
            >
              {/* Bottom hover fill */}
              <div className="absolute inset-0 bg-blush-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

              {/* Numeric prefix + line */}
              <div className="relative z-10 flex items-end gap-2">
                <span className="text-3xl font-medium leading-none text-blush-300 tabular-nums group-hover:text-blush-500 transition-colors duration-200">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="mb-0.5 h-px flex-1 bg-taupe-200 group-hover:bg-blush-300 transition-colors duration-200" />
              </div>

              {/* Icon */}
              <div className="relative z-10">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-blush-100 group-hover:bg-blush-200 text-xl transition-colors duration-200">
                  {feature.icon}
                </span>
              </div>

              <div className="relative z-10 space-y-2">
                <h3 className="text-sm md:text-base font-medium text-taupe-900 leading-tight group-hover:text-taupe-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-taupe-600 leading-relaxed group-hover:text-taupe-700 transition-colors duration-200">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

