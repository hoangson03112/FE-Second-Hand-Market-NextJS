import { IconStar, IconX } from "@tabler/icons-react";
import { Eyebrow } from "@/features/order/components";
import { cn } from "@/lib/utils";

interface ProductReviewModalProps {
  open: boolean;
  selectedProduct: { id: string; name: string } | null;
  rating: number;
  comment: string;
  isSubmitting: boolean;
  onRatingChange: (value: number) => void;
  onCommentChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const FIELD_LABEL =
  "mb-2.5 block text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500";

const BUTTON_BASE =
  "flex-1 rounded-[2px] py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] transition-all duration-300";

export function ProductReviewModal({
  open,
  selectedProduct,
  rating,
  comment,
  isSubmitting,
  onRatingChange,
  onCommentChange,
  onClose,
  onSubmit,
}: ProductReviewModalProps) {
  if (!open || !selectedProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-ink/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2px] border border-luxury-ink/10 bg-luxury-ivory shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-luxury-ink/10 px-6 py-5">
          <div className="min-w-0">
            <Eyebrow>Đánh giá</Eyebrow>
            <h3 className="font-droid-serif mt-3 text-lg tracking-tight text-luxury-ink">
              Đánh giá sản phẩm
            </h3>
            <p className="mt-2 truncate text-xs text-neutral-500">
              {selectedProduct.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="-mr-2 shrink-0 rounded-[2px] p-2 text-neutral-500 transition-colors hover:bg-taupe-50 hover:text-luxury-ink"
          >
            <IconX className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </header>

        <form onSubmit={onSubmit} className="space-y-6 px-6 py-6">
          <div>
            <span className={FIELD_LABEL}>
              Đánh giá của bạn <span className="text-accent">*</span>
            </span>
            <div className="flex justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onRatingChange(i)}
                  aria-label={`Chấm ${i} sao`}
                  className="rounded-[2px] p-1 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <IconStar
                    className={cn(
                      "h-10 w-10 transition-colors duration-300",
                      i <= rating
                        ? "fill-luxury-champagne text-luxury-champagne"
                        : "text-neutral-300 hover:text-luxury-champagne/50",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="product-review-comment" className={FIELD_LABEL}>
              Nhận xét (tùy chọn)
            </label>
            <textarea
              id="product-review-comment"
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              rows={6}
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này…"
              className="w-full resize-none rounded-[2px] border border-luxury-ink/15 bg-white px-4 py-3 text-sm leading-relaxed text-luxury-ink outline-none transition-colors duration-300 placeholder:text-neutral-400 hover:border-luxury-ink/25 focus:border-luxury-champagne"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                BUTTON_BASE,
                "border border-luxury-ink/15 text-neutral-700 hover:border-luxury-ink/30 hover:text-luxury-ink",
              )}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                BUTTON_BASE,
                "bg-luxury-ink text-luxury-ivory hover:bg-charcoal-800 disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              {isSubmitting ? "Đang gửi…" : "Gửi đánh giá"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
