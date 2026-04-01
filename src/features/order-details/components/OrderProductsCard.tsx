import Image from "next/image";
import Link from "next/link";
import { IconMessage, IconPackage, IconPhone, IconStar, IconUser } from "@tabler/icons-react";
import { formatPrice } from "@/utils/format/price";
import { getConditionBadgeColor, getConditionLabel } from "@/utils/format";
import { openChatWithOrder } from "@/utils/chat";
import { getAvatarUrl } from "@/utils";
import type { Order } from "@/types/order";

interface OrderProductsCardProps {
  order: Order;
  productReviews: Record<string, { rating: number; comment?: string }>;
  onOpenProductReview: (productId: string, productName: string) => void;
}

export function OrderProductsCard({
  order,
  productReviews,
  onOpenProductReview,
}: OrderProductsCardProps) {
  const canReview = ["completed", "delivered"].includes(order.status);

  return (
    <div className="bg-cream-50 border border-border rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center gap-2">
        <IconPackage className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Sản phẩm đã đặt</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {order.products?.length || 0} sản phẩm
        </span>
      </div>
      <div className="divide-y divide-border">
        {order.products?.map((item, idx) => {
          const product = item.productId;
          const productId = product?._id ?? (typeof item.productId === "string" ? item.productId : null);
          const productHref = productId ? `/products/${productId}/product` : null;
          const avatar =
            typeof product?.avatar === "object" && product.avatar?.url
              ? product.avatar.url
              : typeof product?.avatar === "string"
                ? product.avatar
                : "/images/product-placeholder.svg";
          const condition = product?.condition;
          const conditionLabel = condition ? getConditionLabel(condition) : null;
          const badgeColorClass = condition ? getConditionBadgeColor(condition) : null;
          const hasReview = productId ? productReviews[productId] : undefined;
          const canReviewProduct = canReview && product && (product.stock ?? 0) >= 1;

          return (
            <div key={idx} className="flex gap-3 sm:gap-4 p-4 sm:p-5">
              {productHref ? (
                <Link
                  href={productHref}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border hover:border-primary/50 transition-colors"
                >
                  <Image
                    src={avatar}
                    alt={product?.name || "Sản phẩm"}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </Link>
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                  <Image
                    src={avatar}
                    alt={product?.name || "Sản phẩm"}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {productHref ? (
                  <Link
                    href={productHref}
                    className="text-sm font-medium text-foreground line-clamp-2 leading-snug hover:text-primary transition-colors"
                  >
                    {product?.name || "Sản phẩm đã ngừng kinh doanh"}
                  </Link>
                ) : (
                  <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
                    {product?.name || "Sản phẩm đã ngừng kinh doanh"}
                  </p>
                )}
                {conditionLabel && badgeColorClass && (
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${badgeColorClass}`}
                  >
                    {conditionLabel}
                  </span>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-xs text-muted-foreground">
                    Số lượng: <span className="font-semibold text-foreground">×{item.quantity}</span>
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    {formatPrice(item.price || product?.price || 0)}
                  </p>
                </div>
                {canReviewProduct && productId && (
                  <div className="mt-2">
                    {hasReview ? (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <IconStar
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i <= hasReview.rating ? "fill-amber-400 text-amber-400" : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        Đã đánh giá
                      </div>
                    ) : (
                      <button
                        onClick={() => onOpenProductReview(productId, product.name || "Sản phẩm")}
                        className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                      >
                        <IconStar className="w-3.5 h-3.5" />
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

      {/* Seller row */}
      {order.sellerId && (
        <div className="px-5 py-4 border-t border-border flex items-center justify-between bg-background/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
              <IconUser className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Người bán</p>
              <p className="text-sm font-semibold text-foreground">
                {order.sellerId.fullName || "—"}
              </p>
              {order.sellerId.phoneNumber && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <IconPhone className="w-3 h-3" />
                  {order.sellerId.phoneNumber}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() =>
              openChatWithOrder(
                {
                  _id: order.sellerId._id,
                  fullName: order.sellerId.fullName,
                  avatar: getAvatarUrl((order.sellerId as { avatar?: { url?: string } })?.avatar) ?? undefined,
                },
                {
                  _id: order._id,
                  status: order.status,
                  ghnOrderCode: order.ghnOrderCode,
                  products: order.products.map((i) => ({
                    name: i.productId?.name || "Sản phẩm",
                    quantity: i.quantity,
                    price: i.price || i.productId?.price || 0,
                  })),
                  totalAmount: order.totalAmount,
                }
              )
            }
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted hover:bg-secondary transition-colors"
          >
            <IconMessage className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Nhắn tin</span>
          </button>
        </div>
      )}
    </div>
  );
}
