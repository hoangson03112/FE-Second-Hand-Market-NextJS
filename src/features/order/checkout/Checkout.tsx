"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconArrowUpRight, IconInfoCircle } from "@tabler/icons-react";
import {
  AddressSection,
  AddressModal,
  CheckoutHeader,
  CheckoutButton,
  CheckoutPanel,
  TrustBadges,
  CheckoutSummary,
  CheckoutSellerSection,
} from "./components";
import { useAddress } from "@/hooks";
import { useCheckout } from "./hooks/useCheckout";
import { PageContainer, Container } from "@/components/layout/Container";
import { useConfirm } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function Checkout() {
  const router = useRouter();
  const { confirm } = useConfirm();

  const {
    addresses,
    selectedAddress,
    showAddressModal,
    showNewAddressForm,
    handleSelectAddress,
    handleOpenModal,
    handleCloseModal,
    handleToggleNewAddressForm,
    handleCreateAddress,
    handleUpdateAddress,
    handleDeleteAddress,
  } = useAddress();

  const {
    sellerGroups,
    subtotal,
    total,
    shipping,
    allLocalPickup,
    isCalculatingShipping,
    shippingError,
    paymentMethods,
    setPaymentMethodForSeller,
    getPaymentMethodForSeller,
    setDeliveryMethodForSeller,
    isBankTransferAvailableBySeller,
    isSubmitting,
    shippingData,
    updateShippingFromAddress,
    handleCheckout,
  } = useCheckout();

  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsRevealed(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (selectedAddress) {
      updateShippingFromAddress(selectedAddress);
    }
  }, [selectedAddress, updateShippingFromAddress]);

  const handleBack = async () => {
    const confirmed = await confirm({
      title: "Rời khỏi trang thanh toán?",
      message:
        "Các thông tin bạn đã chọn sẽ được lưu lại. Bạn có chắc muốn quay lại?",
      confirmText: "Quay lại",
      cancelText: "Ở lại",
      variant: "warning",
    });

    if (confirmed) {
      router.back();
    }
  };

  const isMultiSeller = sellerGroups.length > 1;
  const isEmpty = sellerGroups.length === 0;

  const showAddressSection = sellerGroups.some((g) => g.canCodShipping);

  const itemCount = sellerGroups.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );

  const revealClass = cn(
    "transition-all duration-700 ease-out",
    isRevealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
  );
  const delay = (ms: number) => ({ transitionDelay: `${ms}ms` });

  return (
    <PageContainer
      withBackground={false}
      className="min-h-screen bg-luxury-ivory"
    >
      <CheckoutHeader
        isEmpty={isEmpty}
        onBack={handleBack}
        itemCount={itemCount}
        sellerCount={sellerGroups.length}
      />

      <AddressModal
        show={showAddressModal}
        onHide={handleCloseModal}
        addresses={addresses}
        selectedAddress={selectedAddress}
        onSelectAddress={handleSelectAddress}
        showNewAddressForm={showNewAddressForm}
        onToggleNewAddressForm={handleToggleNewAddressForm}
        onCreateAddress={handleCreateAddress}
        onUpdateAddress={handleUpdateAddress}
        onDeleteAddress={handleDeleteAddress}
      />

      <Container as="main" maxWidth="9xl" paddingX="md" paddingY="lg">
        {/* Delivery address */}
        {showAddressSection ? (
          <div style={delay(140)} className={cn(revealClass, "mb-6")}>
            <CheckoutPanel eyebrow="Giao đến" title="Địa chỉ nhận hàng">
              <AddressSection
                selectedAddress={selectedAddress}
                onChangeAddress={handleOpenModal}
              />
            </CheckoutPanel>
          </div>
        ) : null}

        {/* Multi-seller notice */}
        {isMultiSeller ? (
          <div
            style={delay(180)}
            className={cn(
              revealClass,
              "mb-6 flex items-start gap-4 rounded-[2px] border border-luxury-champagne/30 bg-cream-100/70 px-5 py-4",
            )}
          >
            <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0 text-luxury-champagne" />
            <p className="text-xs leading-relaxed text-neutral-700">
              Bạn đang đặt hàng từ{" "}
              <strong className="font-bold text-luxury-ink">
                {sellerGroups.length} người bán
              </strong>
              . Mỗi đơn được xử lý riêng biệt, có thể giao vào các thời điểm
              khác nhau, và bạn có thể chọn phương thức thanh toán riêng cho
              từng đơn.
            </p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Left column: seller sections */}
          <div className="space-y-6 lg:col-span-8">
            {isEmpty ? (
              <div
                style={delay(220)}
                className={cn(
                  revealClass,
                  "rounded-[2px] border border-dashed border-luxury-ink/15 bg-white px-6 py-20 text-center",
                )}
              >
                <h3
                  className="font-droid-serif text-xl text-luxury-ink"
                >
                  Chưa có gì để thanh toán
                </h3>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-neutral-600">
                  Giỏ hàng đang trống. Hãy chọn vài món trước khi quay lại bước
                  này.
                </p>
                <Link
                  href="/products"
                  className="group mt-8 inline-flex items-center gap-2 rounded-[2px] bg-luxury-ink px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800"
                >
                  Khám phá sản phẩm
                  <IconArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            ) : (
              sellerGroups.map((group, index) => (
                <div
                  key={group.sellerId}
                  style={delay(220 + index * 100)}
                  className={revealClass}
                >
                  <CheckoutSellerSection
                    group={group}
                    index={index}
                    totalGroups={sellerGroups.length}
                    paymentMethod={getPaymentMethodForSeller(group.sellerId)}
                    isBankTransferAvailable={
                      isBankTransferAvailableBySeller[group.sellerId] ?? false
                    }
                    onPaymentMethodChange={(method) =>
                      setPaymentMethodForSeller(group.sellerId, method)
                    }
                    // `group.isLocalPickup` is what the hook actually uses to
                    // price and create the order, so drive the toggle from it
                    // rather than re-deriving a fallback that can disagree.
                    deliveryMethod={
                      group.isLocalPickup ? "local_pickup" : "cod_shipping"
                    }
                    onDeliveryMethodChange={(method) => {
                      setDeliveryMethodForSeller(group.sellerId, method);
                      if (method === "local_pickup") {
                        setPaymentMethodForSeller(group.sellerId, "cod");
                      }
                    }}
                  />
                </div>
              ))
            )}

            {/* Global shipping error / loading */}
            {!allLocalPickup && shippingError ? (
              <div className="rounded-[2px] border border-blush-300 bg-blush-50 px-5 py-4 text-xs leading-relaxed text-blush-800">
                {shippingError}
              </div>
            ) : null}

            {!allLocalPickup && isCalculatingShipping ? (
              <div className="flex items-center gap-4 rounded-[2px] border border-luxury-ink/10 bg-white px-5 py-5">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border border-luxury-ink/20 border-t-luxury-ink" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-600">
                  Đang tính phí vận chuyển
                </span>
              </div>
            ) : null}
          </div>

          {/* Right column: summary + checkout */}
          <div className="lg:col-span-4">
            <div
              style={delay(300)}
              className={cn(revealClass, "space-y-5 lg:sticky lg:top-24")}
            >
              <CheckoutSummary
                sellerGroups={sellerGroups}
                subtotal={subtotal}
                shipping={shipping}
                paymentMethods={paymentMethods}
              />
              <CheckoutButton
                total={total}
                isSubmitting={isSubmitting}
                isDisabled={(!allLocalPickup && !shippingData) || isEmpty}
                onClick={handleCheckout}
              />
              <TrustBadges />
            </div>
          </div>
        </div>
      </Container>
    </PageContainer>
  );
}
