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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-taupe-900/40 backdrop-blur-sm">
      <div className="bg-cream-50 rounded-2xl shadow-xl border-2 border-border max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b-2 border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-taupe-900 uppercase tracking-wider">
                Đánh Giá Sản Phẩm
              </h3>
              <p className="text-sm text-taupe-600 mt-1">
                {selectedProduct.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-taupe-500 hover:bg-taupe-100 hover:text-taupe-900 transition-colors"
            >
              <IconCircleX className="w-6 h-6" />
            </button>
          </div>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-taupe-700 mb-2">
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
                        ? "fill-primary/80 text-primary/80"
                        : "text-taupe-200 hover:text-primary/40"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-taupe-700 mb-1.5">
              Nhận xét (tùy chọn)
            </label>
            <textarea
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-taupe-900 placeholder:text-taupe-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 border-2 border-taupe-300/80 text-taupe-700 rounded-xl font-semibold text-sm hover:bg-taupe-50 hover:border-taupe-500/70 transition-all duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-xl font-bold text-sm tracking-wide hover:bg-primary/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
