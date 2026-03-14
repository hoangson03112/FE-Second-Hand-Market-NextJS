import { Container } from "@/components/layout/Container";
import { RefundModal } from "./RefundModal";
import { ProductReviewModal } from "./ProductReviewModal";
import { RefundDetailCard } from "./RefundDetailCard";
import { OrderTracking } from "@/components/order";
import { OrderDetailHeader } from "./OrderDetailHeader";
import { OrderStatusHero } from "./OrderStatusHero";
import { OrderProductsCard } from "./OrderProductsCard";
import { OrderSellerReviewSection } from "./OrderSellerReviewSection";
import { OrderMetaCard } from "./OrderMetaCard";
import { OrderShippingCard } from "./OrderShippingCard";
import { OrderBankInfoCard } from "./OrderBankInfoCard";
import { OrderPriceSummary } from "./OrderPriceSummary";
import { OrderActionButtons } from "./OrderActionButtons";
import { CancelOrderReasonDialog } from "@/components/ui/CancelOrderReasonDialog";
import { useOrderDetailView } from "../utils/useOrderDetailView";
import type { Order } from "@/types/order";

const REFUND_RELATED_STATUSES = [
  "refund_requested",
  "refund_approved",
  "returning",
  "return_shipping",
  "returned",
  "refunded",
];

export interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
  existingReview: { _id: string; rating: number; comment?: string } | null;
  showReviewForm: boolean;
  reviewRating: number;
  reviewComment: string;
  isSubmittingReview: boolean;
  isCancelling: boolean;
  showCancelDialog: boolean;
  isConfirmingReceived: boolean;
  showRefundModal: boolean;
  refundReason: string;
  refundDescription: string;
  refundImages: File[];
  refundVideos: File[];
  isSubmittingRefund: boolean;
  productReviews: Record<string, { rating: number; comment?: string }>;
  showProductReviewModal: boolean;
  selectedProduct: { id: string; name: string } | null;
  productReviewRating: number;
  productReviewComment: string;
  isSubmittingProductReview: boolean;
  setReviewRating: (value: number) => void;
  setReviewComment: (value: string) => void;
  setShowRefundModal: (value: boolean) => void;
  setRefundReason: (value: string) => void;
  setRefundDescription: (value: string) => void;
  setRefundImages: (images: File[]) => void;
  setRefundVideos: (videos: File[]) => void;
  setShowProductReviewModal: (value: boolean) => void;
  setSelectedProduct: (value: { id: string; name: string } | null) => void;
  setProductReviewRating: (value: number) => void;
  setProductReviewComment: (value: string) => void;
  handleCancelOrder: () => void;
  handleCloseCancelDialog: () => void;
  handleConfirmCancelOrder: (reason: string) => Promise<void>;
  handleSubmitReview: (e: React.FormEvent) => Promise<void>;
  handleConfirmReceived: () => Promise<void>;
  handleSubmitRefund: (e: React.FormEvent) => Promise<void>;
  handleOpenProductReview: (productId: string, productName: string) => void;
  handleSubmitProductReview: (e: React.FormEvent) => Promise<void>;
  bankName: string;
  setBankName: (v: string) => void;
  accountNumber: string;
  setAccountNumber: (v: string) => void;
  accountHolder: string;
  setAccountHolder: (v: string) => void;
  handleSubmitBankInfo: (e: React.FormEvent) => Promise<void>;
  handleEscalateToAdmin?: () => Promise<void>;
  isEscalatingToAdmin?: boolean;
  isSubmittingBankInfo: boolean;
}

export function OrderDetailView({
  order,
  onBack,
  existingReview,
  showReviewForm,
  reviewRating,
  reviewComment,
  isSubmittingReview,
  isCancelling,
  showCancelDialog,
  isConfirmingReceived,
  showRefundModal,
  refundReason,
  refundDescription,
  refundImages,
  refundVideos,
  isSubmittingRefund,
  productReviews,
  showProductReviewModal,
  selectedProduct,
  productReviewRating,
  productReviewComment,
  isSubmittingProductReview,
  setReviewRating,
  setReviewComment,
  setShowRefundModal,
  setRefundReason,
  setRefundDescription,
  setRefundImages,
  setRefundVideos,
  setShowProductReviewModal,
  setSelectedProduct,
  setProductReviewRating,
  setProductReviewComment,
  handleCancelOrder,
  handleCloseCancelDialog,
  handleConfirmCancelOrder,
  handleSubmitReview,
  handleConfirmReceived,
  handleSubmitRefund,
  handleOpenProductReview,
  handleSubmitProductReview,
  bankName,
  setBankName,
  accountNumber,
  setAccountNumber,
  accountHolder,
  setAccountHolder,
  handleSubmitBankInfo,
  handleEscalateToAdmin,
  isEscalatingToAdmin,
  isSubmittingBankInfo,
}: OrderDetailViewProps) {
  const {
    statusConfig,
    progressSteps,
    statusDescription,
    effectiveStepIdx,
    isTerminal,
    isLocalPickup,
  } = useOrderDetailView(order);

  const showRefundCard =
    REFUND_RELATED_STATUSES.includes(order.status) &&
    order.refundRequestId &&
    typeof order.refundRequestId === "object";

  const showSellerReview = order.status === "completed" || order.status === "delivered";
  const showBankInfoCard = order.status === "returning" || order.status === "returned";

  return (
    <div className="min-h-screen bg-background">
      <OrderDetailHeader orderId={order._id} status={order.status} onBack={onBack} />

      <Container maxWidth="6xl" paddingX="md" paddingY="lg">
        <div className="space-y-4 sm:space-y-5">
          <OrderStatusHero
            status={order.status}
            statusConfig={statusConfig}
            statusDescription={statusDescription}
            progressSteps={progressSteps}
            effectiveStepIdx={effectiveStepIdx}
            isTerminal={isTerminal}
            updatedAt={order.updatedAt}
            ghnOrderCode={order.ghnOrderCode}
            ghnReturnOrderCode={order.ghnReturnOrderCode}
          />

          {showRefundCard && (
            <RefundDetailCard
              refund={order.refundRequestId!}
              onEscalateToAdmin={handleEscalateToAdmin}
              isEscalating={isEscalatingToAdmin}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
            {/* Left column */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-5">
              <OrderProductsCard
                order={order}
                productReviews={productReviews}
                onOpenProductReview={handleOpenProductReview}
              />
              {showSellerReview && (
                <OrderSellerReviewSection
                  existingReview={existingReview}
                  showReviewForm={showReviewForm}
                  reviewRating={reviewRating}
                  reviewComment={reviewComment}
                  isSubmittingReview={isSubmittingReview}
                  onRatingChange={setReviewRating}
                  onCommentChange={setReviewComment}
                  onSubmit={handleSubmitReview}
                />
              )}
            </div>

            {/* Right sidebar */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="space-y-4 sm:space-y-5 lg:sticky lg:top-[72px]">
                <OrderMetaCard
                  createdAt={order.createdAt}
                  expectedDeliveryTime={order.expectedDeliveryTime}
                  paymentMethod={order.paymentMethod}
                  shippingMethod={order.shippingMethod}
                  statusPayment={order.statusPayment}
                  isLocalPickup={isLocalPickup}
                />
                <OrderShippingCard
                  shippingMethod={order.shippingMethod}
                  shippingAddress={order.shippingAddress}
                />
                {order.ghnOrderCode && !REFUND_RELATED_STATUSES.includes(order.status) && (
                  <OrderTracking orderId={order._id} ghnOrderCode={order.ghnOrderCode} />
                )}
                {showBankInfoCard && (
                  <OrderBankInfoCard
                    status={order.status}
                    ghnReturnOrderCode={order.ghnReturnOrderCode}
                    ghnReturnTrackingUrl={order.ghnReturnTrackingUrl}
                    refundBankInfo={order.refundBankInfo}
                    bankName={bankName}
                    accountNumber={accountNumber}
                    accountHolder={accountHolder}
                    isSubmittingBankInfo={isSubmittingBankInfo}
                    onBankNameChange={setBankName}
                    onAccountNumberChange={setAccountNumber}
                    onAccountHolderChange={setAccountHolder}
                    onSubmitBankInfo={handleSubmitBankInfo}
                  />
                )}
                <OrderPriceSummary
                  productAmount={order.productAmount ?? 0}
                  shippingFee={order.shippingFee ?? 0}
                  insuranceFee={order.insuranceFee}
                  codFee={order.codFee}
                  totalAmount={order.totalAmount}
                  isLocalPickup={isLocalPickup}
                />
                <OrderActionButtons
                  status={order.status}
                  orderId={order._id}
                  statusPayment={order.statusPayment}
                  isCancelling={isCancelling}
                  isConfirmingReceived={isConfirmingReceived}
                  onCancelOrder={handleCancelOrder}
                  onConfirmReceived={handleConfirmReceived}
                  onOpenRefundModal={() => setShowRefundModal(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>

      <RefundModal
        open={showRefundModal}
        reason={refundReason}
        description={refundDescription}
        images={refundImages}
        videos={refundVideos}
        isSubmitting={isSubmittingRefund}
        onReasonChange={setRefundReason}
        onDescriptionChange={setRefundDescription}
        onImagesChange={setRefundImages}
        onVideosChange={setRefundVideos}
        onClose={() => {
          setShowRefundModal(false);
          setRefundReason("");
          setRefundDescription("");
          setRefundImages([]);
          setRefundVideos([]);
          setBankName("");
          setAccountNumber("");
          setAccountHolder("");
        }}
        onSubmit={handleSubmitRefund}
        bankName={bankName}
        setBankName={setBankName}
        accountNumber={accountNumber}
        setAccountNumber={setAccountNumber}
        accountHolder={accountHolder}
        setAccountHolder={setAccountHolder}
      />

      <ProductReviewModal
        open={showProductReviewModal}
        selectedProduct={selectedProduct}
        rating={productReviewRating}
        comment={productReviewComment}
        isSubmitting={isSubmittingProductReview}
        onRatingChange={setProductReviewRating}
        onCommentChange={setProductReviewComment}
        onClose={() => {
          setShowProductReviewModal(false);
          setSelectedProduct(null);
          setProductReviewComment("");
        }}
        onSubmit={handleSubmitProductReview}
      />

      <CancelOrderReasonDialog
        isOpen={showCancelDialog}
        onConfirm={handleConfirmCancelOrder}
        onCancel={handleCloseCancelDialog}
        isLoading={isCancelling}
        orderCode={order._id.slice(-8).toUpperCase()}
      />
    </div>
  );
}
