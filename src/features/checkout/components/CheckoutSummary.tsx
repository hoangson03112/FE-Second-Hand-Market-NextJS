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
    <div className="p-5 space-y-3">
      <h3 className="text-lg font-medium text-gray-900 pb-3 border-b border-gray-200">
        Tổng Đơn Hàng
      </h3>

      {/* Per-seller breakdown when multi-seller */}
      {isMultiSeller && (
        <div className="space-y-3 py-2 border-b border-gray-200">
          {sellerGroups.map((group) => {
            const method = (paymentMethods[group.sellerId] ?? "cod") as PaymentMethodType;
            const { label, icon: Icon } = PAYMENT_LABEL[method];
            return (
              <div key={group.sellerId} className="text-xs space-y-1 pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                <p className="font-medium text-gray-700 truncate">{group.sellerName}</p>
                <div className="flex justify-between text-gray-500">
                  <span>Hàng ({group.items.length} sp)</span>
                  <span>{formatPrice(group.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Vận chuyển</span>
                  <span>{group.isLocalPickup ? "Miễn phí" : (group.shippingFee > 0 ? formatPrice(group.shippingFee) : "—")}</span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span>Thanh toán</span>
                  <span className="flex items-center gap-1">
                    <Icon className="w-3 h-3" />
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-2.5 py-3 border-b border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tiền hàng</span>
          <span className="text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="text-gray-900">
            {allLocalPickup ? "Miễn phí" : (shipping === 0 ? "Đang tính..." : formatPrice(shipping))}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Giảm giá</span>
            <span className="text-primary font-medium">-{formatPrice(discount)}</span>
          </div>
        )}
      </div>
      <div className="pt-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900">Tổng cộng</span>
          <span className="text-xl font-medium text-primary">{formatPrice(total)}</span>
        </div>
        {isMultiSeller && (
          <p className="text-xs text-gray-400 mt-1">
            Cho {sellerGroups.length} đơn hàng từ {sellerGroups.length} người bán
          </p>
        )}
      </div>
    </div>
  );
}

