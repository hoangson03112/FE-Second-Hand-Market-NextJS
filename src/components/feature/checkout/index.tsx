"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PaymentMethod from "./PaymentMethod";
import OrderItems from "./OrderItems";
import CheckoutSummary from "./CheckoutSummary";
import AddressSection from "./AddressSection";
import AddressModal from "./AddressModal";
import CheckoutHeader from "./CheckoutHeader";
import CheckoutButton from "./CheckoutButton";
import TrustBadges from "./TrustBadges";
import ShippingInfo from "./ShippingInfo";
import { useAddress } from "@/hooks/useAddress";
import { useCheckout } from "@/hooks/useCheckout";

export default function CheckOutPage() {
  const router = useRouter();

  // Address management
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

  // Checkout flow management
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

        {/* Address Modal */}
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

        {/* Address Section - Top Priority */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Địa Chỉ Nhận Hàng
          </h2>
          <AddressSection
            selectedAddress={selectedAddress}
            onChangeAddress={handleOpenModal}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Products & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Sản Phẩm ({orderItems.length})
              </h2>
              <OrderItems items={orderItems} />
            </div>

            {/* Shipping Info */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Thông Tin Vận Chuyển
              </h2>
              <ShippingInfo
                shippingInfo={shippingInfo}
                isCalculating={isCalculatingShipping}
                error={shippingError}
              />
            </div>

            {/* Payment Method */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Phương Thức Thanh Toán
              </h2>
              <PaymentMethod selected={paymentMethod} onSelect={setPaymentMethod} />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Summary */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-border">
                <CheckoutSummary subtotal={subtotal} shipping={shipping} discount={0} />
              </div>

              {/* Checkout Button */}
              <CheckoutButton
                total={total}
                isSubmitting={isSubmitting}
                isDisabled={!shippingData}
                onClick={handleCheckout}
              />

              {/* Trust Badges */}
              <TrustBadges />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
