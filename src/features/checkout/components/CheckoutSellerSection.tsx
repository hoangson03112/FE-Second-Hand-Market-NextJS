"use client";

import Image from "next/image";
import { IconBuildingStore, IconPackage, IconTruck, IconClock } from "@tabler/icons-react";
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
}

export default function CheckoutSellerSection({
  group,
  paymentMethod,
  isBankTransferAvailable,
  onPaymentMethodChange,
}: CheckoutSellerSectionProps) {
  const { sellerId, sellerName, sellerAvatar, items, shippingInfo, subtotal, shippingFee } = group;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
      {/* Seller header */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-gray-50 border-b border-gray-200">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
          {sellerAvatar ? (
            <Image src={sellerAvatar} alt={sellerName} width={32} height={32} className="object-cover" />
          ) : (
            <IconBuildingStore className="w-4 h-4 text-primary" />
          )}
        </div>
        <span className="text-sm font-semibold text-gray-900">{sellerName}</span>
        <span className="ml-auto text-xs text-gray-500">{items.length} sản phẩm</span>
      </div>

      <div className="p-5 space-y-5">
        {/* Product list */}
        <div className="space-y-3">
          {items.map((item) => {
            const avatar = item.product.avatar?.url ?? "";
            const condition = formatCondition(item.product.condition);
            return (
              <div
                key={item.product._id}
                className="flex gap-3 p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition"
              >
                <div className="flex-shrink-0 w-18 h-18 w-[72px] h-[72px] rounded-lg overflow-hidden bg-gray-100 relative">
                  {avatar ? (
                    <Image src={avatar} alt={item.product.name} fill className="object-cover" sizes="72px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <IconPackage className="w-7 h-7 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 line-clamp-2 font-medium">{item.product.name}</p>
                  {condition && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                      {condition}
                    </span>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">×{item.quantity}</span>
                    <span className="text-sm font-semibold text-primary">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Shipping info for this seller */}
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <IconTruck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">
                GHN – {shippingInfo?.short_name ?? "Chuẩn"}
              </span>
              <span className="font-semibold text-gray-900">
                {shippingFee > 0 ? formatPrice(shippingFee) : "Đang tính..."}
              </span>
            </div>
            {shippingInfo?.expectedDeliveryTime && (
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <IconClock className="w-3 h-3" />
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

        {/* Payment method selector */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</p>
          <PaymentMethod
            selected={paymentMethod}
            onSelect={onPaymentMethodChange}
            showBankTransfer={isBankTransferAvailable}
            radioName={`payment-${sellerId}`}
          />
        </div>

        {/* Section subtotal */}
        <div className="pt-3 border-t border-gray-100 space-y-1.5">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tiền hàng</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Phí vận chuyển</span>
            <span>{shippingFee > 0 ? formatPrice(shippingFee) : "—"}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-gray-900">
            <span>Tổng đơn này</span>
            <span className="text-primary">{formatPrice(subtotal + shippingFee)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
