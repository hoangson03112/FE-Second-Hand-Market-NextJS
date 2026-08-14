"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Container, PageContainer } from "@/components/layout/Container";
import { cn } from "@/lib/utils";
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
    loadError,
    secondsLeft,
    formatCountdown,
    proofFile,
    proofPreviewUrl,
    isConfirmingPayment,
    paymentError,
    paymentSuccess,
    copiedField,
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

  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    const frame = window.requestAnimationFrame(() => setIsRevealed(true));
    return () => window.cancelAnimationFrame(frame);
  }, [isLoading]);

  if (isLoading) {
    return (
      <PageContainer
        withBackground={false}
        className="flex min-h-screen items-center justify-center bg-luxury-ivory"
      >
        <div className="flex flex-col items-center gap-5">
          <span className="h-4 w-4 animate-spin rounded-full border border-luxury-ink/20 border-t-luxury-ink" />
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-500">
            Đang tải đơn hàng
          </p>
        </div>
      </PageContainer>
    );
  }

  // Previously this returned `null`, leaving a blank white page whenever the
  // order could not be loaded.
  if (!order) {
    return (
      <PageContainer
        withBackground={false}
        className="flex min-h-screen items-center justify-center bg-luxury-ivory px-4"
      >
        <div className="w-full max-w-md rounded-[2px] border border-dashed border-luxury-ink/15 bg-white px-8 py-14 text-center">
          <h1
            style={{ fontFamily: "var(--font-droid-serif), serif" }}
            className="text-xl tracking-tight text-luxury-ink"
          >
            Không tải được đơn hàng
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            {loadError ??
              "Đơn hàng này không tồn tại hoặc bạn không có quyền thanh toán."}
          </p>
          <Link
            href="/orders"
            className="group mt-8 inline-flex items-center gap-2 rounded-[2px] bg-luxury-ink px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.22em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800"
          >
            Xem đơn hàng của tôi
            <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </PageContainer>
    );
  }

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
      <Container as="main" maxWidth="9xl" paddingX="md" paddingY="lg">
        <div style={delay(60)} className={revealClass}>
          <PaymentHeader
            orderId={orderId}
            secondsLeft={secondsLeft}
            isExpired={isExpired}
            formatCountdown={formatCountdown}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-6 lg:col-span-7">
            <div style={delay(160)} className={revealClass}>
              <PaymentQrSection
                bankInfoLoading={bankInfoLoading}
                bankInfoError={bankInfoError}
                bankInfo={bankInfo}
                qrCodeImageUrl={qrCodeImageUrl}
              />
            </div>
            <div style={delay(240)} className={revealClass}>
              <PaymentBankInfo
                bankInfoLoading={bankInfoLoading}
                bankInfoError={bankInfoError}
                displayBankInfo={displayBankInfo}
                onCopy={handleCopy}
                copiedField={copiedField}
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div
              style={delay(320)}
              className={cn(revealClass, "space-y-5 lg:sticky lg:top-8")}
            >
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
                hasProof={Boolean(proofFile)}
              />
              <PaymentNotes />
            </div>
          </div>
        </div>
      </Container>
    </PageContainer>
  );
}
