"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  Truck,
  Star,
  ShoppingBag,
  Clock,
  CreditCard,
  User,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { OrderService } from "@/services/order.service";
import { SellerReviewService } from "@/services/sellerReview.service";
import { ProductReviewService } from "@/services/productReview.service";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import { getConditionLabel, getConditionBadgeColor } from "@/utils/format";
import { Container } from "@/components/layout/Container";
import type { Order } from "@/types/order";
import { useToast } from "@/components/ui";
import { STATUS_CONFIG } from "@/constants/orderStatus";

interface OrderDetailProps {
  orderId: string;
}

export default function OrderDetail({ orderId }: OrderDetailProps) {
  const router = useRouter();
  const toast = useToast();
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
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
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
      setOrder((prev) => (prev ? { ...prev, status: "refund" } : null));
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
  const isBuyer = account && order && order.buyerId?._id === account.accountID;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-cream-50/30 to-background">
      {/* Header */}
      <div className="bg-cream-50/95 backdrop-blur-md border-b-2 border-neutral-200/60 sticky top-0 z-10 shadow-sm">
        <Container maxWidth="6xl" paddingX="md">
          <div className="py-4 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-cream-50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-neutral-900" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                <ShoppingBag className="w-7 h-7 text-primary" />
                Chi tiết đơn hàng
              </h1>
              <p className="text-sm text-neutral-600 mt-0.5">
                Mã đơn:{" "}
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
        <div className="space-y-4">
          {/* Order Timeline */}
          <div className="bg-cream-50/90 backdrop-blur-md rounded-3xl border-2 border-neutral-200/60 shadow-lg shadow-neutral-200/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-neutral-900">
                Lịch sử đơn hàng
              </h2>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-neutral-200 to-neutral-200" />

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
                        <p className="text-xs text-neutral-500 mt-2 font-mono">
                          Mã vận đơn GHN:{" "}
                          <span className="font-semibold text-primary">
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

          {/* Original Order Info */}
          <div className="bg-cream-50/90 backdrop-blur-md rounded-3xl border-2 border-neutral-200/60 shadow-lg shadow-neutral-200/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-neutral-900">
                Thông tin đơn hàng
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-neutral-200/60">
                <span className="text-sm text-neutral-600">
                  Thời gian đặt hàng
                </span>
                <span className="text-sm font-semibold text-neutral-900">
                  {format(order.createdAt)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-200/60">
                <span className="text-sm text-neutral-600">
                  Phương thức thanh toán
                </span>
                <span className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  {order.paymentMethod === "cod"
                    ? "COD (Thanh toán khi nhận hàng)"
                    : order.paymentMethod === "bank_transfer"
                      ? "Chuyển khoản ngân hàng"
                      : order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-neutral-600">
                  Trạng thái thanh toán
                </span>
                <span
                  className={`text-sm font-semibold flex items-center gap-1.5 ${order.statusPayment ? "text-green-600" : "text-amber-600"}`}
                >
                  {order.statusPayment ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Đã thanh toán
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Chưa thanh toán
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-cream-50/90 backdrop-blur-md rounded-3xl border-2 border-neutral-200/60 shadow-lg shadow-neutral-200/50 overflow-hidden">
            <div className="bg-cream-50/50 px-5 py-4 border-b-2 border-neutral-200/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-neutral-900">
                Sản phẩm đã đặt
              </h2>
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
                        : "/placeholder.svg";
                  const condition = product?.condition;
                  const conditionLabel = condition
                    ? getConditionLabel(condition)
                    : null;
                  const badgeColorClass = condition
                    ? getConditionBadgeColor(condition)
                    : null;
                  const hasReview = productReviews[product._id];
                  const canReview =
                    isBuyer &&
                    ["completed", "delivered"].includes(order.status);

                  return (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 rounded-2xl hover:bg-cream-50/50 transition-colors border border-neutral-200/40"
                    >
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-100 shrink-0 ring-1 ring-neutral-200">
                        <Image
                          src={avatar}
                          alt={product?.name || "Sản phẩm"}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-neutral-900 line-clamp-2 mb-2">
                          {product?.name || "Sản phẩm"}
                        </h4>
                        {conditionLabel && badgeColorClass && (
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${badgeColorClass} mb-2`}
                          >
                            {conditionLabel}
                          </span>
                        )}
                        <div className="flex items-center gap-4 mb-2">
                          <p className="text-sm text-neutral-600">
                            Số lượng:{" "}
                            <span className="font-semibold text-neutral-900">
                              ×{item.quantity}
                            </span>
                          </p>
                          <p className="text-lg font-bold text-primary">
                            {formatPrice(item.price || product?.price || 0)}
                          </p>
                        </div>
                        {canReview && (
                          <div className="mt-2">
                            {hasReview ? (
                              <div className="flex items-center gap-2 text-sm">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i <= hasReview.rating
                                          ? "fill-amber-400 text-amber-400"
                                          : "text-neutral-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-neutral-600">
                                  Đã đánh giá
                                </span>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  handleOpenProductReview(
                                    product._id,
                                    product.name,
                                  )
                                }
                                className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                              >
                                <Star className="w-4 h-4" />
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

              {/* Seller Info */}
              {order.sellerId && (
                <div className="mt-5 pt-5 border-t-2 border-neutral-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600">Người bán</p>
                      <p className="font-bold text-neutral-900 text-base">
                        {order.sellerId.fullName || "—"}
                      </p>
                      {order.sellerId.phoneNumber && (
                        <p className="text-sm text-neutral-600 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {order.sellerId.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors group flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <span className="text-sm font-semibold text-primary">
                      Nhắn tin
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {shippingAddr && (
            <div className="bg-cream-50/90 backdrop-blur-md rounded-3xl border-2 border-neutral-200/60 shadow-lg shadow-neutral-200/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-neutral-900">
                  Địa chỉ nhận hàng
                </h2>
              </div>
              <div className="bg-blue-50/50 rounded-2xl border border-blue-200/50 p-4">
                <p className="font-bold text-neutral-900 text-base mb-1">
                  {shippingAddr.fullName}
                </p>
                <p className="text-sm text-neutral-700 flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  {shippingAddr.phoneNumber}
                </p>
                <p className="text-sm text-neutral-700">
                  {shippingAddr.specificAddress}
                </p>
                {(shippingAddr.ward ||
                  shippingAddr.district ||
                  shippingAddr.province) && (
                  <p className="text-sm text-neutral-600 mt-1">
                    {[
                      shippingAddr.ward,
                      shippingAddr.district,
                      shippingAddr.province,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Shipping Method */}
          <div className="bg-cream-50/90 backdrop-blur-md rounded-3xl border-2 border-neutral-200/60 shadow-lg shadow-neutral-200/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-neutral-900">Vận chuyển</h2>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-700">
                {order.shippingMethod || "Chưa cập nhật"}
              </span>
              {order.expectedDeliveryTime && (
                <span className="text-sm text-neutral-600">
                  Dự kiến: {format(order.expectedDeliveryTime)}
                </span>
              )}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-cream-50/90 backdrop-blur-md rounded-3xl border-2 border-neutral-200/60 shadow-lg shadow-neutral-200/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-neutral-900">
                Chi tiết thanh toán
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-700">Tiền hàng</span>
                <span className="font-semibold text-neutral-900">
                  {formatPrice(order.productAmount || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-700">Phí vận chuyển</span>
                <span className="font-semibold text-neutral-900">
                  {formatPrice(order.shippingFee || 0)}
                </span>
              </div>
              {order.insuranceFee && order.insuranceFee > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700">Phí bảo hiểm</span>
                  <span className="font-semibold text-neutral-900">
                    {formatPrice(order.insuranceFee)}
                  </span>
                </div>
              )}
              {order.codFee && order.codFee > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700">Phí COD</span>
                  <span className="font-semibold text-neutral-900">
                    {formatPrice(order.codFee)}
                  </span>
                </div>
              )}
              <div className="pt-3 border-t-2 border-neutral-200/60 flex justify-between items-center">
                <span className="text-xl font-bold text-neutral-900">
                  Tổng cộng
                </span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Seller Review */}
          {(order.status === "completed" || order.status === "delivered") &&
            isBuyer && (
              <div className="bg-cream-50/90 backdrop-blur-md rounded-3xl border-2 border-neutral-200/60 shadow-lg shadow-neutral-200/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-neutral-900">
                    Đánh giá người bán
                  </h2>
                </div>
                {existingReview ? (
                  <div className="bg-amber-50/50 rounded-2xl border border-amber-200/50 p-4">
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${
                            i <= existingReview.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-neutral-300"
                          }`}
                        />
                      ))}
                    </div>
                    {existingReview.comment && (
                      <p className="text-sm text-neutral-700 leading-relaxed">
                        {existingReview.comment}
                      </p>
                    )}
                  </div>
                ) : showReviewForm ? (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Đánh giá của bạn
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setReviewRating(i)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-10 h-10 ${
                                i <= reviewRating
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
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200/60 bg-cream-50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-neutral-900"
                        placeholder="Chia sẻ trải nghiệm mua hàng của bạn..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="w-full py-3 px-6 bg-primary text-white rounded-full font-bold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isSubmittingReview
                        ? "Đang gửi đánh giá..."
                        : "Gửi đánh giá"}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8 text-neutral-500">
                    <Star className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
                    <p>Đang tải thông tin đánh giá...</p>
                  </div>
                )}
              </div>
            )}

          {/* Action Buttons */}
          <div className="bg-cream-50/90 backdrop-blur-md rounded-3xl border-2 border-neutral-200/60 shadow-lg shadow-neutral-200/50 p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {isBuyer && order.status === "pending" && (
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="flex-1 py-3 px-6 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isCancelling ? "Đang hủy..." : "Hủy đơn hàng"}
                </button>
              )}
              {isBuyer && order.status === "delivered" && (
                <>
                  <button
                    type="button"
                    onClick={handleConfirmReceived}
                    disabled={isConfirmingReceived}
                    className="flex-1 py-3 px-6 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    {isConfirmingReceived ? "Đang xử lý..." : "Đã nhận hàng"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRefundModal(true)}
                    className="flex-1 py-3 px-6 border-2 border-orange-500 text-orange-600 rounded-full font-bold hover:bg-orange-50 transition-all"
                  >
                    Yêu cầu hoàn tiền
                  </button>
                </>
              )}
              {order.status === "delivered" &&
                !order.statusPayment &&
                isBuyer && (
                  <Link
                    href={`/payment?orderId=${order._id}`}
                    className="flex-1 py-3 px-6 bg-primary text-white rounded-full font-bold text-center hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all"
                  >
                    Thanh toán ngay
                  </Link>
                )}
              {(order.status === "completed" ||
                order.status === "cancelled") && (
                <Link
                  href="/orders"
                  className="flex-1 py-3 px-6 border-2 border-neutral-300 text-neutral-900 rounded-full font-bold text-center hover:bg-cream-50 transition-all"
                >
                  Quay lại đơn hàng
                </Link>
              )}
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
                  <XCircle className="w-6 h-6 text-neutral-500" />
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
                  <XCircle className="w-6 h-6 text-neutral-500" />
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
                      <Star
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
