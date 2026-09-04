"use client";

import { IconLoader2, IconCheck } from "@tabler/icons-react";
import type { IProduct } from "@/types/product";

type ProductDrawerFooterProps = {
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
}: ProductDrawerFooterProps) {
  const canModerate =
    product.status === "pending" ||
    product.status === "under_review" ||
    product.status === "review_requested";

  if (!canModerate) {
    return (
      <footer className="shrink-0 border-t border-luxury-ink/10 px-6 py-4 flex justify-end bg-cream-50/50">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 rounded-[2px] border border-luxury-ink/20 text-xs font-bold uppercase tracking-[0.12em] text-luxury-ink hover:bg-taupe-50 transition-colors"
        >
          Đóng
        </button>
      </footer>
    );
  }

  return (
    <footer className="shrink-0 border-t border-luxury-ink/10 px-6 py-4 bg-cream-50/50">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-[2px] border border-luxury-ink/20 text-xs font-bold uppercase tracking-[0.12em] text-luxury-ink hover:bg-taupe-50 transition-colors"
        >
          Đóng
        </button>
        <button
          type="button"
          onClick={() => onReject(product)}
          disabled={isUpdating}
          className="flex-1 px-4 py-2 rounded-[2px] border border-blush-300 bg-blush-50 text-blush-700 text-xs font-bold uppercase tracking-[0.12em] hover:bg-blush-100 disabled:opacity-50 transition-colors"
        >
          ✕ Từ chối
        </button>
        <button
          type="button"
          onClick={() => onApprove(product)}
          disabled={isUpdating}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-[2px] bg-luxury-ink text-luxury-ivory text-xs font-bold uppercase tracking-[0.12em] hover:bg-charcoal-800 disabled:opacity-50 transition-colors shadow-xs"
        >
          {isUpdating ? (
            <IconLoader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <IconCheck className="w-4 h-4" /> Duyệt sản phẩm
            </>
          )}
        </button>
      </div>
    </footer>
  );
}
