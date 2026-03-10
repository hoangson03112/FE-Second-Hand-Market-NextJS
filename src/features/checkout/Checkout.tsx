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
import { useConfirm } from "@/components/ui/ConfirmDialog";

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
    isCalculatingShipping,
    shippingError,
    paymentMethods,
    setPaymentMethodForSeller,
    getPaymentMethodForSeller,
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
      message: "Các thông tin bạn đã chọn sẽ được lưu lại. Bạn có chắc muốn quay lại?",
      confirmText: "Quay lại",
      cancelText: "Ở lại",
      variant: "warning",
    });

    if (confirmed) {
      router.back();
    }
  };

  const isMultiSeller = sellerGroups.length > 1;
  const totalItems = sellerGroups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <PageContainer withBackground={false}>
      <div className="min-h-screen bg-gray-50">
        <Container as="main" maxWidth="7xl" paddingX="md" paddingY="lg">
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
          <div className="bg-white rounded-lg border border-gray-200 shadow-md p-5 mb-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4 pb-3 border-b border-gray-200">
              Địa Chỉ Nhận Hàng
            </h2>
            <AddressSection
              selectedAddress={selectedAddress}
              onChangeAddress={handleOpenModal}
            />
          </div>

          {/* Multi-seller notice */}
          {isMultiSeller && (
            <div className="flex items-start gap-3 p-4 mb-4 bg-primary/8 border border-primary/20 rounded-lg">
              <IconInfoCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-primary/90">
                Bạn đang đặt hàng từ <strong>{sellerGroups.length} người bán</strong>. Mỗi đơn hàng sẽ được xử lý riêng biệt và có thể được giao vào các thời điểm khác nhau. Bạn có thể chọn phương thức thanh toán khác nhau cho từng đơn.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left column: seller sections */}
            <div className="lg:col-span-2 space-y-4">
              {sellerGroups.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 shadow-md p-10 text-center text-gray-500">
                  Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.
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
                  />
                ))
              )}

              {/* Global shipping error */}
              {shippingError && (
                <div className="p-4 bg-destructive/8 border border-destructive/20 rounded-lg text-sm text-destructive">
                  {shippingError}
                </div>
              )}

              {isCalculatingShipping && (
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-md">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                  <span className="text-sm text-gray-600">Đang tính phí vận chuyển...</span>
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
                  isDisabled={!shippingData || sellerGroups.length === 0}
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
