import Image from "next/image";
import Link from "next/link";
import {
  IconMessage,
  IconPhone,
  IconStar,
  IconUser,
} from "@tabler/icons-react";
import { formatPrice } from "@/utils/format/price";
import {
  getConditionBadgeColor,
  getConditionLabel,
  getShippingMethodType,
} from "@/utils/format";
import { openChatWithOrder } from "@/utils/chat";
import { getAvatarUrl } from "@/utils";
import { Panel } from "@/features/order/components";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/order";

interface OrderProductsCardProps {
  order: Order;
  productReviews: Record<string, { rating: number; comment?: string }>;
  onOpenProductReview: (productId: string, productName: string) => void;
}

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className="flex" aria-label={`${rating} trên 5 sao`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <IconStar
          key={i}
          aria-hidden
          className={cn(
            className,
            i <= rating
              ? "fill-luxury-champagne text-luxury-champagne"
              : "text-neutral-300",
          )}
        />
      ))}
    </span>
  );
}

export function OrderProductsCard({
  order,
  productReviews,
  onOpenProductReview,
}: OrderProductsCardProps) {
  const isLocalPickup =
    getShippingMethodType(order.shippingMethod) === "local_pickup";
  const canReview =
    order.status === "completed" ||
    (!isLocalPickup && order.status === "delivered");
  const count = order.products?.length ?? 0;

  return (
    <Panel
      eyebrow="Đơn hàng"
      title="Sản phẩm đã đặt"
      padding="flush"
      aside={
        <span className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
          {count} sản phẩm
        </span>
      }
    >
      <ul className="divide-y divide-luxury-ink/8">
        {order.products?.map((item, idx) => {
          const product = item.productId;
          const productId =
            product?._id ??
            (typeof item.productId === "string" ? item.productId : null);
          const productHref = productId
            ? `/products/${productId}/product`
            : null;
          const avatar =
            typeof product?.avatar === "object" && product.avatar?.url
              ? product.avatar.url
              : typeof product?.avatar === "string"
                ? product.avatar
                : "/images/product-placeholder.svg";
          const condition = product?.condition;
          const conditionLabel = condition
            ? getConditionLabel(condition)
            : null;
          const badgeColorClass = condition
            ? getConditionBadgeColor(condition)
            : null;
          const hasReview = productId ? productReviews[productId] : undefined;
          const canReviewProduct = canReview && Boolean(productId);

          const thumbnail = (
            <Image
              src={avatar}
              alt={product?.name || "Sản phẩm"}
              width={96}
              height={96}
              className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
            />
          );

          return (
            <li key={idx} className="flex gap-4 px-5 py-5 sm:px-6">
              {productHref ? (
                <Link
                  href={productHref}
                  className="group h-20 w-20 shrink-0 overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-cream-100 transition-colors duration-300 hover:border-luxury-champagne/60 sm:h-24 sm:w-24"
                >
                  {thumbnail}
                </Link>
              ) : (
                <div className="group h-20 w-20 shrink-0 overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-cream-100 sm:h-24 sm:w-24">
                  {thumbnail}
                </div>
              )}

              <div className="min-w-0 flex-1">
                {productHref ? (
                  <Link
                    href={productHref}
                    className="line-clamp-2 text-sm font-medium leading-snug text-luxury-ink transition-colors duration-300 hover:text-accent"
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
                    className={cn(
                      "mt-2 inline-block rounded-[2px] border px-2 py-0.5 text-2xs font-bold uppercase tracking-[0.15em]",
                      badgeColorClass,
                    )}
                  >
                    {conditionLabel}
                  </span>
                )}

                <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                    Số lượng ×{item.quantity}
                  </span>
                  <span
                    className="font-droid-serif tabular-nums text-base text-luxury-ink"
                  >
                    {formatPrice(item.price || product?.price || 0)}
                  </span>
                </div>

                {canReviewProduct && productId && (
                  <div className="mt-3">
                    {hasReview ? (
                      <span className="flex items-center gap-2 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                        <Stars
                          rating={hasReview.rating}
                          className="h-3.5 w-3.5"
                        />
                        Đã đánh giá
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          onOpenProductReview(
                            productId,
                            product.name || "Sản phẩm",
                          )
                        }
                        className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ink underline decoration-luxury-champagne underline-offset-4 transition-colors duration-300 hover:text-accent"
                      >
                        <IconStar className="h-3.5 w-3.5 text-luxury-champagne" />
                        Đánh giá sản phẩm
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {order.sellerId && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-luxury-ink/10 bg-cream-50 px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-white">
              <IconUser
                className="h-4 w-4 text-neutral-500"
                strokeWidth={1.75}
              />
            </span>
            <div className="min-w-0">
              <p className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                Người bán
              </p>
              <p className="mt-1 truncate text-sm font-medium text-luxury-ink">
                {order.sellerId.fullName || "—"}
              </p>
              {order.sellerId.phoneNumber && (
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500">
                  <IconPhone className="h-3 w-3" strokeWidth={1.75} />
                  {order.sellerId.phoneNumber}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              openChatWithOrder(
                {
                  _id: order.sellerId._id,
                  fullName: order.sellerId.fullName,
                  avatar:
                    getAvatarUrl(
                      (order.sellerId as { avatar?: { url?: string } })?.avatar,
                    ) ?? undefined,
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
                },
              )
            }
            className="inline-flex shrink-0 items-center gap-2 rounded-[2px] border border-luxury-ink/15 bg-white px-4 py-2.5 text-2xs font-bold uppercase tracking-[0.2em] text-luxury-ink transition-all duration-300 hover:border-luxury-champagne hover:text-accent"
          >
            <IconMessage className="h-4 w-4" strokeWidth={1.75} />
            Nhắn tin
          </button>
        </div>
      )}
    </Panel>
  );
}
