import { IconStar, IconCircleX } from "@tabler/icons-react";

interface Props {
  show: boolean;
  selectedProduct: { id: string; name: string } | null;
  rating: number;
  comment: string;
  isSubmitting: boolean;
  onRatingChange: (rating: number) => void;
  onCommentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function ProductReviewModal({
  show,
  selectedProduct,
  rating,
  comment,
  isSubmitting,
  onRatingChange,
  onCommentChange,
  onSubmit,
  onClose,
}: Props) {
  if (!show || !selectedProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-cream-50 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b-2 border-neutral-200/60">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-neutral-900">Đánh giá sản phẩm</h3>
              <p className="text-sm text-neutral-600 mt-1">{selectedProduct.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <IconCircleX className="w-6 h-6 text-neutral-500" />
            </button>
          </div>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Đánh giá của bạn <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 justify-center py-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onRatingChange(i)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <IconStar
                    className={`w-10 h-10 ${
                      i <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-neutral-300 hover:text-amber-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Nhận xét (tùy chọn)
            </label>
            <textarea
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200/60 bg-cream-50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-neutral-900"
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 border-2 border-neutral-300 text-neutral-900 rounded-full font-bold hover:bg-neutral-50 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-primary text-white rounded-full font-bold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
