import { IconCheck, IconExternalLink } from "@tabler/icons-react";
import { format } from "@/utils/format/date";
import { cn } from "@/lib/utils";
import { Eyebrow, InkSurface } from "@/features/order/components";

interface ProgressStep {
  key: string;
  shortLabel: string;
}

interface OrderStatusHeroProps {
  status: string;
  statusConfig: { label: string; color: string; icon: string; bgColor: string };
  statusDescription: Record<string, string>;
  /** When set (e.g. refund flow + Refund.status), overrides statusDescription[status]. */
  descriptionOverride?: string;
  progressSteps: readonly ProgressStep[];
  effectiveStepIdx: number;
  isTerminal: boolean;
  updatedAt: string;
  ghnOrderCode?: string | null;
  ghnReturnOrderCode?: string | null;
  ghnReturnTrackingUrl?: string | null;
}

const serif = { fontFamily: "var(--font-droid-serif), serif" };

function TrackingRow({
  label,
  code,
  href,
}: {
  label: string;
  code: string;
  href: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
        {label}
      </span>
      <span className="font-mono text-sm text-luxury-ink">{code}</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-1 text-2xs font-bold uppercase tracking-[0.2em] text-luxury-ink underline decoration-luxury-champagne underline-offset-4 transition-colors hover:text-accent"
      >
        Theo dõi
        <IconExternalLink className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

/**
 * The page's one focal point: status on the dark ink ground (the same treatment
 * as the checkout total), with the journey laid out beneath it on white.
 *
 * `statusConfig.icon` / `.bgColor` are deliberately unused — those carry the
 * saturated emoji palette of the admin tables, which does not belong here.
 */
export function OrderStatusHero({
  status,
  statusConfig,
  statusDescription,
  descriptionOverride,
  progressSteps,
  effectiveStepIdx,
  isTerminal,
  updatedAt,
  ghnOrderCode,
  ghnReturnOrderCode,
  ghnReturnTrackingUrl,
}: OrderStatusHeroProps) {
  const showGhnOrder =
    ghnOrderCode &&
    [
      "confirmed",
      "picked_up",
      "shipping",
      "out_for_delivery",
      "delivered",
    ].includes(status);
  const showGhnReturn =
    ghnReturnOrderCode &&
    ["refund", "returning", "return_shipping", "returned", "refunded"].includes(
      status,
    );

  return (
    <section className="overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white">
      <InkSurface className="px-5 py-7 sm:px-6 sm:py-8">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
          <div className="min-w-0 max-w-xl">
            <Eyebrow tone="dark">Trạng thái</Eyebrow>
            <h2
              style={serif}
              className="mt-4 text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] tracking-tight text-luxury-ivory"
            >
              {statusConfig.label}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-luxury-ivory/65">
              {descriptionOverride ??
                statusDescription[status] ??
                "Đang xử lý đơn hàng."}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-2xs font-bold uppercase tracking-[0.2em] text-luxury-champagne">
              Cập nhật
            </p>
            <p className="mt-1.5 text-xs text-luxury-ivory/60">
              {format(updatedAt)}
            </p>
          </div>
        </div>
      </InkSurface>

      {(showGhnOrder || showGhnReturn) && (
        <div className="space-y-2.5 border-b border-luxury-ink/10 bg-cream-50 px-5 py-4 sm:px-6">
          {showGhnOrder && (
            <TrackingRow
              label="Vận đơn GHN"
              code={ghnOrderCode}
              href={`https://tracking.ghn.dev/?order_code=${ghnOrderCode}`}
            />
          )}
          {showGhnReturn && (
            <TrackingRow
              label="Vận đơn hoàn trả"
              code={ghnReturnOrderCode}
              href={
                ghnReturnTrackingUrl?.trim() ||
                `https://tracking.ghn.dev/?order_code=${ghnReturnOrderCode}`
              }
            />
          )}
        </div>
      )}

      {!isTerminal && (
        <div className="px-5 py-6 sm:px-6">
          <Eyebrow>Tiến trình</Eyebrow>

          <ol className="mt-6 flex items-start overflow-x-auto pb-1">
            {progressSteps.map((step, i) => {
              const isDone = i < effectiveStepIdx;
              const isActive = i === effectiveStepIdx;
              const isReached = isDone || isActive;

              return (
                <li
                  key={step.key}
                  className="flex min-w-[76px] flex-1 items-start last:flex-none"
                >
                  <div className="flex w-[76px] shrink-0 flex-col items-center gap-2.5">
                    <span
                      aria-hidden
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-[2px] border transition-colors duration-500",
                        isActive &&
                          "border-luxury-ink bg-luxury-ink ring-2 ring-luxury-champagne/40 ring-offset-2 ring-offset-white",
                        isDone && "border-luxury-ink bg-luxury-ink",
                        !isReached && "border-luxury-ink/15 bg-white",
                      )}
                    >
                      {isDone ? (
                        <IconCheck
                          className="h-3.5 w-3.5 text-luxury-champagne"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            isActive ? "bg-luxury-champagne" : "bg-luxury-ink/20",
                          )}
                        />
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-center text-[10px] font-bold uppercase leading-tight tracking-[0.12em]",
                        isReached ? "text-luxury-ink" : "text-neutral-400",
                      )}
                    >
                      {step.shortLabel}
                    </span>
                  </div>

                  {i < progressSteps.length - 1 && (
                    <span
                      aria-hidden
                      className={cn(
                        "mt-3.5 h-px flex-1 transition-colors duration-500",
                        i < effectiveStepIdx
                          ? "bg-luxury-champagne"
                          : "bg-luxury-ink/10",
                      )}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </section>
  );
}
