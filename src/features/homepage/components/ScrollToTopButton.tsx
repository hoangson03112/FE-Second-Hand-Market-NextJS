"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ScrollToTopButtonProps {
  show: boolean;
  onClick: () => void;
}

export default function ScrollToTopButton({ show, onClick }: ScrollToTopButtonProps) {
  if (!show) return null;
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-8 right-8 w-12 h-12",
        "border-2 border-foreground bg-foreground text-background rounded-xl",
        "hover:bg-primary hover:border-primary transition-all duration-200 z-50",
        "flex items-center justify-center cursor-pointer"
      )}
      aria-label="Scroll to top"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}
