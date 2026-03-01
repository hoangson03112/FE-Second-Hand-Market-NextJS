"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PaymentMethod,
  OrderItems,
  CheckoutSummary,
  AddressSection,
  AddressModal,
  CheckoutHeader,
  CheckoutButton,
  TrustBadges,
  ShippingInfo,
} from "./components";
import { useAddress, useCheckout } from "@/hooks";
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
    orderItems,
    subtotal,
    total,
    shipping,
    shippingInfo,
    isCalculatingShipping,
    shippingError,
    paymentMethod,
    isSubmitting,
    shippingData,
    isBankTransferAvailable,
    setPaymentMethod,
    updateShippingFromAddress,
    handleCheckout,
  } = useCheckout();

  useEffect(() => {
    if (!isBankTransferAvailable && paymentMethod === "bank_transfer") {
      setPaymentMethod("cod");
    }
  }, [isBankTransferAvailable, paymentMethod, setPaymentMethod]);

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

        <div className="bg-white rounded-lg border border-gray-200 shadow-md p-5 mb-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-3 border-b border-gray-200">
            Địa Chỉ Nhận Hàng
          </h2>
          <AddressSection
            selectedAddress={selectedAddress}
            onChangeAddress={handleOpenModal}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-5">
              <h2 className="text-lg font-medium text-gray-900 mb-4 pb-3 border-b border-gray-200">
                Sản Phẩm ({orderItems.length})
              </h2>
              <OrderItems items={orderItems} />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-5">
              <h2 className="text-lg font-medium text-gray-900 mb-4 pb-3 border-b border-gray-200">
                Thông Tin Vận Chuyển
              </h2>
              <ShippingInfo
                shippingInfo={shippingInfo}
                isCalculating={isCalculatingShipping}
                error={shippingError}
              />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-5">
              <h2 className="text-lg font-medium text-gray-900 mb-4 pb-3 border-b border-gray-200">
                Phương Thức Thanh Toán
              </h2>
              <PaymentMethod selected={paymentMethod} onSelect={setPaymentMethod} showBankTransfer={isBankTransferAvailable} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 shadow-md">
                <CheckoutSummary subtotal={subtotal} shipping={shipping} discount={0} />
              </div>
              <CheckoutButton
                total={total}
                isSubmitting={isSubmitting}
                isDisabled={!shippingData}
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
