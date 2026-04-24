"use client";

import React from "react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      style={{ background: "#FDFAF6" }}
      className="relative overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(243,232,220,0.42) 0%, rgba(253,250,246,0.2) 42%, rgba(232,216,198,0.34) 100%)",
        }}
      />

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

      <div className="relative z-10 mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
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
              position: "absolute", width: "340px", height: "340px", borderRadius: "50%",
              background: "radial-gradient(circle, #E8D5C2 0%, transparent 72%)",
              top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none",
            }} />

            {/* -- CAMERA (top-left) -- */}
            <div style={{ position: "absolute", top: "26px", left: "34px", animation: "floatA 5s ease-in-out infinite" }}>
              <svg width="80" height="68" viewBox="0 0 80 68" fill="none">
                {/* body */}
                <rect x="6" y="18" width="68" height="46" rx="7" fill="#24180F"/>
                {/* top bump / viewfinder area */}
                <rect x="18" y="10" width="20" height="12" rx="4" fill="#24180F"/>
                {/* flash */}
                <rect x="46" y="12" width="14" height="10" rx="3" fill="#5D4A38"/>
                {/* lens outer */}
                <circle cx="40" cy="41" r="16" fill="#14110E" stroke="#5D4A38" strokeWidth="2"/>
                {/* lens inner */}
                <circle cx="40" cy="41" r="10" fill="#2D2118"/>
                {/* lens shine */}
                <circle cx="35" cy="36" r="3" fill="white" opacity="0.25"/>
                {/* shutter button */}
                <circle cx="60" cy="20" r="4" fill="#5D4A38"/>
                {/* strap lug left */}
                <rect x="2" y="28" width="7" height="10" rx="2" fill="#5D4A38"/>
                {/* strap lug right */}
                <rect x="71" y="28" width="7" height="10" rx="2" fill="#5D4A38"/>
              </svg>
            </div>

            {/* -- VINYL RECORD (top-right) -- */}
            <div style={{ position: "absolute", top: "18px", right: "42px", animation: "floatB 6s ease-in-out infinite 0.8s" }}>
              <svg width="76" height="76" viewBox="0 0 76 76" fill="none">
                <g style={{ animation: "vinyl-spin 8s linear infinite", transformOrigin: "38px 38px" }}>
                  <circle cx="38" cy="38" r="36" fill="#14110E"/>
                  <circle cx="38" cy="38" r="28" fill="none" stroke="#261B14" strokeWidth="3"/>
                  <circle cx="38" cy="38" r="22" fill="none" stroke="#261B14" strokeWidth="2"/>
                  <circle cx="38" cy="38" r="16" fill="none" stroke="#261B14" strokeWidth="2"/>
                </g>
                {/* label (doesn't spin) */}
                <circle cx="38" cy="38" r="12" fill="#5D4A38"/>
                <circle cx="38" cy="38" r="3" fill="#14110E"/>
                <text x="38" y="35" textAnchor="middle" fontSize="4" fontWeight="700" fill="white" fontFamily="sans-serif">ECO</text>
                <text x="38" y="41" textAnchor="middle" fontSize="3.5" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">VINTAGE</text>
              </svg>
            </div>

            {/* -- STACK OF BOOKS (middle-left) -- */}
            <div style={{ position: "absolute", top: "162px", left: "12px", animation: "floatE 4.5s ease-in-out infinite 0.3s" }}>
              <svg width="72" height="58" viewBox="0 0 72 58" fill="none">
                {/* bottom book */}
                <rect x="4" y="40" width="64" height="14" rx="2" fill="#5D4A38"/>
                <rect x="4" y="40" width="6" height="14" rx="2" fill="#8A4B2E"/>
                <line x1="16" y1="43" x2="62" y2="43" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                {/* middle book */}
                <rect x="8" y="24" width="58" height="14" rx="2" fill="#E3D1BE"/>
                <rect x="8" y="24" width="5" height="14" rx="2" fill="#BAA487"/>
                <line x1="18" y1="27" x2="60" y2="27" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
                {/* top book */}
                <rect x="12" y="8" width="52" height="14" rx="2" fill="#24180F"/>
                <rect x="12" y="8" width="5" height="14" rx="2" fill="#120B06"/>
                <line x1="22" y1="11" x2="58" y2="11" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              </svg>
            </div>

            {/* -- VINTAGE TABLE LAMP (center-ish) -- */}
            <div style={{ position: "absolute", top: "106px", left: "51%", transform: "translateX(-36%)", animation: "floatC 5.5s ease-in-out infinite 0.5s" }}>
              <svg width="70" height="90" viewBox="0 0 70 90" fill="none">
                {/* shade */}
                <path d="M10 38 L22 8 L48 8 L60 38 Z" fill="#5D4A38"/>
                <path d="M10 38 L22 8 L22 12 L12 38 Z" fill="#8A4B2E"/>
                {/* shade rim bottom */}
                <rect x="8" y="36" width="54" height="5" rx="2" fill="#723C22"/>
                {/* shade rim top */}
                <rect x="20" y="6" width="30" height="5" rx="2" fill="#723C22"/>
                {/* bulb glow */}
                <ellipse cx="35" cy="36" rx="8" ry="5" fill="#FFF8E1" opacity="0.5"/>
                {/* stem */}
                <rect x="32" y="41" width="6" height="28" rx="2" fill="#24180F"/>
                {/* base */}
                <ellipse cx="35" cy="70" rx="18" ry="6" fill="#24180F"/>
                <ellipse cx="35" cy="68" rx="14" ry="4" fill="#322214"/>
                {/* cord */}
                <path d="M35 69 Q28 78 25 84" stroke="#322214" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>

            {/* -- COFFEE MUG (right-middle) -- */}
            <div style={{ position: "absolute", top: "198px", right: "18px", animation: "floatD 4s ease-in-out infinite 1.2s" }}>
              <svg width="60" height="62" viewBox="0 0 60 62" fill="none">
                {/* saucer */}
                <ellipse cx="28" cy="56" rx="24" ry="5" fill="#E3D1BE"/>
                <ellipse cx="28" cy="54" rx="18" ry="3" fill="#CBB296"/>
                {/* mug body */}
                <path d="M10 20 Q10 50 28 50 Q46 50 46 20 Z" fill="#F1E7DC"/>
                <rect x="10" y="18" width="36" height="6" rx="1" fill="#E3D1BE"/>
                {/* mug pattern */}
                <path d="M18 30 Q23 26 28 30 Q33 34 38 30" stroke="#5D4A38" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                {/* handle */}
                <path d="M46 24 Q58 24 58 34 Q58 44 46 44" stroke="#CBB296" strokeWidth="4" fill="none" strokeLinecap="round"/>
                {/* steam */}
                <path d="M20 14 Q22 8 20 2" stroke="#CBB296" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.75"/>
                <path d="M28 12 Q30 6 28 0" stroke="#CBB296" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.75"/>
                <path d="M36 14 Q38 8 36 2" stroke="#CBB296" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.75"/>
              </svg>
            </div>

            {/* -- VINTAGE GLASSES (bottom-left) -- */}
            <div style={{ position: "absolute", bottom: "42px", left: "48px", animation: "floatF 5s ease-in-out infinite 0.2s" }}>
              <svg width="78" height="36" viewBox="0 0 78 36" fill="none">
                {/* left arm */}
                <line x1="0" y1="10" x2="12" y2="12" stroke="#24180F" strokeWidth="3" strokeLinecap="round"/>
                {/* right arm */}
                <line x1="78" y1="10" x2="66" y2="12" stroke="#24180F" strokeWidth="3" strokeLinecap="round"/>
                {/* left lens */}
                <rect x="10" y="4" width="24" height="22" rx="11" fill="none" stroke="#5D4A38" strokeWidth="2.5"/>
                <rect x="10" y="4" width="24" height="22" rx="11" fill="#5D4A38" opacity="0.16"/>
                {/* right lens */}
                <rect x="44" y="4" width="24" height="22" rx="11" fill="none" stroke="#5D4A38" strokeWidth="2.5"/>
                <rect x="44" y="4" width="24" height="22" rx="11" fill="#5D4A38" opacity="0.16"/>
                {/* bridge */}
                <path d="M34 14 Q39 10 44 14" stroke="#24180F" strokeWidth="2" fill="none" strokeLinecap="round"/>
                {/* lens shine */}
                <ellipse cx="18" cy="12" rx="5" ry="3" fill="white" opacity="0.3" transform="rotate(-20 18 12)"/>
                <ellipse cx="52" cy="12" rx="5" ry="3" fill="white" opacity="0.3" transform="rotate(-20 52 12)"/>
              </svg>
            </div>

            {/* -- BACKPACK (floating, top center) -- */}
            <div style={{ position: "absolute", top: "64px", left: "45%", animation: "floatA 3.8s ease-in-out infinite 1.5s" }}>
              <svg width="58" height="58" viewBox="0 0 58 58" fill="none">
                {/* handle */}
                <path d="M22 14 Q29 6 36 14" stroke="#24180F" strokeWidth="3" strokeLinecap="round" fill="none"/>
                {/* body */}
                <rect x="12" y="16" width="34" height="34" rx="10" fill="#5D4A38"/>
                {/* top flap */}
                <rect x="14" y="20" width="30" height="10" rx="5" fill="#705843"/>
                {/* pocket */}
                <rect x="19" y="33" width="20" height="12" rx="4" fill="#4E3E30"/>
                {/* zipper line */}
                <line x1="19" y1="29" x2="39" y2="29" stroke="#CDB8A2" strokeWidth="1.4" strokeLinecap="round"/>
                {/* straps */}
                <rect x="9" y="20" width="4" height="24" rx="2" fill="#24180F" opacity="0.8"/>
                <rect x="45" y="20" width="4" height="24" rx="2" fill="#24180F" opacity="0.8"/>
                {/* buckle */}
                <rect x="27" y="36" width="4" height="6" rx="1.5" fill="#CDB8A2"/>
              </svg>
            </div>

            {/* -- DESK FAN (household item) -- */}
            <div style={{ position: "absolute", bottom: "126px", right: "104px", animation: "floatE 5.4s ease-in-out infinite 1.1s" }}>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                {/* stand */}
                <rect x="34" y="46" width="4" height="10" rx="2" fill="#5A4939"/>
                <ellipse cx="36" cy="61" rx="16" ry="4" fill="#CDB8A2"/>
                {/* grill */}
                <circle cx="36" cy="30" r="20" fill="#EBDED0" stroke="#5A4939" strokeWidth="2"/>
                <circle cx="36" cy="30" r="14" fill="none" stroke="#5A4939" strokeWidth="1.5"/>
                <line x1="16" y1="30" x2="56" y2="30" stroke="#5A4939" strokeWidth="1.2"/>
                <line x1="36" y1="10" x2="36" y2="50" stroke="#5A4939" strokeWidth="1.2"/>
                {/* blades */}
                <path d="M36 30 L42 22 Q46 26 42 30 Z" fill="#705843"/>
                <path d="M36 30 L30 22 Q26 26 30 30 Z" fill="#705843"/>
                <path d="M36 30 L42 38 Q38 42 36 36 Z" fill="#705843"/>
                <circle cx="36" cy="30" r="3.5" fill="#24180F"/>
              </svg>
            </div>

            {/* -- POTTED PLANT (household item) -- */}
            <div style={{ position: "absolute", bottom: "18px", left: "176px", animation: "floatC 4.8s ease-in-out infinite 0.9s" }}>
              <svg width="54" height="64" viewBox="0 0 54 64" fill="none">
                {/* pot */}
                <path d="M12 34 H42 L38 54 H16 Z" fill="#8E603F"/>
                <rect x="10" y="30" width="34" height="6" rx="2" fill="#744C33"/>
                {/* leaves */}
                <ellipse cx="20" cy="22" rx="6" ry="11" fill="#6E8D58" transform="rotate(-22 20 22)"/>
                <ellipse cx="34" cy="21" rx="6" ry="11" fill="#62804E" transform="rotate(22 34 21)"/>
                <ellipse cx="27" cy="16" rx="5" ry="10" fill="#79995F"/>
                <path d="M27 30 V20" stroke="#4D663E" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>

   

          </div>

        </div>
      </div>
    </section>
  );
}
