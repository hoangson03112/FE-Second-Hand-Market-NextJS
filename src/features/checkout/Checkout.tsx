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

  const showAddressSection = sellerGroups.some((g) => g.canCodShipping);

  return (
    <PageContainer withBackground={false}>
      <div className="min-h-screen bg-cream-50">
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
            <div className="bg-gradient-to-br from-cream-50 to-white rounded-2xl border-2 border-border p-6 mb-6 shadow-md">
              <h2 className="text-lg font-semibold text-taupe-900 mb-5 pb-4 border-b-2 border-border uppercase tracking-wider">
                Địa chỉ nhận hàng
              </h2>
              <AddressSection
                selectedAddress={selectedAddress}
                onChangeAddress={handleOpenModal}
              />
            </div>
          )}

          {/* Multi-seller notice */}
          {isMultiSeller && (
            <div className="flex items-start gap-4 p-5 mb-6 bg-primary/5 border-2 border-primary/20 rounded-xl">
              <IconInfoCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-primary/90">
                Bạn đang đặt hàng từ{" "}
                <strong>{sellerGroups.length} người bán</strong>. Mỗi đơn
                hàng sẽ được xử lý riêng biệt và có thể
                được giao vào các thời điểm khác nhau. Bạn có
                thể chọn phương thức thanh toán khác nhau cho từng
                đơn.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: seller sections */}
            <div className="lg:col-span-2 space-y-6">
              {sellerGroups.length === 0 ? (
                <div className="bg-gradient-to-br from-cream-50 to-white rounded-2xl border-2 border-border p-12 text-center text-taupe-600 text-sm shadow-md">
                  Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi
                  thanh toán.
                </div>
              ) : (
                sellerGroups.map((group) => (
                  <CheckoutSellerSection
                    key={group.sellerId}
                    group={group}
                    paymentMethod={getPaymentMethodForSeller(group.sellerId)}
                    isBankTransferAvailable={
                      isBankTransferAvailableBySeller[group.sellerId] ?? false
                    }
                    onPaymentMethodChange={(method) =>
                      setPaymentMethodForSeller(group.sellerId, method)
                    }
                    deliveryMethod={
                      deliveryMethodBySeller[group.sellerId] ??
                      (group.canCodShipping ? "cod_shipping" : "local_pickup")
                    }
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
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-xs uppercase tracking-wide font-semibold text-red-600">
                  {shippingError}
                </div>
              )}

              {!allLocalPickup && isCalculatingShipping && (
                <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-cream-50 to-white rounded-2xl border-2 border-border shadow-md">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary/30 border-t-primary" />
                  <span className="text-sm text-taupe-600">
                    Đang tính phí vận chuyển...
                  </span>
                </div>
              )}
            </div>

            {/* Right column: summary + checkout */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <div className="bg-gradient-to-br from-cream-50 to-white rounded-2xl border-2 border-border shadow-md">
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
                  isDisabled={
                    (!allLocalPickup && !shippingData) ||
                    sellerGroups.length === 0
                  }
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