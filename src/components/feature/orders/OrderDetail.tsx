"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Package,
  Loader2,
  MapPin,
  Phone,
  Truck,
  Star,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { OrderService } from "@/services/order.service";
import { SellerReviewService } from "@/services/sellerReview.service";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import { PageContainer, Container } from "@/components/layout/Container";
import type { Order } from "@/types/order";
import { useToast } from "@/components/ui";

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xử lý",
  delivered: "Đã giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  refund: "Đang hoàn tiền",
  refunded: "Đã hoàn tiền",
};

interface OrderDetailProps {
  orderId: string;
}

export default function OrderDetail({ orderId }: OrderDetailProps) {
  const router = useRouter();
  const toast = useToast();
  const { data: account, isLoading: userLoading } = useUser();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [existingReview, setExistingReview] = useState<{ _id: string; rating: number; comment?: string } | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const isBuyer = account && order && order.buyerId?._id === account.accountID;

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
        if (res.review) setExistingReview(res.review);
        else setShowReviewForm(true);
      } catch {
        setShowReviewForm(true);
      }
    };
    fetchReview();
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
        error instanceof Error ? error.message : "Không thể hủy đơn hàng"
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

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!account) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) return null;

  const statusLabel = STATUS_LABELS[order.status] || order.status || "Đang xử lý";
  const shippingAddr = order.shippingAddress;

  return (
    <PageContainer withBackground={false}>
      <Container as="main" maxWidth="2xl" paddingX="md" paddingY="lg">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại đơn hàng
        </Link>

        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-foreground">
                Đơn hàng #{order._id.slice(-8).toUpperCase()}
              </h1>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  order.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : order.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                }`}
              >
                {statusLabel}
              </span>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Đặt hàng lúc {format(order.createdAt)}
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Sản phẩm
              </h2>
              <div className="space-y-3">
                {order.products?.map((item, idx) => {
                  const prod = item.productId;
                  const avatar =
                    prod?.avatar?.url ||
                    (typeof prod?.avatar === "string" ? prod.avatar : "/placeholder.svg");
                  return (
                    <div
                      key={idx}
                      className="flex gap-4 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image
                          src={avatar}
                          alt={prod?.name || "Sản phẩm"}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {prod?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          x{item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-primary shrink-0">
                        {formatPrice((prod?.price || 0) * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {shippingAddr && (
              <div>
                <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Địa chỉ giao hàng
                </h2>
                <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                  <p className="font-medium">{shippingAddr.fullName}</p>
                  <p className="text-sm flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {shippingAddr.phoneNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {shippingAddr.address}
                  </p>
                </div>
              </div>
            )}

            <div>
              <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Vận chuyển
              </h2>
              <p className="text-muted-foreground">
                {order.shippingMethod || "Chưa cập nhật"}
              </p>
            </div>

            <div className="border-t border-border pt-4 flex justify-between items-center">
              <span className="font-semibold text-foreground">Tổng tiền:</span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(order.totalAmount)}
              </span>
            </div>

            {(order.status === "completed" || order.status === "delivered") && (
              <div className="border-t border-border pt-4">
                <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Đánh giá người bán
                </h2>
                {existingReview ? (
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i <= existingReview.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    {existingReview.comment && (
                      <p className="text-sm text-muted-foreground">{existingReview.comment}</p>
                    )}
                  </div>
                ) : showReviewForm ? (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Đánh giá</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setReviewRating(i)}
                            className="p-1"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                i <= reviewRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Nhận xét (tùy chọn)</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                        placeholder="Chia sẻ trải nghiệm của bạn..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
                    >
                      {isSubmittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                    </button>
                  </form>
                ) : null}
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-4">
              {isBuyer && order.status === "pending" && (
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="py-3 px-6 border border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 disabled:opacity-50"
                >
                  {isCancelling ? "Đang hủy..." : "Hủy đơn hàng"}
                </button>
              )}
              {order.status === "delivered" && !order.statusPayment && isBuyer && (
                <Link
                  href={`/payment?orderId=${order._id}`}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-center hover:bg-primary/90"
                >
                  Thanh toán
                </Link>
              )}
              <Link
                href="/orders"
                className="flex-1 py-3 border border-border rounded-lg font-semibold text-center hover:bg-muted/50"
              >
                Xem tất cả đơn hàng
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </PageContainer>
  );
}
