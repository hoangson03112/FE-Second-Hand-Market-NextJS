"use client";

import { IconBuildingStore, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

interface SellFormHeaderProps {
  isEditMode: boolean;
  showBecomeSellerLink: boolean;
}

export function SellFormHeader({ isEditMode, showBecomeSellerLink }: SellFormHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
          {isEditMode ? "Cập nhật sản phẩm" : "Đăng sản phẩm"}
        </h1>
        <p className="text-muted-foreground text-xs mt-0.5">
          {isEditMode
            ? "Cập nhật thông tin sản phẩm của bạn"
            : "Điền thông tin để sản phẩm dễ được tìm thấy"}
        </p>
      </div>
      {showBecomeSellerLink && (
        <Link
          href="/become-seller"
          className="flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10 hover:border-primary transition-colors shrink-0"
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
