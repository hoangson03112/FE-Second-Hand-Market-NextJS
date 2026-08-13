"use client";

import Link from "next/link";
import { IconArrowUpRight, IconPackageOff } from "@tabler/icons-react";
import { useOrderDetail } from "./hooks/useOrderDetail";
import { OrderDetailView } from "./components/OrderDetailView";

interface OrderDetailProps {
  orderId: string;
  autoOpenRefund?: boolean;
  autoOpenReview?: boolean;
}

export default function OrderDetail({
  orderId,
  autoOpenRefund,
  autoOpenReview,
}: OrderDetailProps) {
  const state = useOrderDetail({ orderId, autoOpenRefund, autoOpenReview });

  if (state.userLoading || state.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-luxury-ivory">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-luxury-ink/15 border-t-luxury-champagne" />
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-taupe-400">
            Đang tải chi tiết đơn hàng...
          </p>
        </div>
      </div>
    );
  }

  if (!state.order)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-luxury-ivory px-4 text-center">
        <span
          className="flex h-14 w-14 items-center justify-center border border-luxury-ink/10 bg-white"
          style={{ borderRadius: "2px" }}
        >
          <IconPackageOff className="h-6 w-6 text-taupe-400" strokeWidth={1.5} />
        </span>
        <p className="max-w-xs text-sm text-neutral-500">
          Không tìm thấy đơn hàng hoặc bạn không có quyền xem.
        </p>
        <Link
          href="/orders"
          className="group inline-flex items-center gap-2 bg-luxury-ink px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800"
          style={{ borderRadius: "2px" }}
        >
          Về danh sách đơn hàng
          <IconArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    );

  return (
    <OrderDetailView
      order={state.order}
      onBack={() => state.router.back()}
      existingReview={state.existingReview}
      showReviewForm={state.showReviewForm}
      reviewRating={state.reviewRating}
      reviewComment={state.reviewComment}
      isSubmittingReview={state.isSubmittingReview}
      isCancelling={state.isCancelling}
      showCancelDialog={state.showCancelDialog}
      isConfirmingReceived={state.isConfirmingReceived}
      showRefundModal={state.showRefundModal}
      refundReason={state.refundReason}
      refundDescription={state.refundDescription}
      refundImages={state.refundImages}
      refundVideos={state.refundVideos}
      isSubmittingRefund={state.isSubmittingRefund}
      productReviews={state.productReviews}
      showProductReviewModal={state.showProductReviewModal}
      selectedProduct={state.selectedProduct}
      productReviewRating={state.productReviewRating}
      productReviewComment={state.productReviewComment}
      isSubmittingProductReview={state.isSubmittingProductReview}
      setReviewRating={state.setReviewRating}
      setReviewComment={state.setReviewComment}
      setShowRefundModal={state.setShowRefundModal}
      setRefundReason={state.setRefundReason}
      setRefundDescription={state.setRefundDescription}
      setRefundImages={state.setRefundImages}
      setRefundVideos={state.setRefundVideos}
      setShowProductReviewModal={state.setShowProductReviewModal}
      setSelectedProduct={state.setSelectedProduct}
      setProductReviewRating={state.setProductReviewRating}
      setProductReviewComment={state.setProductReviewComment}
      handleCancelOrder={state.handleCancelOrder}
      handleCloseCancelDialog={state.handleCloseCancelDialog}
      handleConfirmCancelOrder={state.handleConfirmCancelOrder}
      handleSubmitReview={state.handleSubmitReview}
      handleConfirmReceived={state.handleConfirmReceived}
      handleSubmitRefund={state.handleSubmitRefund}
      handleOpenProductReview={state.handleOpenProductReview}
      handleSubmitProductReview={state.handleSubmitProductReview}
      handleSubmitBankInfo={state.handleSubmitBankInfo}
      isSubmittingBankInfo={state.isSubmittingBankInfo}
      bankName={state.bankName}
      setBankName={state.setBankName}
      accountNumber={state.accountNumber}
      setAccountNumber={state.setAccountNumber}
      accountHolder={state.accountHolder}
      setAccountHolder={state.setAccountHolder}
    />
  );
}