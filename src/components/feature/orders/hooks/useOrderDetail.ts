"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { OrderService } from "@/services/order.service";
import { SellerReviewService } from "@/services/sellerReview.service";
import { ProductReviewService } from "@/services/productReview.service";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import type { Order } from "@/types/order";

export function useOrderDetail(orderId: string) {
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
  const [isSubmittingProductReview, setIsSubmittingProductReview] = useState(false);

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
      message: "Bạn có chắc muốn hủy đơn hàng này?",
      confirmText: "Hủy đơn",
      cancelText: "Không",
      variant: "danger",
    });
    if (!ok) return;
    setIsCancelling(true);
    try {
      await OrderService.updateStatus(order._id, "cancelled");
      setOrder((prev) => (prev ? { ...prev, status: "cancelled" } : null));
      toast.success("Đã hủy đơn hàng");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể hủy đơn hàng");
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
      setExistingReview({ _id: "", rating: reviewRating, comment: reviewComment });
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
    const ok = await confirm({
      title: "Xác nhận đã nhận hàng",
      message: "Xác nhận bạn đã nhận được hàng?",
      confirmText: "Xác nhận",
      cancelText: "Hủy",
    });
    if (!ok) return;
    setIsConfirmingReceived(true);
    try {
      await OrderService.confirmReceived(order._id);
      setOrder((prev) => (prev ? { ...prev, status: "completed" } : null));
      toast.success("Đã xác nhận nhận hàng thành công!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xác nhận nhận hàng");
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
        error instanceof Error ? error.message : "Không thể gửi yêu cầu hoàn tiền",
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
        error instanceof Error ? error.message : "Không thể gửi đánh giá sản phẩm",
      );
    } finally {
      setIsSubmittingProductReview(false);
    }
  };

  const isBuyer = !!(account && order && order.buyerId?._id === account.accountID);

  return {
    account,
    userLoading,
    order,
    isLoading,
    isBuyer,
    // seller review
    existingReview,
    showReviewForm,
    reviewRating,
    reviewComment,
    isSubmittingReview,
    setReviewRating,
    setReviewComment,
    handleSubmitReview,
    // cancel
    isCancelling,
    handleCancelOrder,
    // confirm received
    isConfirmingReceived,
    handleConfirmReceived,
    // refund
    showRefundModal,
    refundReason,
    isSubmittingRefund,
    setShowRefundModal,
    setRefundReason,
    handleSubmitRefund,
    // product reviews
    productReviews,
    showProductReviewModal,
    selectedProduct,
    productReviewRating,
    productReviewComment,
    isSubmittingProductReview,
    setShowProductReviewModal,
    setSelectedProduct,
    setProductReviewRating,
    setProductReviewComment,
    handleOpenProductReview,
    handleSubmitProductReview,
  };
}
