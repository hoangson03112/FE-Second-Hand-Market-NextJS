"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { OrderService } from "@/services/order.service";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import { PageContainer, Container } from "@/components/layout/Container";
import type { Order } from "@/types/order";

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xử lý",
  delivered: "Đã giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  refund: "Đang hoàn tiền",
  refunded: "Đã hoàn tiền",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  delivered: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refund: "bg-orange-100 text-orange-800",
  refunded: "bg-gray-100 text-gray-800",
};

export default function Orders() {
  const router = useRouter();
  const { data: account, isLoading: userLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && !account) {
      router.push("/login");
      return;
    }
    if (!account) return;

    const fetchOrders = async () => {
      try {
        const res = await OrderService.getMyOrders();
        setOrders(res.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [account, userLoading, router]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!account) return null;

  return (
    <PageContainer withBackground={false}>
      <Container as="main" maxWidth="4xl" paddingX="md" paddingY="lg">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Package className="w-8 h-8" />
          Đơn hàng của tôi
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Bạn chưa có đơn hàng nào</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
            >
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const firstProduct = order.products?.[0]?.productId;
              const avatar =
                firstProduct?.avatar?.url ||
                (typeof firstProduct?.avatar === "string"
                  ? firstProduct.avatar
                  : "/placeholder.svg");
              const statusLabel =
                STATUS_LABELS[order.status] || order.status || "Đang xử lý";
              const statusColor =
                STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800";

              return (
                <Link
                  key={order._id}
                  href={`/orders/${order._id}`}
                  className="block bg-white rounded-xl border border-border p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image
                        src={avatar}
                        alt={firstProduct?.name || "Sản phẩm"}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {firstProduct?.name}
                        {order.products && order.products.length > 1
                          ? ` +${order.products.length - 1} sản phẩm khác`
                          : ""}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Người bán: {order.sellerId?.fullName || "—"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-primary">
                        {formatPrice(order.totalAmount)}
                      </p>
                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
                      >
                        {statusLabel}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </PageContainer>
  );
}
