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
    <div id="seller-review-section" className="bg-gradient-to-br from-cream-50 to-white border-2 border-border rounded-2xl overflow-hidden shadow-md">
      <div className="px-5 py-3 border-b-2 border-border">
        <div className="flex items-center gap-2">
          <IconStar className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-taupe-900 uppercase tracking-wider">Đánh giá người bán</span>
        </div>
        <p className="text-xs text-taupe-500 mt-1">{FEATURE_INFO.REVIEW_SELLER_TIP}</p>
      </div>
      <div className="p-5">
        {existingReview ? (
          <div className="bg-taupe-50/60 rounded-xl border border-border p-4">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <IconStar
                  key={i}
                  className={`w-5 h-5 ${
                    i <= existingReview.rating ? "fill-primary/80 text-primary/80" : "text-taupe-200"
                  }`}
                />
              ))}
            </div>
            {existingReview.comment && (
              <p className="text-sm text-taupe-700 leading-relaxed">{existingReview.comment}</p>
            )}
          </div>
        ) : showReviewForm ? (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-taupe-700 mb-2">
                Đánh giá của bạn
              </label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onRatingChange(i)}
                    className="p-0.5 hover:scale-110 transition-transform"
                  >
                    <IconStar
                      className={`w-9 h-9 ${
                        i <= reviewRating ? "fill-primary/80 text-primary/80" : "text-taupe-200 hover:text-primary/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-taupe-700 mb-2">
                Nhận xét (tùy chọn)
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => onCommentChange(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-taupe-900 placeholder:text-taupe-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm resize-none"
                placeholder="Chia sẻ trải nghiệm mua hàng của bạn..."
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingReview}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
            >
              {isSubmittingReview ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-center py-6 text-taupe-500 text-sm gap-2">
            <IconStar className="w-5 h-5 text-taupe-300" />
            Đang tải thông tin đánh giá...
          </div>
        )}
      </div>
    </div>
  );
}