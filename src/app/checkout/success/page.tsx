"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { OrderService } from "@/services/order.service";
import type { Order } from "@/types/order";
import { formatPrice } from "@/utils/format/price";
import { CheckCircle2, Package, Home, Truck, Calendar, CreditCard, MapPin } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push("/checkout");
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await OrderService.getById(orderId);
        setOrder(response.order);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Không thể tải thông tin đơn hàng");
        router.push("/checkout");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-cream-50/30 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-neutral-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-cream-50/30 to-background py-12 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-100/30 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Success Animation Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-xl shadow-green-500/30">
              <CheckCircle2 className="h-14 w-14 text-white animate-scale-in" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-3">
            Đặt hàng thành công! 🎉
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Cảm ơn bạn đã tin tưởng và mua hàng. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến tay bạn.
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-cream-50/90 backdrop-blur-md rounded-3xl shadow-lg shadow-neutral-200/50 border-2 border-neutral-200/60 p-8 mb-6 animate-fade-in-up animation-delay-100">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-neutral-200">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">Thông tin đơn hàng</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-cream-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Package className="h-4 w-4 text-neutral-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-600 mb-1">Mã đơn hàng</p>
                  <p className="font-bold text-neutral-900 font-mono text-sm break-all">{orderId}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-cream-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CreditCard className="h-4 w-4 text-neutral-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-600 mb-1">Phương thức thanh toán</p>
                  <p className="font-semibold text-neutral-900">
                    {order.paymentMethod === "cod" ? "💵 Thanh toán khi nhận hàng (COD)" : "🏦 Chuyển khoản ngân hàng"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-cream-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar className="h-4 w-4 text-neutral-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-600 mb-1">Thời gian đặt hàng</p>
                  <p className="font-semibold text-neutral-900">
                    {new Date(order.createdAt || Date.now()).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-cream-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Truck className="h-4 w-4 text-neutral-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-600 mb-1">Trạng thái</p>
                  <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    🔄 {order.status === "pending" ? "Đang xử lý" : order.status}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-cream-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4 text-neutral-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-600 mb-1">Địa chỉ giao hàng</p>
                  <p className="font-semibold text-neutral-900 text-sm">
                    {order.shippingAddress?.fullName}
                  </p>
                  <p className="text-sm text-neutral-600 mt-1">
                    📞 {order.shippingAddress?.phoneNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="mt-6 pt-6 border-t-2 border-neutral-200">
            <div className="space-y-3">
              <div className="flex justify-between text-neutral-600">
                <span>Tiền hàng:</span>
                <span className="font-semibold">{formatPrice(order.productAmount || 0)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Phí vận chuyển:</span>
                <span className="font-semibold">{formatPrice(order.shippingFee || 0)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-neutral-200">
                <span className="text-lg font-bold text-neutral-900">Tổng cộng:</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline / Next Steps */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-md rounded-3xl shadow-lg border-2 border-blue-200/60 p-8 mb-6 animate-fade-in-up animation-delay-200">
          <h3 className="text-xl font-bold text-blue-900 mb-5 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            Quy trình xử lý đơn hàng
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 shadow-md">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 pt-1">
                <p className="font-semibold text-blue-900">Đơn hàng đã được tiếp nhận</p>
                <p className="text-sm text-blue-700 mt-1">Chúng tôi đã ghi nhận đơn hàng của bạn</p>
              </div>
            </div>
            <div className="flex items-start gap-4 group ml-5 border-l-2 border-dashed border-blue-300 pl-5 py-2">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-md animate-pulse">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 pt-1">
                <p className="font-semibold text-blue-900">Người bán đang chuẩn bị hàng</p>
                <p className="text-sm text-blue-700 mt-1">Sản phẩm sẽ được đóng gói và gửi đi sớm</p>
              </div>
            </div>
            <div className="flex items-start gap-4 group ml-5 border-l-2 border-dashed border-blue-300 pl-5 py-2">
              <div className="w-10 h-10 rounded-full bg-neutral-300 flex items-center justify-center flex-shrink-0">
                <Truck className="h-5 w-5 text-neutral-600" />
              </div>
              <div className="flex-1 pt-1">
                <p className="font-semibold text-neutral-700">Đang vận chuyển</p>
                <p className="text-sm text-neutral-600 mt-1">Đơn vị vận chuyển sẽ giao hàng đến bạn</p>
              </div>
            </div>
            <div className="flex items-start gap-4 group ml-5 pl-5 py-2">
              <div className="w-10 h-10 rounded-full bg-neutral-300 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-neutral-600" />
              </div>
              <div className="flex-1 pt-1">
                <p className="font-semibold text-neutral-700">Giao hàng thành công</p>
                <p className="text-sm text-neutral-600 mt-1">Dự kiến trong 2-5 ngày làm việc</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-300">
          <Link
            href="/"
            className="flex-1 py-4 px-6 rounded-full border-2 border-neutral-300 bg-cream-50/95 backdrop-blur-sm text-neutral-800 font-bold text-center hover:border-primary hover:text-primary hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
            Về trang chủ
          </Link>
          <Link
            href={`/orders/${orderId}`}
            className="flex-1 py-4 px-6 rounded-full bg-primary text-white font-bold text-center hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Package className="h-5 w-5" />
            Xem chi tiết đơn hàng
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center animate-fade-in-up animation-delay-400">
          <p className="text-sm text-neutral-600 mb-2">
            Cần hỗ trợ? Liên hệ với chúng tôi
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <a href="tel:1900xxxx" className="text-primary hover:underline font-semibold">
              📞 1900 xxxx
            </a>
            <span className="text-neutral-400">|</span>
            <a href="mailto:support@example.com" className="text-primary hover:underline font-semibold">
              ✉️ support@example.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
