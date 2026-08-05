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
    <div className="bg-white rounded-[2px] border border-luxury-ink/10 overflow-hidden">
      {/* Seller header */}
      <div className="flex items-center gap-4 px-6 py-4 bg-taupe-50/50 border-b border-luxury-ink/10">
        <AvatarOrInitials avatar={sellerAvatar} fullName={sellerName} size={32} className="flex-shrink-0" />
        <span className="text-sm font-semibold text-luxury-ink">{sellerName}</span>
        <span className="ml-auto text-[10px] uppercase tracking-[0.2em] font-semibold text-taupe-500">{items.length} sản phẩm</span>
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
                className="flex gap-4 p-4 border border-luxury-ink/10 rounded-[2px] hover:border-luxury-ink/30 transition-colors bg-white"
              >
                <div className="flex-shrink-0 w-[72px] h-[72px] rounded-[2px] border border-luxury-ink/10 overflow-hidden bg-taupe-50 relative">
                  {avatar ? (
                    <Image src={avatar} alt={item.product.name} fill className="object-cover" sizes="72px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <IconPackage className="w-7 h-7 text-taupe-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-luxury-ink line-clamp-2 font-medium">{item.product.name}</p>
                  {condition && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-taupe-50/50 border border-luxury-ink/10 text-luxury-ink text-[10px] uppercase tracking-wide font-semibold rounded-[2px]">
                      {condition}
                    </span>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[11px] font-semibold text-taupe-500">×{item.quantity}</span>
                    <span className="text-sm font-bold text-luxury-ink" style={{ fontFamily: "var(--font-droid-serif), serif" }}>
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
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-luxury-ink mb-3">Hình thức giao hàng</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onDeliveryMethodChange("local_pickup")}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-[2px] border text-[11px] uppercase tracking-[0.1em] font-semibold transition-all ${
                  deliveryMethod === "local_pickup"
                    ? "border-luxury-ink bg-luxury-ink text-white"
                    : "border-luxury-ink/20 text-taupe-500 hover:border-luxury-ink/50 hover:text-luxury-ink"
                }`}
              >
                <IconMapPin className="w-4 h-4" />
                Gặp mặt trực tiếp
              </button>
              <button
                type="button"
                onClick={() => onDeliveryMethodChange("cod_shipping")}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-[2px] border text-[11px] uppercase tracking-[0.1em] font-semibold transition-all ${
                  deliveryMethod === "cod_shipping"
                    ? "border-luxury-ink bg-luxury-ink text-white"
                    : "border-luxury-ink/20 text-taupe-500 hover:border-luxury-ink/50 hover:text-luxury-ink"
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
          <div className="flex items-start gap-3 p-4 bg-taupe-50/50 rounded-[2px] border border-luxury-ink/10">
            <IconMapPin className="w-5 h-5 text-luxury-ink flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <span className="text-luxury-ink font-semibold">Giao dịch trực tiếp</span>
              <p className="text-xs text-taupe-600 mt-1">
                Người bán và người mua tự thỏa thuận địa điểm gặp mặt
              </p>
            </div>
            <span className="font-bold text-luxury-ink text-sm" style={{ fontFamily: "var(--font-droid-serif), serif" }}>Miễn phí</span>
          </div>
        ) : (
          <div className="flex items-start gap-3 p-4 bg-taupe-50/50 rounded-[2px] border border-luxury-ink/10">
            <IconTruck className="w-5 h-5 text-luxury-ink flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-luxury-ink font-semibold">
                  GHN – {shippingInfo?.short_name ?? "Chuẩn"}
                </span>
                <span className="font-bold text-luxury-ink" style={{ fontFamily: "var(--font-droid-serif), serif" }}>
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
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-luxury-ink mb-3">Phương thức thanh toán</p>
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
            <div className="mt-3 flex items-start gap-3 p-3.5 rounded-[2px] bg-blush-50/50 border border-blush-200">
              <IconInfoCircle className="w-4 h-4 text-blush-600 shrink-0 mt-0.5" />
              <p className="text-[11px] uppercase tracking-wide font-semibold text-blush-800">{FEATURE_INFO.PAYMENT_COD_ONLY}</p>
            </div>
          )}
        </div>

        {/* Section subtotal */}
        <div className="pt-5 border-t border-luxury-ink/10 space-y-3">
          <div className="flex justify-between text-[11px] uppercase tracking-wide font-semibold text-taupe-600 items-center">
            <span>Tiền hàng</span>
            <span className="text-sm font-bold text-luxury-ink normal-case tracking-normal" style={{ fontFamily: "var(--font-droid-serif), serif" }}>{formatPrice(subtotal)}</span>
          </div>
          {!group.isLocalPickup && (
            <div className="flex justify-between text-[11px] uppercase tracking-wide font-semibold text-taupe-600 items-center">
              <span>Phí vận chuyển</span>
              <span className="text-sm font-bold text-luxury-ink normal-case tracking-normal" style={{ fontFamily: "var(--font-droid-serif), serif" }}>{shippingFee > 0 ? formatPrice(shippingFee) : "—"}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-luxury-ink">Tổng đơn này</span>
            <span className="text-lg font-bold text-luxury-ink" style={{ fontFamily: "var(--font-droid-serif), serif" }}>{formatPrice(subtotal + shippingFee)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

