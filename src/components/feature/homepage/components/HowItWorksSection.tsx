"use client";

import React from "react";
import { cn } from "@/lib/utils";

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
  return (
    <section className="py-20 bg-white bg-wave relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={cn("text-3xl md:text-4xl font-bold mb-4", "animate-fade-in-up", "text-neutral-900")}>
            🚀 Cách thức hoạt động
          </h2>
          <p className={cn("text-lg max-w-2xl mx-auto", "animate-fade-in-up animation-delay-200", "text-neutral-700 font-medium")}>
            Chỉ với 3 bước đơn giản, bạn có thể mua bán đồ cũ một cách dễ dàng
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={index} className={cn("relative text-center animate-fade-in-up", `animation-delay-${(index + 1) * 200}`)}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg z-10 shadow-lg">
                {step.step}
              </div>
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-tint to-secondary-tint border-4 border-primary mx-auto mb-6 flex items-center justify-center text-5xl animate-float-slow hover-scale">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900">{step.title}</h3>
              <p className="text-neutral-700 leading-relaxed font-medium">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 -right-6 w-12 h-0.5 bg-neutral-300">
                  <div className="absolute -right-2 -top-2 text-neutral-400 text-2xl">→</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
