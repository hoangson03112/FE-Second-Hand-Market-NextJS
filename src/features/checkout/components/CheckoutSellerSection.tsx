"use client";

import Image from "next/image";
import { IconPackage, IconTruck, IconClock, IconMapPin, IconInfoCircle } from "@tabler/icons-react";
import { AvatarOrInitials } from "@/components/shared/AvatarOrInitials";
import { FEATURE_INFO } from "@/constants/messages";
import { formatPrice } from "@/utils/format/price";
import { formatCondition } from "@/utils/format";
import type { SellerGroup } from "../hooks/useCheckout";
import type { PaymentMethodType } from "./PaymentMethod";
import PaymentMethod from "./PaymentMethod";

interface CheckoutSellerSectionProps {
  group: SellerGroup;
  paymentMethod: PaymentMethodType;
  isBankTransferAvailable: boolean;
  onPaymentMethodChange: (method: PaymentMethodType) => void;
  deliveryMethod: "local_pickup" | "cod_shipping";
  onDeliveryMethodChange: (method: "local_pickup" | "cod_shipping") => void;
}

export default function CheckoutSellerSection({
  group,
  paymentMethod,
  isBankTransferAvailable,
  onPaymentMethodChange,
  deliveryMethod,
  onDeliveryMethodChange,
}: CheckoutSellerSectionProps) {
  const { sellerId, sellerName, sellerAvatar, items, shippingInfo, subtotal, shippingFee } = group;

  return (
    <div className="bg-gradient-to-br from-cream-50 to-white rounded-2xl border-2 border-border overflow-hidden shadow-md">
      {/* Seller header */}
      <div className="flex items-center gap-4 px-6 py-4 bg-taupe-50/60 border-b-2 border-border">
        <AvatarOrInitials avatar={sellerAvatar} fullName={sellerName} size={32} className="flex-shrink-0" />
        <span className="text-sm font-semibold text-taupe-900">{sellerName}</span>
        <span className="ml-auto text-[10px] uppercase tracking-wide font-semibold text-taupe-500">{items.length} sản phẩm</span>
      </div>

      <div className="p-6 space-y-6">
        {/* Product list */}
        <div className="space-y-4">
          {items.map((item) => {
            const avatar = item.product.avatar?.url ?? "";
            const condition = formatCondition(item.product.condition);
            return (
              <div
                key={item.product._id}
                className="flex gap-4 p-4 border border-border rounded-xl hover:border-primary/40 transition-colors bg-white"
              >
                <div className="flex-shrink-0 w-[72px] h-[72px] rounded-xl border border-border overflow-hidden bg-taupe-100 relative">
                  {avatar ? (
                    <Image src={avatar} alt={item.product.name} fill className="object-cover" sizes="72px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <IconPackage className="w-7 h-7 text-taupe-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-taupe-900 line-clamp-2 font-medium">{item.product.name}</p>
                  {condition && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-taupe-50 border border-border text-taupe-700 text-[10px] uppercase tracking-wide font-semibold rounded-full">
                      {condition}
                    </span>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-semibold text-taupe-500">×{item.quantity}</span>
                    <span className="text-sm font-bold text-primary">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Delivery method selector */}
        {group.hasBothOptions && (
          <div>
            <p className="text-xs uppercase tracking-wide font-semibold text-taupe-900 mb-3">Hình thức giao hàng</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onDeliveryMethodChange("local_pickup")}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-xs uppercase tracking-wide font-semibold transition-all ${
                  deliveryMethod === "local_pickup"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-taupe-500 hover:border-primary/40 hover:text-taupe-900"
                }`}
              >
                <IconMapPin className="w-4 h-4" />
                Gặp mặt trực tiếp
              </button>
              <button
                type="button"
                onClick={() => onDeliveryMethodChange("cod_shipping")}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 text-xs uppercase tracking-wide font-semibold transition-all ${
                  deliveryMethod === "cod_shipping"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-taupe-500 hover:border-primary/40 hover:text-taupe-900"
                }`}
              >
                <IconTruck className="w-4 h-4" />
                Giao hàng COD
              </button>
            </div>
          </div>
        )}

        {/* Shipping info for this seller */}
        {group.isLocalPickup ? (
          <div className="flex items-start gap-3 p-4 bg-taupe-50/60 rounded-xl border border-border">
            <IconMapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <span className="text-taupe-900 font-semibold">Giao dịch trực tiếp</span>
              <p className="text-xs text-taupe-600 mt-1">
                Người bán và người mua tự thỏa thuận địa điểm gặp mặt
              </p>
            </div>
            <span className="font-bold text-primary text-sm">Miễn phí</span>
          </div>
        ) : (
          <div className="flex items-start gap-3 p-4 bg-taupe-50/60 rounded-xl border border-border">
            <IconTruck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-taupe-900 font-semibold">
                  GHN – {shippingInfo?.short_name ?? "Chuẩn"}
                </span>
                <span className="font-bold text-primary">
                  {shippingFee > 0 ? formatPrice(shippingFee) : "Đang tính..."}
                </span>
              </div>
              {shippingInfo?.expectedDeliveryTime && (
                <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold uppercase tracking-wide text-taupe-500">
                  <IconClock className="w-3.5 h-3.5" />
                  <span>
                    Dự kiến:{" "}
                    {new Date(shippingInfo.expectedDeliveryTime).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment method selector */}
        <div>
          <p className="text-xs uppercase tracking-wide font-semibold text-taupe-900 mb-3">Phương thức thanh toán</p>
          <PaymentMethod
            selected={paymentMethod}
            onSelect={onPaymentMethodChange}
            showBankTransfer={isBankTransferAvailable && deliveryMethod !== "local_pickup"}
            radioName={`payment-${sellerId}`}
          />
          {deliveryMethod === "local_pickup" && (
            <p className="text-[11px] uppercase tracking-wide font-semibold text-taupe-500 mt-3">Gặp mặt trực tiếp — thanh toán khi nhận hàng</p>
          )}
          {!isBankTransferAvailable && deliveryMethod !== "local_pickup" && (
            <div className="mt-3 flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border-2 border-amber-200">
              <IconInfoCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] uppercase tracking-wide font-semibold text-amber-800">{FEATURE_INFO.PAYMENT_COD_ONLY}</p>
            </div>
          )}
        </div>

        {/* Section subtotal */}
        <div className="pt-5 border-t-2 border-border space-y-3">
          <div className="flex justify-between text-xs uppercase tracking-wide font-semibold text-taupe-600 items-center">
            <span>Tiền hàng</span>
            <span className="text-sm font-bold text-taupe-900 normal-case tracking-normal">{formatPrice(subtotal)}</span>
          </div>
          {!group.isLocalPickup && (
            <div className="flex justify-between text-xs uppercase tracking-wide font-semibold text-taupe-600 items-center">
              <span>Phí vận chuyển</span>
              <span className="text-sm font-bold text-taupe-900 normal-case tracking-normal">{shippingFee > 0 ? formatPrice(shippingFee) : "—"}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs uppercase tracking-wide font-semibold text-taupe-900">Tổng đơn này</span>
            <span className="text-lg font-bold text-primary">{formatPrice(subtotal + shippingFee)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}