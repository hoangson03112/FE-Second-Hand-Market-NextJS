import {
  IconPackage,
  IconCalendar,
  IconAlertCircle,
  IconTag,
} from "@tabler/icons-react";
import Image from "next/image";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format";
import { PRODUCT_STATUS_CONFIG } from "@/constants";
import type { MyListingProduct } from "@/types/myProducts";
import type { ProductStatusFilter } from "@/types/product";
import { ProductStatusBadge } from "./ProductStatusBadge";
import { ProductDiscountList } from "./ProductDiscountList";
import { ProductCardActions } from "./ProductCardActions";

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

  const actionProps = {
    product,
    canEdit,
    canRequestReview,
    isVisibleOnSite,
    onRequestReview,
    isRequestingReview,
    onDelete,
    isDeleting,
  };

  if (viewMode === "grid") {
    return (
      <div className="group relative rounded-2xl bg-gradient-to-br from-cream-50 to-white border-2 border-border hover:border-primary/40 overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="relative w-full aspect-square bg-taupe-100 overflow-hidden">
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
              <IconPackage className="w-12 h-12 text-taupe-300" />
            </div>
          )}

          <div className="absolute top-2 right-2">
            <ProductStatusBadge statusCfg={statusCfg} variant="grid" />
          </div>
        </div>

        <div className="p-3.5">
          <h3 className="font-medium text-taupe-900 line-clamp-2 text-sm mb-2 leading-snug">
            {product.name}
          </h3>

          {product.categoryId?.name && (
            <div className="flex items-center gap-1 text-xs text-taupe-500 mb-3">
              <IconTag className="w-3 h-3" />
              <span className="line-clamp-1">{product.categoryId.name}</span>
            </div>
          )}

          {product.status === "rejected" &&
            product.aiModerationResult?.rejectionReason && (
              <div className="p-2 rounded-lg bg-red-50 border border-red-200 mb-3">
                <div className="flex items-start gap-1.5">
                  <IconAlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600/90 line-clamp-2">
                    {product.aiModerationResult.rejectionReason}
                  </p>
                </div>
              </div>
            )}

          <div className="flex items-center justify-between mb-3 pt-2 border-t-2 border-border">
            <span className="text-lg font-bold text-primary tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.createdAt && (
              <span className="text-xs text-taupe-400">
                {format(product.createdAt)}
              </span>
            )}
          </div>

          <ProductDiscountList
            discounts={discounts}
            onDelete={onDeleteDiscount}
            isDeletingId={isDeletingDiscount}
            variant="grid"
          />

          <ProductCardActions {...actionProps} variant="grid" />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-2xl bg-gradient-to-br from-cream-50 to-white border-2 border-border hover:border-primary/40 overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-4 p-4">
        <div className="relative w-20 h-20 rounded-xl bg-taupe-100 shrink-0 overflow-hidden">
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
              <IconPackage className="w-8 h-8 text-taupe-300" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-taupe-900 text-base line-clamp-1 mb-1">
                {product.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-taupe-500">
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

            <ProductStatusBadge statusCfg={statusCfg} variant="list" />
          </div>

          {product.status === "rejected" &&
            product.aiModerationResult?.rejectionReason && (
              <div className="p-2 rounded-lg bg-red-50 border border-red-200 mb-2">
                <div className="flex items-start gap-1.5">
                  <IconAlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600/90 line-clamp-1">
                    {product.aiModerationResult.rejectionReason}
                  </p>
                </div>
              </div>
            )}

          <ProductDiscountList
            discounts={discounts}
            onDelete={onDeleteDiscount}
            isDeletingId={isDeletingDiscount}
            variant="list"
          />

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary tabular-nums">
              {formatPrice(product.price)}
            </span>
            <ProductCardActions {...actionProps} variant="list" />
          </div>
        </div>
      </div>
    </div>
  );
}
