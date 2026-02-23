"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, Loader2, ShoppingBag, ChevronRight, MapPin, Truck, Clock, MessageSquare, XCircle } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { OrderService } from "@/services/order.service";
import { useConfirm } from "@/components/ui";
import { useToast } from "@/components/ui";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import { Container } from "@/components/layout/Container";
import type { Order } from "@/types/order";

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xác nhận",
  processing: "Đang xử lý",
  shipping: "Đang giao",
  delivered: "Đã giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  refund: "Đang hoàn tiền",
  refunded: "Đã hoàn tiền",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  processing: "bg-blue-100 text-blue-800 border-blue-300",
  shipping: "bg-purple-100 text-purple-800 border-purple-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
  refund: "bg-orange-100 text-orange-800 border-orange-300",
  refunded: "bg-neutral-100 text-neutral-800 border-neutral-300",
};

const STATUS_ICONS: Record<string, string> = {
  pending: "⏳",
  processing: "📦",
  shipping: "🚚",
  delivered: "✅",
  completed: "🎉",
  cancelled: "❌",
  refund: "💰",
  refunded: "✔️",
};

const ORDER_TABS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "processing", label: "Đang xử lý" },
  { key: "shipping", label: "Đang giao" },
  { key: "completed", label: "Hoàn thành" },
  { key: "cancelled", label: "Đã hủy" },
];

export default function Orders() {
  const router = useRouter();
  const { data: account, isLoading: userLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { confirm } = useConfirm();
  const toast = useToast();

  const handleCancel = async (orderId: string) => {
    const ok = await confirm({
      title: "Hủy đơn hàng",
      message: "Bạn có chắc muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.",
      confirmText: "Hủy đơn",
      cancelText: "Giữ lại",
      variant: "danger",
    });
    if (!ok) return;
    setCancellingId(orderId);
    try {
      await OrderService.updateStatus(orderId, "cancelled");
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o))
      );
      toast.success("Hủy đơn hàng thành công.");
    } catch (err) {
      console.error("Cancel order error:", err);
      toast.error("Hủy đơn thất bại, vui lòng thử lại.");
    } finally {
      setCancellingId(null);
    }
  };

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
      <div className="min-h-screen bg-gradient-to-b from-background via-cream-50/30 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-neutral-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!account) return null;

  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(order => order.status === activeTab);

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
                Đơn hàng của tôi
              </h1>
              <p className="text-sm text-neutral-600 mt-0.5">
                Quản lý và theo dõi đơn hàng của bạn
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Tabs */}
      <div className="bg-cream-50/90 backdrop-blur-md border-b-2 border-neutral-200/60 sticky top-[73px] z-10">
        <Container maxWidth="6xl" paddingX="md">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {ORDER_TABS.map((tab) => {
              const count = tab.key === "all" 
                ? orders.length 
                : orders.filter(o => o.status === tab.key).length;
              
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                    activeTab === tab.key
                      ? "bg-primary text-white shadow-md"
                      : "bg-cream-50 text-neutral-700 hover:bg-cream-100 border border-neutral-200"
                  }`}
                >
                  {tab.label}
                  {count > 0 && (
                    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                      activeTab === tab.key 
                        ? "bg-cream-100/30" 
                        : "bg-primary/10 text-primary"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      {/* Content */}
      <Container maxWidth="6xl" paddingX="md" paddingY="lg">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-neutral-600">Đang tải đơn hàng...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-cream-50/90 backdrop-blur-md rounded-3xl border-2 border-neutral-200/60 shadow-lg shadow-neutral-200/50 p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cream-50 flex items-center justify-center">
              <Package className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              {activeTab === "all" ? "Chưa có đơn hàng nào" : `Không có đơn hàng ${ORDER_TABS.find(t => t.key === activeTab)?.label.toLowerCase()}`}
            </h3>
            <p className="text-neutral-600 mb-6">
              {activeTab === "all" 
                ? "Hãy bắt đầu mua sắm và tạo đơn hàng đầu tiên của bạn!"
                : "Không tìm thấy đơn hàng nào trong trạng thái này"}
            </p>
            {activeTab === "all" && (
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                Mua sắm ngay
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusLabel = STATUS_LABELS[order.status] || "Đang xử lý";
              const statusColor = STATUS_COLORS[order.status] || "bg-neutral-100 text-neutral-800 border-neutral-300";
              const statusIcon = STATUS_ICONS[order.status] || "📦";
              
              return (
                <div
                  key={order._id}
                  className="bg-cream-50/90 backdrop-blur-md rounded-3xl border-2 border-neutral-200/60 shadow-lg shadow-neutral-200/50 overflow-hidden hover:shadow-xl hover:shadow-neutral-200/60 transition-all duration-300 group"
                >
                  {/* Order Header */}
                  <div className="bg-cream-50/50 px-5 py-4 border-b-2 border-neutral-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {order.ghnOrderCode ? (
                          <p className="font-semibold text-neutral-900 text-sm">
                            Mã vận đơn: <span className="font-mono">{order.ghnOrderCode}</span>
                          </p>
                        ) : (
                          <p className="font-semibold text-neutral-900 text-sm">
                            Đơn hàng <span className="font-mono text-neutral-500">#{order._id.slice(-8).toUpperCase()}</span>
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-neutral-500" />
                          <p className="text-xs text-neutral-600">
                            {format(order.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${statusColor} flex items-center gap-1.5`}>
                      <span>{statusIcon}</span>
                      <span>{statusLabel}</span>
                    </div>
                  </div>

                  {/* Products List */}
                  <div className="p-5">
                    <div className="space-y-3">
                      {order.products?.map((item, idx) => {
                        const product = item.productId;
                        const avatar = typeof product?.avatar === "string" 
                          ? product.avatar 
                          : product?.avatar?.url || "/placeholder.svg";
                        
                        return (
                          <div key={idx} className="flex gap-4 p-3 rounded-2xl hover:bg-cream-50/50 transition-colors">
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0 ring-1 ring-neutral-200">
                              <Image
                                src={avatar}
                                alt={product?.name || "Sản phẩm"}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-neutral-900 line-clamp-2 mb-1">
                                {product?.name || "Sản phẩm"}
                              </h4>
                              <p className="text-sm text-neutral-600 mb-2">
                                Số lượng: ×{item.quantity}
                              </p>
                              <p className="text-base font-bold text-primary">
                                {formatPrice(item.price || product?.price || 0)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Seller Info */}
                    {order.sellerId && (
                      <div className="mt-4 pt-4 border-t-2 border-neutral-200/60 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Package className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-neutral-600">Người bán</p>
                            <p className="font-medium text-neutral-900 text-sm">
                              {order.sellerId.fullName || "—"}
                            </p>
                          </div>
                        </div>
                        <button className="p-2 rounded-full hover:bg-cream-50 transition-colors group/chat">
                          <MessageSquare className="w-5 h-5 text-neutral-600 group-hover/chat:text-primary transition-colors" />
                        </button>
                      </div>
                    )}

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div className="mt-3 p-3 bg-blue-50/50 rounded-xl border border-blue-200/50">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-blue-800 font-medium mb-1">Địa chỉ nhận hàng</p>
                            <p className="text-sm font-semibold text-neutral-900">
                              {order.shippingAddress.fullName} | {order.shippingAddress.phoneNumber}
                            </p>
                            <p className="text-sm text-neutral-700 mt-0.5">
                              {order.shippingAddress.specificAddress}
                            </p>
                            {(order.shippingAddress.ward || order.shippingAddress.district || order.shippingAddress.province) && (
                              <p className="text-sm text-neutral-600 mt-0.5">
                                {[
                                  order.shippingAddress.ward,
                                  order.shippingAddress.district,
                                  order.shippingAddress.province
                                ].filter(Boolean).join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Shipping Method */}
                    {order.shippingMethod && (
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <Truck className="w-4 h-4 text-neutral-600" />
                        <span className="text-neutral-600">Vận chuyển:</span>
                        <span className="font-medium text-neutral-900">{order.shippingMethod}</span>
                      </div>
                    )}

                    {/* Order Footer */}
                    <div className="mt-4 pt-4 border-t-2 border-neutral-200/60 flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-sm text-neutral-600">Tiền hàng:</span>
                          <span className="font-semibold text-neutral-900">
                            {formatPrice(order.productAmount || 0)}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-sm text-neutral-600">Phí vận chuyển:</span>
                          <span className="font-semibold text-neutral-900">
                            {formatPrice(order.shippingFee || 0)}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-bold text-neutral-900">Tổng cộng:</span>
                          <span className="text-xl font-bold text-primary">
                            {formatPrice(order.totalAmount)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.status === "pending" && (
                          <button
                            onClick={() => handleCancel(order._id)}
                            disabled={cancellingId === order._id}
                            className="px-4 py-2.5 rounded-full border-2 border-red-300 text-red-600 font-semibold text-sm hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
                          >
                            {cancellingId === order._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            Hủy đơn
                          </button>
                        )}
                        <Link
                          href={`/orders/${order._id}`}
                          className="px-6 py-2.5 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 group/btn"
                        >
                          <span>Xem chi tiết</span>
                          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
