"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] border-b border-taupe-200 bg-cream-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid gap-16 lg:gap-24 lg:grid-cols-[3fr,2fr] items-start">

          {/* Left column */}
          <div className="space-y-10">
            <div className="space-y-4">
              <p className="text-[11px] font-bold tracking-[0.4em] uppercase text-taupe-400">
                SECOND-HAND MARKET
              </p>

              <h1
                className={cn(
                  "font-black text-taupe-900 leading-[0.95] tracking-tight",
                  "text-[2.75rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[4.25rem]"
                )}
              >
                Chợ đồ cũ{" "}
                <span className="block text-primary">
                  thông minh, tối giản, rõ ràng.
                </span>
              </h1>
            </div>

            <p className="max-w-xl text-base md:text-lg leading-relaxed text-taupe-600">
              Kết nối người mua và người bán để những món đồ cũ tiếp tục được
              sử dụng. An toàn, tiện lợi và thân thiện với môi trường.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link
                href="/products"
                className="inline-flex items-center justify-center border border-taupe-900 bg-taupe-900 px-7 py-3 text-sm md:text-base font-semibold uppercase tracking-[0.18em] text-cream-50 hover:bg-primary hover:border-primary transition-colors"
              >
                Khám phá sản phẩm
              </Link>
              <Link
                href="/sell"
                className="inline-flex items-center justify-center border border-taupe-300 bg-transparent px-7 py-3 text-sm md:text-base font-semibold uppercase tracking-[0.18em] text-taupe-800 hover:border-primary hover:text-primary transition-colors"
              >
                Đăng tin bán
              </Link>
            </div>
          </div>

    

        </div>
      </div>
    </section>
  );
}
