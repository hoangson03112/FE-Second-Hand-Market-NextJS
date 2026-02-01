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
import { useAddress, useCheckout } from "./hooks";

export default function Checkout() {
  const router = useRouter();

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
    setPaymentMethod,
    updateShippingFromAddress,
    handleCheckout,
  } = useCheckout();

  useEffect(() => {
    if (selectedAddress) {
      updateShippingFromAddress(selectedAddress);
    }
  }, [selectedAddress, updateShippingFromAddress]);

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <CheckoutHeader onBack={() => router.back()} />

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

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full" />
            Địa Chỉ Nhận Hàng
          </h2>
          <AddressSection
            selectedAddress={selectedAddress}
            onChangeAddress={handleOpenModal}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" />
                Sản Phẩm ({orderItems.length})
              </h2>
              <OrderItems items={orderItems} />
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" />
                Thông Tin Vận Chuyển
              </h2>
              <ShippingInfo
                shippingInfo={shippingInfo}
                isCalculating={isCalculatingShipping}
                error={shippingError}
              />
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" />
                Phương Thức Thanh Toán
              </h2>
              <PaymentMethod selected={paymentMethod} onSelect={setPaymentMethod} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-border">
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
      </main>
    </div>
  );
}
