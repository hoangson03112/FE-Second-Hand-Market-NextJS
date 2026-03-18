import { IconPackage, IconCalendar, IconEdit, IconTrash, IconAlertCircle, IconEye, IconTag, IconRefresh, IconTicket, IconX } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/utils/format/price";
import { format, formatDateOnly } from "@/utils/format";
import { cn } from "@/lib/utils";
import { PRODUCT_STATUS_CONFIG } from "@/constants";
import type { MyListingProduct } from "@/types/myProducts";
import type { ProductStatusFilter } from "@/types/product";

interface ProductCardProps {
  product: MyListingProduct;
  onDelete: (productId: string, productName: string) => void;
  isDeleting: boolean;
  onDeleteDiscount?: (discountId: string) => void;
  isDeletingDiscount?: string | null;
  onRequestReview?: (productId: string) => void;
  isRequestingReview?: boolean;
  viewMode?: "list" | "grid";
}

export function ProductCard({
  product,
  onDelete,
  isDeleting,
  onDeleteDiscount,
  isDeletingDiscount = null,
  onRequestReview,
  isRequestingReview = false,
  viewMode = "list",
}: ProductCardProps) {
  const discounts = product.personalDiscounts ?? [];
  const statusCfg =
    PRODUCT_STATUS_CONFIG[product.status as ProductStatusFilter] ??
    PRODUCT_STATUS_CONFIG.pending;

  const isVisibleOnSite =
    product.status === "approved" ||
    product.status === "active" ||
    product.status === "sold";

  const canEdit =
    product.status === "rejected" ||
    product.status === "approved" ||
    product.status === "active" ||
    product.status === "review_requested";

  const canRequestReview =
    product.status === "rejected" &&
    !product.aiModerationResult?.humanReviewRequested;

  if (viewMode === "grid") {
    return (
      <div className="group relative rounded-xl bg-card border border-border hover:border-primary/30 overflow-hidden transition-all hover:shadow-md">
        <div className="relative w-full aspect-square bg-muted overflow-hidden">
          {product.avatar?.url ? (
            <Image
              src={product.avatar.url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <IconPackage className="w-12 h-12 text-muted-foreground/40" />
            </div>
          )}

          <div className="absolute top-2 right-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-card/90 backdrop-blur-sm border",
                statusCfg.text,
              )}
              style={{ borderColor: `${statusCfg.color}40` }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: statusCfg.color }}
              />
              {statusCfg.label}
            </span>
          </div>
        </div>

        <div className="p-3.5">
          <h3 className="font-medium text-foreground line-clamp-2 text-sm mb-2 leading-snug">
            {product.name}
          </h3>

          {product.categoryId?.name && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
              <IconTag className="w-3 h-3" />
              <span className="line-clamp-1">{product.categoryId.name}</span>
            </div>
          )}

          {product.status === "rejected" &&
            product.aiModerationResult?.rejectionReason && (
              <div className="p-2 rounded-lg bg-destructive/8 border border-destructive/20 mb-3">
                <div className="flex items-start gap-1.5">
                  <IconAlertCircle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive/80 line-clamp-2">
                    {product.aiModerationResult.rejectionReason}
                  </p>
                </div>
              </div>
            )}

          <div className="flex items-center justify-between mb-3 pt-2 border-t border-border">
            <span className="text-lg font-bold text-foreground tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.createdAt && (
              <span className="text-xs text-muted-foreground">
                {format(product.createdAt)}
              </span>
            )}
          </div>

          {discounts.length > 0 && (
            <div className="mb-3 space-y-1.5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <IconTicket className="w-3 h-3" />
                Ưu đãi ({discounts.length})
              </p>
              {discounts.map((d) => (
                <div
                  key={d._id}
                  className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg bg-primary/5 border border-primary/15 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-primary">{formatPrice(d.price)}</span>
                    {d.buyerId?.fullName && (
                      <span className="text-muted-foreground ml-1 truncate block">
                        → {d.buyerId.fullName}
                      </span>
                    )}
                    <span className="text-muted-foreground text-[10px]">
                      Hết hạn: {formatDateOnly(d.endDate)}
                    </span>
                  </div>
                  {onDeleteDiscount && (
                    <button
                      type="button"
                      onClick={() => onDeleteDiscount(d._id)}
                      disabled={isDeletingDiscount === d._id}
                      className="p-1 rounded text-destructive hover:bg-destructive/10 disabled:opacity-50 shrink-0"
                      title="Xóa ưu đãi"
                    >
                      <IconX className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-1.5">
            {canEdit && (
              <Link
                href={`/sell?edit=${product._id}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                <IconEdit className="w-3.5 h-3.5" />
                Sửa
              </Link>
            )}

            {canRequestReview && onRequestReview && (
              <button
                type="button"
                onClick={() => onRequestReview(product._id)}
                disabled={isRequestingReview}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium bg-secondary/60 hover:bg-secondary text-foreground/80 border border-border disabled:opacity-50 transition-colors"
              >
                <IconRefresh className="w-3.5 h-3.5" />
                {isRequestingReview ? "..." : "Duyệt lại"}
              </button>
            )}

            {isVisibleOnSite && product.slug && (
              <Link
                href={`/products/${product._id}/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                <IconEye className="w-3.5 h-3.5" />
                Xem
              </Link>
            )}

            <button
              type="button"
              onClick={() => onDelete(product._id, product.name)}
              disabled={isDeleting}
              className="px-2.5 py-2 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/5 disabled:opacity-50 transition-colors"
            >
              <IconTrash className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-xl bg-card border border-border hover:border-primary/40 overflow-hidden transition-all hover:shadow-sm">
      <div className="flex items-center gap-4 p-4">
        <div className="relative w-20 h-20 rounded-lg bg-muted shrink-0 overflow-hidden">
          {product.avatar?.url ? (
            <Image
              src={product.avatar.url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <IconPackage className="w-8 h-8 text-muted-foreground/40" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-base line-clamp-1 mb-1">
                {product.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {product.categoryId?.name && (
                  <span className="flex items-center gap-1">
                    <IconTag className="w-3 h-3" />
                    {product.categoryId.name}
                  </span>
                )}
                {product.createdAt && (
                  <span className="flex items-center gap-1">
                    <IconCalendar className="w-3 h-3" />
                    {format(product.createdAt)}
                  </span>
                )}
              </div>
            </div>

            <span
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap border shrink-0",
                statusCfg.text,
              )}
              style={{
                backgroundColor: `${statusCfg.color}10`,
                borderColor: `${statusCfg.color}40`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: statusCfg.color }}
              />
              {statusCfg.label}
            </span>
          </div>

          {product.status === "rejected" &&
            product.aiModerationResult?.rejectionReason && (
              <div className="p-2 rounded-lg bg-destructive/8 border border-destructive/20 mb-2">
                <div className="flex items-start gap-1.5">
                  <IconAlertCircle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive/80 line-clamp-1">
                    {product.aiModerationResult.rejectionReason}
                  </p>
                </div>
              </div>
            )}

          {discounts.length > 0 && (
            <div className="mb-2 space-y-1">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <IconTicket className="w-3 h-3" />
                Ưu đãi ({discounts.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {discounts.map((d) => (
                  <div
                    key={d._id}
                    className="inline-flex items-center gap-2 py-1 px-2 rounded-lg bg-primary/5 border border-primary/15 text-xs"
                  >
                    <span className="font-medium text-primary">{formatPrice(d.price)}</span>
                    {d.buyerId?.fullName && (
                      <span className="text-muted-foreground truncate max-w-[80px]">
                        {d.buyerId.fullName}
                      </span>
                    )}
                    <span className="text-muted-foreground text-[10px]">
                      {formatDateOnly(d.endDate)}
                    </span>
                    {onDeleteDiscount && (
                      <button
                        type="button"
                        onClick={() => onDeleteDiscount(d._id)}
                        disabled={isDeletingDiscount === d._id}
                        className="p-0.5 rounded text-destructive hover:bg-destructive/10 disabled:opacity-50"
                        title="Xóa ưu đãi"
                      >
                        <IconX className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-foreground tabular-nums">
              {formatPrice(product.price)}
            </span>

            <div className="flex items-center gap-1.5">
              {canEdit && (
                <Link
                  href={`/sell?edit=${product._id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors"
                >
                  <IconEdit className="w-3.5 h-3.5" />
                  Sửa
                </Link>
              )}

              {canRequestReview && onRequestReview && (
                <button
                  type="button"
                  onClick={() => onRequestReview(product._id)}
                  disabled={isRequestingReview}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary/60 hover:bg-secondary text-foreground/80 border border-border disabled:opacity-50 transition-colors"
                >
                  <IconRefresh className="w-3.5 h-3.5" />
                  {isRequestingReview ? "..." : "Yêu cầu duyệt lại"}
                </button>
              )}

              {isVisibleOnSite && product.slug && (
                <Link
                  href={`/products/${product._id}/${product.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors"
                >
                  <IconEye className="w-3.5 h-3.5" />
                  Xem
                </Link>
              )}

              <button
                type="button"
                onClick={() => onDelete(product._id, product.name)}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/5 disabled:opacity-50 transition-colors"
              >
                <IconTrash className="w-3.5 h-3.5" />
                {isDeleting ? "..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
