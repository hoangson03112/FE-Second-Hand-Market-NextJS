"use client";

import { usePayment } from "./hooks";
import {
  PaymentHeader,
  PaymentQrSection,
  PaymentOrderSummary,
  PaymentBankInfo,
  PaymentProofUpload,
  PaymentNotes,
  PaymentActions,
} from "./components";

export default function Payment() {
  const {
    orderId,
    order,
    isLoading,
    secondsLeft,
    formatCountdown,
    proofPreviewUrl,
    isConfirmingPayment,
    paymentError,
    paymentSuccess,
    bankInfo,
    bankInfoLoading,
    bankInfoError,
    displayBankInfo,
    qrCodeImageUrl,
    isExpired,
    handleCopy,
    handleConfirmPayment,
    setProofFile,
  } = usePayment();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        <PaymentHeader
          orderId={orderId}
          secondsLeft={secondsLeft}
          isExpired={isExpired}
          formatCountdown={formatCountdown}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
          <div className="lg:col-span-7 space-y-4 lg:space-y-5">
            <PaymentQrSection
              bankInfoLoading={bankInfoLoading}
              bankInfoError={bankInfoError}
              bankInfo={bankInfo}
              qrCodeImageUrl={qrCodeImageUrl}
            />
            <PaymentBankInfo
              bankInfoLoading={bankInfoLoading}
              bankInfoError={bankInfoError}
              displayBankInfo={displayBankInfo}
              onCopy={handleCopy}
            />
          </div>

          <div className="lg:col-span-5">
            <div className="space-y-4 lg:space-y-5 lg:sticky lg:top-6">
              <PaymentOrderSummary totalAmount={order.totalAmount} />
              <PaymentProofUpload
                proofPreviewUrl={proofPreviewUrl}
                isExpired={isExpired}
                isConfirmingPayment={isConfirmingPayment}
                paymentError={paymentError}
                paymentSuccess={paymentSuccess}  
                onFileChange={setProofFile}
              />
              <PaymentActions
                isExpired={isExpired}
                isConfirmingPayment={isConfirmingPayment}
                onConfirmPayment={handleConfirmPayment}
              />
              <PaymentNotes />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
