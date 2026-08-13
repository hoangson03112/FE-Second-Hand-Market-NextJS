import { IconEdit, IconEye, IconRefresh, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
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
  /** grid: icon-only delete, flex-1 buttons. list: labeled delete, inline gap. */
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
  const btnBase =
    variant === "grid"
      ? "flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors"
      : "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors";

  return (
    <div className={variant === "grid" ? "flex gap-1.5" : "flex items-center gap-1.5"}>
      {canEdit && (
        <Link
          href={`/sell?edit=${product._id}`}
          className={`${btnBase} bg-taupe-100 hover:bg-taupe-200 text-taupe-900`}
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
          className={`${btnBase} bg-white hover:bg-taupe-50 text-taupe-700 border-2 border-border disabled:opacity-50`}
        >
          <IconRefresh className="w-3.5 h-3.5" />
          {isRequestingReview ? "..." : variant === "grid" ? "Duyệt lại" : "Yêu cầu duyệt lại"}
        </button>
      )}

      {isVisibleOnSite && product.slug && (
        <Link
          href={`/products/${product._id}/${product.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnBase} bg-taupe-100 hover:bg-taupe-200 text-taupe-900`}
        >
          <IconEye className="w-3.5 h-3.5" />
          Xem
        </Link>
      )}

      <button
        type="button"
        onClick={() => onDelete(product._id, product.name)}
        disabled={isDeleting}
        className={
          variant === "grid"
            ? "px-2.5 py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
            : `${btnBase} text-red-500 hover:bg-red-50 disabled:opacity-50`
        }
      >
        <IconTrash className="w-3.5 h-3.5" />
        {variant === "list" && (isDeleting ? "..." : "Xóa")}
      </button>
    </div>
  );
}