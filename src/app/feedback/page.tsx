"use client";

import { useState, FormEvent } from "react";
import {
  IconStar,
  IconStarFilled,
  IconSend,
  IconCheck,
  IconLoader2,
  IconHeartHandshake,
} from "@tabler/icons-react";
import { useToast } from "@/components/providers/ToastProvider";

export default function FeedbackPage() {
  const toast = useToast();
  const [rating, setRating] = useState<number>(5);
  const [feedbackCategory, setFeedbackCategory] = useState("ui");
  const [comments, setComments] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!comments.trim()) {
      toast.error("Vui lòng nhập nội dung góp ý của bạn.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 800));
    setIsSubmitting(false);
    setIsDone(true);
    toast.success("Cảm ơn bạn đã đóng góp ý kiến quý báu!");
    setComments("");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-luxury-ivory text-luxury-ink">
      <section className="relative border-b border-luxury-ink/10 bg-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-luxury-champagne/80" />
            <span className="text-2xs font-bold uppercase tracking-[0.28em] text-neutral-600">
              Lắng Nghe Người Dùng
            </span>
            <span className="h-px w-8 bg-luxury-champagne/80" />
          </div>
          <h1 className="font-droid-serif text-3xl sm:text-5xl font-bold tracking-tight text-luxury-ink leading-tight">
            Góp Ý & Phản Hồi Trải Nghiệm
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Mỗi ý kiến đóng góp của bạn là động lực to lớn giúp đội ngũ Eco Market không ngừng cải tiến sản phẩm và chất lượng phục vụ.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-6 sm:p-10 space-y-6">
          {isDone ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-[2px] bg-accent text-white flex items-center justify-center">
                <IconCheck className="w-8 h-8" />
              </div>
              <h2 className="font-droid-serif text-2xl font-bold text-luxury-ink">
                Ý kiến của bạn đã được ghi nhận!
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                Đội ngũ phát triển sản phẩm sẽ nghiên cứu kỹ lưỡng những phản hồi này để tiếp tục nâng cấp hệ thống trong các bản cập nhật sắp tới.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsDone(false)}
                  className="inline-flex items-center justify-center rounded-[2px] bg-luxury-ink px-6 py-2.5 text-2xs font-bold uppercase tracking-[0.14em] text-luxury-ivory hover:bg-charcoal-800 transition-all"
                >
                  Gửi thêm ý kiến khác
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 border-b border-luxury-ink/8 pb-6 text-center">
                <label className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 block">
                  Mức độ hài lòng tổng thể của bạn
                </label>
                <div className="flex items-center justify-center gap-2 pt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform"
                    >
                      {star <= rating ? (
                        <IconStarFilled className="w-8 h-8" />
                      ) : (
                        <IconStar className="w-8 h-8 text-neutral-300" />
                      )}
                    </button>
                  ))}
                </div>
                <span className="text-xs font-semibold text-neutral-500 block pt-1">
                  {rating === 5 && "Rất tuyệt vời (5/5)"}
                  {rating === 4 && "Hài lòng (4/5)"}
                  {rating === 3 && "Bình thường (3/5)"}
                  {rating === 2 && "Cần cải thiện (2/5)"}
                  {rating === 1 && "Rất không hài lòng (1/5)"}
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                  Phân hệ bạn muốn góp ý
                </label>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="w-full rounded-[2px] border border-luxury-ink/15 bg-white px-3.5 py-2 text-xs text-luxury-ink focus:outline-none focus:border-luxury-ink transition-all"
                >
                  <option value="ui">Giao diện người dùng & Thiết kế</option>
                  <option value="speed">Tốc độ tải & Trải nghiệm ứng dụng</option>
                  <option value="escrow">Quy trình Thanh toán & Ký quỹ Escrow</option>
                  <option value="search">Tính năng Tìm kiếm & Lọc sản phẩm</option>
                  <option value="seller">Trải nghiệm đăng bán của Người bán</option>
                  <option value="cs">Chất lượng chăm sóc khách hàng</option>
                  <option value="feature">Đề xuất tính năng mới</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                  Chi tiết góp ý hoặc ý tưởng của bạn *
                </label>
                <textarea
                  required
                  rows={5}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Chia sẻ cụ thể những điểm bạn thích, chưa thích hoặc ý tưởng cải tiến..."
                  className="w-full rounded-[2px] border border-luxury-ink/15 bg-white px-3.5 py-2 text-xs text-luxury-ink focus:outline-none focus:border-luxury-ink transition-all resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                  Email của bạn{" "}
                  <span className="font-normal lowercase text-neutral-400">
                    (tùy chọn để chúng tôi phản hồi kết quả cải tiến)
                  </span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@vidu.com"
                  className="w-full rounded-[2px] border border-luxury-ink/15 bg-white px-3.5 py-2 text-xs text-luxury-ink focus:outline-none focus:border-luxury-ink transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-[2px] bg-luxury-ink px-6 py-3 text-2xs font-bold uppercase tracking-[0.14em] text-luxury-ivory hover:bg-charcoal-800 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <IconLoader2 className="w-4 h-4 animate-spin" />
                    Đang gửi phản hồi...
                  </>
                ) : (
                  <>
                    <IconSend className="w-4 h-4" />
                    Gửi đóng góp ý kiến
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
