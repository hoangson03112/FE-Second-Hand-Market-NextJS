"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Show first few pages
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show last few pages
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show pages around current
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={cn(
          "flex items-center justify-center w-11 h-11 border-2",
          "transition-all duration-200 font-black",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          currentPage === 1
            ? "bg-taupe-100 text-taupe-300 border-taupe-200"
            : "bg-cream-50 text-taupe-900 border-taupe-300 hover:bg-primary hover:text-cream-50 hover:border-primary"
        )}
        aria-label="Trang trước"
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={3} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-taupe-400 font-black text-[18px]"
              >
                •••
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              className={cn(
                "flex items-center justify-center min-w-[44px] h-11 px-3 border-2",
                "transition-all duration-200",
                "font-black text-[14px] tabular-nums",
                isActive
                  ? "bg-primary text-cream-50 border-primary"
                  : "bg-cream-50 text-taupe-900 border-taupe-300 hover:bg-primary hover:text-cream-50 hover:border-primary"
              )}
              aria-label={`Trang ${pageNum}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={cn(
          "flex items-center justify-center w-11 h-11 border-2",
          "transition-all duration-200 font-black",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          currentPage === totalPages
            ? "bg-taupe-100 text-taupe-300 border-taupe-200"
            : "bg-cream-50 text-taupe-900 border-taupe-300 hover:bg-primary hover:text-cream-50 hover:border-primary"
        )}
        aria-label="Trang sau"
      >
        <ChevronRight className="w-5 h-5" strokeWidth={3} />
      </button>
    </div>
  );
}

