"use client";

import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export default function SearchError() {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <div
        className="rounded-[2px] flex h-16 w-16 items-center justify-center border border-blush-200 bg-blush-50"
      >
        <IconAlertTriangle className="h-6 w-6 text-blush-600" strokeWidth={1.5} />
      </div>

      <h3
        className={cn("font-droid-serif mt-6 text-xl text-luxury-ink", "font-normal")}
      >
        Có lỗi xảy ra
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-500">
        Không thể tải kết quả tìm kiếm. Vui lòng kiểm tra kết nối và thử lại.
      </p>

      <button
        type="button"
        onClick={() => window.location.reload()}
        className="rounded-[2px] group mt-7 inline-flex items-center gap-2 bg-luxury-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800"
      >
        <IconRefresh
          className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180"
          strokeWidth={1.75}
        />
        Thử lại
      </button>
    </div>
  );
}
