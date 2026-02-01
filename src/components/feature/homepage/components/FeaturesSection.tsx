"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  features: Feature[];
}

export default function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <section className="py-20 bg-mesh-gradient relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={cn("text-3xl md:text-4xl font-bold mb-4", "animate-fade-in-up", "text-neutral-900")}>
            Tại sao chọn chúng tôi?
          </h2>
          <p className={cn("text-lg max-w-2xl mx-auto", "animate-fade-in-up animation-delay-200", "text-neutral-700 font-medium")}>
            Những lý do khiến hàng ngàn người dùng tin tưởng lựa chọn nền tảng của chúng tôi
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "bg-white rounded-2xl p-6 border border-default hover-border-primary",
                "hover-lift transition-all duration-300",
                "animate-scale-in"
              )}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="text-5xl mb-4 text-center animate-float-slow">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-center text-neutral-900">{feature.title}</h3>
              <p className="text-neutral-700 text-center leading-relaxed font-medium">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
