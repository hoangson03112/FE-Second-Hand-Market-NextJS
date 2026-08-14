"use client";

import { IconSearch } from "@tabler/icons-react";

interface SearchHeaderProps {
  query: string;
  total: number;
}

export default function SearchHeader({ query, total }: SearchHeaderProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-luxury-ink/8 bg-luxury-ivory/95 backdrop-blur-md">
      <div className="mx-auto w-full max-w-9xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-luxury-champagne/80" aria-hidden />
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.28em] text-neutral-600">
            <IconSearch
              className="h-3.5 w-3.5 text-luxury-champagne"
              strokeWidth={1.75}
            />
            Tìm kiếm
          </p>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-droid-serif), serif",
            fontWeight: 400,
          }}
          className="mt-3 text-[clamp(1.4rem,3vw,2rem)] leading-tight text-luxury-ink"
        >
          &ldquo;{query || "..."}&rdquo;
        </h1>

        {query && (
          <p className="mt-1.5 text-sm text-neutral-500">
            Tìm thấy{" "}
            <span className="font-bold text-luxury-ink">
              {total.toLocaleString("vi-VN")}
            </span>{" "}
            sản phẩm
          </p>
        )}
      </div>
    </div>
  );
}
