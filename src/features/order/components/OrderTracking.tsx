"use client";

import {
  IconArrowUpRight,
  IconClock,
  IconCopy,
  IconLoader2,
  IconMapPin,
} from "@tabler/icons-react";
import { useMemo } from "react";
import { useOrderTracking } from "@/hooks/useOrderQueries";
import { cn } from "@/lib/utils";
import { Panel } from "./Panel";
import { microCaps } from "./editorialStyles";

interface OrderTrackingProps {
  orderId: string;
  ghnOrderCode?: string;
}

function formatDateTime(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2px] border border-luxury-ink/10 bg-cream-50/60 px-3.5 py-3">
      <p className={cn(microCaps, "text-neutral-500")}>{label}</p>
      <p className="mt-1.5 text-xs leading-snug text-luxury-ink">{value}</p>
    </div>
  );
}

export function OrderTracking({ orderId, ghnOrderCode }: OrderTrackingProps) {
  const trackingUrl = `https://tracking.ghn.dev/?order_code=${ghnOrderCode || ""}`;
  const {
    data: tracking,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useOrderTracking(orderId, Boolean(orderId && ghnOrderCode));

  const events = useMemo(() => {
    if (!ghnOrderCode) return [];
    return (tracking?.log ?? []).slice(0, 6);
  }, [ghnOrderCode, tracking?.log]);

  if (!ghnOrderCode) return null;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(ghnOrderCode);
    } catch {
      /* Clipboard is unavailable (insecure context) — the code is on screen. */
    }
  };

  return (
    <Panel
      eyebrow="Vận đơn GHN"
      title={ghnOrderCode}
      aside={
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={copyCode}
            aria-label="Sao chép mã vận đơn"
            title="Sao chép mã vận đơn"
            className="rounded-[2px] border border-luxury-ink/12 p-2 text-luxury-ink/50 transition-colors duration-300 hover:border-luxury-ink/30 hover:text-luxury-ink"
          >
            <IconCopy className="h-3.5 w-3.5" />
          </button>
          <a
            href={trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ink transition-colors hover:text-taupe-700"
          >
            Mở GHN
            <IconArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <MetaCell
          label="Trạng thái"
          value={tracking?.status_text || "Đang đồng bộ"}
        />
        <MetaCell
          label="Cập nhật lúc"
          value={formatDateTime(tracking?.updated_date)}
        />
        <MetaCell
          label="Dự kiến giao"
          value={formatDateTime(tracking?.estimate_deliver_time)}
        />
      </div>

      <div className="mt-5 border-t border-luxury-ink/8 pt-5">
        <div className="flex items-center justify-between gap-4">
          <p className={cn(microCaps, "text-neutral-500")}>Lịch sử vận đơn</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ink transition-colors hover:text-taupe-700"
          >
            {isFetching ? (
              <>
                <IconLoader2 className="h-3 w-3 animate-spin" />
                Đang tải
              </>
            ) : (
              "Làm mới"
            )}
          </button>
        </div>

        <div className="mt-4 max-h-72 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 py-10">
              <span className="h-4 w-4 animate-spin rounded-full border border-luxury-ink/20 border-t-luxury-ink" />
              <p className={cn(microCaps, "text-neutral-500")}>
                Đang tải vận đơn
              </p>
            </div>
          ) : isError ? (
            <div className="py-10 text-center">
              <p className="text-sm leading-relaxed text-neutral-600">
                Không tải được chi tiết vận đơn.
              </p>
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-3 inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ink transition-colors hover:text-taupe-700"
              >
                Mở trang GHN
                <IconArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          ) : events.length === 0 ? (
            <p className="py-10 text-center text-sm text-neutral-600">
              Chưa có lịch sử vận chuyển.
            </p>
          ) : (
            <ol>
              {events.map((event, index) => {
                const isLast = index === events.length - 1;
                const isLatest = index === 0;

                return (
                  <li
                    key={`${event.time}-${event.status}-${index}`}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <span
                        aria-hidden
                        className={cn(
                          "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                          isLatest ? "bg-luxury-champagne" : "bg-luxury-ink/25",
                        )}
                      />
                      {!isLast ? (
                        <span
                          aria-hidden
                          className="w-px flex-1 bg-luxury-ink/10"
                        />
                      ) : null}
                    </div>

                    <div className={cn("min-w-0", isLast ? "pb-0" : "pb-5")}>
                      <p
                        className={cn(
                          "text-xs leading-snug",
                          isLatest
                            ? "font-medium text-luxury-ink"
                            : "text-neutral-600",
                        )}
                      >
                        {event.status_text || event.status}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-2xs text-neutral-500">
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <IconClock className="h-3 w-3" />
                          {formatDateTime(event.time)}
                        </span>
                        {event.location ? (
                          <span className="inline-flex min-w-0 items-center gap-1">
                            <IconMapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </span>
                        ) : null}
                      </div>
                      {event.note ? (
                        <p className="mt-1.5 text-2xs leading-relaxed text-neutral-500">
                          {event.note}
                        </p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>
    </Panel>
  );
}
