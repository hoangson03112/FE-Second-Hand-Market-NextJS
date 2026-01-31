"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { OrderService } from "@/services/order.service";
import { formatPrice } from "@/utils/format/price";
import { CheckCircle2, Package, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
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
        alert("Không thể tải thông tin đơn hàng");
        router.push("/checkout");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-muted-foreground">
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được tiếp nhận.
          </p>
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-lg border border-border p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Thông tin đơn hàng</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mã đơn hàng:</span>
              <span className="font-medium font-mono">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tổng tiền:</span>
              <span className="font-bold text-primary">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phương thức thanh toán:</span>
              <span className="font-medium">
                {order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "Chuyển khoản"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trạng thái:</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {order.status || "Đang xử lý"}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">Bước tiếp theo:</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span>Đơn hàng của bạn đã được tiếp nhận và đang được xử lý</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span>Bạn sẽ nhận được thông báo khi đơn hàng được xác nhận</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span>Đơn hàng sẽ được giao trong 2-5 ngày làm việc</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 btn btn-outline py-3 text-center flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Về trang chủ
          </Link>
          <button
            onClick={() => router.push(`/orders/${orderId}`)}
            className="flex-1 btn btn-primary py-3"
          >
            Xem chi tiết đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}
