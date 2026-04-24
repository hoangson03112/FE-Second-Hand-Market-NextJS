"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getPageWindow(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 2) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const goto = (p: number) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    onPageChange(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages = getPageWindow(currentPage, totalPages);

  return (
    <nav
      role="navigation"
      aria-label="Phân trang"
      className={cn("flex items-center justify-center gap-2", className)}
    >
      <button
        onClick={() => goto(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Trang trước"
        className={cn(
          "inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border text-sm font-medium",
          "transition-all duration-150 select-none outline-none",
          "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1",
          currentPage === 1
            ? "border-border/50 bg-muted/40 text-muted-foreground/50 cursor-not-allowed pointer-events-none"
            : "border-border/70 bg-background text-foreground hover:bg-muted/60 hover:border-border hover:-translate-y-px hover:shadow-sm active:translate-y-0",
        )}
      >
        <IconChevronLeft className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden sm:inline">Trước</span>
      </button>

      <div className="inline-flex items-center gap-0.5 p-0.5 rounded-xl border border-border/60 bg-muted/30">
        {pages.map((p, i) => {
          if (p === "...") {
            return (
              <span
                key={`ellipsis-${i}`}
                className="w-8 h-7 inline-flex items-center justify-center text-xs text-muted-foreground/60 tracking-widest"
              >
                ···
              </span>
            );
          }

          const n = p as number;
          const isActive = n === currentPage;

          return (
            <button
              key={n}
              onClick={() => goto(n)}
              aria-label={`Trang ${n}`}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex items-center justify-center min-w-[30px] h-7 px-2 rounded-lg text-sm",
                "transition-all duration-150 select-none outline-none",
                "focus-visible:ring-2 focus-visible:ring-primary/30",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm cursor-default pointer-events-none"
                  : "text-muted-foreground font-medium hover:bg-background hover:text-foreground hover:shadow-xs cursor-pointer",
              )}
            >
              {n}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => goto(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Trang sau"
        className={cn(
          "inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border text-sm font-medium",
          "transition-all duration-150 select-none outline-none",
          "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1",
          currentPage === totalPages
            ? "border-border/50 bg-muted/40 text-muted-foreground/50 cursor-not-allowed pointer-events-none"
            : "border-border/70 bg-background text-foreground hover:bg-muted/60 hover:border-border hover:-translate-y-px hover:shadow-sm active:translate-y-0",
        )}
      >
        <span className="hidden sm:inline">Sau</span>
        <IconChevronRight className="w-3.5 h-3.5 shrink-0" />
      </button>
    </nav>
  );
}
