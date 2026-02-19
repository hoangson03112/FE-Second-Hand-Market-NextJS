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
    <section ref={ref} className="bg-cream-50 py-16 md:py-24 border-b-2 border-taupe-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 md:mb-20 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-lg">
            <p className="text-[10px] font-black tracking-[0.45em] uppercase text-taupe-400 mb-6">
              LỢI THẾ
            </p>
            <h2
              className={cn(
                "text-[2.5rem] md:text-[3.25rem] lg:text-[4rem] font-black tracking-[-0.02em] text-taupe-900 leading-[0.9]",
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
              "max-w-sm text-[15px] text-taupe-600 leading-relaxed font-normal",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}
            style={{ transition: "all 420ms ease-out 60ms" }}
          >
            Được xây dựng với trọng tâm là sự tin tưởng, tốc độ và trải nghiệm
            người dùng thực sự.
          </p>
        </div>

        {/* Feature grid - Swiss grid system */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t-2 border-taupe-300">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "group flex flex-col gap-5 pt-8 pb-10",
                "border-b-2 border-taupe-200 sm:border-b-0",
                "sm:border-r-2 border-taupe-200 last:border-r-0",
                "px-0 sm:px-7 first:pl-0 lg:first:pr-10",
                "hover:bg-cream-100 transition-colors duration-200",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{
                transition: `all 420ms ease-out ${isVisible ? index * 70 + 150 : 0}ms`,
              }}
            >
              {/* Swiss numeric prefix */}
              <div className="flex items-end gap-3">
                <span className="text-[2.75rem] font-black leading-none tracking-tight text-taupe-300 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="mb-1 h-[2px] flex-1 bg-taupe-200 group-hover:bg-primary transition-colors" />
              </div>

              <div className="space-y-3">
                <h3 className="text-[15px] md:text-[17px] font-bold tracking-tight text-taupe-900 uppercase leading-tight">
                  {feature.title}
                </h3>
                <p className="text-[14px] text-taupe-600 leading-relaxed">
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
