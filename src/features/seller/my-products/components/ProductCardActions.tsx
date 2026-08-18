import {
  IconEdit,
  IconEye,
  IconLoader2,
  IconRefresh,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import {
  dangerActionSm,
  outlineActionSm,
  primaryActionSm,
} from "@/features/order/components";
import { cn } from "@/lib/utils";
import type { MyListingProduct } from "@/types/myProducts";

interface ProductCardActionsProps {
  product: MyListingProduct;
  canEdit: boolean;
  canRequestReview: boolean;
  isVisibleOnSite: boolean;
  onRequestReview?: (productId: string) => void;
  isRequestingReview: boolean;
  onDelete: (productId: string, productName: string) => void;
  isDeleting: boolean;
  /** grid: buttons share the row width, delete is icon-only. list: inline, labelled. */
  variant?: "grid" | "list";
}

export function ProductCardActions({
  product,
  canEdit,
  canRequestReview,
  isVisibleOnSite,
  onRequestReview,
  isRequestingReview,
  onDelete,
  isDeleting,
  variant = "list",
}: ProductCardActionsProps) {
  const isGrid = variant === "grid";
  /** In the grid the row is narrow, so the labelled actions stretch to fill it. */
  const grow = isGrid ? "flex-1" : undefined;

  return (
    <div className="flex items-center gap-2">
      {canEdit ? (
        <Link
          href={`/sell?edit=${product._id}`}
          className={cn(outlineActionSm, grow)}
        >
          <IconEdit className="h-3.5 w-3.5" />
          Sửa
        </Link>
      ) : null}

      {canRequestReview && onRequestReview ? (
        <button
          type="button"
          onClick={() => onRequestReview(product._id)}
          disabled={isRequestingReview}
          className={cn(primaryActionSm, grow)}
        >
          {isRequestingReview ? (
            <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <IconRefresh className="h-3.5 w-3.5" />
          )}
          {isGrid ? "Duyệt lại" : "Yêu cầu duyệt lại"}
        </button>
      ) : null}

      {isVisibleOnSite && product.slug ? (
        <Link
          href={`/products/${product._id}/${product.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(outlineActionSm, grow)}
        >
          <IconEye className="h-3.5 w-3.5" />
          Xem
        </Link>
      ) : null}

      <button
        type="button"
        onClick={() => onDelete(product._id, product.name)}
        disabled={isDeleting}
        aria-label={isGrid ? `Xóa ${product.name}` : undefined}
        className={cn(dangerActionSm, isGrid && "w-9 shrink-0 px-0")}
      >
        {isDeleting ? (
          <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <IconTrash className="h-3.5 w-3.5" />
        )}
        {isGrid ? null : "Xóa"}
      </button>
    </div>
  );
}
