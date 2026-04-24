import * as React from "react";

import { cn } from "@/lib/utils";

type SpinnerSize = "sm" | "md" | "lg";

const spinnerSizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-9 w-9 border-[3px]",
};

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  label?: string;
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
      className={cn("inline-flex items-center gap-2 text-muted-foreground", className)}
      {...props}
    >
      <span
        className={cn(
          "inline-block animate-spin rounded-full border-primary border-r-transparent",
          spinnerSizeClasses[size]
        )}
      />
      <span className="text-sm">{label}</span>
    </div>
  );
}

interface LoadingBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  fullScreen?: boolean;
  text?: string;
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
        "flex w-full items-center justify-center rounded-xl border border-border bg-card p-6",
        fullScreen && "min-h-[50vh]",
        className
      )}
      {...props}
    >
      <Spinner size={spinnerSize} label={text} />
    </div>
  );
}

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
    <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
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
