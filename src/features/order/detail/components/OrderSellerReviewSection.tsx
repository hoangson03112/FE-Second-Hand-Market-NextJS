import { IconStar } from "@tabler/icons-react";
import { FEATURE_INFO } from "@/constants/messages";
import { Panel } from "@/features/order/components";
import { cn } from "@/lib/utils";

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

const FIELD_LABEL =
  "mb-2.5 block text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500";

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
    <Panel
      id="seller-review-section"
      eyebrow="Trải nghiệm"
      title="Đánh giá người bán"
      description={FEATURE_INFO.REVIEW_SELLER_TIP}
    >
      {existingReview ? (
        <div className="rounded-[2px] border border-luxury-ink/10 bg-cream-50 px-5 py-5">
          <span className="flex gap-1" aria-label={`${existingReview.rating} trên 5 sao`}>
            {[1, 2, 3, 4, 5].map((i) => (
              <IconStar
                key={i}
                aria-hidden
                className={cn(
                  "h-5 w-5",
                  i <= existingReview.rating
                    ? "fill-luxury-champagne text-luxury-champagne"
                    : "text-neutral-300",
                )}
              />
            ))}
          </span>
          {existingReview.comment && (
            <p className="mt-3 text-sm leading-relaxed text-neutral-700">
              {existingReview.comment}
            </p>
          )}
        </div>
      ) : showReviewForm ? (
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <span className={FIELD_LABEL}>Đánh giá của bạn</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onRatingChange(i)}
                  aria-label={`Chấm ${i} sao`}
                  className="rounded-[2px] p-0.5 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <IconStar
                    className={cn(
                      "h-9 w-9 transition-colors duration-300",
                      i <= reviewRating
                        ? "fill-luxury-champagne text-luxury-champagne"
                        : "text-neutral-300 hover:text-luxury-champagne/50",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="seller-review-comment" className={FIELD_LABEL}>
              Nhận xét (tùy chọn)
            </label>
            <textarea
              id="seller-review-comment"
              value={reviewComment}
              onChange={(e) => onCommentChange(e.target.value)}
              rows={4}
              placeholder="Chia sẻ trải nghiệm mua hàng của bạn…"
              className="w-full resize-none rounded-[2px] border border-luxury-ink/15 bg-white px-4 py-3 text-sm leading-relaxed text-luxury-ink outline-none transition-colors duration-300 placeholder:text-neutral-400 hover:border-luxury-ink/25 focus:border-luxury-champagne"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmittingReview}
            className="w-full rounded-[2px] bg-luxury-ink py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800 disabled:opacity-50"
          >
            {isSubmittingReview ? "Đang gửi…" : "Gửi đánh giá"}
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-center gap-3 py-8 text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border border-luxury-ink/20 border-t-luxury-ink" />
          Đang tải thông tin đánh giá
        </div>
      )}
    </Panel>
  );
}
