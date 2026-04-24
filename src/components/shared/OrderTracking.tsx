"use client";

import {
  IconClock,
  IconCopy,
  IconExternalLink,
  IconLoader2,
  IconMapPin,
  IconTruck,
} from "@tabler/icons-react";
import { useMemo } from "react";
import { useOrderTracking } from "@/hooks/useOrderQueries";
import { cn } from "@/lib/utils";

interface OrderTrackingProps {
  orderId: string;
  ghnOrderCode?: string;
}

export function OrderTracking({ orderId, ghnOrderCode }: OrderTrackingProps) {
  const trackingUrl = `https://tracking.ghn.dev/?order_code=${ghnOrderCode || ""}`;
  const { data: tracking, isLoading, isError, refetch, isFetching } = useOrderTracking(
    orderId,
    Boolean(orderId && ghnOrderCode)
  );

  const events = useMemo(() => {
    if (!ghnOrderCode) return [];
    const logs = tracking?.log ?? [];
    return logs.slice(0, 6);
  }, [ghnOrderCode, tracking?.log]);

  if (!ghnOrderCode) return null;

  const formatDateTime = (value?: string) => {
    if (!value) return "Chua co";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(d);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(ghnOrderCode);
    } catch {
      // Ignore copy failures silently.
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <header className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/20">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <IconTruck className="w-4.5 h-4.5 text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-foreground">Theo doi van don</h3>
          <p className="text-xs text-muted-foreground">
            Don #{orderId.slice(-8).toUpperCase()} - Ma GHN: {ghnOrderCode}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={copyCode}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            <IconCopy className="w-3.5 h-3.5" />
            Sao chep ma
          </button>
          <a
            href={trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/15 transition-colors"
          >
            Mo GHN
            <IconExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      <div className="p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-muted/20 px-3 py-2.5">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Trang thai
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {tracking?.status_text || "Dang dong bo"}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 px-3 py-2.5">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Cap nhat luc
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {formatDateTime(tracking?.updated_date)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 px-3 py-2.5">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Du kien giao
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {formatDateTime(tracking?.estimate_deliver_time)}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <div className="px-3 py-2.5 border-b border-border bg-muted/20 flex items-center justify-between">
            <p className="text-xs font-semibold text-foreground">Lich su van don</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              {isFetching ? (
                <>
                  <IconLoader2 className="w-3.5 h-3.5 animate-spin" />
                  Dang tai
                </>
              ) : (
                "Lam moi"
              )}
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto p-3">
            {isLoading ? (
              <div className="py-8 flex items-center justify-center text-muted-foreground">
                <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                Dang tai thong tin van don...
              </div>
            ) : isError ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Khong tai duoc chi tiet tracking.
                </p>
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  Mo trang GHN
                  <IconExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : events.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Chua co lich su van chuyen.
              </div>
            ) : (
              <ul className="space-y-3">
                {events.map((event, index) => (
                  <li key={`${event.time}-${event.status}-${index}`} className="flex gap-3">
                    <div className="pt-1">
                      <span
                        className={cn(
                          "block w-2.5 h-2.5 rounded-full",
                          index === 0 ? "bg-primary" : "bg-primary/35"
                        )}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {event.status_text || event.status}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <IconClock className="w-3.5 h-3.5" />
                          {formatDateTime(event.time)}
                        </span>
                        {event.location && (
                          <span className="inline-flex items-center gap-1">
                            <IconMapPin className="w-3.5 h-3.5" />
                            {event.location}
                          </span>
                        )}
                      </div>
                      {event.note && (
                        <p className="mt-1 text-xs text-muted-foreground">{event.note}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
