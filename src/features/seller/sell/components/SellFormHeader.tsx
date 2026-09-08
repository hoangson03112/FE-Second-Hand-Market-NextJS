"use client";

import {
  IconBuildingStore,
  IconArrowRight,
  IconChevronRight,
} from "@tabler/icons-react";
import Link from "next/link";

interface SellFormHeaderProps {
  isEditMode: boolean;
  showBecomeSellerLink: boolean;
}

export function SellFormHeader({
  isEditMode,
  showBecomeSellerLink,
}: SellFormHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-luxury-ink/6 pb-6">
      <div className="max-w-2xl">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-charcoal-400"
        >
          <Link href="/" className="transition-colors hover:text-luxury-ink">
            Trang chủ
          </Link>
          <IconChevronRight className="h-3 w-3 text-taupe-300" />
          <Link
            href="/my/listings"
            className="transition-colors hover:text-luxury-ink"
          >
            Sản phẩm của tôi
          </Link>
          <IconChevronRight className="h-3 w-3 text-taupe-300" />
          <span className="text-luxury-ink">
            {isEditMode ? "Cập nhật sản phẩm" : "Đăng sản phẩm"}
          </span>
        </nav>
        <div className="flex items-center gap-3">
          <span aria-hidden className="h-px w-8 bg-luxury-champagne/80" />
          <p className="text-2xs font-semibold uppercase tracking-[0.24em] text-neutral-600">
            {isEditMode ? "Chỉnh sửa tin đăng" : "Tin đăng mới"}
          </p>
        </div>
        <h1
          className="font-droid-serif mt-3 text-[clamp(1.5rem,3vw,2rem)] font-normal tracking-tight text-luxury-ink"
        >
          {isEditMode ? "Cập nhật sản phẩm" : "Đăng sản phẩm"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          {isEditMode
            ? "Cập nhật thông tin sản phẩm của bạn"
            : "Điền thông tin để sản phẩm dễ được tìm thấy"}
        </p>
      </div>
      {showBecomeSellerLink && (
        <Link
          href="/become-seller"
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[2px] border border-luxury-ink/15 px-5 text-2xs font-semibold uppercase tracking-[0.15em] text-luxury-ink transition-all duration-300 hover:border-luxury-ink hover:bg-luxury-ink hover:text-luxury-ivory"
        >
          <IconBuildingStore className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Đăng ký làm Seller</span>
          <span className="sm:hidden">Làm Seller</span>
          <IconArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}
