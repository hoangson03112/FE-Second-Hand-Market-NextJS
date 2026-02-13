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
      <div className="max-w-7xl mx-auto px-4">
        <PaymentHeader
          orderId={orderId}
          secondsLeft={secondsLeft}
          isExpired={isExpired}
          formatCountdown={formatCountdown}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <PaymentQrSection
              bankInfoLoading={bankInfoLoading}
              bankInfoError={bankInfoError}
              bankInfo={bankInfo}
              qrCodeImageUrl={qrCodeImageUrl}
            />
            <PaymentOrderSummary totalAmount={order.totalAmount} />
          </div>

          <div className="space-y-6">
            <PaymentBankInfo
              bankInfoLoading={bankInfoLoading}
              bankInfoError={bankInfoError}
              displayBankInfo={displayBankInfo}
              onCopy={handleCopy}
            />
            <PaymentProofUpload
              proofPreviewUrl={proofPreviewUrl}
              isExpired={isExpired}
              isConfirmingPayment={isConfirmingPayment}
              paymentError={paymentError}
              paymentSuccess={paymentSuccess}
              onFileChange={setProofFile}
            />
            <PaymentNotes />
            <PaymentActions
              isExpired={isExpired}
              isConfirmingPayment={isConfirmingPayment}
              onConfirmPayment={handleConfirmPayment}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
