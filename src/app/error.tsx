"use client";

import { useEffect } from "react";
import Link from "next/link";
import { IconArrowUpRight, IconRefresh } from "@tabler/icons-react";
import { logger } from "@/infrastructure/monitoring/logger";

/**
 * Route-level error boundary. Next renders this in place of the page whenever a
 * render or data error escapes a segment below it, instead of leaving a blank
 * screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Unhandled route error", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-luxury-ivory px-4 py-20">
      <div className="w-full max-w-lg text-center">
        <div className="flex items-center justify-center gap-3">
          <span aria-hidden className="h-px w-8 bg-luxury-champagne/80" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-600">
            Đã có lỗi xảy ra
          </p>
          <span aria-hidden className="h-px w-8 bg-luxury-champagne/80" />
        </div>

        <h1
          style={{
            fontFamily: "var(--font-droid-serif), serif",
            fontWeight: 400,
            lineHeight: 1.1,
          }}
          className="mt-6 text-[clamp(1.75rem,4vw,2.5rem)] tracking-tight text-luxury-ink"
        >
          Trang này đang gặp trục trặc.
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-neutral-600">
          Lỗi đã được ghi nhận. Bạn có thể thử tải lại — nếu vẫn không được, hãy
          quay về trang chủ.
        </p>

        {error.digest ? (
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Mã lỗi · <span className="tabular-nums">{error.digest}</span>
          </p>
        ) : null}

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[2px] bg-luxury-ink px-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800 sm:w-auto"
          >
            <IconRefresh className="h-4 w-4" />
            Thử lại
          </button>

          <Link
            href="/"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-[2px] border border-luxury-ink/15 px-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-luxury-ink transition-all duration-300 hover:border-luxury-ink hover:bg-luxury-ink hover:text-luxury-ivory sm:w-auto"
          >
            Về trang chủ
            <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
