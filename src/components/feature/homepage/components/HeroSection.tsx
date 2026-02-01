"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import AnimatedBackground from "@/components/common/AnimatedBackground";

interface Stat {
  number: string;
  label: string;
  icon: string;
}

interface HeroSectionProps {
  stats: Stat[];
}

export default function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="relative min-h-[70vh] overflow-hidden rounded-b-[32px] shadow-lg bg-gradient-to-br from-cream-50 via-white to-taupe-50">
      <AnimatedBackground />
      <div className="relative z-30 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className={cn("inline-block mb-6 animate-fade-in-down animation-delay-100")}>
            <span className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-primary text-sm font-semibold border border-primary/30 shadow-md">
              Nền tảng mua bán đồ cũ
            </span>
          </div>
          <h1
            className={cn(
              "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight",
              "animate-fade-in-up animation-delay-200",
              "text-neutral-900 drop-shadow-lg"
            )}
          >
            Chợ Đồ Cũ
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-taupe-600 to-blush-600">
              Thông Minh
            </span>
          </h1>
          <p
            className={cn(
              "text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed",
              "animate-fade-in-up animation-delay-300",
              "text-neutral-700 font-medium drop-shadow-sm"
            )}
          >
            Kết nối người mua và người bán, tạo ra giá trị mới cho những món
            đồ cũ. An toàn, tiện lợi và thân thiện với môi trường.
          </p>
          <div className={cn("flex flex-col sm:flex-row gap-4 justify-center mb-12", "animate-fade-in-up animation-delay-400")}>
            <Link href="/products" className="btn btn-primary btn-lg btn-rounded hover-lift shadow-primary">
              Khám phá sản phẩm
            </Link>
            <Link href="/sell" className="btn btn-secondary btn-lg btn-rounded hover-lift font-medium">
              Đăng tin bán
            </Link>
          </div>
          <div className={cn("flex flex-wrap justify-center gap-8", "animate-fade-in-up animation-delay-500")}>
            {stats.slice(0, 3).map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-1 text-primary drop-shadow-md">{stat.number}</div>
                <div className="text-sm md:text-base text-neutral-700 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
