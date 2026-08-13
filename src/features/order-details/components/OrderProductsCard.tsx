import Image from "next/image";
import Link from "next/link";
import { IconMessage, IconPackage, IconPhone, IconStar, IconUser } from "@tabler/icons-react";
import { formatPrice } from "@/utils/format/price";
import { getConditionBadgeColor, getConditionLabel, getShippingMethodType } from "@/utils/format";
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
  const isLocalPickup = getShippingMethodType(order.shippingMethod) === "local_pickup";
  const canReview =
    order.status === "completed" || (!isLocalPickup && order.status === "delivered");

  return (
    <div className="overflow-hidden border border-luxury-ink/8 bg-white/60" style={{ borderRadius: "2px" }}>
      <div className="flex items-center gap-2 border-b border-luxury-ink/8 px-5 py-3">
        <IconPackage className="h-4 w-4 text-luxury-champagne" strokeWidth={1.75} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600">Sản phẩm đã đặt</span>
        <span className="ml-auto text-xs text-taupe-400">
          {order.products?.length || 0} sản phẩm
        </span>
      </div>
      <div className="divide-y divide-luxury-ink/6">
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
          const canReviewProduct = canReview && Boolean(productId);

          return (
            <div key={idx} className="flex gap-3 p-4 sm:gap-4 sm:p-5">
              {productHref ? (
                <Link
                  href={productHref}
                  className="h-16 w-16 shrink-0 overflow-hidden border border-luxury-ink/10 bg-cream-100 transition-colors hover:border-luxury-champagne/60 sm:h-20 sm:w-20"
                  style={{ borderRadius: "2px" }}
                >
                  <Image
                    src={avatar}
                    alt={product?.name || "Sản phẩm"}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </Link>
              ) : (
                <div
                  className="h-16 w-16 shrink-0 overflow-hidden border border-luxury-ink/10 bg-cream-100 sm:h-20 sm:w-20"
                  style={{ borderRadius: "2px" }}
                >
                  <Image
                    src={avatar}
                    alt={product?.name || "Sản phẩm"}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                {productHref ? (
                  <Link
                    href={productHref}
                    className="line-clamp-2 text-sm font-medium leading-snug text-luxury-ink transition-colors hover:text-accent"
                  >
                    {product?.name || "Sản phẩm đã ngừng kinh doanh"}
                  </Link>
                ) : (
                  <p className="line-clamp-2 text-sm font-medium leading-snug text-luxury-ink">
                    {product?.name || "Sản phẩm đã ngừng kinh doanh"}
                  </p>
                )}
                {conditionLabel && badgeColorClass && (
                  <span
                    className={`mt-1 inline-block border px-2 py-0.5 text-[10px] font-semibold ${badgeColorClass}`}
                    style={{ borderRadius: "2px" }}
                  >
                    {conditionLabel}
                  </span>
                )}
                <div className="mt-2 flex items-center gap-3">
                  <p className="text-xs text-taupe-400">
                    Số lượng: <span className="font-semibold text-luxury-ink">×{item.quantity}</span>
                  </p>
                  <p className="text-sm font-semibold text-luxury-ink">
                    {formatPrice(item.price || product?.price || 0)}
                  </p>
                </div>
                {canReviewProduct && productId && (
                  <div className="mt-2">
                    {hasReview ? (
                      <div className="flex items-center gap-1.5 text-xs text-taupe-400">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <IconStar
                              key={i}
                              className={i <= hasReview.rating ? "h-3.5 w-3.5 fill-luxury-champagne text-luxury-champagne" : "h-3.5 w-3.5 text-taupe-200"}
                            />
                          ))}
                        </div>
                        Đã đánh giá
                      </div>
                    ) : (
                      <button
                        onClick={() => onOpenProductReview(productId, product.name || "Sản phẩm")}
                        className="flex items-center gap-1 text-xs font-medium text-luxury-ink hover:text-accent hover:underline"
                      >
                        <IconStar className="h-3.5 w-3.5 text-luxury-champagne" />
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
        <div className="flex items-center justify-between border-t border-luxury-ink/8 bg-cream-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-luxury-ink/5" style={{ borderRadius: "2px" }}>
              <IconUser className="h-4 w-4 text-taupe-500" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-xs text-taupe-400">Người bán</p>
              <p className="text-sm font-semibold text-luxury-ink">
                {order.sellerId.fullName || "—"}
              </p>
              {order.sellerId.phoneNumber && (
                <p className="flex items-center gap-1 text-xs text-taupe-400">
                  <IconPhone className="h-3 w-3" />
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
            className="flex items-center gap-1.5 border border-luxury-ink/15 px-3.5 py-2 text-luxury-ink transition-all duration-300 hover:border-luxury-champagne hover:text-accent"
            style={{ borderRadius: "2px" }}
          >
            <IconMessage className="h-4 w-4" strokeWidth={1.75} />
            <span className="text-xs font-semibold">Nhắn tin</span>
          </button>
        </div>
      )}
    </div>
  );
}