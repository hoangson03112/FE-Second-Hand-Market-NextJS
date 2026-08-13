"use client";

import Image from "next/image";
import Link from "next/link";
import { IconPackage } from "@tabler/icons-react";
import { formatPrice } from "@/utils/format/price";
import { getConditionBadgeColor, getConditionLabel } from "@/utils/format";
import type { Order } from "@/types/order";

function getAvatar(product: Order["products"][number]["productId"]): string {
  if (!product) return "/images/product-placeholder.svg";
  if (typeof product.avatar === "string" && product.avatar.trim()) return product.avatar;
  if (product.avatar && typeof product.avatar === "object" && "url" in product.avatar) {
    return (product.avatar as { url: string }).url || "/images/product-placeholder.svg";
  }
  const first = product.images?.[0];
  if (first && typeof first === "object" && "url" in first) return (first as { url: string }).url;
  return "/images/product-placeholder.svg";
}

interface SellerProductsCardProps {
  order: Order;
}

export function SellerProductsCard({ order }: SellerProductsCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/20">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <IconPackage className="w-4.5 h-4.5 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">Sản phẩm trong đơn</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{order.products.length} sản phẩm</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {order.products.map((item, idx) => {
          const product = item.productId;
          const avatar = getAvatar(product);
          const condition = product?.condition;
          const conditionLabel = condition ? getConditionLabel(condition) : null;
          const badgeColor = condition ? getConditionBadgeColor(condition) : null;

          return (
            <div
              key={idx}
              className="flex gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors group"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                <Image
                  src={avatar}
                  alt={product?.name || "Sản phẩm"}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="font-semibold text-foreground text-sm line-clamp-2 leading-snug">
                    {product?.name || "Sản phẩm"}
                  </h4>
                  {product?._id && (
                    <Link
                      href={`/products/${product._id}`}
                      target="_blank"
                      className="shrink-0 text-[10px] text-primary font-medium hover:underline"
                    >
                      Xem →
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {conditionLabel && badgeColor && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeColor}`}>
                      {conditionLabel}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Số lượng: <span className="font-semibold text-foreground">×{item.quantity}</span>
                  </span>
                </div>
                <p className="text-base font-bold text-primary mt-1.5">
                  {formatPrice(item.price || product?.price || 0)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price summary */}
      <div className="px-5 pb-5 space-y-1.5">
        <div className="flex justify-between text-sm text-muted-foreground pt-3 border-t border-border">
          <span>Tiền hàng</span>
          <span>{formatPrice(order.productAmount || 0)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Phí vận chuyển</span>
          <span>{formatPrice(order.shippingFee || 0)}</span>
        </div>
        {(order.codFee ?? 0) > 0 && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Phí COD</span>
            <span>{formatPrice(order.codFee!)}</span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2 mt-1 border-t border-border">
          <span className="text-sm font-bold text-foreground">Tổng cộng</span>
          <span className="text-lg font-bold text-primary">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
