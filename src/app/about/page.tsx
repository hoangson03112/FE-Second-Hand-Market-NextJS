import type { Metadata } from "next";
import Link from "next/link";
import {
  IconLeaf,
  IconShieldCheck,
  IconArrowsShuffle,
  IconSparkles,
  IconArrowRight,
} from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Về chúng tôi | Eco Market",
  description:
    "Eco Market - Nền tảng thương mại điện tử tuần hoàn hàng đầu, mang lại vòng đời mới cho sản phẩm chất lượng cao với độ tin cậy tuyệt đối.",
};

const STATS = [
  { value: "50,000+", label: "Sản phẩm tuần hoàn", note: "Đã trao gửi thành công" },
  { value: "120 Tấn", label: "Cắt giảm CO2", note: "Bảo vệ môi trường tự nhiên" },
  { value: "99.8%", label: "Giao dịch an toàn", note: "Bảo vệ bởi Ký quỹ Escrow" },
  { value: "4.9 / 5", label: "Độ hài lòng", note: "Từ hơn 35.000 khách hàng" },
];

const PILLARS = [
  {
    icon: IconLeaf,
    title: "Kinh tế tuần hoàn",
    description:
      "Tối ưu hóa giá trị của mọi sản phẩm bằng cách kéo dài vòng đời sử dụng, giảm thiểu tối đa rác thải điện tử và tiêu dùng ra môi trường.",
  },
  {
    icon: IconShieldCheck,
    title: "Thanh toán Ký quỹ an toàn",
    description:
      "Tiền thanh toán được giữ an toàn tại hệ thống Eco Market và chỉ giải ngân cho người bán khi người mua đã kiểm tra và hài lòng với đơn hàng.",
  },
  {
    icon: IconSparkles,
    title: "Kiểm định chất lượng AI",
    description:
      "Tích hợp hệ thống phân tích hình ảnh và văn bản tự động bởi AI nhằm phát hiện hàng giả, hàng kém chất lượng và nội dung gian lận ngay từ khâu đăng bán.",
  },
  {
    icon: IconArrowsShuffle,
    title: "Minh bạch & Công bằng",
    description:
      "Quy trình xử lý khiếu nại 3 bên minh bạch, đảm bảo quyền lợi tuyệt đối cho người mua và sự công bằng cho người bán chân chính.",
  },
];

const VALUES = [
  {
    tag: "01",
    title: "Chính trực & Minh bạch",
    description:
      "Mọi thông tin sản phẩm, lịch sử giao dịch và phí dịch vụ luôn được công khai, rõ ràng và không có bất kỳ phụ phí ẩn.",
  },
  {
    tag: "02",
    title: "Trách nhiệm bền vững",
    description:
      "Mỗi giao dịch trên Eco Market là một hành động thiết thực đóng góp vào mục tiêu phát triển bền vững và giảm tải ô nhiễm hành tinh.",
  },
  {
    tag: "03",
    title: "Trải nghiệm Tinh tế",
    description:
      "Định vị lại thị trường đồ cũ thành một không gian mua sắm văn minh, thẩm mỹ cao và đáng tin cậy như mua hàng mới cao cấp.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-luxury-ivory text-luxury-ink">
      <section className="relative border-b border-luxury-ink/10 bg-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-luxury-champagne/80" />
            <span className="text-2xs font-bold uppercase tracking-[0.28em] text-neutral-600">
              Về Eco Market
            </span>
            <span className="h-px w-8 bg-luxury-champagne/80" />
          </div>
          <h1 className="font-droid-serif text-3xl sm:text-5xl font-bold tracking-tight text-luxury-ink max-w-3xl mx-auto leading-tight">
            Định Nghĩa Lại Phong Cách Tiêu Dùng Tuần Hoàn & Bền Vững
          </h1>
          <p className="mt-6 text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Eco Market ra đời với sứ mệnh xây dựng một chuẩn mực mới cho thị trường đồ cũ tại Việt Nam — nơi sự tin cậy, tính minh bạch và ý thức bảo vệ môi trường hòa quyện trong từng trải nghiệm mua sắm.
          </p>
        </div>
      </section>

      <section className="border-b border-luxury-ink/10 bg-cream-50/50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((stat, i) => (
              <div key={i} className="rounded-[2px] border border-luxury-ink/10 bg-white p-6 shadow-xs">
                <p className="font-droid-serif text-2xl sm:text-4xl font-bold text-luxury-ink tabular-nums">
                  {stat.value}
                </p>
                <p className="text-2xs font-bold uppercase tracking-[0.16em] text-neutral-600 mt-2">
                  {stat.label}
                </p>
                <p className="text-xs text-neutral-400 mt-1">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-px w-6 bg-luxury-champagne/80" />
            <span className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
              Trụ cột hoạt động
            </span>
            <span className="h-px w-6 bg-luxury-champagne/80" />
          </div>
          <h2 className="font-droid-serif text-2xl sm:text-3xl font-bold text-luxury-ink">
            Giải Pháp Công Nghệ Cho Tiêu Dùng Thông Minh
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="rounded-[2px] border border-luxury-ink/10 bg-white p-6 sm:p-8 space-y-4 hover:border-luxury-ink/30 transition-all"
              >
                <div className="w-12 h-12 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink flex items-center justify-center">
                  <Icon className="w-6 h-6" stroke={1.5} />
                </div>
                <h3 className="font-droid-serif text-lg font-bold text-luxury-ink">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-luxury-ink/10 bg-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-px w-6 bg-luxury-champagne/80" />
              <span className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                Giá trị cốt lõi
              </span>
              <span className="h-px w-6 bg-luxury-champagne/80" />
            </div>
            <h2 className="font-droid-serif text-2xl sm:text-3xl font-bold text-luxury-ink">
              Nguyên Tắc Định Hình Eco Market
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((val) => (
              <div
                key={val.tag}
                className="rounded-[2px] border border-luxury-ink/10 bg-cream-50/40 p-6 sm:p-8 space-y-3"
              >
                <span className="font-droid-serif text-2xl font-bold text-luxury-champagne">
                  {val.tag}
                </span>
                <h3 className="font-droid-serif text-base font-bold text-luxury-ink">
                  {val.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-luxury-ink/10 bg-luxury-ink text-luxury-ivory py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-droid-serif text-2xl sm:text-3xl font-bold">
            Cùng Nhau Xây Dựng Thói Quen Tiêu Dùng Tích Cực
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Khám phá hàng ngàn sản phẩm chất lượng hoặc bắt đầu đăng bán những món đồ bạn không còn sử dụng ngay hôm nay.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-luxury-ivory text-luxury-ink px-6 py-3 text-2xs font-bold uppercase tracking-[0.14em] hover:bg-cream-100 transition-all"
            >
              Khám phá sản phẩm
              <IconArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/sell"
              className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-luxury-ivory/30 text-luxury-ivory px-6 py-3 text-2xs font-bold uppercase tracking-[0.14em] hover:bg-white/10 transition-all"
            >
              Đăng bán ngay
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
