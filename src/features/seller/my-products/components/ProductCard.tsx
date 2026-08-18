import { IconAlertTriangle, IconSparkles } from "@tabler/icons-react";
import Image from "next/image";
import { microCaps } from "@/features/order/components";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format";
import type { MyListingProduct } from "@/types/myProducts";
import { ProductStatusChip } from "./ProductStatusChip";
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

const SHEET =
  "group relative overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white transition-all duration-500 hover:border-luxury-ink/25 hover:shadow-[0_12px_32px_color-mix(in_srgb,var(--luxury-ink)_6%,transparent)]";

/** Photo on a cream ground, contained rather than cropped — as on the storefront. */
function Thumbnail({
  product,
  className,
  sizes,
}: {
  product: MyListingProduct;
  className?: string;
  sizes: string;
}) {
  const imageUrl = product.avatar?.url;

  return (
    <div className={cn("relative overflow-hidden bg-cream-100", className)}>
      {imageUrl ? (
        <>
          <Image
            src={imageUrl}
            alt=""
            fill
            aria-hidden
            className="scale-125 object-cover opacity-30 blur-lg"
            sizes={sizes}
          />
          <div className="absolute inset-0 p-2">
            <div className="relative h-full w-full">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes={sizes}
                className="object-contain transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-full items-center justify-center text-neutral-400">
          <IconSparkles className="h-7 w-7 opacity-40" />
        </div>
      )}
    </div>
  );
}

/** Why the moderator turned the listing down — blush ramp, never raw red. */
function RejectionNote({
  reason,
  lines,
}: {
  reason: string;
  lines: "one" | "two";
}) {
  return (
    <div className="flex gap-2.5 rounded-[2px] border border-blush-300 bg-blush-50 px-3 py-2.5">
      <IconAlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blush-600" />
      <p
        className={cn(
          "text-xs leading-relaxed text-blush-800",
          lines === "one" ? "line-clamp-1" : "line-clamp-2",
        )}
      >
        {reason}
      </p>
    </div>
  );
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

  const rejectionReason =
    product.status === "rejected"
      ? product.aiModerationResult?.rejectionReason
      : null;

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
      <article className={cn(SHEET, "flex flex-col")}>
        <div className="relative">
          <Thumbnail
            product={product}
            className="aspect-square w-full"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <ProductStatusChip
            status={product.status}
            className="absolute left-2.5 top-2.5 z-10"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          {product.categoryId?.name ? (
            <p className={cn(microCaps, "truncate text-neutral-500")}>
              {product.categoryId.name}
            </p>
          ) : null}

          <h3 className="line-clamp-2 text-sm font-medium leading-relaxed text-luxury-ink">
            {product.name}
          </h3>

          {rejectionReason ? (
            <RejectionNote reason={rejectionReason} lines="two" />
          ) : null}

          <div className="mt-auto flex items-baseline justify-between gap-3 border-t border-luxury-ink/8 pt-3">
            <span
              className="font-droid-serif tabular-nums text-lg text-luxury-ink"
            >
              {formatPrice(product.price)}
            </span>
            {product.createdAt ? (
              <span className="shrink-0 text-2xs tabular-nums text-neutral-500">
                {format(product.createdAt)}
              </span>
            ) : null}
          </div>

          {discounts.length > 0 ? (
            <ProductDiscountList
              discounts={discounts}
              onDelete={onDeleteDiscount}
              isDeletingId={isDeletingDiscount}
              variant="grid"
            />
          ) : null}

          <ProductCardActions {...actionProps} variant="grid" />
        </div>
      </article>
    );
  }

  return (
    <article className={SHEET}>
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:gap-5 sm:p-5">
        <Thumbnail
          product={product}
          className="h-24 w-24 shrink-0 rounded-[2px] border border-luxury-ink/10"
          sizes="96px"
        />

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="line-clamp-1 text-sm font-medium leading-relaxed text-luxury-ink sm:text-base">
                {product.name}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                {product.categoryId?.name ? (
                  <span className={cn(microCaps, "text-neutral-500")}>
                    {product.categoryId.name}
                  </span>
                ) : null}
                {product.createdAt ? (
                  <span className="text-2xs tabular-nums text-neutral-500">
                    {format(product.createdAt)}
                  </span>
                ) : null}
              </div>
            </div>

            <ProductStatusChip status={product.status} />
          </div>

          {rejectionReason ? (
            <RejectionNote reason={rejectionReason} lines="one" />
          ) : null}

          {discounts.length > 0 ? (
            <ProductDiscountList
              discounts={discounts}
              onDelete={onDeleteDiscount}
              isDeletingId={isDeletingDiscount}
              variant="list"
            />
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-luxury-ink/8 pt-3">
            <span
              className="font-droid-serif tabular-nums text-xl text-luxury-ink"
            >
              {formatPrice(product.price)}
            </span>
            <ProductCardActions {...actionProps} variant="list" />
          </div>
        </div>
      </div>
    </article>
  );
}
