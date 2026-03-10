import {
  IconArrowLeft,
  IconBuildingBank,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconCreditCard,
  IconMapPin,
  IconMessage,
  IconPackage,
  IconPhone,
  IconShoppingBag,
  IconStar,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { formatPrice } from "@/utils/format/price";
import { format, formatDateOnly } from "@/utils/format/date";
import { getConditionBadgeColor, getConditionLabel } from "@/utils/format";
import { STATUS_CONFIG } from "@/constants/orderStatus";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CancelOrderReasonDialog } from "@/components/ui/CancelOrderReasonDialog";
import type { Order } from "@/types/order";
import { openChatWithOrder } from "@/utils/chat";
import { RefundModal } from "./RefundModal";
import { ProductReviewModal } from "./ProductReviewModal";
import { RefundDetailCard } from "./RefundDetailCard";
import { OrderTracking } from "@/components/order";

interface OrderDetailViewProps {
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
  isSubmittingBankInfo,
}: OrderDetailViewProps) {
  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const shippingAddr = order.shippingAddress;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-10">
        <Container maxWidth="6xl" paddingX="md">
          <div className="py-4 flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
            >
              <IconArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <IconShoppingBag className="w-7 h-7 text-primary" />
                Chi tiết đơn hàng
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Mã đơn nội bộ:{" "}
                <span className="font-mono font-semibold">
                  {order._id.slice(-8).toUpperCase()}
                </span>
              </p>
            </div>
            <StatusBadge status={order.status} size="md" />
          </div>
        </Container>
      </div>

      <Container maxWidth="6xl" paddingX="md" paddingY="lg">
        <div className="space-y-4 sm:space-y-5">
          <div className="bg-card rounded-2xl border border-border p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <IconClock className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Lịch sử đơn hàng</h2>
            </div>

            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-border to-border" />

              <div className="space-y-6">
                <div className="relative flex gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center z-10 border-4 border-card shadow-lg ${statusConfig.bgColor}`}
                  >
                    <span className="text-xl">{statusConfig.icon}</span>
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-bold ${statusConfig.color}`}>{statusConfig.label}</h3>
                      <span className="text-xs text-neutral-500">{format(order.updatedAt)}</span>
                    </div>
                    <p className="text-sm text-neutral-600">
                      {order.status === "pending" && "Đơn hàng đang chờ người bán xác nhận"}
                      {order.status === "confirmed" && "Người bán đã xác nhận, đơn hàng đã được tạo trên GHN"}
                      {order.status === "picked_up" && "GHN đã lấy hàng thành công"}
                      {order.status === "shipping" && "Đơn hàng đang được vận chuyển"}
                      {order.status === "out_for_delivery" && "Shipper đang trên đường giao hàng"}
                      {order.status === "delivered" && "Đơn hàng đã được giao đến bạn"}
                      {order.status === "completed" && "Đơn hàng đã hoàn thành"}
                      {order.status === "delivery_failed" && "Giao hàng thất bại"}
                      {order.status === "returned" && "Hàng đã về người bán. Admin đang xử lý hoàn tiền cho bạn."}
                      {order.status === "cancelled" && "Đơn hàng đã bị hủy"}
                      {order.status === "returning" && "Đơn hoàn trả đã được tạo. Vui lòng đến bưu cục GHN gần nhất để giao lại hàng theo vận đơn hoàn trả."}
                      {order.status === "return_shipping" && "Đơn hoàn trả đã được tạo. Vui lòng đến bưu cục GHN gần nhất để giao lại hàng theo vận đơn hoàn trả."}
                      {order.status === "refund_requested" && "Người mua đã gửi yêu cầu hoàn tiền, đang chờ người bán xem xét"}
                      {order.status === "refund_approved" && "Người bán đã chấp thuận hoàn tiền, quản trị viên đang xử lý"}
                      {order.status === "refunded" && "Hoàn tiền đã được xử lý thành công"}
                    </p>
                    {order?.ghnOrderCode &&
                      ["confirmed", "picked_up", "shipping", "out_for_delivery", "delivered"].includes(order.status) && (
                        <p className="text-xs text-muted-foreground mt-2 font-mono flex items-center gap-2 flex-wrap">
                          Mã vận đơn GHN: <span className="font-semibold text-primary">{order.ghnOrderCode}</span>
                          <a
                            href={`https://tracking.ghn.dev/?order_code=${order.ghnOrderCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline not-italic"
                          >
                            Theo dõi →
                          </a>
                        </p>
                      )}
                    {order?.ghnReturnOrderCode &&
                      ["returning", "return_shipping", "returned", "refunded"].includes(order.status) && (
                        <p className="text-xs text-muted-foreground mt-2 font-mono flex items-center gap-2 flex-wrap">
                          Mã vận đơn hoàn trả: <span className="font-semibold text-primary">{order.ghnReturnOrderCode}</span>
                          <a
                            href={`https://tracking.ghn.dev/?order_code=${order.ghnReturnOrderCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline not-italic"
                          >
                            Theo dõi →
                          </a>
                        </p>
                      )}
                  </div>
                </div>

                <div className="relative flex gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center z-10 border-4 border-card shadow-lg bg-primary/10">
                    <span className="text-xl">✓</span>
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-primary">Đã đặt hàng</h3>
                      <span className="text-xs text-neutral-500">{format(order.createdAt)}</span>
                    </div>
                    <p className="text-sm text-neutral-600">Đơn hàng đã được tạo thành công</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── REFUND SECTION ─────────────────────────────────────────── */}
          {["refund_requested", "refund_approved", "returning", "return_shipping", "returned", "refunded"].includes(order.status) &&
            order.refundRequestId && typeof order.refundRequestId === "object" && (
              <RefundDetailCard refund={order.refundRequestId} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
            <div className="lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-5">
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <IconPackage className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">Sản phẩm đã đặt</h2>
                </div>
                <div className="p-5">
                  <div className="space-y-3">
                    {order.products?.map((item, idx) => {
                      const product = item.productId;
                      const avatar =
                        typeof product?.avatar === "object" && product.avatar?.url
                          ? product.avatar.url
                          : typeof product?.avatar === "string"
                            ? product.avatar
                            : "/images/product-placeholder.svg";
                      const condition = product?.condition;
                      const conditionLabel = condition ? getConditionLabel(condition) : null;
                      const badgeColorClass = condition ? getConditionBadgeColor(condition) : null;
                      const hasReview = productReviews[product._id];
                      // Chỉ cho đánh giá sản phẩm khi đơn hoàn thành VÀ sản phẩm còn hàng (stock >= 1)
                      // Nếu sản phẩm hết hàng, đánh giá không còn hữu ích cho người mua tiếp theo
                      const canReview =
                        ["completed", "delivered"].includes(order.status) &&
                        (product?.stock ?? 0) >= 1;

                      return (
                        <div key={idx} className="flex gap-4 p-4 rounded-xl hover:bg-background transition-colors border border-border">
                          <div className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-100 shrink-0 ring-1 ring-neutral-200">
                            <Image src={avatar} alt={product?.name || "Sản phẩm"} width={96} height={96} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground line-clamp-2 mb-2">{product?.name || "Sản phẩm"}</h4>
                            {conditionLabel && badgeColorClass && (
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${badgeColorClass} mb-2`}>
                                {conditionLabel}
                              </span>
                            )}
                            <div className="flex items-center gap-4 mb-2">
                              <p className="text-sm text-neutral-600">
                                Số lượng: <span className="font-semibold text-neutral-900">×{item.quantity}</span>
                              </p>
                              <p className="text-lg font-semibold text-primary">{formatPrice(item.price || product?.price || 0)}</p>
                            </div>
                            {canReview && (
                              <div className="mt-2">
                                {hasReview ? (
                                  <div className="flex items-center gap-2 text-sm">
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((i) => (
                                        <IconStar key={i} className={`w-4 h-4 ${i <= hasReview.rating ? "fill-amber-400 text-amber-400" : "text-neutral-300"}`} />
                                      ))}
                                    </div>
                                    <span className="text-neutral-600">Đã đánh giá</span>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleOpenProductReview(product._id, product.name)}
                                    className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                                  >
                                    <IconStar className="w-4 h-4" />
                                    Đánh giá sản phẩm
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {order.sellerId && (
                    <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                          <IconUser className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Người bán</p>
                          <p className="font-semibold text-foreground text-base">{order.sellerId.fullName || "—"}</p>
                          {order.sellerId.phoneNumber && (
                            <p className="text-sm text-neutral-600 flex items-center gap-1">
                              <IconPhone className="w-3.5 h-3.5" />
                              {order.sellerId.phoneNumber}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          openChatWithOrder(
                            {
                              _id: order.sellerId._id,
                              fullName: order.sellerId.fullName,
                            },
                            {
                              _id: order._id,
                              status: order.status,
                              ghnOrderCode: order.ghnOrderCode,
                              products: order.products.map((item) => ({
                                name: item.productId?.name || "Sản phẩm",
                                quantity: item.quantity,
                                price: item.price || item.productId?.price || 0,
                              })),
                              totalAmount: order.totalAmount,
                            }
                          )
                        }
                        className="px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors group flex items-center gap-2">
                        <IconMessage className="w-5 h-5 text-primary" />
                        <span className="text-sm font-semibold text-primary">Nhắn tin</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {(order.status === "completed" || order.status === "delivered") && (
                <div id="seller-review-section" className="bg-card rounded-2xl border border-border p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <IconStar className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Đánh giá người bán</h2>
                  </div>
                  {existingReview ? (
                    <div className="bg-secondary/60 rounded-2xl border border-border p-4">
                      <div className="flex gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <IconStar key={i} className={`w-6 h-6 ${i <= existingReview.rating ? "fill-amber-400 text-amber-400" : "text-neutral-300"}`} />
                        ))}
                      </div>
                      {existingReview.comment && <p className="text-sm text-neutral-700 leading-relaxed">{existingReview.comment}</p>}
                    </div>
                  ) : showReviewForm ? (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-900 mb-2">Đánh giá của bạn</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <button key={i} type="button" onClick={() => setReviewRating(i)} className="p-1 hover:scale-110 transition-transform">
                              <IconStar className={`w-10 h-10 ${i <= reviewRating ? "fill-amber-400 text-amber-400" : "text-neutral-300 hover:text-amber-200"}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-900 mb-2">Nhận xét (tùy chọn)</label>
                        <textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-neutral-900"
                          placeholder="Chia sẻ trải nghiệm mua hàng của bạn..."
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="w-full py-3 px-6 bg-foreground text-background rounded-xl font-semibold hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {isSubmittingReview ? "Đang gửi đánh giá..." : "Gửi đánh giá"}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-8 text-neutral-500">
                      <IconStar className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
                      <p>Đang tải thông tin đánh giá...</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-5 xl:col-span-4">
              <div className="space-y-4 sm:space-y-5 lg:sticky lg:top-24">
                <div className="bg-card rounded-2xl border border-border p-5">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-1 border-b border-border">
                      <span className="text-sm text-muted-foreground">Thời gian đặt hàng</span>
                      <span className="text-sm font-semibold text-foreground">{format(order.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border">
                      <span className="text-sm text-muted-foreground">Thanh toán</span>
                      <span className="text-sm font-semibold text-foreground flex items-center gap-1.5 text-right">
                        <IconCreditCard className="w-4 h-4 text-primary" />
                        {order.paymentMethod === "cod"
                          ? "COD"
                          : order.paymentMethod === "bank_transfer"
                            ? "Chuyển khoản"
                            : order.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-muted-foreground">Trạng thái TT</span>
                      <span className={`text-sm font-semibold flex items-center gap-1 ${order.statusPayment ? "text-primary" : "text-muted-foreground"}`}>
                        {order.statusPayment ? <IconCircleCheck className="w-4 h-4" /> : <IconCircleX className="w-4 h-4" />}
                        {order.statusPayment ? "Đã thanh toán" : "Chưa thanh toán"}
                      </span>
                    </div>
                  </div>
                </div>

                {shippingAddr && (
                  <div className="bg-card rounded-2xl border border-border p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <IconMapPin className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">Địa chỉ nhận hàng</h3>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{shippingAddr.fullName}</p>
                    <p className="text-sm text-muted-foreground">{shippingAddr.phoneNumber}</p>
                    <p className="text-sm text-muted-foreground mt-1">{shippingAddr.specificAddress}</p>
                    {(shippingAddr.ward || shippingAddr.district || shippingAddr.province) && (
                      <p className="text-sm text-muted-foreground">{[shippingAddr.ward, shippingAddr.district, shippingAddr.province].filter(Boolean).join(", ")}</p>
                    )}
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">Vận chuyển</p>
                      <p className="text-sm font-medium text-foreground">{order.shippingMethod || "Chưa cập nhật"}</p>
                      {order.expectedDeliveryTime && (
                        <p className="text-xs text-muted-foreground mt-1">Dự kiến: {formatDateOnly(order.expectedDeliveryTime)}</p>
                      )}
                    </div>
                  </div>
                )}

                {order.ghnOrderCode && (
                  <OrderTracking
                    orderId={order._id}
                    ghnOrderCode={order.ghnOrderCode}
                  />
                )}

                {/* Bank info card for returning / returned */}
                {(order.status === "returning" || order.status === "returned") && (
                  <div className="bg-card rounded-2xl border border-border p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <IconBuildingBank className="w-5 h-5 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">
                        {order.status === "returning" ? "Vận đơn hoàn trả" : "Thông tin ngân hàng nhận tiền"}
                      </h3>
                    </div>

                    {order.status === "returning" && (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Đơn hoàn trả đã được tạo. Vui lòng đến bưu cục GHN gần nhất để gửi hàng theo mã vận đơn bên dưới.
                        </p>
                        {order.ghnReturnOrderCode && (
                          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
                            <p className="text-xs text-muted-foreground mb-1">Mã vận đơn hoàn trả</p>
                            <p className="font-mono font-semibold text-primary">{order.ghnReturnOrderCode}</p>
                            {order.ghnReturnTrackingUrl && (
                              <a
                                href={order.ghnReturnTrackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline mt-1 block"
                              >
                                Xem trên GHN →
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {order.status === "returned" && order.refundBankInfo?.buyerAccountNumber ? (
                      <div className="space-y-2">
                        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3">
                          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Đã gửi — Chờ admin xử lý hoàn tiền</p>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-muted-foreground">Ngân hàng:</span> <span className="font-semibold">{order.refundBankInfo.buyerBankName}</span></p>
                            <p><span className="text-muted-foreground">Số TK:</span> <span className="font-mono font-semibold">{order.refundBankInfo.buyerAccountNumber}</span></p>
                            <p><span className="text-muted-foreground">Chủ TK:</span> <span className="font-semibold">{order.refundBankInfo.buyerAccountHolder}</span></p>
                          </div>
                        </div>
                      </div>
                    ) : order.status === "returned" ? (
                      <form onSubmit={handleSubmitBankInfo} className="space-y-3">
                        <p className="text-sm text-muted-foreground">Hàng đã về người bán. Vui lòng cung cấp thông tin ngân hàng để nhận tiền hoàn.</p>
                        <div>
                          <label className="block text-xs font-medium text-foreground mb-1">Tên ngân hàng</label>
                          <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            required
                            placeholder="VD: Vietcombank, Techcombank..."
                            className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-foreground mb-1">Số tài khoản</label>
                          <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            required
                            placeholder="Nhập số tài khoản..."
                            className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-foreground mb-1">Tên chủ tài khoản</label>
                          <input
                            type="text"
                            value={accountHolder}
                            onChange={(e) => setAccountHolder(e.target.value)}
                            required
                            placeholder="Tên đầy đủ trên tài khoản..."
                            className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmittingBankInfo || !bankName.trim() || !accountNumber.trim() || !accountHolder.trim()}
                          className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                        >
                          {isSubmittingBankInfo ? "Đang gửi..." : "Xác nhận thông tin ngân hàng"}
                        </button>
                      </form>
                    ) : null}
                  </div>
                )}

                <div className="bg-card rounded-2xl border border-border p-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tiền hàng</span>
                      <span>{formatPrice(order.productAmount || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Phí vận chuyển</span>
                      <span>{formatPrice(order.shippingFee || 0)}</span>
                    </div>
                    {order.insuranceFee && order.insuranceFee > 0 && (
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Phí bảo hiểm</span>
                        <span>{formatPrice(order.insuranceFee)}</span>
                      </div>
                    )}
                    {order.codFee && order.codFee > 0 && (
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Phí COD</span>
                        <span>{formatPrice(order.codFee)}</span>
                      </div>
                    )}
                    <div className="pt-2 mt-2 border-t border-border flex justify-between items-center">
                      <span className="text-base font-semibold text-foreground">Tổng cộng</span>
                      <span className="text-xl font-semibold text-primary">{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-4">
                  <div className="flex flex-col gap-2">
                    {order.status === "pending" && (
                      <button
                        type="button"
                        onClick={handleCancelOrder}
                        disabled={isCancelling}
                        className="w-full py-2.5 px-4 bg-destructive text-destructive-foreground rounded-xl font-semibold hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                      >
                        <IconCircleX className="w-5 h-5" />
                        {isCancelling ? "Đang hủy..." : "Hủy đơn hàng"}
                      </button>
                    )}
                    {order.status === "delivered" && (
                      <>
                        <button
                          type="button"
                          onClick={handleConfirmReceived}
                          disabled={isConfirmingReceived}
                          className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                          <IconCircleCheck className="w-5 h-5" />
                          {isConfirmingReceived ? "Đang xử lý..." : "Đã nhận hàng"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowRefundModal(true)}
                          className="w-full py-2.5 px-4 border border-orange-500 text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all"
                        >
                          Yêu cầu hoàn tiền
                        </button>
                      </>
                    )}
                    {order.status === "delivered" && !order.statusPayment && (
                      <Link
                        href={`/payment?orderId=${order._id}`}
                        className="w-full py-2.5 px-4 bg-foreground text-background rounded-xl font-semibold text-center hover:bg-foreground/90 transition-all"
                      >
                        Thanh toán ngay
                      </Link>
                    )}
                  </div>
                </div>
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
