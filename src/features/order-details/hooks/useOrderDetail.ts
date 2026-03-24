"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { OrderService } from "@/services/order.service";
import { SellerReviewService } from "@/services/sellerReview.service";
import { ProductReviewService } from "@/services/productReview.service";
import type { Order } from "@/types/order";
import { ORDER_MESSAGES, REVIEW_MESSAGES, REFUND_MESSAGES } from "@/constants/messages";

interface UseOrderDetailParams {
  orderId: string;
  autoOpenRefund?: boolean;
  autoOpenReview?: boolean;
}

export function useOrderDetail({ orderId, autoOpenRefund, autoOpenReview }: UseOrderDetailParams) {
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
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isConfirmingReceived, setIsConfirmingReceived] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [refundDescription, setRefundDescription] = useState("");
  const [refundImages, setRefundImages] = useState<File[]>([]);
  const [refundVideos, setRefundVideos] = useState<File[]>([]);
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [isSubmittingBankInfo, setIsSubmittingBankInfo] = useState(false);
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
        setOrder(res.order ?? null);
      } catch (error) {
        console.error("Error fetching order:", error);
        setOrder(null);
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

    fetchReview();
    fetchProductReviews();
  }, [order, orderId]);

  // Auto-open refund or review modal when navigated from order list with query params
  useEffect(() => {
    if (!order || isLoading) return;
    if (autoOpenRefund && (order.status === "delivered" || order.status === "completed")) {
      setShowRefundModal(true);
    } else if (autoOpenReview && (order.status === "completed" || order.status === "delivered")) {
      // Scroll to review section
      setTimeout(() => {
        document.getElementById("seller-review-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [order, isLoading, autoOpenRefund, autoOpenReview]);

  const handleCancelOrder = () => {
    if (!order || order.status !== "pending") return;
    setShowCancelDialog(true);
  };

  const handleCloseCancelDialog = () => {
    if (isCancelling) return;
    setShowCancelDialog(false);
  };

  const handleConfirmCancelOrder = async (reason: string) => {
    if (!order || order.status !== "pending") return;

    setIsCancelling(true);
    try {
      await OrderService.cancelOrder(order._id, reason);
      setOrder((prev) => (prev ? { ...prev, status: "cancelled" } : null));
      setShowCancelDialog(false);
      toast.success(ORDER_MESSAGES.CANCEL_SUCCESS);
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
      toast.success(REVIEW_MESSAGES.SELLER_REVIEW_SUCCESS);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(REVIEW_MESSAGES.SELLER_REVIEW_ERROR);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleConfirmReceived = async () => {
    if (!order || order.status !== "delivered") return;
    const ok = await confirm({
      title: "Xác nhận nhận hàng",
      message: "Bạn xác nhận đã nhận được hàng?",
      confirmText: "Xác nhận",
      cancelText: "Để sau",
      variant: "info",
    });
    if (!ok) return;

    setIsConfirmingReceived(true);
    try {
      await OrderService.confirmReceived(order._id);
      setOrder((prev) => (prev ? { ...prev, status: "completed" } : null));
      toast.success(ORDER_MESSAGES.CONFIRM_RECEIVED_SUCCESS);
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
    if (!bankName.trim() || !accountNumber.trim() || !accountHolder.trim()) return;

    setIsSubmittingRefund(true);
    try {
      await OrderService.requestRefund(
        order._id,
        refundReason,
        refundDescription || undefined,
        refundImages.length ? refundImages : undefined,
        refundVideos.length ? refundVideos : undefined,
        bankName.trim(),
        accountNumber.trim(),
        accountHolder.trim(),
      );
      setOrder((prev) => (prev ? { ...prev, status: "refund_requested" } : null));
      setShowRefundModal(false);
      setRefundReason("");
      setRefundDescription("");
      setRefundImages([]);
      setRefundVideos([]);
      setBankName("");
      setAccountNumber("");
      setAccountHolder("");
      toast.success(REFUND_MESSAGES.REQUEST_SUCCESS);
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

  const handleSubmitBankInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !bankName.trim() || !accountNumber.trim() || !accountHolder.trim()) return;

    setIsSubmittingBankInfo(true);
    try {
      const res = await OrderService.submitRefundBankInfo(order._id, {
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        accountHolder: accountHolder.trim(),
      });
      setOrder(res.data);
      toast.success("Thông tin ngân hàng đã được gửi thành công");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể gửi thông tin ngân hàng",
      );
    } finally {
      setIsSubmittingBankInfo(false);
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
      toast.success(REVIEW_MESSAGES.PRODUCT_REVIEW_SUCCESS);
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

  return {
    router,
    account,
    userLoading,
    order,
    isLoading,
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
    handleSubmitBankInfo,
    isSubmittingBankInfo,
    bankName,
    setBankName,
    accountNumber,
    setAccountNumber,
    accountHolder,
    setAccountHolder,
  };
}
