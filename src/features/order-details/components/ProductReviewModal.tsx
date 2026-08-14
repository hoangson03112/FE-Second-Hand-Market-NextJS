import { IconStar, IconX } from "@tabler/icons-react";

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
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-luxury-ivory shadow-2xl"
        style={{ borderRadius: "2px" }}
      >
        <div className="flex items-start justify-between border-b border-luxury-ink/8 px-6 py-5">
          <div>
            <h3
              style={{
                fontFamily: "var(--font-droid-serif), serif",
                fontWeight: 400,
              }}
              className="text-lg text-luxury-ink"
            >
              Đánh giá sản phẩm
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              {selectedProduct.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-taupe-400 transition-colors hover:text-luxury-ink"
            aria-label="Đóng"
          >
            <IconX className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 px-6 py-6">
          <div>
            <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
              Đánh giá của bạn <span className="text-accent">*</span>
            </label>
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onRatingChange(i)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <IconStar
                    className={
                      i <= rating
                        ? "h-10 w-10 fill-luxury-champagne text-luxury-champagne"
                        : "h-10 w-10 text-taupe-200 hover:text-luxury-champagne/40"
                    }
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
              Nhận xét (tùy chọn)
            </label>
            <textarea
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              rows={6}
              className="w-full border border-luxury-ink/15 bg-white px-3.5 py-2.5 text-sm text-luxury-ink placeholder:text-taupe-400/70 outline-none transition-colors duration-300 hover:border-luxury-ink/25 focus:border-luxury-champagne"
              style={{ borderRadius: "2px" }}
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-luxury-ink/15 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-600 transition-all duration-300 hover:border-luxury-ink/30 hover:text-luxury-ink"
              style={{ borderRadius: "2px" }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-luxury-ink px-6 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ borderRadius: "2px" }}
            >
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
