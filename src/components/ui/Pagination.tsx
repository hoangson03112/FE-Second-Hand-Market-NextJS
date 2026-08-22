"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  /**
   * "default" — dashboard/admin (bo tròn, token shadcn).
   * "luxury"  — storefront editorial: góc 2px, ivory/ink/champagne, số serif.
   */
  variant?: "default" | "luxury";
}

function getPageWindow(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 2) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}

/** Vùng cuộn thật của app là #main-scroll-container, không phải window. */
function scrollToTop() {
  const container = document.getElementById("main-scroll-container");
  if (container) {
    container.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  variant = "default",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const goto = (p: number) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    onPageChange(p);
    scrollToTop();
  };

  const pages = getPageWindow(currentPage, totalPages);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  if (variant === "luxury") {
    const pad = (n: number) => String(n).padStart(2, "0");

    /* Nút Trước/Sau — dạng chữ editorial, gạch chân hairline khi hover */
    const arrowClass = (disabled: boolean) =>
      cn(
        "group inline-flex items-center gap-2 py-1 text-xs font-bold uppercase tracking-[0.15em]",
        "outline-none transition-colors duration-300 ease-out",
        "focus-visible:text-luxury-ink",
        disabled
          ? "pointer-events-none text-luxury-ink/20"
          : "text-neutral-600 hover:text-luxury-ink",
      );

    return (
      <nav
        role="navigation"
        aria-label="Phân trang"
        className={cn(
          "flex items-center justify-center gap-4 sm:gap-7",
          className,
        )}
      >
        <button
          onClick={() => goto(currentPage - 1)}
          disabled={isFirst}
          aria-label="Trang trước"
          className={arrowClass(isFirst)}
        >
          <IconChevronLeft
            className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-x-1"
            strokeWidth={1.75}
          />
          <span className="hidden sm:inline">Trước</span>
        </button>

        <div className="flex items-center gap-1">
          {pages.map((p, i) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${i}`}
                  aria-hidden
                  className="inline-flex h-9 w-6 items-center justify-center text-xs tracking-[0.15em] text-luxury-ink/25"
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
                  "font-droid-serif inline-flex h-9 min-w-9 items-center justify-center border px-2 text-sm leading-none",
                  "outline-none transition-all duration-300 ease-out",
                  "focus-visible:border-luxury-champagne",
                  isActive
                    ? "pointer-events-none cursor-default border-luxury-ink bg-luxury-ink text-cream-50"
                    : "border-transparent text-neutral-500 hover:border-luxury-champagne/60 hover:bg-cream-50 hover:text-luxury-ink",
                )}
                style={{ borderRadius: "2px" }}
              >
                {pad(n)}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => goto(currentPage + 1)}
          disabled={isLast}
          aria-label="Trang sau"
          className={arrowClass(isLast)}
        >
          <span className="hidden sm:inline">Sau</span>
          <IconChevronRight
            className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1"
            strokeWidth={1.75}
          />
        </button>
      </nav>
    );
  }

  return (
    <nav
      role="navigation"
      aria-label="Phân trang"
      className={cn("flex items-center justify-center gap-2", className)}
    >
      <button
        onClick={() => goto(currentPage - 1)}
        disabled={isFirst}
        aria-label="Trang trước"
        className={cn(
          "inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border text-sm font-medium",
          "transition-all duration-150 select-none outline-none",
          "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1",
          isFirst
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
                  ? "bg-primary text-primary-foreground font-bold shadow-sm cursor-default pointer-events-none"
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
        disabled={isLast}
        aria-label="Trang sau"
        className={cn(
          "inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border text-sm font-medium",
          "transition-all duration-150 select-none outline-none",
          "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1",
          isLast
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
