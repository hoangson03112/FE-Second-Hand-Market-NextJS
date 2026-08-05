"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconInfoCircle } from "@tabler/icons-react";
import {
  AddressSection,
  AddressModal,
  CheckoutHeader,
  CheckoutButton,
  TrustBadges,
  CheckoutSummary,
  CheckoutSellerSection,
} from "./components";
import { useAddress } from "@/hooks";
import { useCheckout } from "./hooks/useCheckout";
import { PageContainer, Container } from "@/components/layout/Container";
import { useConfirm } from "@/components/shared";

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
    deliveryMethodBySeller,
    isBankTransferAvailableBySeller,
    isSubmitting,
    shippingData,
    updateShippingFromAddress,
    handleCheckout,
  } = useCheckout();

  useEffect(() => {
    if (selectedAddress) {
      updateShippingFromAddress(selectedAddress);
    }
  }, [selectedAddress, updateShippingFromAddress]);

  const handleBack = async () => {
    const confirmed = await confirm({
      title: "Rá»i khá»i trang thanh toÃ¡n?",
      message: "CÃ¡c thÃ´ng tin báº¡n Ä‘Ã£ chá»n sáº½ Ä‘Æ°á»£c lÆ°u láº¡i. Báº¡n cÃ³ cháº¯c muá»‘n quay láº¡i?",
      confirmText: "Quay láº¡i",
      cancelText: "á»ž láº¡i",
      variant: "warning",
    });

    if (confirmed) {
      router.back();
    }
  };

  const isMultiSeller = sellerGroups.length > 1;

  // Hiá»‡n Ä‘á»‹a chá»‰ náº¿u cÃ³ báº¥t ká»³ seller nÃ o cÃ³ thá»ƒ ship COD (cÃ³ thá»ƒ cáº§n Ä‘á»‹a chá»‰ giao hÃ ng)
  const showAddressSection = sellerGroups.some((g) => g.canCodShipping);

  return (
    <PageContainer withBackground={false}>
      <div className="min-h-screen bg-luxury-ivory">
        <Container as="main" maxWidth="9xl" paddingX="md" paddingY="lg">
          <CheckoutHeader onBack={handleBack} />

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

          {/* Delivery address */}
          {showAddressSection && (
            <div className="bg-white rounded-[2px] border border-luxury-ink/10 p-6 mb-6">
              <h2 className="text-xl text-luxury-ink mb-5 pb-4 border-b border-luxury-ink/10" style={{ fontFamily: "var(--font-droid-serif), serif" }}>
                Äá»‹a Chá»‰ Nháº­n HÃ ng
              </h2>
              <AddressSection
                selectedAddress={selectedAddress}
                onChangeAddress={handleOpenModal}
              />
            </div>
          )}

          {/* Multi-seller notice */}
          {isMultiSeller && (
            <div className="flex items-start gap-4 p-5 mb-6 bg-taupe-50/50 border border-luxury-ink/10 rounded-[2px]">
              <IconInfoCircle className="w-5 h-5 text-luxury-ink flex-shrink-0 mt-0.5" />
              <p className="text-sm text-primary/90">
                Báº¡n Ä‘ang Ä‘áº·t hÃ ng tá»« <strong>{sellerGroups.length} ngÆ°á»i bÃ¡n</strong>. Má»—i Ä‘Æ¡n hÃ ng sáº½ Ä‘Æ°á»£c xá»­ lÃ½ riÃªng biá»‡t vÃ  cÃ³ thá»ƒ Ä‘Æ°á»£c giao vÃ o cÃ¡c thá»i Ä‘iá»ƒm khÃ¡c nhau. Báº¡n cÃ³ thá»ƒ chá»n phÆ°Æ¡ng thá»©c thanh toÃ¡n khÃ¡c nhau cho tá»«ng Ä‘Æ¡n.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: seller sections */}
            <div className="lg:col-span-2 space-y-6">
              {sellerGroups.length === 0 ? (
                <div className="bg-white rounded-[2px] border border-luxury-ink/10 p-12 text-center text-taupe-600 text-sm">
                  Giá» hÃ ng trá»‘ng. Vui lÃ²ng thÃªm sáº£n pháº©m trÆ°á»›c khi thanh toÃ¡n.
                </div>
              ) : (
                sellerGroups.map((group) => (
                  <CheckoutSellerSection
                    key={group.sellerId}
                    group={group}
                    paymentMethod={getPaymentMethodForSeller(group.sellerId)}
                    isBankTransferAvailable={isBankTransferAvailableBySeller[group.sellerId] ?? false}
                    onPaymentMethodChange={(method) =>
                      setPaymentMethodForSeller(group.sellerId, method)
                    }
                    deliveryMethod={deliveryMethodBySeller[group.sellerId] ?? (group.canCodShipping ? "cod_shipping" : "local_pickup")}
                    onDeliveryMethodChange={(method) => {
                      setDeliveryMethodForSeller(group.sellerId, method);
                      if (method === "local_pickup") {
                        setPaymentMethodForSeller(group.sellerId, "cod");
                      }
                    }}
                  />
                ))
              )}

              {/* Global shipping error / loading */}
              {!allLocalPickup && shippingError && (
                <div className="p-4 bg-blush-50/50 border border-blush-200 rounded-[2px] text-[11px] uppercase tracking-wide font-semibold text-blush-600">
                  {shippingError}
                </div>
              )}

              {!allLocalPickup && isCalculatingShipping && (
                <div className="flex items-center gap-4 p-5 bg-white rounded-[2px] border border-luxury-ink/10">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-luxury-ink/20 border-t-luxury-ink" />
                  <span className="text-sm text-gray-600">Äang tÃ­nh phÃ­ váº­n chuyá»ƒn...</span>
                </div>
              )}
            </div>

            {/* Right column: summary + checkout */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <div className="bg-white rounded-[2px] border border-luxury-ink/10">
                  <CheckoutSummary
                    sellerGroups={sellerGroups}
                    subtotal={subtotal}
                    shipping={shipping}
                    paymentMethods={paymentMethods}
                  />
                </div>
                <CheckoutButton
                  total={total}
                  isSubmitting={isSubmitting}
                  isDisabled={(!allLocalPickup && !shippingData) || sellerGroups.length === 0}
                  onClick={handleCheckout}
                />
                <TrustBadges />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </PageContainer>
  );
}
