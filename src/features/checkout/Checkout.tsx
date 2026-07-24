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
      <div className="min-h-screen bg-gray-50">
        <Container as="main" maxWidth="8xl" paddingX="md" paddingY="lg">
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

          {/* Delivery address - áº¨n khi toÃ n bá»™ sáº£n pháº©m giao dá»‹ch trá»±c tiáº¿p */}
          {showAddressSection && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-5 mb-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4 pb-3 border-b border-gray-200">
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
            <div className="flex items-start gap-3 p-4 mb-4 bg-primary/8 border border-primary/20 rounded-lg">
              <IconInfoCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-primary/90">
                Báº¡n Ä‘ang Ä‘áº·t hÃ ng tá»« <strong>{sellerGroups.length} ngÆ°á»i bÃ¡n</strong>. Má»—i Ä‘Æ¡n hÃ ng sáº½ Ä‘Æ°á»£c xá»­ lÃ½ riÃªng biá»‡t vÃ  cÃ³ thá»ƒ Ä‘Æ°á»£c giao vÃ o cÃ¡c thá»i Ä‘iá»ƒm khÃ¡c nhau. Báº¡n cÃ³ thá»ƒ chá»n phÆ°Æ¡ng thá»©c thanh toÃ¡n khÃ¡c nhau cho tá»«ng Ä‘Æ¡n.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left column: seller sections */}
            <div className="lg:col-span-2 space-y-4">
              {sellerGroups.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 shadow-md p-10 text-center text-gray-500">
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

              {/* Global shipping error / loading - chá»‰ hiá»‡n khi cÃ³ GHN */}
              {!allLocalPickup && shippingError && (
                <div className="p-4 bg-destructive/8 border border-destructive/20 rounded-lg text-sm text-destructive">
                  {shippingError}
                </div>
              )}

              {!allLocalPickup && isCalculatingShipping && (
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-md">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                  <span className="text-sm text-gray-600">Äang tÃ­nh phÃ­ váº­n chuyá»ƒn...</span>
                </div>
              )}
            </div>

            {/* Right column: summary + checkout */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 shadow-md">
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
