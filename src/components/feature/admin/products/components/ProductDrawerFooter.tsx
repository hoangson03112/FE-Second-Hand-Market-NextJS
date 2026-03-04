"use client";

import { IconLoader2, IconShoppingBag } from "@tabler/icons-react";
import type { IProduct } from "@/types/product";

type Props = {
  product: IProduct;
  onClose: () => void;
  onApprove: (p: IProduct) => void;
  onReject: (p: IProduct) => void;
  isUpdating: boolean;
};

export function ProductDrawerFooter({
  product,
  onClose,
  onApprove,
  onReject,
  isUpdating,
}: Props) {
  const canModerate =
    product.status === "pending" ||
    product.status === "under_review" ||
    product.status === "review_requested";

  if (!canModerate) {
    return (
      <footer className="shrink-0 border-t border-border px-5 py-4 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          Đóng
        </button>
      </footer>
    );
  }

  return (
    <footer className="shrink-0 border-t border-border px-5 py-4">
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          Đóng
        </button>
        <button
          type="button"
          onClick={() => onReject(product)}
          disabled={isUpdating}
          className="flex-1 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:hover:bg-red-900/30 disabled:opacity-50 transition-colors"
        >
          ✕ Từ chối
        </button>
        <button
          type="button"
          onClick={() => onApprove(product)}
          disabled={isUpdating}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-md shadow-primary/20"
        >
          {isUpdating ? (
            <IconLoader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <IconShoppingBag className="w-4 h-4" /> Duyệt sản phẩm
            </>
          )}
        </button>
      </div>
    </footer>
  );
}
