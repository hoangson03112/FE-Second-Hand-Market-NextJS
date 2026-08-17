"use client";

import { IconInfoCircle } from "@tabler/icons-react";
import Link from "next/link";
import { FEATURE_INFO } from "@/constants/messages";

interface SellerLimitInfoBoxProps {
  isSeller: boolean;
  productLimit: { totalProducts: number; limit: number } | null;
}

export function SellerLimitInfoBox({
  isSeller,
  productLimit,
}: SellerLimitInfoBoxProps) {
  return (
    <div className="mb-4 flex items-start gap-4 rounded-[2px] border border-luxury-champagne/30 bg-cream-100/70 px-5 py-4">
      <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0 text-luxury-champagne" />
      <div className="flex-1 min-w-0">
        <p className="text-xs leading-relaxed text-neutral-700">
          {isSeller
            ? FEATURE_INFO.SELLER_UNLIMITED
            : productLimit
              ? FEATURE_INFO.SELLER_LIMIT(
                  productLimit.totalProducts,
                  productLimit.limit,
                )
              : "Tài khoản thường giới hạn số sản phẩm đăng. Đăng ký Seller để đăng không giới hạn và nhận thanh toán qua ngân hàng."}
        </p>
        {!isSeller && (
          <Link
            href="/become-seller"
            className="mt-2 inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-luxury-ink transition-colors hover:text-taupe-700"
          >
            Đăng ký Seller →
          </Link>
        )}
      </div>
    </div>
  );
}
