"use client";

import Link from "next/link";
import { IconSearch, IconSparkles } from "@tabler/icons-react";

const SUGGESTIONS = ["Bàn ghế gỗ", "iPhone cũ", "Đồ vintage", "Xe đạp"];

export default function SearchEmpty() {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <div
        className="relative flex h-16 w-16 items-center justify-center border border-luxury-ink/10 bg-white"
        style={{ borderRadius: "2px" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-2 -top-2 h-8 w-8 opacity-25"
          style={{
            background:
              "radial-gradient(circle, var(--luxury-champagne) 0%, transparent 70%)",
          }}
        />
        <IconSearch className="h-6 w-6 text-taupe-400" strokeWidth={1.5} />
      </div>

      <h2
        style={{
          fontFamily: "var(--font-droid-serif), serif",
          fontWeight: 400,
        }}
        className="mt-6 text-xl text-luxury-ink"
      >
        Nhập từ khóa để tìm kiếm
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-500">
        Sử dụng ô tìm kiếm trên thanh menu để khám phá hàng ngàn sản phẩm
        second-hand chất lượng
      </p>

      <div className="mt-8 flex flex-col items-center gap-3">
        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-taupe-400">
          <IconSparkles
            className="h-3.5 w-3.5 text-luxury-champagne"
            strokeWidth={1.75}
          />
          Gợi ý tìm kiếm
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <Link
              key={s}
              href={`/search?q=${encodeURIComponent(s)}`}
              className="border border-luxury-ink/12 bg-cream-50 px-3.5 py-1.5 text-[12px] font-medium text-neutral-600 transition-all duration-300 hover:border-luxury-champagne hover:text-luxury-ink"
              style={{ borderRadius: "2px" }}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
