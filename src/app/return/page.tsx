import type { Metadata } from "next";
import Link from "next/link";
import {
  IconReceiptRefund,
  IconClock,
  IconShieldCheck,
  IconCheck,
  IconX,
  IconArrowRight,
  IconPhoto,
  IconQrcode,
} from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Chính sách đổi trả & Hoàn tiền | Eco Market",
  description:
    "Quy chế bảo vệ người mua 72h, quy trình khiếu nại tranh chấp và hoàn trả 100% tiền qua tài khoản ngân hàng VietQR tại Eco Market.",
};

const ELIGIBLE_CASES = [
  "Sản phẩm nhận được bị nứt vỡ, hỏng hóc hoặc không thể hoạt động mà người bán không ghi rõ trong mô tả.",
  "Người bán giao sai mẫu mã, sai phân loại hoặc thiếu phụ kiện thiết yếu đi kèm.",
  "Sản phẩm là hàng giả, hàng nhái thương hiệu không đúng cam kết.",
  "Kiện hàng bị thất lạc trong quá trình vận chuyển hoặc không nhận được hàng sau thời gian cam kết.",
];

const INELIGIBLE_CASES = [
  "Người mua đổi ý, không còn nhu cầu sử dụng nhưng sản phẩm vẫn đúng mô tả.",
  "Sản phẩm bị hư hại do lỗi sử dụng sai cách của người mua sau khi đã nhận hàng.",
  "Yêu cầu hoàn tiền gửi sau thời hạn 3 ngày (72 giờ) kể từ khi bưu tá giao hàng thành công.",
];

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-luxury-ivory text-luxury-ink">
      <section className="relative border-b border-luxury-ink/10 bg-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-luxury-champagne/80" />
            <span className="text-2xs font-bold uppercase tracking-[0.28em] text-neutral-600">
              Bảo Vệ Người Mua 100%
            </span>
            <span className="h-px w-8 bg-luxury-champagne/80" />
          </div>
          <h1 className="font-droid-serif text-3xl sm:text-5xl font-bold tracking-tight text-luxury-ink leading-tight">
            Chính Sách Đổi Trả & Hoàn Tiền
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Cam kết hoàn tiền minh bạch, nhanh chóng và an toàn nhờ cơ chế giữ tiền Ký quỹ Escrow độc lập.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 3-day guarantee card */}
        <div className="rounded-[2px] border border-accent/30 bg-cream-50/70 p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-[2px] bg-accent text-white flex items-center justify-center shrink-0">
            <IconShieldCheck className="w-10 h-10" />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-2xs font-bold uppercase tracking-[0.2em] text-accent block">
              Đặc quyền Eco Guard
            </span>
            <h2 className="font-droid-serif text-xl sm:text-2xl font-bold text-luxury-ink">
              Thời Gian Khiếu Nại 72 Giờ (3 Ngày)
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Bạn có trọn vẹn 3 ngày sau khi nhận hàng để trải nghiệm thực tế. Trong thời gian này, tiền thanh toán của bạn luôn được giữ an toàn tại tài khoản trung gian Eco Market.
            </p>
          </div>
        </div>

        {/* Eligible vs Ineligible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 border-b border-luxury-ink/8 pb-3 text-accent font-bold">
              <IconCheck className="w-5 h-5 text-accent" />
              <h3 className="font-droid-serif text-base text-luxury-ink">
                Trường hợp được chấp nhận hoàn tiền
              </h3>
            </div>
            <ul className="space-y-3">
              {ELIGIBLE_CASES.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 border-b border-luxury-ink/8 pb-3 text-blush-700 font-bold">
              <IconX className="w-5 h-5 text-blush-700" />
              <h3 className="font-droid-serif text-base text-luxury-ink">
                Trường hợp không áp dụng hoàn tiền
              </h3>
            </div>
            <ul className="space-y-3">
              {INELIGIBLE_CASES.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-blush-600 mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4-step Dispute Resolution */}
        <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-6 sm:p-10 space-y-6">
          <h2 className="font-droid-serif text-xl font-bold text-luxury-ink border-b border-luxury-ink/8 pb-4">
            Quy Trình Xử Lý Tranh Chấp 4 Bước
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <span className="font-droid-serif text-xl font-bold text-luxury-champagne">
                Bước 1
              </span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-luxury-ink">
                Gửi yêu cầu & Bằng chứng
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Người mua bấm “Yêu cầu hoàn tiền” trong đơn hàng, tải lên ảnh/video chụp rõ khuyết tật của sản phẩm.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-droid-serif text-xl font-bold text-luxury-champagne">
                Bước 2
              </span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-luxury-ink">
                Người bán phản hồi (24h)
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Người bán xem xét bằng chứng và có quyền chấp nhận hoàn tiền hoặc phản hồi giải trình.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-droid-serif text-xl font-bold text-luxury-champagne">
                Bước 3
              </span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-luxury-ink">
                Admin thẩm định phán quyết
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Nếu hai bên không thống nhất, Admin Eco Market sẽ làm trọng tài căn cứ theo bằng chứng và lịch sử chat.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-droid-serif text-xl font-bold text-luxury-champagne">
                Bước 4
              </span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-luxury-ink">
                Hoàn tiền tự động VietQR
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Khi được duyệt, hệ thống chuyển khoản 100% số tiền hoàn về tài khoản ngân hàng của bạn trong 1-2h.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
