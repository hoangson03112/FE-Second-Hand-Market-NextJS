"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "../hooks";
import Link from "next/link";
import {
  IconArrowRight,
  IconBolt,
  IconHeadset,
  IconLeaf,
  IconShieldCheck,
} from "@tabler/icons-react";

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
  const featureCards = features.slice(0, 4);
  const featureIcons = [IconShieldCheck, IconBolt, IconLeaf, IconHeadset];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-taupe-200/70 bg-gradient-to-br from-cream-50 via-taupe-50 to-cream-100 py-14 md:py-20"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-52 -right-52 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/60 px-3 py-1 text-xs font-semibold tracking-wide text-taupe-700 backdrop-blur",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              )}
              style={{ transition: "all 380ms ease-out" }}
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IconShieldCheck className="h-4 w-4" />
              </span>
              Lợi thế
            </div>

            <h2
              className={cn(
                "mt-4 text-3xl font-semibold tracking-tight text-taupe-950 sm:text-4xl lg:text-5xl",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              )}
              style={{ transition: "all 420ms ease-out 60ms" }}
            >
              Không chỉ đẹp,
              <span className="block text-primary">mà còn đúng nghiệp vụ.</span>
            </h2>

            <p
              className={cn(
                "mt-3 max-w-xl text-sm leading-relaxed text-taupe-600 sm:text-base",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              )}
              style={{ transition: "all 420ms ease-out 120ms" }}
            >
              Nền tảng được xây dựng xoay quanh ba thứ cốt lõi: tin tưởng, tốc độ xử lý và
              trải nghiệm giao dịch minh bạch từ đầu đến cuối.
            </p>

            <div
              className={cn(
                "mt-6 flex flex-col gap-3 sm:flex-row sm:items-center",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              )}
              style={{ transition: "all 420ms ease-out 180ms" }}
            >
              <Link
                href="/products"
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-taupe-900 px-5 text-sm font-semibold text-cream-50 shadow-lg shadow-black/10 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-taupe-900/95"
              >
                Khám phá ngay
                <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/become-seller"
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-border bg-white/70 px-5 text-sm font-semibold text-taupe-800 backdrop-blur transition-colors hover:bg-white"
              >
                Trở thành người bán
              </Link>
            </div>

            <div
              className={cn(
                "mt-6 rounded-3xl border border-border/70 bg-white/70 p-5 backdrop-blur",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              )}
              style={{ transition: "all 420ms ease-out 240ms" }}
            >
              <div className="text-xs font-semibold tracking-wide text-taupe-500">
                NIỀM TIN LÀ MẶC ĐỊNH
              </div>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {[
                  { value: "24/7", label: "Hỗ trợ" },
                  { value: "Realtime", label: "Thông báo" },
                  { value: "Minh bạch", label: "Trạng thái" },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-2xl border border-border/70 bg-white p-3">
                    <div className="text-sm font-semibold text-taupe-950">{kpi.value}</div>
                    <div className="mt-0.5 text-xs text-taupe-500">{kpi.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {featureCards.map((feature, index) => {
                const FeatureIcon = featureIcons[index] || IconShieldCheck;
                return (
                <div
                  key={index}
                  className={cn(
                    "group relative overflow-hidden rounded-3xl border border-border/70 bg-white/80 p-6 backdrop-blur",
                    "shadow-2xl shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                  style={{
                    transition: `opacity 420ms ease-out ${isVisible ? 200 + index * 80 : 0}ms,
                                 transform 420ms ease-out ${isVisible ? 200 + index * 80 : 0}ms`,
                  }}
                >
                  <div aria-hidden className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
                  </div>

                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold tracking-wide text-taupe-500">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="mt-1 text-lg font-semibold text-taupe-950">
                          {feature.title}
                        </div>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <FeatureIcon className="h-5 w-5" />
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-taupe-600 min-h-[44px]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )})}
            </div>

            <div
              className={cn(
                "mt-4 rounded-3xl border border-border/70 bg-white/50 p-5 backdrop-blur",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transition: "all 420ms ease-out 520ms" }}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm font-semibold text-taupe-950">
                  Một nền tảng cho cả mua, bán và quản trị
                </div>
                <div className="text-xs text-taupe-600">
                  Quy trình • Trạng thái • Hoàn tiền • Khiếu nại • Hệ thống thông báo
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

