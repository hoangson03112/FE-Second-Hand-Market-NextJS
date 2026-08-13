import { IconStar } from "@tabler/icons-react";
import { FEATURE_INFO } from "@/constants/messages";

interface OrderSellerReviewSectionProps {
  existingReview: { _id: string; rating: number; comment?: string } | null;
  showReviewForm: boolean;
  reviewRating: number;
  reviewComment: string;
  isSubmittingReview: boolean;
  onRatingChange: (value: number) => void;
  onCommentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function OrderSellerReviewSection({
  existingReview,
  showReviewForm,
  reviewRating,
  reviewComment,
  isSubmittingReview,
  onRatingChange,
  onCommentChange,
  onSubmit,
}: OrderSellerReviewSectionProps) {
  return (
    <div id="seller-review-section" className="overflow-hidden border border-luxury-ink/8 bg-white/60" style={{ borderRadius: "2px" }}>
      <div className="border-b border-luxury-ink/8 px-5 py-3">
        <div className="flex items-center gap-2">
          <IconStar className="h-4 w-4 text-luxury-champagne" strokeWidth={1.75} />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600">Đánh giá người bán</span>
        </div>
        <p className="mt-1 text-xs text-taupe-400">{FEATURE_INFO.REVIEW_SELLER_TIP}</p>
      </div>
      <div className="p-5">
        {existingReview ? (
          <div className="border border-luxury-ink/8 bg-cream-50 p-4" style={{ borderRadius: "2px" }}>
            <div className="mb-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <IconStar
                  key={i}
                  className={i <= existingReview.rating ? "h-5 w-5 fill-luxury-champagne text-luxury-champagne" : "h-5 w-5 text-taupe-200"}
                />
              ))}
            </div>
            {existingReview.comment && (
              <p className="text-sm leading-relaxed text-neutral-700">{existingReview.comment}</p>
            )}
          </div>
        ) : showReviewForm ? (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                Đánh giá của bạn
              </label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onRatingChange(i)}
                    className="p-0.5 transition-transform hover:scale-110"
                  >
                    <IconStar
                      className={i <= reviewRating ? "h-9 w-9 fill-luxury-champagne text-luxury-champagne" : "h-9 w-9 text-taupe-200 hover:text-luxury-champagne/40"}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                Nhận xét (tùy chọn)
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => onCommentChange(e.target.value)}
                rows={3}
                className="w-full resize-none border border-luxury-ink/15 bg-white px-3.5 py-2.5 text-sm text-luxury-ink placeholder:text-taupe-400/70 outline-none transition-colors duration-300 hover:border-luxury-ink/25 focus:border-luxury-champagne"
                style={{ borderRadius: "2px" }}
                placeholder="Chia sẻ trải nghiệm mua hàng của bạn..."
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingReview}
              className="w-full bg-luxury-ink py-2.5 text-sm font-semibold text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800 disabled:opacity-50"
              style={{ borderRadius: "2px" }}
            >
              {isSubmittingReview ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-taupe-400">
            <IconStar className="h-5 w-5 text-taupe-200" />
            Đang tải thông tin đánh giá...
          </div>
        )}
      </div>
    </div>
  );
}