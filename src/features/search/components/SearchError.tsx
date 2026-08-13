"use client";

import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";

export default function SearchError() {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center border border-red-200 bg-red-50"
        style={{ borderRadius: "2px" }}
      >
        <IconAlertTriangle className="h-6 w-6 text-red-500" strokeWidth={1.5} />
      </div>

      <h3
        style={{ fontFamily: "var(--font-droid-serif), serif", fontWeight: 400 }}
        className="mt-6 text-xl text-luxury-ink"
      >
        Có lỗi xảy ra
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-500">
        Không thể tải kết quả tìm kiếm. Vui lòng kiểm tra kết nối và thử lại.
      </p>

      <button
        type="button"
        onClick={() => window.location.reload()}
        className="group mt-7 inline-flex items-center gap-2 bg-luxury-ink px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800"
        style={{ borderRadius: "2px" }}
      >
        <IconRefresh className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180" strokeWidth={1.75} />
        Thử lại
      </button>
    </div>
  );
}