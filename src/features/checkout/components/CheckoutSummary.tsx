"use client";

import { IconWallet, IconBuilding } from "@tabler/icons-react";
import { formatPrice } from "@/utils/format/price";
import type { SellerGroup } from "../hooks/useCheckout";
import type { PaymentMethodType } from "./PaymentMethod";

interface CheckoutSummaryProps {
  subtotal: number;
  shipping: number;
  discount?: number;
  sellerGroups?: SellerGroup[];
  paymentMethods?: Record<string, PaymentMethodType>;
}

const PAYMENT_LABEL: Record<PaymentMethodType, { label: string; icon: typeof IconWallet }> = {
  cod: { label: "COD", icon: IconWallet },
  bank_transfer: { label: "Chuyển khoản", icon: IconBuilding },
};

export default function CheckoutSummary({
  subtotal,
  shipping,
  discount = 0,
  sellerGroups = [],
  paymentMethods = {},
}: CheckoutSummaryProps) {
  const total = subtotal + shipping - discount;
  const isMultiSeller = sellerGroups.length > 1;
  const allLocalPickup = sellerGroups.length > 0 && sellerGroups.every((g) => g.isLocalPickup);

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-taupe-900 pb-4 border-b-2 border-border uppercase tracking-wider">
        Tổng Đơn Hàng
      </h3>

      {/* Per-seller breakdown when multi-seller */}
      {isMultiSeller && (
        <div className="space-y-4 py-4 border-b-2 border-border">
          {sellerGroups.map((group) => {
            const method = (paymentMethods[group.sellerId] ?? "cod") as PaymentMethodType;
            const { label, icon: Icon } = PAYMENT_LABEL[method];
            return (
              <div key={group.sellerId} className="space-y-2 pb-4 border-b border-border last:border-0 last:pb-0">
                <p className="font-semibold text-sm text-taupe-900 truncate mb-2">{group.sellerName}</p>
                <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wide text-taupe-500 items-center">
                  <span>Hàng ({group.items.length} sp)</span>
                  <span className="normal-case tracking-normal text-sm font-bold text-taupe-900">{formatPrice(group.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wide text-taupe-500 items-center">
                  <span>Vận chuyển</span>
                  <span className="normal-case tracking-normal text-sm font-bold text-taupe-900">{group.isLocalPickup ? "Miễn phí" : (group.shippingFee > 0 ? formatPrice(group.shippingFee) : "—")}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-taupe-500 mt-1">
                  <span>Thanh toán</span>
                  <span className="flex items-center gap-1.5 text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-4 py-5 border-b-2 border-border">
        <div className="flex justify-between items-center text-[11px] font-semibold uppercase tracking-wide text-taupe-500">
          <span>Tiền hàng</span>
          <span className="normal-case tracking-normal text-sm font-bold text-taupe-900">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center text-[11px] font-semibold uppercase tracking-wide text-taupe-500">
          <span>Phí vận chuyển</span>
          <span className="normal-case tracking-normal text-sm font-bold text-taupe-900">
            {allLocalPickup ? "Miễn phí" : (shipping === 0 ? "Đang tính..." : formatPrice(shipping))}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between items-center text-[11px] font-semibold uppercase tracking-wide text-taupe-500">
            <span>Giảm giá</span>
            <span className="normal-case tracking-normal text-sm font-bold text-red-600">-{formatPrice(discount)}</span>
          </div>
        )}
      </div>
      <div className="pt-4">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-taupe-900 mb-1">Tổng cộng</span>
          <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
        </div>
        {isMultiSeller && (
          <p className="text-[10px] font-semibold uppercase tracking-wide text-taupe-400 mt-2">
            Cho {sellerGroups.length} đơn hàng từ {sellerGroups.length} người bán
          </p>
        )}
      </div>
    </div>
  );
}