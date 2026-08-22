"use client";

import Image from "next/image";
import {
  IconPackage,
  IconTruck,
  IconClock,
  IconMapPin,
  IconInfoCircle,
  IconWallet,
} from "@tabler/icons-react";
import { AvatarOrInitials } from "@/components/ui/AvatarOrInitials";
import { FEATURE_INFO } from "@/constants/messages";
import { cn } from "@/lib/utils";
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
  /** Zero-based position, shown as an editorial "01 / 03" marker. */
  index?: number;
  totalGroups?: number;
}

const twoDigits = (value: number) => String(value).padStart(2, "0");

function MoneyRow({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span
        className={cn(
          "text-xs font-medium uppercase tracking-[0.15em]",
          emphasis ? "text-luxury-ink" : "text-neutral-500",
        )}
      >
        {label}
      </span>
      <span

        className={cn(
"font-droid-serif",
          "tabular-nums text-luxury-ink",
          emphasis ? "text-xl" : "text-sm",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function DeliveryOption({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof IconTruck;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center justify-center gap-2 rounded-[2px] border px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] transition-all duration-300",
        active
          ? "border-luxury-ink bg-luxury-ink text-luxury-ivory"
          : "border-luxury-ink/15 text-neutral-500 hover:border-luxury-ink/40 hover:text-luxury-ink",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

export default function CheckoutSellerSection({
  group,
  paymentMethod,
  isBankTransferAvailable,
  onPaymentMethodChange,
  deliveryMethod,
  onDeliveryMethodChange,
  index,
  totalGroups,
}: CheckoutSellerSectionProps) {
  const {
    sellerId,
    sellerName,
    sellerAvatar,
    items,
    shippingInfo,
    subtotal,
    shippingFee,
  } = group;

  const showMarker = index !== undefined && totalGroups !== undefined;

  return (
    <section className="overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white">
      {/* Seller header */}
      <header className="flex items-center gap-4 border-b border-luxury-ink/10 bg-cream-50/70 px-5 py-4 sm:px-6">
        <AvatarOrInitials
          avatar={sellerAvatar}
          fullName={sellerName}
          size={32}
          className="shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-luxury-ink">
            {sellerName}
          </p>
          <p className="mt-0.5 text-2xs font-medium uppercase tracking-[0.15em] text-neutral-500">
            {items.length} sản phẩm
          </p>
        </div>
        {showMarker ? (
          <span

            className="font-droid-serif shrink-0 text-sm italic text-luxury-ink/30"
          >
            {twoDigits(index + 1)} / {twoDigits(totalGroups)}
          </span>
        ) : null}
      </header>

      <div className="px-5 sm:px-6">
        {/* Product list */}
        <div className="divide-y divide-luxury-ink/8">
          {items.map((item) => {
            const avatar = item.product.avatar?.url ?? "";
            const condition = formatCondition(item.product.condition);
            return (
              <div key={item.product._id} className="flex gap-4 py-5">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-taupe-50">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <IconPackage className="h-6 w-6 text-taupe-300" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium leading-relaxed text-luxury-ink">
                    {item.product.name}
                  </p>
                  {condition ? (
                    <span className="mt-2 inline-block rounded-[2px] border border-luxury-ink/10 bg-cream-50 px-2 py-0.5 text-2xs font-bold uppercase text-neutral-600">
                      {condition}
                    </span>
                  ) : null}
                  <div className="mt-3 flex items-baseline justify-between gap-4">
                    <span className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
                      Số lượng: {item.quantity} sản phẩm
                    </span>
                    <span

                      className="font-droid-serif tabular-nums text-base text-luxury-ink"
                    >
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Delivery method selector */}
        {group.hasBothOptions ? (
          <div className="border-t border-luxury-ink/8 py-6">
            <p className="text-2xs font-medium uppercase tracking-[0.15em] text-charcoal-800">
              Hình thức giao hàng
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DeliveryOption
                active={deliveryMethod === "local_pickup"}
                onClick={() => onDeliveryMethodChange("local_pickup")}
                icon={IconMapPin}
                label="Gặp mặt trực tiếp"
              />
              <DeliveryOption
                active={deliveryMethod === "cod_shipping"}
                onClick={() => onDeliveryMethodChange("cod_shipping")}
                icon={IconTruck}
                label="Giao hàng COD"
              />
            </div>
          </div>
        ) : null}

        {/* Shipping info for this seller */}
        <div
          className={cn(
            "py-6",
            !group.hasBothOptions && "border-t border-luxury-ink/8",
          )}
        >
          {group.isLocalPickup ? (
            <div className="flex items-start gap-4 rounded-[2px] border border-luxury-ink/10 bg-cream-50/60 px-4 py-4">
              <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-luxury-ink">
                  Giao dịch trực tiếp
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
                  Người bán và người mua tự thỏa thuận địa điểm gặp mặt.
                </p>
              </div>
              <span className="shrink-0 text-2xs font-bold uppercase tracking-[0.15em] text-charcoal-700">
                Miễn phí
              </span>
            </div>
          ) : (
            <div className="flex items-start gap-4 rounded-[2px] border border-luxury-ink/10 bg-cream-50/60 px-4 py-4">
              <IconTruck className="mt-0.5 h-4 w-4 shrink-0 text-luxury-ink" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-luxury-ink">
                    GHN — {shippingInfo?.short_name ?? "Chuẩn"}
                  </p>
                  <span

                    className="font-droid-serif tabular-nums text-sm text-luxury-ink"
                  >
                    {shippingFee > 0 ? formatPrice(shippingFee) : "Đang tính…"}
                  </span>
                </div>
                {shippingInfo?.expectedDeliveryTime ? (
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.15em] text-neutral-700">
                    <IconClock className="h-3.5 w-3.5" />
                    <span>
                      Dự kiến{" "}
                      {new Date(
                        shippingInfo.expectedDeliveryTime,
                      ).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Payment method — only a real choice when the order ships.
            Gặp mặt trực tiếp always settles in cash at the handover, so we
            state it instead of rendering a single-option radio group. */}
        <div className="border-t border-luxury-ink/8 py-6">
          <p className="text-2xs font-medium uppercase tracking-[0.15em] text-charcoal-800">
            {group.isLocalPickup ? "Thanh toán" : "Phương thức thanh toán"}
          </p>

          {group.isLocalPickup ? (
            <div className="mt-4 flex items-start gap-4 rounded-[2px] border border-luxury-ink/10 bg-cream-50/60 px-4 py-4">
              <IconWallet className="mt-0.5 h-4 w-4 shrink-0 text-luxury-ink" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-luxury-ink">
                  Thanh toán khi gặp mặt
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
                  Bạn trả tiền trực tiếp cho người bán lúc nhận hàng.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-4">
                <PaymentMethod
                  selected={paymentMethod}
                  onSelect={onPaymentMethodChange}
                  showBankTransfer={isBankTransferAvailable}
                  radioName={`payment-${sellerId}`}
                />
              </div>

              {!isBankTransferAvailable ? (
                <div className="mt-4 flex items-start gap-3 rounded-[2px] border border-luxury-champagne/30 bg-cream-100/70 px-4 py-3.5">
                  <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0 text-luxury-champagne" />
                  <p className="text-xs leading-relaxed text-neutral-700">
                    {FEATURE_INFO.PAYMENT_COD_ONLY}
                  </p>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* Section subtotal */}
      <div className="space-y-3.5 border-t border-luxury-ink/10 bg-cream-50/70 px-5 py-5 sm:px-6">
        <MoneyRow label="Tiền hàng" value={formatPrice(subtotal)} />
        {!group.isLocalPickup ? (
          <MoneyRow
            label="Phí vận chuyển"
            value={shippingFee > 0 ? formatPrice(shippingFee) : "—"}
          />
        ) : null}
        <div className="border-t border-luxury-ink/10 pt-3.5">
          <MoneyRow
            label="Tổng đơn này"
            value={formatPrice(subtotal + shippingFee)}
            emphasis
          />
        </div>
      </div>
    </section>
  );
}
