"use client";

import Link from "next/link";
import { useOrderDetail } from "./hooks/useOrderDetail";
import { OrderDetailView } from "./components/OrderDetailView";

interface OrderDetailProps {
  orderId: string;
  autoOpenRefund?: boolean;
  autoOpenReview?: boolean;
}

export default function OrderDetail({ orderId, autoOpenRefund, autoOpenReview }: OrderDetailProps) {
  const state = useOrderDetail({ orderId, autoOpenRefund, autoOpenReview });

  if (state.userLoading || state.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-cream-50/30 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-neutral-600">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!state.order) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <p className="text-neutral-500">Không tìm thấy đơn hàng hoặc bạn không có quyền xem.</p>
      <Link href="/orders" className="px-4 py-2 rounded-xl bg-foreground text-background text-sm">Về danh sách đơn hàng</Link>
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
      handleEscalateToAdmin={state.handleEscalateToAdmin}
      isEscalatingToAdmin={state.isEscalatingToAdmin}
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
