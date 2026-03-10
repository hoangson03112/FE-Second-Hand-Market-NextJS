"use client";

import React from "react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      style={{ background: "#FDFAF6" }}
      className="relative overflow-hidden"
    >
      {/* Subtle warm gradient blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: "-80px", right: "-120px",
          width: "600px", height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle at 40% 40%, #F5E6D8 0%, transparent 65%)",
          opacity: 0.7,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          bottom: "-60px", left: "30%",
          width: "360px", height: "360px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #EDE0D4 0%, transparent 70%)",
          opacity: 0.4,
        }}
      />

      <div className="relative z-10 w-full container mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          {/* LEFT: Content */}
          <div className="max-w-lg">
            {/* Label */}
            <div
              className="opacity-0-init animate-fade-in-up mb-4"
              style={{ animationDelay: "60ms", animationFillMode: "forwards" }}
            >
              <span
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase"
                style={{ color: "#736045" }}
              >
                <span
                  className="w-6 h-px"
                  style={{ background: "#736045", display: "inline-block" }}
                />
                Sàn đồ cũ trực tuyến
              </span>
            </div>

            {/* Headline */}
            <h1
              className="opacity-0-init animate-fade-in-up font-semibold leading-[1.1] tracking-tight mb-6"
              style={{
                fontSize: "clamp(2.6rem, 5.5vw, 4rem)",
                color: "#1A1714",
                animationDelay: "150ms",
                animationFillMode: "forwards",
              }}
            >
              Mua &amp; bán đồ cũ
              <br />
              <span style={{ color: "#736045" }}>dễ dàng &amp; tin cậy</span>
            </h1>

            {/* Desc */}
            <p
              className="opacity-0-init animate-fade-in-up text-base leading-relaxed mb-7"
              style={{
                color: "#7A6755",
                animationDelay: "260ms",
                animationFillMode: "forwards",
              }}
            >
              Kết nối hàng ngàn người mua và người bán trên mọi tỉnh thành.
              An toàn, nhanh chóng và thân thiện với môi trường.
            </p>

            {/* CTA row */}
            <div
              className="opacity-0-init animate-fade-in-up flex flex-wrap gap-3 mb-7"
              style={{ animationDelay: "360ms", animationFillMode: "forwards" }}
            >
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold transition-all duration-200 hover:opacity-90"
                style={{ background: "#1A1714", color: "#FDFAF6", borderRadius: "8px" }}
              >
                Khám phá sản phẩm
                <span>&rarr;</span>
              </Link>
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold transition-all duration-200"
                style={{
                  background: "transparent",
                  color: "#1A1714",
                  border: "1.5px solid #D5C4B5",
                  borderRadius: "8px",
                }}
              >
                Đăng tin bán
              </Link>
            </div>

            {/* Stats row */}
            <div
              className="opacity-0-init animate-fade-in-up flex gap-8"
              style={{
                animationDelay: "460ms",
                animationFillMode: "forwards",
                paddingTop: "24px",
                borderTop: "1px solid #EDE0D4",
              }}
            >
              {[
                { value: "10k+", label: "Sản phẩm" },
                { value: "5k+", label: "Người dùng" },
                { value: "98%", label: "Hài lòng" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-semibold tracking-tight" style={{ color: "#1A1714" }}>{s.value}</div>
                  <div className="text-xs font-medium mt-0.5" style={{ color: "#A89280" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Floating vintage objects illustration */}
          <div
            className="hidden lg:block opacity-0-init animate-fade-in-up"
            style={{ position: "relative", minHeight: "420px", animationDelay: "180ms", animationFillMode: "forwards" }}
          >
            <style>{`
              @keyframes floatA {
                0%,100% { transform: translateY(0px) rotate(-8deg); }
                50%      { transform: translateY(-16px) rotate(-5deg); }
              }
              @keyframes floatB {
                0%,100% { transform: translateY(0px) rotate(10deg); }
                50%      { transform: translateY(-20px) rotate(13deg); }
              }
              @keyframes floatC {
                0%,100% { transform: translateY(0px) rotate(0deg); }
                50%      { transform: translateY(-12px) rotate(-3deg); }
              }
              @keyframes floatD {
                0%,100% { transform: translateY(0px) rotate(14deg); }
                50%      { transform: translateY(-18px) rotate(17deg); }
              }
              @keyframes floatE {
                0%,100% { transform: translateY(0px) rotate(-12deg); }
                50%      { transform: translateY(-10px) rotate(-9deg); }
              }
              @keyframes floatF {
                0%,100% { transform: translateY(0px) rotate(5deg); }
                50%      { transform: translateY(-22px) rotate(8deg); }
              }
              @keyframes vinyl-spin {
                from { transform: rotate(0deg); }
                to   { transform: rotate(360deg); }
              }
            `}</style>

            {/* Soft glow backdrop */}
            <div aria-hidden style={{
              position: "absolute", width: "320px", height: "320px", borderRadius: "50%",
              background: "radial-gradient(circle, #F0E0CC 0%, transparent 70%)",
              top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none",
            }} />

            {/* -- CAMERA (top-left) -- */}
            <div style={{ position: "absolute", top: "18px", left: "40px", animation: "floatA 5s ease-in-out infinite" }}>
              <svg width="80" height="68" viewBox="0 0 80 68" fill="none">
                {/* body */}
                <rect x="6" y="18" width="68" height="46" rx="7" fill="#2C1F14"/>
                {/* top bump / viewfinder area */}
                <rect x="18" y="10" width="20" height="12" rx="4" fill="#2C1F14"/>
                {/* flash */}
                <rect x="46" y="12" width="14" height="10" rx="3" fill="#736045"/>
                {/* lens outer */}
                <circle cx="40" cy="41" r="16" fill="#1A1714" stroke="#736045" strokeWidth="2"/>
                {/* lens inner */}
                <circle cx="40" cy="41" r="10" fill="#3A2A1E"/>
                {/* lens shine */}
                <circle cx="35" cy="36" r="3" fill="white" opacity="0.25"/>
                {/* shutter button */}
                <circle cx="60" cy="20" r="4" fill="#736045"/>
                {/* strap lug left */}
                <rect x="2" y="28" width="7" height="10" rx="2" fill="#736045"/>
                {/* strap lug right */}
                <rect x="71" y="28" width="7" height="10" rx="2" fill="#736045"/>
              </svg>
            </div>

            {/* -- VINYL RECORD (top-right) -- */}
            <div style={{ position: "absolute", top: "10px", right: "50px", animation: "floatB 6s ease-in-out infinite 0.8s" }}>
              <svg width="76" height="76" viewBox="0 0 76 76" fill="none">
                <g style={{ animation: "vinyl-spin 8s linear infinite", transformOrigin: "38px 38px" }}>
                  <circle cx="38" cy="38" r="36" fill="#1A1714"/>
                  <circle cx="38" cy="38" r="28" fill="none" stroke="#2E2018" strokeWidth="3"/>
                  <circle cx="38" cy="38" r="22" fill="none" stroke="#2E2018" strokeWidth="2"/>
                  <circle cx="38" cy="38" r="16" fill="none" stroke="#2E2018" strokeWidth="2"/>
                </g>
                {/* label (doesn't spin) */}
                <circle cx="38" cy="38" r="12" fill="#736045"/>
                <circle cx="38" cy="38" r="3" fill="#1A1714"/>
                <text x="38" y="35" textAnchor="middle" fontSize="4" fontWeight="700" fill="white" fontFamily="sans-serif">ECO</text>
                <text x="38" y="41" textAnchor="middle" fontSize="3.5" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">VINTAGE</text>
              </svg>
            </div>

            {/* -- STACK OF BOOKS (middle-left) -- */}
            <div style={{ position: "absolute", top: "160px", left: "20px", animation: "floatE 4.5s ease-in-out infinite 0.3s" }}>
              <svg width="72" height="58" viewBox="0 0 72 58" fill="none">
                {/* bottom book */}
                <rect x="4" y="40" width="64" height="14" rx="2" fill="#736045"/>
                <rect x="4" y="40" width="6" height="14" rx="2" fill="#A05A38"/>
                <line x1="16" y1="43" x2="62" y2="43" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                {/* middle book */}
                <rect x="8" y="24" width="58" height="14" rx="2" fill="#EDE0D4"/>
                <rect x="8" y="24" width="5" height="14" rx="2" fill="#D0C0A8"/>
                <line x1="18" y1="27" x2="60" y2="27" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
                {/* top book */}
                <rect x="12" y="8" width="52" height="14" rx="2" fill="#2C1F14"/>
                <rect x="12" y="8" width="5" height="14" rx="2" fill="#1A1008"/>
                <line x1="22" y1="11" x2="58" y2="11" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              </svg>
            </div>

            {/* -- VINTAGE TABLE LAMP (center-ish) -- */}
            <div style={{ position: "absolute", top: "110px", left: "50%", transform: "translateX(-30%)", animation: "floatC 5.5s ease-in-out infinite 0.5s" }}>
              <svg width="70" height="90" viewBox="0 0 70 90" fill="none">
                {/* shade */}
                <path d="M10 38 L22 8 L48 8 L60 38 Z" fill="#736045"/>
                <path d="M10 38 L22 8 L22 12 L12 38 Z" fill="#A05A38"/>
                {/* shade rim bottom */}
                <rect x="8" y="36" width="54" height="5" rx="2" fill="#8A4828"/>
                {/* shade rim top */}
                <rect x="20" y="6" width="30" height="5" rx="2" fill="#8A4828"/>
                {/* bulb glow */}
                <ellipse cx="35" cy="36" rx="8" ry="5" fill="#FFF8E1" opacity="0.5"/>
                {/* stem */}
                <rect x="32" y="41" width="6" height="28" rx="2" fill="#2C1F14"/>
                {/* base */}
                <ellipse cx="35" cy="70" rx="18" ry="6" fill="#2C1F14"/>
                <ellipse cx="35" cy="68" rx="14" ry="4" fill="#3E2A1A"/>
                {/* cord */}
                <path d="M35 69 Q28 78 25 84" stroke="#3E2A1A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>

            {/* -- COFFEE MUG (right-middle) -- */}
            <div style={{ position: "absolute", top: "200px", right: "30px", animation: "floatD 4s ease-in-out infinite 1.2s" }}>
              <svg width="60" height="62" viewBox="0 0 60 62" fill="none">
                {/* saucer */}
                <ellipse cx="28" cy="56" rx="24" ry="5" fill="#EDE0D4"/>
                <ellipse cx="28" cy="54" rx="18" ry="3" fill="#D8C8B0"/>
                {/* mug body */}
                <path d="M10 20 Q10 50 28 50 Q46 50 46 20 Z" fill="#FAF7F2"/>
                <rect x="10" y="18" width="36" height="6" rx="1" fill="#EDE0D4"/>
                {/* mug pattern */}
                <path d="M18 30 Q23 26 28 30 Q33 34 38 30" stroke="#736045" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                {/* handle */}
                <path d="M46 24 Q58 24 58 34 Q58 44 46 44" stroke="#D8C8B0" strokeWidth="4" fill="none" strokeLinecap="round"/>
                {/* steam */}
                <path d="M20 14 Q22 8 20 2" stroke="#D8C8B0" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7"/>
                <path d="M28 12 Q30 6 28 0" stroke="#D8C8B0" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7"/>
                <path d="M36 14 Q38 8 36 2" stroke="#D8C8B0" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7"/>
              </svg>
            </div>

            {/* -- VINTAGE GLASSES (bottom-left) -- */}
            <div style={{ position: "absolute", bottom: "50px", left: "55px", animation: "floatF 5s ease-in-out infinite 0.2s" }}>
              <svg width="78" height="36" viewBox="0 0 78 36" fill="none">
                {/* left arm */}
                <line x1="0" y1="10" x2="12" y2="12" stroke="#2C1F14" strokeWidth="3" strokeLinecap="round"/>
                {/* right arm */}
                <line x1="78" y1="10" x2="66" y2="12" stroke="#2C1F14" strokeWidth="3" strokeLinecap="round"/>
                {/* left lens */}
                <rect x="10" y="4" width="24" height="22" rx="11" fill="none" stroke="#736045" strokeWidth="2.5"/>
                <rect x="10" y="4" width="24" height="22" rx="11" fill="#736045" opacity="0.12"/>
                {/* right lens */}
                <rect x="44" y="4" width="24" height="22" rx="11" fill="none" stroke="#736045" strokeWidth="2.5"/>
                <rect x="44" y="4" width="24" height="22" rx="11" fill="#736045" opacity="0.12"/>
                {/* bridge */}
                <path d="M34 14 Q39 10 44 14" stroke="#2C1F14" strokeWidth="2" fill="none" strokeLinecap="round"/>
                {/* lens shine */}
                <ellipse cx="18" cy="12" rx="5" ry="3" fill="white" opacity="0.3" transform="rotate(-20 18 12)"/>
                <ellipse cx="52" cy="12" rx="5" ry="3" fill="white" opacity="0.3" transform="rotate(-20 52 12)"/>
              </svg>
            </div>

            {/* -- SMALL KEY (floating, top center) -- */}
            <div style={{ position: "absolute", top: "70px", left: "48%", animation: "floatA 3.8s ease-in-out infinite 1.5s" }}>
              <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                <circle cx="14" cy="14" r="11" fill="none" stroke="#736045" strokeWidth="3"/>
                <circle cx="14" cy="14" r="5" fill="#736045" opacity="0.3"/>
                <line x1="22" y1="22" x2="40" y2="38" stroke="#736045" strokeWidth="3" strokeLinecap="round"/>
                <line x1="32" y1="30" x2="32" y2="36" stroke="#736045" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="36" y1="34" x2="36" y2="38" stroke="#736045" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>

            {/* -- PRICE TAG (bottom-right) -- */}
            <div style={{ position: "absolute", bottom: "35px", right: "45px", animation: "floatB 6.5s ease-in-out infinite 0.7s" }}>
              <svg width="52" height="64" viewBox="0 0 52 64" fill="none">
                <path d="M4 8 L48 8 L48 54 L26 64 L4 54 Z" fill="#EDE0D4" stroke="#736045" strokeWidth="1.5"/>
                <circle cx="26" cy="8" r="4" fill="none" stroke="#736045" strokeWidth="1.5"/>
                <line x1="14" y1="24" x2="38" y2="24" stroke="#C8B098" strokeWidth="1"/>
                <line x1="14" y1="30" x2="34" y2="30" stroke="#C8B098" strokeWidth="1"/>
                <line x1="14" y1="36" x2="30" y2="36" stroke="#C8B098" strokeWidth="1"/>
                <text x="26" y="50" textAnchor="middle" fontSize="8" fontWeight="700" fill="#736045" fontFamily="sans-serif">? CU</text>
              </svg>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
