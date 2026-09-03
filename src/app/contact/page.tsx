"use client";

import { useState, FormEvent } from "react";
import {
  IconMapPin,
  IconPhone,
  IconMail,
  IconClock,
  IconSend,
  IconCheck,
  IconLoader2,
} from "@tabler/icons-react";
import { useToast } from "@/components/providers/ToastProvider";

export default function ContactPage() {
  const toast = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("support");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      toast.error("Vui lòng điền đầy đủ họ tên, email và nội dung tin nhắn.");
      return;
    }

    setIsSubmitting(true);
    // Simulate async submission
    await new Promise((res) => setTimeout(res, 800));
    setIsSubmitting(false);
    setIsSent(true);
    toast.success("Gửi tin nhắn liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.");
    setFullName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-luxury-ivory text-luxury-ink">
      <section className="relative border-b border-luxury-ink/10 bg-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-luxury-champagne/80" />
            <span className="text-2xs font-bold uppercase tracking-[0.28em] text-neutral-600">
              Kết Nối Với Chúng Tôi
            </span>
            <span className="h-px w-8 bg-luxury-champagne/80" />
          </div>
          <h1 className="font-droid-serif text-3xl sm:text-5xl font-bold tracking-tight text-luxury-ink leading-tight">
            Liên Hệ Ban Quản Trị Eco Market
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Chúng tôi luôn lắng nghe mọi thắc mắc, đề xuất hợp tác kinh doanh và yêu cầu hỗ trợ từ quý khách hàng.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-6 sm:p-8 space-y-6">
              <h2 className="font-droid-serif text-xl font-bold text-luxury-ink border-b border-luxury-ink/8 pb-4">
                Thông Tin Trực Tiếp
              </h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink flex items-center justify-center shrink-0">
                    <IconMapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-2xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                      Trụ sở văn phòng
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-luxury-ink mt-0.5">
                      Khu Công Nghệ Cao, TP. Thủ Đức, TP. Hồ Chí Minh
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink flex items-center justify-center shrink-0">
                    <IconPhone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-2xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                      Hotline hỗ trợ (24/7)
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-luxury-ink mt-0.5">
                      1900 6868 · 028 7300 8888
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink flex items-center justify-center shrink-0">
                    <IconMail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-2xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                      Email tiếp nhận
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-luxury-ink mt-0.5">
                      hotro@ecomarket.io.vn
                    </p>
                    <p className="text-xs text-neutral-400">
                      contact@ecomarket.io.vn (Hợp tác doanh nghiệp)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink flex items-center justify-center shrink-0">
                    <IconClock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-2xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                      Thời gian làm việc
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-luxury-ink mt-0.5">
                      Thứ Hai - Chủ Nhật: 08:00 - 22:00
                    </p>
                    <p className="text-xs text-neutral-400">
                      Hệ thống tự động trực tuyến 24/7
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="rounded-[2px] border border-luxury-ink/10 bg-white p-6 sm:p-8 space-y-5"
            >
              <h2 className="font-droid-serif text-xl font-bold text-luxury-ink border-b border-luxury-ink/8 pb-4">
                Gửi Tin Nhắn Cho Chúng Tôi
              </h2>

              {isSent ? (
                <div className="p-6 rounded-[2px] border border-accent/30 bg-cream-50/70 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-[2px] bg-accent text-white flex items-center justify-center">
                    <IconCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-droid-serif text-lg font-bold text-luxury-ink">
                    Cảm ơn bạn đã liên hệ!
                  </h3>
                  <p className="text-xs text-neutral-600 max-w-md mx-auto">
                    Yêu cầu của bạn đã được chuyển tới bộ phận liên quan. Chuyên viên chăm sóc khách hàng sẽ phản hồi qua email hoặc số điện thoại trong thời gian sớm nhất.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSent(false)}
                    className="inline-flex items-center gap-1 text-2xs font-bold uppercase tracking-[0.14em] text-accent hover:underline pt-2"
                  >
                    Gửi thêm tin nhắn khác →
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full rounded-[2px] border border-luxury-ink/15 bg-white px-3.5 py-2 text-xs text-luxury-ink focus:outline-none focus:border-luxury-ink transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@vidu.com"
                        className="w-full rounded-[2px] border border-luxury-ink/15 bg-white px-3.5 py-2 text-xs text-luxury-ink focus:outline-none focus:border-luxury-ink transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0912 345 678"
                        className="w-full rounded-[2px] border border-luxury-ink/15 bg-white px-3.5 py-2 text-xs text-luxury-ink focus:outline-none focus:border-luxury-ink transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                        Chủ đề liên hệ
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full rounded-[2px] border border-luxury-ink/15 bg-white px-3.5 py-2 text-xs text-luxury-ink focus:outline-none focus:border-luxury-ink transition-all"
                      >
                        <option value="support">Hỗ trợ giao dịch & Đơn hàng</option>
                        <option value="refund">Khiếu nại đổi trả & Ký quỹ</option>
                        <option value="seller">Hợp tác mở gian hàng Seller</option>
                        <option value="partnership">Hợp tác kinh doanh & Truyền thông</option>
                        <option value="other">Ý kiến đóng góp khác</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                      Nội dung tin nhắn *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Mô tả chi tiết nội dung bạn cần hỗ trợ hoặc đề xuất..."
                      className="w-full rounded-[2px] border border-luxury-ink/15 bg-white px-3.5 py-2 text-xs text-luxury-ink focus:outline-none focus:border-luxury-ink transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-luxury-ink px-6 py-3 text-2xs font-bold uppercase tracking-[0.14em] text-luxury-ivory hover:bg-charcoal-800 disabled:opacity-50 transition-all w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <IconLoader2 className="w-4 h-4 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <IconSend className="w-4 h-4" />
                        Gửi tin nhắn liên hệ
                      </>
                    )}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
