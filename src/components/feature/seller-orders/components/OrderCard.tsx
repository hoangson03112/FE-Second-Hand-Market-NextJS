import Link from "next/link";
import Image from "next/image";
import { IconUser, IconPhone, IconClock, IconMail } from "@tabler/icons-react";
import type { Order } from "@/types/order";
import { STATUS_LABELS, STATUS_COLORS } from "@/constants/orderStatus";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import { getProductImage } from "../utils/orderUtils";
import OrderActions from "./OrderActions";

interface OrderCardProps {
  order: Order;
  imageErrorMap: Record<string, boolean>;
  updatingId: string | null;
  onImageError: (orderId: string) => void;
  onUpdateStatus: (
    orderId: string,
    status: "confirmed" | "cancelled",
    reason?: string
  ) => void;
}

export default function OrderCard({
  order,
  imageErrorMap,
  updatingId,
  onImageError,
  onUpdateStatus,
}: OrderCardProps) {
  const firstProduct = order.products?.[0]?.productId;
  const productImage = getProductImage(firstProduct, imageErrorMap, order._id);
  const statusLabel =
    STATUS_LABELS[order.status] || order.status || "Đang xử lý";
  const statusColor =
    STATUS_COLORS[order.status] ||
    "bg-neutral-100 text-neutral-800 border-neutral-300";
  const buyerPhone = order.buyerId?.phoneNumber?.trim();
  const buyerEmail = order.buyerId?.email?.trim();

  return (
    <div className="bg-cream-50 rounded-2xl border-2 border-border hover:border-primary/30 p-5 transition-all hover:shadow-lg">
      <div className="flex gap-4 mb-4">
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted shrink-0 ring-2 ring-border">
          <Image
            src={productImage}
            alt={firstProduct?.name || "Sản phẩm"}
            width={96}
            height={96}
            className="w-full h-full object-cover"
            onError={() => onImageError(order._id)}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-1">
            Mã đơn nội bộ:{" "}
            <span className="font-mono">
              #{order._id.slice(-8).toUpperCase()}
            </span>
          </p>
          <Link
            href={`/orders/${order._id}`}
            className="font-semibold text-foreground hover:text-primary line-clamp-2 mb-2 block"
          >
            {firstProduct?.name}
            {order.products && order.products.length > 1
              ? ` +${order.products.length - 1} sản phẩm`
              : ""}
          </Link>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconUser className="w-4 h-4" />
              <span>
                Người mua:{" "}
                <span className="font-medium text-foreground">
                  {order.buyerId?.fullName || "—"}
                </span>
              </span>
            </div>
            {buyerPhone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconPhone className="w-4 h-4" />
                <span className="font-medium text-foreground">{buyerPhone}</span>
              </div>
            )}
            {buyerEmail && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconMail className="w-4 h-4" />
                <span className="text-foreground">{buyerEmail}</span>
              </div>
            )}
            {!buyerPhone && !buyerEmail && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconPhone className="w-4 h-4" />
                <span>Chưa có thông tin liên hệ</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconClock className="w-4 h-4" />
              <span>{format(order.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xl font-bold text-primary mb-2">
            {formatPrice(order.totalAmount)}
          </p>
          <span
            className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold border ${statusColor}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <OrderActions
        order={order}
        updatingId={updatingId}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
}
