"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] border-b border-taupe-200 bg-cream-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid gap-16 lg:gap-20 lg:grid-cols-[3fr,2fr] items-center">

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

          {/* Right column: editorial object composition */}
          <div className="hidden lg:flex flex-col gap-3 select-none">

            {/* Row 1: Camera card (wide) + Watch card */}
            <div className="grid grid-cols-[3fr,2fr] gap-3">

              {/* Camera */}
              <div className="bg-taupe-50 border border-taupe-200 p-5 flex flex-col justify-between min-h-[160px] shadow-[2px_2px_0_0_rgba(100,90,80,0.06)]">
                <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-taupe-400">
                  Máy ảnh film
                </span>
                <div className="flex justify-center items-center py-3">
                  <svg width="76" height="56" viewBox="0 0 76 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="14" width="64" height="38" rx="3" stroke="#6B5F52" strokeWidth="1.8"/>
                    <circle cx="38" cy="33" r="13" stroke="#6B5F52" strokeWidth="1.8"/>
                    <circle cx="38" cy="33" r="7.5" stroke="#9A8C7E" strokeWidth="1.4"/>
                    <circle cx="38" cy="33" r="2.5" fill="#9A8C7E"/>
                    <rect x="22" y="6" width="14" height="10" rx="2" stroke="#6B5F52" strokeWidth="1.6"/>
                    <rect x="54" y="10" width="7" height="6" rx="1" stroke="#9A8C7E" strokeWidth="1.4"/>
                    <line x1="6" y1="22" x2="70" y2="22" stroke="#9A8C7E" strokeWidth="0.8" strokeDasharray="2 3"/>
                  </svg>
                </div>
                <div>
                  <div className="text-base font-black text-taupe-900 tracking-tight">120.000đ</div>
                  <div className="text-[8px] font-semibold tracking-[0.28em] uppercase text-taupe-400 mt-0.5">
                    Tình trạng tốt
                  </div>
                </div>
              </div>

              {/* Watch */}
              <div className="bg-white border border-taupe-200 p-5 flex flex-col justify-between min-h-[160px] shadow-[2px_2px_0_0_rgba(100,90,80,0.06)]">
                <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-taupe-400">
                  Đồng hồ
                </span>
                <div className="flex justify-center items-center py-2">
                  <svg width="46" height="58" viewBox="0 0 46 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="16" y="2" width="14" height="9" rx="2" stroke="#6B5F52" strokeWidth="1.6"/>
                    <circle cx="23" cy="29" r="14" stroke="#6B5F52" strokeWidth="1.8"/>
                    <circle cx="23" cy="29" r="10" stroke="#9A8C7E" strokeWidth="1"/>
                    <line x1="23" y1="29" x2="23" y2="21" stroke="#4A3F35" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="23" y1="29" x2="29" y2="26" stroke="#6B5F52" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="23" cy="29" r="1.5" fill="#4A3F35"/>
                    <rect x="16" y="47" width="14" height="9" rx="2" stroke="#6B5F52" strokeWidth="1.6"/>
                  </svg>
                </div>
                <div className="text-sm font-black text-taupe-900 tracking-tight">350.000đ</div>
              </div>
            </div>

            {/* Row 2: Vinyl record + Book + small label */}
            <div className="grid grid-cols-[2fr,3fr] gap-3">

              {/* Vinyl record */}
              <div className="bg-taupe-900 border border-taupe-800 p-5 flex flex-col justify-between min-h-[150px] shadow-[2px_2px_0_0_rgba(100,90,80,0.08)]">
                <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-taupe-400">
                  Đĩa vinyl
                </span>
                <div className="flex justify-center items-center py-2">
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="25" cy="25" r="22" stroke="#9A8C7E" strokeWidth="1.6"/>
                    <circle cx="25" cy="25" r="16" stroke="#6B5F52" strokeWidth="0.8"/>
                    <circle cx="25" cy="25" r="11" stroke="#6B5F52" strokeWidth="0.8"/>
                    <circle cx="25" cy="25" r="6" stroke="#9A8C7E" strokeWidth="1"/>
                    <circle cx="25" cy="25" r="2.5" fill="#F0EAE0"/>
                    <line x1="25" y1="3" x2="25" y2="10" stroke="#6B5F52" strokeWidth="1" strokeDasharray="1 2"/>
                  </svg>
                </div>
                <div className="text-sm font-black text-cream-100 tracking-tight">80.000đ</div>
              </div>

              {/* Book */}
              <div className="bg-cream-100 border border-taupe-200 p-5 flex flex-col justify-between min-h-[150px] shadow-[2px_2px_0_0_rgba(100,90,80,0.06)]">
                <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-taupe-400">
                  Sách cũ
                </span>
                <div className="flex justify-center items-center py-2">
                  <svg width="52" height="58" viewBox="0 0 52 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Book stack */}
                    <rect x="4" y="36" width="44" height="14" rx="2" stroke="#6B5F52" strokeWidth="1.6"/>
                    <rect x="2" y="22" width="44" height="14" rx="2" stroke="#6B5F52" strokeWidth="1.6" fill="#F0EAE0"/>
                    <rect x="6" y="8" width="40" height="14" rx="2" stroke="#6B5F52" strokeWidth="1.8" fill="white"/>
                    {/* Lines on top book */}
                    <line x1="12" y1="14" x2="36" y2="14" stroke="#9A8C7E" strokeWidth="1.4" strokeLinecap="round"/>
                    <line x1="12" y1="18" x2="28" y2="18" stroke="#C4B8A8" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="text-sm font-black text-taupe-900 tracking-tight">45.000đ</div>
              </div>
            </div>

            {/* Bottom rule line */}
            <div className="flex items-center gap-3 pt-1">
              <div className="h-[1px] w-4 bg-primary" />
              <span className="text-[9px] font-bold tracking-[0.32em] uppercase text-taupe-400">
                Hàng ngàn sản phẩm đang chờ bạn
              </span>
              <div className="h-[1px] flex-1 bg-taupe-200" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
