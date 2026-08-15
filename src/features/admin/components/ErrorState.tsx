"use client";

import * as React from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";

import { EmptyState, type EmptyStateProps } from "./EmptyState";
import { Button } from "@/components/ui/button";

export interface ErrorStateProps
  extends Partial<Omit<EmptyStateProps, "title" | "action">> {
  title?: React.ReactNode;
  onRetry?: () => void;
  retryText?: string;
}

/**
 * ErrorState — {@link EmptyState} preset for error situations, with an optional
 * retry button.
 */
export function ErrorState({
  icon,
  title = "Đã có lỗi xảy ra",
  description = "Vui lòng thử lại sau.",
  onRetry,
  retryText = "Thử lại",
  ...props
}: ErrorStateProps) {
  return (
    <EmptyState
      icon={icon ?? <TriangleAlert className="text-destructive" />}
      title={title}
      description={description}
      action={
        onRetry ? (
          <Button
            variant="outline"
            onClick={onRetry}
          >
            <RotateCcw className="size-4 mr-2" />
            {retryText}
          </Button>
        ) : undefined
      }
      {...props}
    />
  );
}
