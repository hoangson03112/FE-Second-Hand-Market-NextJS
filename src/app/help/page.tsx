import type { Metadata } from "next";
import Link from "next/link";
import {
  IconSearch,
  IconShoppingCart,
  IconBuildingStore,
  IconShieldCheck,
  IconTruck,
  IconReceiptRefund,
  IconHelpCircle,
  IconPhoneCall,
  IconMessageCircle,
  IconArrowRight,
} from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Trung tâm trợ giúp | Eco Market",
  description:
    "Cẩm nang hướng dẫn sử dụng, quy trình thanh toán ký quỹ, giải quyết khiếu nại và hỗ trợ người dùng trên sàn Eco Market.",
};

const TOPICS = [
  {
    icon: IconShoppingCart,
    title: "Hướng dẫn Người mua",
    desc: "Tìm kiếm sản phẩm, đặt hàng an toàn, kiểm tra hàng và quản lý đơn.",
    links: [
      { name: "Cách đặt mua và thanh toán an toàn", href: "/faq#buyer-order" },
      { name: "Quy trình kiểm tra hàng khi nhận (Đồng kiểm)", href: "/shipping" },
      { name: "Yêu cầu khiếu nại & Hoàn tiền trong 3 ngày", href: "/return" },
    ],
  },
  {
    icon: IconBuildingStore,
    title: "Hướng dẫn Người bán (Seller)",
    desc: "Đăng ký định danh CCCD, đăng bán sản phẩm, đóng gói và nhận tiền.",
    links: [
      { name: "Hồ sơ đăng ký tài khoản Seller", href: "/become-seller" },
      { name: "Quy chuẩn chụp ảnh và định giá sản phẩm", href: "/faq#seller-listing" },
      { name: "Thời gian giải ngân tiền vào tài khoản", href: "/faq#seller-payout" },
    ],
  },
  {
    icon: IconShieldCheck,
    title: "Thanh toán & Ký quỹ Escrow",
    desc: "Cơ chế bảo vệ tiền trung gian, cổng VietQR / PayOS và xác thực thanh toán.",
    links: [
      { name: "Cơ chế hoạt động của tài khoản Ký quỹ", href: "/faq#escrow-how" },
      { name: "Xác nhận đã nhận hàng thành công", href: "/faq#confirm-order" },
      { name: "Bảo mật thông tin tài khoản ngân hàng", href: "/privacy" },
    ],
  },
  {
    icon: IconTruck,
    title: "Vận chuyển & Giao nhận",
    desc: "Đơn vị vận chuyển GHN Express, tra cứu mã vận đơn và bảng biểu phí.",
    links: [
      { name: "Tra cứu lộ trình đơn hàng thời gian thực", href: "/my/orders" },
      { name: "Chính sách biểu phí và bảo hiểm hàng hóa", href: "/shipping" },
      { name: "Xử lý sự cố giao trễ hoặc thất lạc", href: "/contact" },
    ],
  },
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-luxury-ivory text-luxury-ink">
      <section className="relative border-b border-luxury-ink/10 bg-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-luxury-champagne/80" />
            <span className="text-2xs font-bold uppercase tracking-[0.28em] text-neutral-600">
              Trung Tâm Hỗ Trợ
            </span>
            <span className="h-px w-8 bg-luxury-champagne/80" />
          </div>
          <h1 className="font-droid-serif text-3xl sm:text-5xl font-bold tracking-tight text-luxury-ink leading-tight">
            Chúng Tôi Có Thể Giúp Gì Cho Bạn?
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Tra cứu cẩm nang hướng dẫn, chính sách bảo vệ giao dịch hoặc kết nối trực tiếp với đội ngũ hỗ trợ Eco Market.
          </p>

          <div className="mt-8 max-w-xl mx-auto relative">
            <div className="flex items-center rounded-[2px] border border-luxury-ink/20 bg-cream-50/50 px-4 py-3 shadow-xs">
              <IconSearch className="w-5 h-5 text-neutral-400 shrink-0 mr-3" />
              <input
                type="text"
                placeholder="Nhập câu hỏi hoặc vấn đề cần trợ giúp (VD: hoàn tiền, ký quỹ, phí ship...)"
                className="w-full bg-transparent text-xs sm:text-sm text-luxury-ink placeholder:text-neutral-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOPICS.map((topic, idx) => {
            const Icon = topic.icon;
            return (
              <div
                key={idx}
                className="rounded-[2px] border border-luxury-ink/10 bg-white p-6 sm:p-8 space-y-4"
              >
                <div className="flex items-center gap-3 border-b border-luxury-ink/8 pb-4">
                  <div className="w-10 h-10 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-droid-serif text-lg font-bold text-luxury-ink">
                      {topic.title}
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {topic.desc}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2.5 pt-1">
                  {topic.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link
                        href={link.href}
                        className="text-xs text-neutral-700 hover:text-accent font-medium flex items-center justify-between group transition-colors py-1"
                      >
                        <span>{link.name}</span>
                        <IconArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-luxury-ink/10 bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-[2px] border border-luxury-ink/10 bg-cream-50/40 p-6 space-y-3">
              <IconHelpCircle className="w-6 h-6 text-luxury-ink" />
              <h3 className="font-droid-serif text-base font-bold text-luxury-ink">
                Câu hỏi thường gặp
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Xem danh sách tổng hợp hơn 30 câu hỏi phổ biến nhất của cộng đồng.
              </p>
              <Link
                href="/faq"
                className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.14em] text-accent hover:underline pt-2"
              >
                Mở trang FAQ →
              </Link>
            </div>

            <div className="rounded-[2px] border border-luxury-ink/10 bg-cream-50/40 p-6 space-y-3">
              <IconMessageCircle className="w-6 h-6 text-luxury-ink" />
              <h3 className="font-droid-serif text-base font-bold text-luxury-ink">
                Gửi yêu cầu hỗ trợ
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Gửi tin nhắn hoặc báo cáo vấn đề tới ban điều hành và nhận phản hồi trong 2h.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.14em] text-accent hover:underline pt-2"
              >
                Liên hệ ngay →
              </Link>
            </div>

            <div className="rounded-[2px] border border-luxury-ink/10 bg-cream-50/40 p-6 space-y-3">
              <IconPhoneCall className="w-6 h-6 text-luxury-ink" />
              <h3 className="font-droid-serif text-base font-bold text-luxury-ink">
                Hotline hỗ trợ 24/7
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Tổng đài khẩn cấp cho các trường hợp khiếu nại đơn hàng: <strong>1900 6868</strong>
              </p>
              <a
                href="tel:19006868"
                className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.14em] text-accent hover:underline pt-2"
              >
                Gọi tổng đài →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
