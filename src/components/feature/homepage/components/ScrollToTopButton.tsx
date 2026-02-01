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
        "fixed bottom-8 right-8 w-12 h-12 rounded-full",
        "bg-gradient-primary text-white shadow-lg",
        "hover-lift transition-all duration-300 z-50",
        "flex items-center justify-center",
        "animate-bounce-in cursor-pointer"
      )}
      aria-label="Scroll to top"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}
