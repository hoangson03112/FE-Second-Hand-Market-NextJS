import { IconInfoCircle } from "@tabler/icons-react";
import { Container } from "@/components/layout/Container";
import { RefundModal } from "@/features/refunds";
import { FEATURE_INFO } from "@/constants/messages";
import { ProductReviewModal } from "./ProductReviewModal";
import { RefundDetailCard } from "./RefundDetailCard";
import { OrderTracking } from "@/components/shared";
import { OrderDetailHeader } from "./OrderDetailHeader";
import { OrderStatusHero } from "./OrderStatusHero";
import { OrderProductsCard } from "./OrderProductsCard";
import { OrderSellerReviewSection } from "./OrderSellerReviewSection";
import { OrderMetaCard } from "./OrderMetaCard";
import { OrderShippingCard } from "./OrderShippingCard";
import { OrderBankInfoCard } from "./OrderBankInfoCard";
import { OrderPriceSummary } from "./OrderPriceSummary";
import { OrderActionButtons } from "./OrderActionButtons";
import { CancelOrderReasonDialog } from "@/components/shared";
import { useOrderDetailView } from "../hooks/useOrderDetailView";
import { REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER } from "@/constants/refund";
import { STATUS_DESCRIPTION_GHN, STATUS_DESCRIPTION_LOCAL } from "../constants";
import type { Order } from "@/types/order";

const REFUND_RELATED_STATUSES = [
  "refund",
  "refund_requested",
  "refund_approved",
  "returning",
  "return_shipping",
  "returned",
  "refunded",
];

/** Mô tả hero theo phase Refund (order có thể vẫn là "refund" suốt vòng đời — xem Order model BE). */
function getBuyerRefundHeroDescription(params: {
  orderStatus: string;
  refundStatus: string | null;
  isLocalPickup: boolean;
}): string | undefined {
  const { orderStatus, refundStatus, isLocalPickup } = params;
  if (!REFUND_RELATED_STATUSES.includes(orderStatus) && !refundStatus) return undefined;

  const rs = refundStatus;
  const local = STATUS_DESCRIPTION_LOCAL;
  const ghn = STATUS_DESCRIPTION_GHN;

  if (orderStatus === "refunded" || rs === "completed") {
    return isLocalPickup ? local.refunded : ghn.refunded;
  }
  if (rs === "pending") {
    return isLocalPickup
      ? "Yêu cầu đã gửi. Người bán sẽ xem xét và phản hồi trong thời gian quy định."
      : "Yêu cầu đã gửi. Người bán sẽ xem xét; khi được chấp thuận, bạn gửi hàng hoàn theo vận đơn GHN.";
  }
  if (rs === "approved") {
    return isLocalPickup
      ? "Người bán đã chấp thuận hoàn tiền. Liên hệ để trả hàng theo thỏa thuận."
      : `Người bán đã chấp thuận hoàn tiền. Tiếp theo: vận đơn hoàn GHN và gửi hàng đúng quy định. ${REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER}`;
  }
  if (rs === "return_shipping" || rs === "returning" || orderStatus === "return_shipping" || orderStatus === "returning") {
    return isLocalPickup ? local.returning : ghn.returning;
  }
  if (rs === "returned" || orderStatus === "returned") {
    return isLocalPickup ? local.returned : ghn.returned;
  }
  if (rs === "bank_info_required") {
    return "Cần bổ sung thông tin tài khoản ngân hàng để admin chuyển khoản hoàn tiền.";
  }
  if (rs === "processing" || rs === "failed") {
    return rs === "failed"
      ? "Giao dịch hoàn tiền gặp sự cố. Hệ thống sẽ xử lý lại; vui lòng theo dõi hoặc liên hệ hỗ trợ."
      : "Hệ thống đang xử lý chuyển tiền hoàn về cho bạn.";
  }
  if (rs === "rejected") {
    return "Người bán đã từ chối yêu cầu hoàn tiền. Nếu không đồng ý, bạn có thể khiếu nại để admin xem xét.";
  }
  if (rs === "disputed") {
    return "Khiếu nại đang được admin xem xét. Bạn sẽ nhận thông báo khi có quyết định.";
  }
  if (orderStatus === "refund" || orderStatus === "refund_requested" || orderStatus === "refund_approved") {
    return isLocalPickup ? local.refund : ghn.refund;
  }
  return undefined;
}

function buildRefundTodoMessage(params: {
  orderStatus: string;
  refundStatus?: string | null;
  hasBankInfo: boolean;
  isEscalating?: boolean;
}) {
  const { orderStatus, refundStatus, hasBankInfo } = params;
  const rs = refundStatus ?? null;

  if (orderStatus === "refunded" || rs === "completed") {
    return {
      tone: "success" as const,
      title: "Hoàn tiền đã hoàn tất",
      description: "Bạn đã nhận hoàn tiền thành công cho đơn hàng này.",
    };
  }

  if (rs === "rejected") {
    return {
      tone: "warning" as const,
      title: "Yêu cầu đã bị từ chối",
      description: "Nếu bạn không đồng ý, hãy dùng nút khiếu nại trong phần chi tiết hoàn tiền để admin xem xét.",
    };
  }

  if (rs === "pending") {
    return {
      tone: "info" as const,
      title: "Chờ người bán xem xét",
      description: "Yêu cầu đã được gửi. Người bán sẽ chấp thuận hoặc từ chối; bạn sẽ thấy cập nhật tại đây.",
    };
  }

  if (rs === "approved") {
    return {
      tone: "info" as const,
      title: "Người bán đã chấp thuận",
      description:
        "Tiếp theo: làm theo vận đơn hoàn trả (GHN) hoặc hướng dẫn trên đơn để gửi hàng về người bán. " +
        REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER,
    };
  }

  if (rs === "return_shipping" || rs === "returning" || orderStatus === "returning" || orderStatus === "return_shipping") {
    return {
      tone: "warning" as const,
      title: "Việc cần làm ngay",
      description:
        "Gửi hàng hoàn theo vận đơn GHN và giữ lại biên nhận để đối chiếu khi cần. " +
        REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER,
    };
  }

  if (rs === "bank_info_required") {
    return {
      tone: "warning" as const,
      title: "Việc cần làm ngay",
      description: "Bổ sung thông tin tài khoản ngân hàng để admin có thể chuyển khoản hoàn tiền.",
    };
  }

  if (rs === "processing" || rs === "failed") {
    return {
      tone: "info" as const,
      title: rs === "failed" ? "Hoàn tiền cần xử lý lại" : "Đang chuyển khoản hoàn tiền",
      description:
        rs === "failed"
          ? "Giao dịch hoàn tiền chưa thành công. Hệ thống sẽ thử lại; vui lòng theo dõi trang này."
          : "Người bán đã nhận hàng hoàn (nếu có). Tiền sẽ được chuyển theo thông tin bạn đã cung cấp.",
    };
  }

  if (orderStatus === "returned" || rs === "returned") {
    if (!hasBankInfo) {
      return {
        tone: "warning" as const,
        title: "Việc cần làm ngay",
        description: "Cập nhật thông tin tài khoản ngân hàng để hệ thống chuyển tiền hoàn.",
      };
    }
    return {
      tone: "info" as const,
      title: "Đang chờ admin xử lý hoàn tiền",
      description: "Người bán đã nhận hàng hoàn, hệ thống đang xử lý bước hoàn tiền cuối cùng.",
    };
  }

  if (rs === "disputed") {
    return {
      tone: "info" as const,
      title: "Admin đang xem xét khiếu nại",
      description: "Bạn đã gửi khiếu nại. Vui lòng chờ quyết định từ quản trị viên.",
    };
  }

  if (orderStatus === "refund" || orderStatus === "refund_requested" || orderStatus === "refund_approved") {
    return {
      tone: "info" as const,
      title: "Yêu cầu hoàn tiền đang được xử lý",
      description:
        "Theo dõi trạng thái chi tiết bên dưới. Nếu đã có vận đơn hoàn trả, hãy gửi hàng đúng hạn.",
    };
  }

  return null;
}

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
  } = useOrderDetailView({
    status: order.status,
    shippingMethod: order.shippingMethod,
    refundStatus:
      order.refundRequestId && typeof order.refundRequestId === "object"
        ? order.refundRequestId.status
        : null,
  });

  const showRefundCard =
    REFUND_RELATED_STATUSES.includes(order.status) &&
    order.refundRequestId &&
    typeof order.refundRequestId === "object";

  const showSellerReview =
    order.status === "completed" || (!isLocalPickup && order.status === "delivered");
  const refundDocStatus =
    order.refundRequestId && typeof order.refundRequestId === "object"
      ? order.refundRequestId.status
      : null;
  const showBankInfoCard =
    order.status === "returning" ||
    order.status === "returned" ||
    (order.status === "refund" &&
      refundDocStatus &&
      ["return_shipping", "returning", "returned", "bank_info_required", "processing"].includes(
        refundDocStatus,
      ));
  const isRefundFlow = REFUND_RELATED_STATUSES.includes(order.status);
  const refundTodo = buildRefundTodoMessage({
    orderStatus: order.status,
    refundStatus: refundDocStatus,
    hasBankInfo: Boolean(order.refundBankInfo?.buyerAccountNumber),
    isEscalating: isEscalatingToAdmin,
  });
  const refundTodoClass =
    refundTodo?.tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : refundTodo?.tone === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-sky-200 bg-sky-50 text-sky-800";

  const refundHeroDescription = getBuyerRefundHeroDescription({
    orderStatus: order.status,
    refundStatus: refundDocStatus,
    isLocalPickup,
  });

  return (
    <div className="min-h-screen bg-background">
      <OrderDetailHeader orderId={order._id} status={order.status} onBack={onBack} />

      <Container maxWidth="7xl" paddingX="md" paddingY="lg">
        <div className="space-y-4 sm:space-y-5">
          <OrderStatusHero
            status={order.status}
            statusConfig={statusConfig}
            statusDescription={statusDescription}
            descriptionOverride={refundHeroDescription}
            progressSteps={progressSteps}
            effectiveStepIdx={effectiveStepIdx}
            isTerminal={isTerminal}
            updatedAt={order.updatedAt}
            ghnOrderCode={order.ghnOrderCode}
            ghnReturnOrderCode={order.ghnReturnOrderCode}
            ghnReturnTrackingUrl={order.ghnReturnTrackingUrl}
          />

          {isRefundFlow && refundTodo && (
            <div className={`rounded-xl border px-4 py-3 ${refundTodoClass}`}>
              <p className="text-sm font-semibold">{refundTodo.title}</p>
              <p className="mt-1 text-xs leading-relaxed">{refundTodo.description}</p>
            </div>
          )}

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
                isLocalPickup={isLocalPickup}
                isCancelling={isCancelling}
                isConfirmingReceived={isConfirmingReceived}
                onCancelOrder={handleCancelOrder}
                onConfirmReceived={handleConfirmReceived}
                onOpenRefundModal={() => setShowRefundModal(true)}
              />
              {showSellerReview && (
                <>
                  <div className="flex items-start gap-3 p-3 rounded-xl border border-primary/20 bg-primary/8">
                    <IconInfoCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-primary/90">{FEATURE_INFO.REVIEW_PRODUCT_RULE}</p>
                  </div>
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
                </>
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
                  hideExpectedDelivery={isRefundFlow}
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
                    refundStatus={refundDocStatus}
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
