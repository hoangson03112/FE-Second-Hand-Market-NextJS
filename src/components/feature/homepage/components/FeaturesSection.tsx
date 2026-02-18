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
    <section ref={ref} className="bg-cream-100 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 md:mb-16 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-[0.4em] uppercase text-taupe-400">
              LỢI THẾ
            </p>
            <h2
              className={cn(
                "mt-4 text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-taupe-900 leading-[1.05]",
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
              "max-w-xs text-sm text-taupe-500 leading-relaxed",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}
            style={{ transition: "all 420ms ease-out 60ms" }}
          >
            Được xây dựng với trọng tâm là sự tin tưởng, tốc độ và trải nghiệm
            người dùng thực sự.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-taupe-200">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "group flex flex-col gap-4 pt-8 pb-6",
                "border-b border-taupe-200 sm:border-b-0",
                "sm:border-r border-taupe-200 last:border-r-0",
                "px-0 sm:px-6 first:pl-0",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{
                transition: `all 420ms ease-out ${isVisible ? index * 70 + 150 : 0}ms`,
              }}
            >
              {/* Swiss ruled-line marker */}
              <div className="w-8 h-[3px] bg-primary group-hover:w-12 transition-all duration-300" />

              <div className="space-y-2">
                <h3 className="text-sm md:text-base font-bold tracking-tight text-taupe-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-taupe-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <span className="mt-auto text-[11px] font-bold tracking-[0.28em] text-taupe-300 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
