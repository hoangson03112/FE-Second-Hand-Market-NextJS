"use client";

import { IconArrowLeft, IconPackage, IconMapPin, IconPhone, IconTruck, IconStar, IconShoppingBag, IconClock, IconCreditCard, IconUser, IconCircleCheck, IconCircleX, IconMessage } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";
import { OrderService } from "@/services/order.service";
import { SellerReviewService } from "@/services/sellerReview.service";
import { ProductReviewService } from "@/services/productReview.service";
import { formatPrice } from "@/utils/format/price";
import { format, formatDateOnly } from "@/utils/format/date";
import { getConditionLabel, getConditionBadgeColor } from "@/utils/format";
import { Container } from "@/components/layout/Container";
import type { Order } from "@/types/order";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { STATUS_CONFIG } from "@/constants/orderStatus";

interface OrderDetailProps {
  orderId: string;
}

export default function OrderDetail({ orderId }: OrderDetailProps) {
  const router = useRouter();
  const toast = useToast();
  const { confirm } = useConfirm();
  const { data: account, isLoading: userLoading } = useUser();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [existingReview, setExistingReview] = useState<{
    _id: string;
    rating: number;
    comment?: string;
  } | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isConfirmingReceived, setIsConfirmingReceived] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [productReviews, setProductReviews] = useState<
    Record<string, { rating: number; comment?: string }>
  >({});
  const [showProductReviewModal, setShowProductReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [productReviewRating, setProductReviewRating] = useState(5);
  const [productReviewComment, setProductReviewComment] = useState("");
  const [isSubmittingProductReview, setIsSubmittingProductReview] =
    useState(false);

  useEffect(() => {
    if (!userLoading && !account) {
      router.push("/login");
      return;
    }
    if (!account) return;

    const fetchOrder = async () => {
      try {
        const res = await OrderService.getById(orderId);
        setOrder(res.order);
      } catch (error) {
        console.error("Error fetching order:", error);
        router.push("/orders");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [account, userLoading, orderId, router]);

  useEffect(() => {
    if (!order || !["completed", "delivered"].includes(order.status)) return;
    const fetchReview = async () => {
      try {
        const res = await SellerReviewService.getByOrder(orderId);
        if (res?.data?.review) setExistingReview(res.data.review);
        else setShowReviewForm(true);
      } catch {
        setShowReviewForm(true);
      }
    };
    fetchReview();

    // Fetch product reviews
    const fetchProductReviews = async () => {
      const reviews: Record<string, { rating: number; comment?: string }> = {};
      for (const item of order.products) {
        try {
          const res = await ProductReviewService.getByOrderAndProduct(
            orderId,
            item.productId._id,
          );
          if (res?.review) {
            reviews[item.productId._id] = {
              rating: res.review.rating,
              comment: res.review.comment,
            };
          }
        } catch {
          // No review yet
        }
      }
      setProductReviews(reviews);
    };
    fetchProductReviews();
  }, [order, orderId]);

  const handleCancelOrder = async () => {
    if (!order || order.status !== "pending") return;
    const ok = await confirm({
      title: "Hủy đơn hàng",
      message: "Bạn có chắc muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.",
      confirmText: "Hủy đơn",
      cancelText: "Giữ lại",
      variant: "danger",
    });
    if (!ok) return;
    setIsCancelling(true);
    try {
      await OrderService.updateStatus(order._id, "cancelled");
      setOrder((prev) => (prev ? { ...prev, status: "cancelled" } : null));
      toast.success("Đã hủy đơn hàng");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể hủy đơn hàng",
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order?.sellerId) return;
    setIsSubmittingReview(true);
    try {
      await SellerReviewService.create({
        sellerId: order.sellerId._id,
        orderId: order._id,
        rating: reviewRating,
        comment: reviewComment || undefined,
      });
      setExistingReview({
        _id: "",
        rating: reviewRating,
        comment: reviewComment,
      });
      setShowReviewForm(false);
      setReviewComment("");
      toast.success("Đã gửi đánh giá thành công!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Không thể gửi đánh giá");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleConfirmReceived = async () => {
    if (!order || order.status !== "delivered") return;
    if (!window.confirm("Xác nhận bạn đã nhận được hàng?")) return;
    setIsConfirmingReceived(true);
    try {
      await OrderService.confirmReceived(order._id);
      setOrder((prev) => (prev ? { ...prev, status: "completed" } : null));
      toast.success("Đã xác nhận nhận hàng thành công!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể xác nhận nhận hàng",
      );
    } finally {
      setIsConfirmingReceived(false);
    }
  };

  const handleSubmitRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !refundReason.trim()) return;
    setIsSubmittingRefund(true);
    try {
      await OrderService.requestRefund(order._id, refundReason);
      setOrder((prev) => (prev ? { ...prev, status: "returned" } : null));
      setShowRefundModal(false);
      setRefundReason("");
      toast.success("Đã gửi yêu cầu hoàn tiền!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể gửi yêu cầu hoàn tiền",
      );
    } finally {
      setIsSubmittingRefund(false);
    }
  };

  const handleOpenProductReview = (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setProductReviewRating(5);
    setProductReviewComment("");
    setShowProductReviewModal(true);
  };

  const handleSubmitProductReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !selectedProduct) return;
    setIsSubmittingProductReview(true);
    try {
      await ProductReviewService.create({
        productId: selectedProduct.id,
        orderId: order._id,
        rating: productReviewRating,
        comment: productReviewComment || undefined,
      });
      setProductReviews((prev) => ({
        ...prev,
        [selectedProduct.id]: {
          rating: productReviewRating,
          comment: productReviewComment,
        },
      }));
      setShowProductReviewModal(false);
      toast.success("Đã gửi đánh giá sản phẩm thành công!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể gửi đánh giá sản phẩm",
      );
    } finally {
      setIsSubmittingProductReview(false);
    }
  };

  if (userLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-cream-50/30 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-neutral-600">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!account || !order) return null;

  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const shippingAddr = order.shippingAddress;

  return (
    <div className="min-h-screen bg-[#FDFAF6]">
      {/* Header */}
      <div className="bg-[#FDFAF6]/95 backdrop-blur-md border-b border-[#EDE0D4] sticky top-0 z-10">
        <Container maxWidth="6xl" paddingX="md">
          <div className="py-4 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-[#F5EDE4] transition-colors"
            >
              <IconArrowLeft className="h-5 w-5 text-[#1A1714]" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-[#1A1714] flex items-center gap-2">
                <IconShoppingBag className="w-7 h-7 text-[#C47B5A]" />
                Chi tiết đơn hàng
              </h1>
              <p className="text-sm text-[#7A6755] mt-0.5">
                Mã đơn nội bộ:{" "}
                <span className="font-mono font-semibold">
                  {order._id.slice(-8).toUpperCase()}
                </span>
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${statusConfig.bgColor} ${statusConfig.color} flex items-center gap-2`}
            >
              <span>{statusConfig.icon}</span>
              <span>{statusConfig.label}</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Content */}
      <Container maxWidth="6xl" paddingX="md" paddingY="lg">
        <div className="space-y-4 sm:space-y-5">
          {/* Order Timeline */}
          <div className="bg-white rounded-2xl border border-[#EDE0D4] p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <IconClock className="w-5 h-5 text-[#C47B5A]" />
              <h2 className="text-lg font-semibold text-[#1A1714]">
                Lịch sử đơn hàng
              </h2>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#C47B5A] via-[#EDE0D4] to-[#EDE0D4]" />

              <div className="space-y-6">
                {/* Completed/Current Status */}
                <div className="relative flex gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-lg ${
                      statusConfig.bgColor
                    }`}
                  >
                    <span className="text-xl">{statusConfig.icon}</span>
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-bold ${statusConfig.color}`}>
                        {statusConfig.label}
                      </h3>
                      <span className="text-xs text-neutral-500">
                        {format(order.updatedAt)}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600">
                      {order.status === "pending" &&
                        "Đơn hàng đang chờ người bán xác nhận"}
                      {order.status === "confirmed" &&
                        "Người bán đã xác nhận, đơn hàng đã được tạo trên GHN"}
                      {order.status === "picked_up" &&
                        "GHN đã lấy hàng thành công"}
                      {order.status === "shipping" &&
                        "Đơn hàng đang được vận chuyển"}
                      {order.status === "out_for_delivery" &&
                        "Shipper đang trên đường giao hàng"}
                      {order.status === "delivered" &&
                        "Đơn hàng đã được giao đến bạn"}
                      {order.status === "completed" && "Đơn hàng đã hoàn thành"}
                      {order.status === "failed" && "Giao hàng thất bại"}
                      {order.status === "returned" && "Hàng đã được hoàn trả"}
                      {order.status === "cancelled" && "Đơn hàng đã bị hủy"}
                    </p>
                    {order?.ghnOrderCode &&
                      [
                        "confirmed",
                        "picked_up",
                        "shipping",
                        "out_for_delivery",
                        "delivered",
                      ].includes(order.status) && (
                        <p className="text-xs text-[#7A6755] mt-2 font-mono">
                          Mã vận đơn GHN:{" "}
                          <span className="font-semibold text-[#C47B5A]">
                            {order.ghnOrderCode}
                          </span>
                        </p>
                      )}
                  </div>
                </div>

                {/* Created Status */}
                <div className="relative flex gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-lg bg-green-50">
                    <span className="text-xl">✓</span>
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-green-700">Đã đặt hàng</h3>
                      <span className="text-xs text-neutral-500">
                        {format(order.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600">
                      Đơn hàng đã được tạo thành công
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
            <div className="lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-5">
              {/* Products */}
              <div className="bg-white rounded-2xl border border-[#EDE0D4] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#EDE0D4] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5EDE4] flex items-center justify-center">
                    <IconPackage className="w-5 h-5 text-[#C47B5A]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#1A1714]">Sản phẩm đã đặt</h2>
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
                      const canReview = ["completed", "delivered"].includes(order.status);

                      return (
                        <div key={idx} className="flex gap-4 p-4 rounded-xl hover:bg-[#FDFAF6] transition-colors border border-[#EDE0D4]">
                          <div className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-100 shrink-0 ring-1 ring-neutral-200">
                            <Image src={avatar} alt={product?.name || "Sản phẩm"} width={96} height={96} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#1A1714] line-clamp-2 mb-2">{product?.name || "Sản phẩm"}</h4>
                            {conditionLabel && badgeColorClass && (
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${badgeColorClass} mb-2`}>
                                {conditionLabel}
                              </span>
                            )}
                            <div className="flex items-center gap-4 mb-2">
                              <p className="text-sm text-neutral-600">
                                Số lượng: <span className="font-semibold text-neutral-900">×{item.quantity}</span>
                              </p>
                              <p className="text-lg font-semibold text-[#C47B5A]">{formatPrice(item.price || product?.price || 0)}</p>
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
                                    className="text-sm text-[#C47B5A] font-medium hover:underline flex items-center gap-1"
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
                    <div className="mt-5 pt-5 border-t border-[#EDE0D4] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#F5EDE4] flex items-center justify-center">
                          <IconUser className="w-6 h-6 text-[#C47B5A]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#7A6755]">Người bán</p>
                          <p className="font-semibold text-[#1A1714] text-base">{order.sellerId.fullName || "—"}</p>
                          {order.sellerId.phoneNumber && (
                            <p className="text-sm text-neutral-600 flex items-center gap-1">
                              <IconPhone className="w-3.5 h-3.5" />
                              {order.sellerId.phoneNumber}
                            </p>
                          )}
                        </div>
                      </div>
                      <button className="px-4 py-2 rounded-full bg-[#F5EDE4] hover:bg-[#EDE0D4] transition-colors group flex items-center gap-2">
                        <IconMessage className="w-5 h-5 text-[#C47B5A]" />
                        <span className="text-sm font-semibold text-[#C47B5A]">Nhắn tin</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {(order.status === "completed" || order.status === "delivered") && (
                <div className="bg-white rounded-2xl border border-[#EDE0D4] p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <IconStar className="w-5 h-5 text-[#C47B5A]" />
                    <h2 className="text-lg font-semibold text-[#1A1714]">Đánh giá người bán</h2>
                  </div>
                  {existingReview ? (
                    <div className="bg-amber-50/50 rounded-2xl border border-amber-200/50 p-4">
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
                          className="w-full px-4 py-3 rounded-xl border border-[#EDE0D4] bg-[#FDFAF6] focus:border-[#C47B5A] focus:ring-2 focus:ring-[#C47B5A]/20 transition-all text-neutral-900"
                          placeholder="Chia sẻ trải nghiệm mua hàng của bạn..."
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="w-full py-3 px-6 bg-[#1A1714] text-white rounded-xl font-semibold hover:bg-[#2a221b] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                <div className="bg-white rounded-2xl border border-[#EDE0D4] p-5">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-1 border-b border-[#EDE0D4]">
                      <span className="text-sm text-[#7A6755]">Thời gian đặt hàng</span>
                      <span className="text-sm font-semibold text-[#1A1714]">{format(order.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[#EDE0D4]">
                      <span className="text-sm text-[#7A6755]">Thanh toán</span>
                      <span className="text-sm font-semibold text-[#1A1714] flex items-center gap-1.5 text-right">
                        <IconCreditCard className="w-4 h-4 text-[#C47B5A]" />
                        {order.paymentMethod === "cod"
                          ? "COD"
                          : order.paymentMethod === "bank_transfer"
                            ? "Chuyển khoản"
                            : order.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-[#7A6755]">Trạng thái TT</span>
                      <span className={`text-sm font-semibold flex items-center gap-1 ${order.statusPayment ? "text-green-600" : "text-amber-600"}`}>
                        {order.statusPayment ? <IconCircleCheck className="w-4 h-4" /> : <IconCircleX className="w-4 h-4" />}
                        {order.statusPayment ? "Đã thanh toán" : "Chưa thanh toán"}
                      </span>
                    </div>
                  </div>
                </div>

                {shippingAddr && (
                  <div className="bg-white rounded-2xl border border-[#EDE0D4] p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <IconMapPin className="w-4 h-4 text-[#C47B5A]" />
                      <h3 className="text-sm font-semibold text-[#1A1714]">Địa chỉ nhận hàng</h3>
                    </div>
                    <p className="text-sm font-semibold text-[#1A1714]">{shippingAddr.fullName}</p>
                    <p className="text-sm text-[#7A6755]">{shippingAddr.phoneNumber}</p>
                    <p className="text-sm text-[#7A6755] mt-1">{shippingAddr.specificAddress}</p>
                    {(shippingAddr.ward || shippingAddr.district || shippingAddr.province) && (
                      <p className="text-sm text-[#7A6755]">{[shippingAddr.ward, shippingAddr.district, shippingAddr.province].filter(Boolean).join(", ")}</p>
                    )}
                    <div className="mt-3 pt-3 border-t border-[#EDE0D4]">
                      <p className="text-xs text-[#7A6755]">Vận chuyển</p>
                      <p className="text-sm font-medium text-[#1A1714]">{order.shippingMethod || "Chưa cập nhật"}</p>
                      {order.expectedDeliveryTime && (
                        <p className="text-xs text-[#7A6755] mt-1">Dự kiến: {formatDateOnly(order.expectedDeliveryTime)}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl border border-[#EDE0D4] p-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-[#7A6755]">
                      <span>Tiền hàng</span>
                      <span>{formatPrice(order.productAmount || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#7A6755]">
                      <span>Phí vận chuyển</span>
                      <span>{formatPrice(order.shippingFee || 0)}</span>
                    </div>
                    {order.insuranceFee && order.insuranceFee > 0 && (
                      <div className="flex justify-between text-sm text-[#7A6755]">
                        <span>Phí bảo hiểm</span>
                        <span>{formatPrice(order.insuranceFee)}</span>
                      </div>
                    )}
                    {order.codFee && order.codFee > 0 && (
                      <div className="flex justify-between text-sm text-[#7A6755]">
                        <span>Phí COD</span>
                        <span>{formatPrice(order.codFee)}</span>
                      </div>
                    )}
                    <div className="pt-2 mt-2 border-t border-[#EDE0D4] flex justify-between items-center">
                      <span className="text-base font-semibold text-[#1A1714]">Tổng cộng</span>
                      <span className="text-xl font-semibold text-[#C47B5A]">{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#EDE0D4] p-4">
                  <div className="flex flex-col gap-2">
                    {order.status === "pending" && (
                      <button
                        type="button"
                        onClick={handleCancelOrder}
                        disabled={isCancelling}
                        className="w-full py-2.5 px-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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
                          className="w-full py-2.5 px-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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
                        className="w-full py-2.5 px-4 bg-[#1A1714] text-white rounded-xl font-semibold text-center hover:bg-[#2a221b] transition-all"
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

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-cream-50 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b-2 border-neutral-200/60">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-neutral-900">
                  Yêu cầu hoàn tiền
                </h3>
                <button
                  onClick={() => {
                    setShowRefundModal(false);
                    setRefundReason("");
                  }}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <IconCircleX className="w-6 h-6 text-neutral-500" />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmitRefund} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Lý do hoàn tiền <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  rows={6}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200/60 bg-cream-50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-neutral-900"
                  placeholder="Vui lòng mô tả chi tiết lý do bạn muốn hoàn tiền..."
                />
                <p className="text-xs text-neutral-500 mt-2">
                  * Yêu cầu hoàn tiền sẽ được xem xét trong vòng 24-48h
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowRefundModal(false);
                    setRefundReason("");
                  }}
                  className="flex-1 py-3 px-6 border-2 border-neutral-300 text-neutral-900 rounded-full font-bold hover:bg-neutral-50 transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRefund || !refundReason.trim()}
                  className="flex-1 py-3 px-6 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmittingRefund ? "Đang gửi..." : "Gửi yêu cầu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Review Modal */}
      {showProductReviewModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-cream-50 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b-2 border-neutral-200/60">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">
                    Đánh giá sản phẩm
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    {selectedProduct.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowProductReviewModal(false);
                    setSelectedProduct(null);
                    setProductReviewComment("");
                  }}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <IconCircleX className="w-6 h-6 text-neutral-500" />
                </button>
              </div>
            </div>
            <form
              onSubmit={handleSubmitProductReview}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Đánh giá của bạn <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 justify-center py-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setProductReviewRating(i)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <IconStar
                        className={`w-10 h-10 ${
                          i <= productReviewRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-neutral-300 hover:text-amber-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Nhận xét (tùy chọn)
                </label>
                <textarea
                  value={productReviewComment}
                  onChange={(e) => setProductReviewComment(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200/60 bg-cream-50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-neutral-900"
                  placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowProductReviewModal(false);
                    setSelectedProduct(null);
                    setProductReviewComment("");
                  }}
                  className="flex-1 py-3 px-6 border-2 border-neutral-300 text-neutral-900 rounded-full font-bold hover:bg-neutral-50 transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProductReview}
                  className="flex-1 py-3 px-6 bg-primary text-white rounded-full font-bold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmittingProductReview ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
