"use client";

import Link from "next/link";

interface SellFormActionsProps {
  isEditMode: boolean;
  isLoading: boolean;
  canRequestReview: boolean;
}

export function SellFormActions({
  isEditMode,
  isLoading,
  canRequestReview,
}: SellFormActionsProps) {
  const getSubmitLabel = () => {
    if (isLoading) {
      return isEditMode
        ? canRequestReview
          ? "Đang lưu và yêu cầu duyệt lại..."
          : "Đang cập nhật..."
        : "Đang đăng...";
    }
    return isEditMode
      ? canRequestReview
        ? "Lưu và yêu cầu duyệt lại"
        : "Cập nhật sản phẩm"
      : "Đăng sản phẩm";
  };

  return (
    <div className="flex flex-col-reverse gap-3 border-t border-luxury-ink/10 pt-6 sm:flex-row sm:justify-end">
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex h-12 items-center justify-center rounded-[2px] bg-luxury-ink px-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {getSubmitLabel()}
      </button>
      <Link
        href={isEditMode ? "/my/listings" : "/"}
        className="inline-flex h-12 items-center justify-center rounded-[2px] border border-luxury-ink/15 px-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-luxury-ink transition-all duration-300 hover:border-luxury-ink hover:bg-luxury-ink hover:text-luxury-ivory"
      >
        Hủy
      </Link>
    </div>
  );
}
