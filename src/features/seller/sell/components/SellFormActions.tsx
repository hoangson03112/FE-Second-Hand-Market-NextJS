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
    <div className="flex flex-col sm:flex-row gap-2 pt-2">
      <button
        type="submit"
        disabled={isLoading}
        className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-bold text-sm tracking-wide hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
      >
        {getSubmitLabel()}
      </button>
      <Link
        href={isEditMode ? "/my/listings" : "/"}
        className="flex-1 text-center h-11 rounded-xl flex items-center justify-center border-2 border-taupe-300/80 text-taupe-700 text-sm font-semibold hover:bg-taupe-50 hover:border-taupe-500/70 transition-all duration-200"
      >
        Hủy
      </Link>
    </div>
  );
}