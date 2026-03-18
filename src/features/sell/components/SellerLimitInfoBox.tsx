"use client";

import { IconInfoCircle } from "@tabler/icons-react";
import Link from "next/link";
import { FEATURE_INFO } from "@/constants/messages";

interface SellerLimitInfoBoxProps {
  isSeller: boolean;
  productLimit: { totalProducts: number; limit: number } | null;
}

export function SellerLimitInfoBox({ isSeller, productLimit }: SellerLimitInfoBoxProps) {
  return (
    <div className="mb-4 p-4 rounded-xl border border-primary/20 bg-primary/8 flex items-start gap-3">
      <IconInfoCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-primary/90">
          {isSeller
            ? FEATURE_INFO.SELLER_UNLIMITED
            : productLimit
              ? FEATURE_INFO.SELLER_LIMIT(productLimit.totalProducts, productLimit.limit)
              : "Tài khoản thường giới hạn số sản phẩm đăng. Đăng ký Seller để đăng không giới hạn và nhận thanh toán qua ngân hàng."}
        </p>
        {!isSeller && (
          <Link
            href="/become-seller"
            className="inline-block mt-1.5 text-xs font-semibold text-primary hover:underline"
          >
            Đăng ký Seller →
          </Link>
        )}
      </div>
    </div>
  );
}
