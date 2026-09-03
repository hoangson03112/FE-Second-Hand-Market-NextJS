import type { Metadata } from "next";
import Link from "next/link";
import {
  IconTruck,
  IconClock,
  IconBoxSeam,
  IconShieldCheck,
  IconChecklist,
  IconCurrencyDollar,
} from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Chính sách vận chuyển | Eco Market",
  description:
    "Tìm hiểu quy trình giao nhận hàng hóa, đơn vị vận chuyển đối tác GHN Express, thời gian phát hàng và quy định đồng kiểm tại Eco Market.",
};

const STEPS = [
  {
    step: "01",
    title: "Người bán chuẩn bị hàng",
    desc: "Trong vòng 24h kể từ khi đơn hàng được tạo, người bán đóng gói cẩn thận và bàn giao cho bưu tá GHN.",
  },
  {
    step: "02",
    title: "Vận chuyển & Cập nhật lộ trình",
    desc: "Kiện hàng được phân loại tại trung tâm logistics. Người mua theo dõi vị trí kiện hàng trên hệ thống thời gian thực.",
  },
  {
    step: "03",
    title: "Đồng kiểm khi nhận hàng",
    desc: "Bưu tá giao tận tay. Người mua kiểm tra ngoại quan kiện hàng trước khi ký nhận.",
  },
  {
    step: "04",
    title: "Bảo vệ 3 ngày sau nhận",
    desc: "Người mua có thêm 3 ngày kiểm tra kỹ lưỡng công năng trước khi hệ thống hoàn tất giải ngân cho người bán.",
  },
];

const TIMEFRAMES = [
  {
    area: "Nội tỉnh / Nội thành (TP.HCM, Hà Nội, Đà Nẵng)",
    time: "24 - 48 giờ",
    note: "Giao nhanh tiêu chuẩn",
  },
  {
    area: "Cận vùng / Các tỉnh lân cận",
    time: "2 - 3 ngày",
    note: "Tuyến huyện +1 ngày",
  },
  {
    area: "Liên miền (Bắc - Nam, Tây Nguyên, Hải Đảo)",
    time: "3 - 5 ngày",
    note: "Tùy thuộc điều kiện thời tiết",
  },
];

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-luxury-ivory text-luxury-ink">
      <section className="relative border-b border-luxury-ink/10 bg-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-luxury-champagne/80" />
            <span className="text-2xs font-bold uppercase tracking-[0.28em] text-neutral-600">
              Giao Nhận Toàn Quốc
            </span>
            <span className="h-px w-8 bg-luxury-champagne/80" />
          </div>
          <h1 className="font-droid-serif text-3xl sm:text-5xl font-bold tracking-tight text-luxury-ink leading-tight">
            Chính Sách Vận Chuyển & Giao Hàng
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Hợp tác cùng đơn vị vận chuyển hàng đầu GHN Express nhằm mang lại trải nghiệm giao nhận nhanh chóng, an toàn và minh bạch.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Process Steps */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="h-px w-6 bg-luxury-champagne/80" />
              <span className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                Quy trình chuẩn
              </span>
              <span className="h-px w-6 bg-luxury-champagne/80" />
            </div>
            <h2 className="font-droid-serif text-2xl font-bold text-luxury-ink">
              Chu Trình Giao Nhận 4 Bước
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className="rounded-[2px] border border-luxury-ink/10 bg-white p-6 space-y-3 relative"
              >
                <span className="font-droid-serif text-2xl font-bold text-luxury-champagne">
                  {s.step}
                </span>
                <h3 className="font-droid-serif text-base font-bold text-luxury-ink">
                  {s.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Timeframes */}
        <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-6 sm:p-8 space-y-6">
          <h2 className="font-droid-serif text-xl font-bold text-luxury-ink border-b border-luxury-ink/8 pb-4">
            Thời Gian Giao Hàng Dự Kiến
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-luxury-ink/10 bg-cream-50/70 text-left">
                  <th className="px-4 py-3 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                    Khu vực giao hàng
                  </th>
                  <th className="px-4 py-3 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                    Thời gian dự kiến
                  </th>
                  <th className="px-4 py-3 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                    Ghi chú
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-ink/6">
                {TIMEFRAMES.map((tf, i) => (
                  <tr key={i} className="hover:bg-taupe-50/30 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-luxury-ink">
                      {tf.area}
                    </td>
                    <td className="px-4 py-3.5 text-accent font-bold">
                      {tf.time}
                    </td>
                    <td className="px-4 py-3.5 text-neutral-500">{tf.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inspection & Co-checking rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 border-b border-luxury-ink/8 pb-3">
              <IconChecklist className="w-5 h-5 text-accent" />
              <h3 className="font-droid-serif text-base font-bold text-luxury-ink">
                Quy Định Đồng Kiểm Khi Nhận
              </h3>
            </div>
            <ul className="text-xs sm:text-sm text-neutral-600 space-y-2.5 list-disc pl-4 leading-relaxed">
              <li>
                Người mua được phép mở hộp bên ngoài để kiểm tra số lượng, mẫu mã và ngoại quan sản phẩm trước khi ký nhận.
              </li>
              <li>
                Không được cắm điện thử tải đối với đồ điện tử hoặc bóc tem niêm phong nhà sản xuất (nếu có).
              </li>
              <li>
                Nếu sản phẩm bị móp méo, vỡ hỏng do vận chuyển hoặc giao sai hàng, bạn có quyền từ chối nhận hàng ngay lập tức.
              </li>
            </ul>
          </div>

          <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 border-b border-luxury-ink/8 pb-3">
              <IconCurrencyDollar className="w-5 h-5 text-accent" />
              <h3 className="font-droid-serif text-base font-bold text-luxury-ink">
                Biểu Phí Vận Chuyển & Bảo Hiểm
              </h3>
            </div>
            <ul className="text-xs sm:text-sm text-neutral-600 space-y-2.5 list-disc pl-4 leading-relaxed">
              <li>
                Phí vận chuyển được tính tự động dựa trên trọng lượng, kích thước kiện hàng và khoảng cách địa lý thông qua API GHN.
              </li>
              <li>
                100% đơn hàng trên Eco Market được tích hợp bảo hiểm hàng hóa; nếu có sự cố thất lạc hoặc hư hỏng trong quá trình vận chuyển, bưu cục sẽ bồi thường toàn bộ giá trị đơn hàng.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
