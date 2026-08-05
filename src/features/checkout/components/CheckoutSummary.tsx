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
      <h3 className="text-xl text-luxury-ink pb-4 border-b border-luxury-ink/10" style={{ fontFamily: "var(--font-droid-serif), serif" }}>
        Tổng Đơn Hàng
      </h3>

      {/* Per-seller breakdown when multi-seller */}
      {isMultiSeller && (
        <div className="space-y-4 py-4 border-b border-luxury-ink/10">
          {sellerGroups.map((group) => {
            const method = (paymentMethods[group.sellerId] ?? "cod") as PaymentMethodType;
            const { label, icon: Icon } = PAYMENT_LABEL[method];
            return (
              <div key={group.sellerId} className="space-y-2 pb-4 border-b border-luxury-ink/5 last:border-0 last:pb-0">
                <p className="font-semibold text-sm text-luxury-ink truncate mb-2">{group.sellerName}</p>
                <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wide text-taupe-500 items-center">
                  <span>Hàng ({group.items.length} sp)</span>
                  <span className="normal-case tracking-normal text-sm font-bold text-luxury-ink" style={{ fontFamily: "var(--font-droid-serif), serif" }}>{formatPrice(group.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wide text-taupe-500 items-center">
                  <span>Vận chuyển</span>
                  <span className="normal-case tracking-normal text-sm font-bold text-luxury-ink" style={{ fontFamily: "var(--font-droid-serif), serif" }}>{group.isLocalPickup ? "Miễn phí" : (group.shippingFee > 0 ? formatPrice(group.shippingFee) : "—")}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-taupe-500 mt-1">
                  <span>Thanh toán</span>
                  <span className="flex items-center gap-1.5 text-luxury-ink bg-taupe-50 px-2 py-0.5 rounded-[2px] border border-luxury-ink/10">
                    <Icon className="w-3.5 h-3.5 text-taupe-400" />
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-4 py-5 border-b border-luxury-ink/10">
        <div className="flex justify-between items-center text-[11px] font-semibold uppercase tracking-wide text-taupe-500">
          <span>Tiền hàng</span>
          <span className="normal-case tracking-normal text-sm font-bold text-luxury-ink" style={{ fontFamily: "var(--font-droid-serif), serif" }}>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center text-[11px] font-semibold uppercase tracking-wide text-taupe-500">
          <span>Phí vận chuyển</span>
          <span className="normal-case tracking-normal text-sm font-bold text-luxury-ink" style={{ fontFamily: "var(--font-droid-serif), serif" }}>
            {allLocalPickup ? "Miễn phí" : (shipping === 0 ? "Đang tính..." : formatPrice(shipping))}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between items-center text-[11px] font-semibold uppercase tracking-wide text-taupe-500">
            <span>Giảm giá</span>
            <span className="normal-case tracking-normal text-sm font-bold text-blush-600" style={{ fontFamily: "var(--font-droid-serif), serif" }}>-{formatPrice(discount)}</span>
          </div>
        )}
      </div>
      <div className="pt-4">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-luxury-ink mb-1">Tổng cộng</span>
          <span className="text-2xl font-bold text-luxury-ink" style={{ fontFamily: "var(--font-droid-serif), serif" }}>{formatPrice(total)}</span>
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

