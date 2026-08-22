import * as React from "react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Spinner — inline, inherits the colour of its context                       */
/* -------------------------------------------------------------------------- */

type SpinnerSize = "sm" | "md" | "lg";

const spinnerSizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-9 w-9 border-[3px]",
};

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  label?: React.ReactNode;
}

export function Spinner({
  size = "md",
  label = "Đang tải...",
  className,
  ...props
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("inline-flex items-center gap-2 text-charcoal-500", className)}
      {...props}
    >
      <span
        aria-hidden
        // `border-current` so the ring follows the text colour of whatever
        // wraps it (dark buttons, tinted cards…) instead of a fixed token.
        className={cn(
          "inline-block animate-spin rounded-full border-current border-r-transparent",
          spinnerSizeClasses[size]
        )}
      />
      {label ? (
        <span className="text-sm">{label}</span>
      ) : (
        <span className="sr-only">Đang tải</span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* LoadingBlock — a card-sized placeholder inside an already-rendered page    */
/* -------------------------------------------------------------------------- */

interface LoadingBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  fullScreen?: boolean;
  text?: React.ReactNode;
  spinnerSize?: SpinnerSize;
}

export function LoadingBlock({
  fullScreen = false,
  text = "Đang tải dữ liệu...",
  spinnerSize = "lg",
  className,
  ...props
}: LoadingBlockProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-white p-6",
        fullScreen && "min-h-[50vh]",
        className
      )}
      {...props}
    >
      <Spinner size={spinnerSize} label={text} />
    </div>
  );
}

/** Backwards-compatible alias (`label` / `fullscreen` spelling). */
export function Loading({
  label,
  fullscreen,
  ...rest
}: Omit<LoadingBlockProps, "text"> & {
  label?: React.ReactNode;
  fullscreen?: boolean;
}) {
  return <LoadingBlock text={label} fullScreen={fullscreen} {...rest} />;
}

/* -------------------------------------------------------------------------- */
/* PageLoader — the route-level loader used by every `app/**\/loading.tsx`     */
/* -------------------------------------------------------------------------- */

export interface PageLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Small uppercase kicker above the headline. */
  eyebrow?: string;
  /** Serif headline — keep it one short sentence. */
  title?: string;
  /** Optional supporting line under the progress rule. */
  caption?: string;
  /** Fill the whole viewport instead of the content area (~70vh). */
  fullScreen?: boolean;
}

/**
 * Server-component safe (no hooks, no event handlers) so it can be rendered
 * straight from a `loading.tsx` Suspense boundary.
 */
export function PageLoader({
  eyebrow = "Đang tải",
  title = "Vui lòng chờ trong giây lát.",
  caption,
  fullScreen = false,
  className,
  ...props
}: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={cn(
        "flex w-full items-center justify-center bg-luxury-ivory px-4 py-20",
        fullScreen ? "min-h-screen" : "min-h-[70vh]",
        className
      )}
      {...props}
    >
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-3">
          <span aria-hidden className="h-px w-8 bg-luxury-champagne/80" />
          <p className="text-2xs font-semibold uppercase tracking-[0.2em] text-neutral-600">
            {eyebrow}
          </p>
          <span aria-hidden className="h-px w-8 bg-luxury-champagne/80" />
        </div>

        <p className="font-droid-serif mt-6 text-[clamp(1.35rem,3vw,1.85rem)] font-normal leading-tight tracking-tight text-luxury-ink">
          {title}
        </p>

        <div
          aria-hidden
          className="mx-auto mt-8 h-px w-44 overflow-hidden bg-luxury-ink/10"
        >
          <span className="animate-loading-sweep block h-px w-1/3 bg-luxury-ink" />
        </div>

        {caption ? (
          <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-neutral-600">
            {caption}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* LoadingState — loading / empty / data switch for client-side queries       */
/* -------------------------------------------------------------------------- */

interface LoadingStateProps<T> {
  loading: boolean;
  data?: T | null;
  isEmpty?: (data: T | null | undefined) => boolean;
  loadingFallback?: React.ReactNode;
  emptyFallback?: React.ReactNode;
  children: React.ReactNode | ((data: T) => React.ReactNode);
}

export function LoadingState<T>({
  loading,
  data,
  isEmpty,
  loadingFallback = <LoadingBlock />,
  emptyFallback = (
    <div className="rounded-[2px] border border-dashed border-luxury-ink/15 bg-white p-6 text-center text-sm text-charcoal-500">
      Chưa có dữ liệu để hiển thị
    </div>
  ),
  children,
}: LoadingStateProps<T>) {
  if (loading) return <>{loadingFallback}</>;

  const empty = isEmpty ? isEmpty(data) : !data;
  if (empty) return <>{emptyFallback}</>;

  if (typeof children === "function") {
    return <>{(children as (value: T) => React.ReactNode)(data as T)}</>;
  }

  return <>{children}</>;
}
