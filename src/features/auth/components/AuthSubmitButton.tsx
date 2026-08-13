"use client";

import { IconArrowUpRight } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

interface AuthSubmitButtonProps {
  label: string;
  loadingLabel?: string;
  isLoading?: boolean;
  className?: string;
}

export default function AuthSubmitButton({
  label,
  loadingLabel = "Đang xử lý...",
  isLoading = false,
  className,
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={cn(
        "group relative flex w-full items-center justify-center rounded-[2px] bg-luxury-ink px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-luxury-ivory transition-all duration-300",
        "hover:scale-[1.01] disabled:opacity-70 disabled:hover:scale-100",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-0 bg-accent opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-15"
      />
      <span className="relative z-10 flex items-center gap-2.5">
        {isLoading ? loadingLabel : label}
        {isLoading ? null : (
          <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        )}
      </span>
    </button>
  );
}
