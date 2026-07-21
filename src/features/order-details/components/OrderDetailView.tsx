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

/** MÃ´ táº£ hero theo phase Refund (order cÃ³ thá»ƒ váº«n lÃ  "refund" suá»‘t vÃ²ng Ä‘á»i â€” xem Order model BE). */
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
      ? "YÃªu cáº§u Ä‘Ã£ gá»­i. NgÆ°á»i bÃ¡n sáº½ xem xÃ©t vÃ  pháº£n há»“i trong thá»i gian quy Ä‘á»‹nh."
      : "YÃªu cáº§u Ä‘Ã£ gá»­i. NgÆ°á»i bÃ¡n sáº½ xem xÃ©t; khi Ä‘Æ°á»£c cháº¥p thuáº­n, báº¡n gá»­i hÃ ng hoÃ n theo váº­n Ä‘Æ¡n GHN.";
  }
  if (rs === "approved") {
    return isLocalPickup
      ? "NgÆ°á»i bÃ¡n Ä‘Ã£ cháº¥p thuáº­n hoÃ n tiá»n. LiÃªn há»‡ Ä‘á»ƒ tráº£ hÃ ng theo thá»a thuáº­n."
      : `NgÆ°á»i bÃ¡n Ä‘Ã£ cháº¥p thuáº­n hoÃ n tiá»n. Tiáº¿p theo: váº­n Ä‘Æ¡n hoÃ n GHN vÃ  gá»­i hÃ ng Ä‘Ãºng quy Ä‘á»‹nh. ${REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER}`;
  }
  if (rs === "return_shipping" || rs === "returning" || orderStatus === "return_shipping" || orderStatus === "returning") {
    return isLocalPickup ? local.returning : ghn.returning;
  }
  if (rs === "returned" || orderStatus === "returned") {
    return isLocalPickup ? local.returned : ghn.returned;
  }
  if (rs === "bank_info_required") {
    return "Cáº§n bá»• sung thÃ´ng tin tÃ i khoáº£n ngÃ¢n hÃ ng Ä‘á»ƒ admin chuyá»ƒn khoáº£n hoÃ n tiá»n.";
  }
  if (rs === "processing" || rs === "failed") {
    return rs === "failed"
      ? "Giao dá»‹ch hoÃ n tiá»n gáº·p sá»± cá»‘. Há»‡ thá»‘ng sáº½ xá»­ lÃ½ láº¡i; vui lÃ²ng theo dÃµi hoáº·c liÃªn há»‡ há»— trá»£."
      : "Há»‡ thá»‘ng Ä‘ang xá»­ lÃ½ chuyá»ƒn tiá»n hoÃ n vá» cho báº¡n.";
  }
  if (rs === "rejected") {
    return "NgÆ°á»i bÃ¡n Ä‘Ã£ tá»« chá»‘i yÃªu cáº§u hoÃ n tiá»n. Náº¿u khÃ´ng Ä‘á»“ng Ã½, báº¡n cÃ³ thá»ƒ khiáº¿u náº¡i Ä‘á»ƒ admin xem xÃ©t.";
  }
  if (rs === "disputed") {
    return "Khiáº¿u náº¡i Ä‘ang Ä‘Æ°á»£c admin xem xÃ©t. Báº¡n sáº½ nháº­n thÃ´ng bÃ¡o khi cÃ³ quyáº¿t Ä‘á»‹nh.";
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
      title: "HoÃ n tiá»n Ä‘Ã£ hoÃ n táº¥t",
      description: "Báº¡n Ä‘Ã£ nháº­n hoÃ n tiá»n thÃ nh cÃ´ng cho Ä‘Æ¡n hÃ ng nÃ y.",
    };
  }

  if (rs === "rejected") {
    return {
      tone: "warning" as const,
      title: "YÃªu cáº§u Ä‘Ã£ bá»‹ tá»« chá»‘i",
      description: "Náº¿u báº¡n khÃ´ng Ä‘á»“ng Ã½, hÃ£y dÃ¹ng nÃºt khiáº¿u náº¡i trong pháº§n chi tiáº¿t hoÃ n tiá»n Ä‘á»ƒ admin xem xÃ©t.",
    };
  }

  if (rs === "pending") {
    return {
      tone: "info" as const,
      title: "Chá» ngÆ°á»i bÃ¡n xem xÃ©t",
      description: "YÃªu cáº§u Ä‘Ã£ Ä‘Æ°á»£c gá»­i. NgÆ°á»i bÃ¡n sáº½ cháº¥p thuáº­n hoáº·c tá»« chá»‘i; báº¡n sáº½ tháº¥y cáº­p nháº­t táº¡i Ä‘Ã¢y.",
    };
  }

  if (rs === "approved") {
    return {
      tone: "info" as const,
      title: "NgÆ°á»i bÃ¡n Ä‘Ã£ cháº¥p thuáº­n",
      description:
        "Tiáº¿p theo: lÃ m theo váº­n Ä‘Æ¡n hoÃ n tráº£ (GHN) hoáº·c hÆ°á»›ng dáº«n trÃªn Ä‘Æ¡n Ä‘á»ƒ gá»­i hÃ ng vá» ngÆ°á»i bÃ¡n. " +
        REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER,
    };
  }

  if (rs === "return_shipping" || rs === "returning" || orderStatus === "returning" || orderStatus === "return_shipping") {
    return {
      tone: "warning" as const,
      title: "Viá»‡c cáº§n lÃ m ngay",
      description:
        "Gá»­i hÃ ng hoÃ n theo váº­n Ä‘Æ¡n GHN vÃ  giá»¯ láº¡i biÃªn nháº­n Ä‘á»ƒ Ä‘á»‘i chiáº¿u khi cáº§n. " +
        REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER,
    };
  }

  if (rs === "bank_info_required") {
    return {
      tone: "warning" as const,
      title: "Viá»‡c cáº§n lÃ m ngay",
      description: "Bá»• sung thÃ´ng tin tÃ i khoáº£n ngÃ¢n hÃ ng Ä‘á»ƒ admin cÃ³ thá»ƒ chuyá»ƒn khoáº£n hoÃ n tiá»n.",
    };
  }

  if (rs === "processing" || rs === "failed") {
    return {
      tone: "info" as const,
      title: rs === "failed" ? "HoÃ n tiá»n cáº§n xá»­ lÃ½ láº¡i" : "Äang chuyá»ƒn khoáº£n hoÃ n tiá»n",
      description:
        rs === "failed"
          ? "Giao dá»‹ch hoÃ n tiá»n chÆ°a thÃ nh cÃ´ng. Há»‡ thá»‘ng sáº½ thá»­ láº¡i; vui lÃ²ng theo dÃµi trang nÃ y."
          : "NgÆ°á»i bÃ¡n Ä‘Ã£ nháº­n hÃ ng hoÃ n (náº¿u cÃ³). Tiá»n sáº½ Ä‘Æ°á»£c chuyá»ƒn theo thÃ´ng tin báº¡n Ä‘Ã£ cung cáº¥p.",
    };
  }

  if (orderStatus === "returned" || rs === "returned") {
    if (!hasBankInfo) {
      return {
        tone: "warning" as const,
        title: "Viá»‡c cáº§n lÃ m ngay",
        description: "Cáº­p nháº­t thÃ´ng tin tÃ i khoáº£n ngÃ¢n hÃ ng Ä‘á»ƒ há»‡ thá»‘ng chuyá»ƒn tiá»n hoÃ n.",
      };
    }
    return {
      tone: "info" as const,
      title: "Äang chá» admin xá»­ lÃ½ hoÃ n tiá»n",
      description: "NgÆ°á»i bÃ¡n Ä‘Ã£ nháº­n hÃ ng hoÃ n, há»‡ thá»‘ng Ä‘ang xá»­ lÃ½ bÆ°á»›c hoÃ n tiá»n cuá»‘i cÃ¹ng.",
    };
  }

  if (rs === "disputed") {
    return {
      tone: "info" as const,
      title: "Admin Ä‘ang xem xÃ©t khiáº¿u náº¡i",
      description: "Báº¡n Ä‘Ã£ gá»­i khiáº¿u náº¡i. Vui lÃ²ng chá» quyáº¿t Ä‘á»‹nh tá»« quáº£n trá»‹ viÃªn.",
    };
  }

  if (orderStatus === "refund" || orderStatus === "refund_requested" || orderStatus === "refund_approved") {
    return {
      tone: "info" as const,
      title: "YÃªu cáº§u hoÃ n tiá»n Ä‘ang Ä‘Æ°á»£c xá»­ lÃ½",
      description:
        "Theo dÃµi tráº¡ng thÃ¡i chi tiáº¿t bÃªn dÆ°á»›i. Náº¿u Ä‘Ã£ cÃ³ váº­n Ä‘Æ¡n hoÃ n tráº£, hÃ£y gá»­i hÃ ng Ä‘Ãºng háº¡n.",
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

      <Container maxWidth="8xl" paddingX="md" paddingY="lg">
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
