"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "../hooks";
import Link from "next/link";
import {
  IconArrowRight,
  IconBellRinging,
  IconPackage,
  IconShieldCheck,
  IconSparkles,
  IconUserPlus,
} from "@tabler/icons-react";

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
  const stepCards = steps.slice(0, 3);
  const stepIcons = [IconUserPlus, IconPackage, IconShieldCheck];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-taupe-700/60 bg-gradient-to-br from-taupe-950 via-taupe-900 to-taupe-800 py-16 md:py-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-44 right-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-44 -left-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cream-100/15 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),transparent_45%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
            <div className="rounded-3xl border border-cream-100/15 bg-cream-100/5 p-6 text-left md:p-8">
              <div
                className={cn(
                  "group inline-flex items-center gap-2 rounded-full border border-cream-100/25 bg-cream-100/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-cream-50",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                )}
                style={{ transition: "all 380ms ease-out" }}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-amber-300 animate-pulse">
                  <IconSparkles className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                </span>
                Quy trình giao dịch
              </div>

              <h2
                className={cn(
                  "mt-4 text-3xl font-semibold tracking-tight text-cream-50 sm:text-5xl",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                )}
                style={{ transition: "all 420ms ease-out 60ms" }}
              >
                Mở gian hàng và giao dịch
                <span className="mt-1 block text-amber-300">chỉ trong 3 bước.</span>
              </h2>

              <p
                className={cn(
                  "mt-4 max-w-2xl text-sm leading-relaxed text-cream-100/90 sm:text-base",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                )}
                style={{ transition: "all 420ms ease-out 120ms" }}
              >
                Từ đăng ký đến chốt đơn, mọi trạng thái đều được hiển thị rõ ràng để người mua
                và người bán luôn biết giao dịch đang ở bước nào.
              </p>
            </div>

            <div
              className={cn(
                "rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 transition-transform duration-300 hover:-translate-y-0.5 md:p-7",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              )}
              style={{ transition: "all 420ms ease-out 180ms" }}
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-cream-50/90">
                Bắt đầu ngay
              </p>
              <p className="mt-2 text-sm leading-relaxed text-cream-100/85">
                Tạo tài khoản để đăng bán hoặc khám phá sản phẩm phù hợp chỉ trong vài phút.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/register"
                  className="group inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-semibold text-cream-50 shadow-lg shadow-primary/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40 hover:bg-primary/95"
                >
                  Tạo tài khoản
                  <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/search"
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-cream-100/30 bg-cream-100/10 px-5 text-sm font-semibold text-cream-50 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cream-100/20"
                >
                  Khám phá sản phẩm
                </Link>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute left-16 right-16 top-10 hidden h-px bg-gradient-to-r from-transparent via-cream-100/25 to-transparent lg:block" />
            <div className="grid gap-4 lg:grid-cols-3">
              {stepCards.map((step, index) => {
                const StepIcon = stepIcons[index] || IconPackage;
                return (
                <div
                  key={index}
                  className={cn(
                    "group relative overflow-hidden rounded-3xl border border-cream-100/20 bg-cream-100/10 p-6",
                    "shadow-2xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-cream-100/15",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                  style={{
                    transition: `opacity 420ms ease-out ${isVisible ? 200 + index * 80 : 0}ms,
                                 transform 420ms ease-out ${isVisible ? 200 + index * 80 : 0}ms`,
                  }}
                >
                  <div aria-hidden className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-primary/20 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cream-100/10 to-transparent" />
                  </div>

                  <div className="relative">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold tracking-wide text-amber-300">
                          BƯỚC {step.step || String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="mt-1 text-lg font-semibold text-cream-50">
                          {step.title}
                        </div>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cream-100/20 text-amber-300 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
                        <StepIcon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" />
                      </div>
                    </div>

                    <p className="mt-3 min-h-[44px] text-sm leading-relaxed text-cream-100/85">
                      {step.description}
                    </p>
                  </div>
                </div>
              )})}
            </div>

            <div
              className={cn(
                "group mt-5 rounded-3xl border border-cream-100/20 bg-gradient-to-r from-cream-100/15 to-transparent p-5 transition-colors duration-300 hover:from-cream-100/20",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transition: "all 420ms ease-out 420ms" }}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm font-semibold text-cream-50">
                  Giao dịch an tâm, rõ trạng thái theo thời gian thực
                </div>
                <div className="flex items-center gap-3 text-xs text-cream-100/85">
                  <span className="inline-flex items-center gap-1.5">
                    <IconBellRinging className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" />
                    Thông báo realtime
                  </span>
                  <span>•</span>
                  <span>Theo dõi đơn</span>
                  <span>•</span>
                  <span>Hỗ trợ tranh chấp</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

