import type { Metadata } from "next";
import Link from "next/link";
import {
  IconBriefcase,
  IconClock,
  IconMapPin,
  IconCurrencyDollar,
  IconHeartHandshake,
  IconDeviceLaptop,
  IconChartLine,
  IconCoffee,
  IconMail,
} from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Tuyển dụng & Cơ hội nghề nghiệp | Eco Market",
  description:
    "Gia nhập Eco Market để cùng xây dựng nền tảng thương mại điện tử tuần hoàn hàng đầu với văn hóa làm việc linh hoạt, sáng tạo và chế độ đãi ngộ hấp dẫn.",
};

const BENEFITS = [
  {
    icon: IconDeviceLaptop,
    title: "Làm việc linh hoạt (Hybrid)",
    desc: "Tự chủ thời gian và không gian làm việc kết hợp giữa văn phòng sáng tạo và làm việc từ xa.",
  },
  {
    icon: IconCurrencyDollar,
    title: "Đãi ngộ & ESOP cạnh tranh",
    desc: "Lương thưởng theo năng lực, bảo hiểm sức khỏe cao cấp và cơ hội sở hữu cổ phần gắn liền với sự phát triển của công ty.",
  },
  {
    icon: IconChartLine,
    title: "Lộ trình thăng tiến rõ ràng",
    desc: "Được đào tạo liên tục, ngân sách học tập cá nhân hàng năm và cơ hội dẫn dắt các dự án công nghệ đột phá.",
  },
  {
    icon: IconCoffee,
    title: "Văn hóa mở & Tôn trọng",
    desc: "Môi trường phẳng, không khoảng cách cấp bậc, khuyến khích thử nghiệm ý tưởng mới và học hỏi không ngừng.",
  },
];

const JOBS = [
  {
    id: "FE-01",
    title: "Senior Frontend Engineer (Next.js / TypeScript)",
    department: "Engineering",
    location: "TP. Hồ Chí Minh / Hybrid",
    type: "Full-time",
    experience: "3+ năm kinh nghiệm",
    description:
      "Chịu trách nhiệm kiến trúc và phát triển giao diện người dùng Next.js 14+ App Router, tối ưu hóa Web Vitals và triển khai Design System Quiet Luxury.",
  },
  {
    id: "AI-02",
    title: "AI / Machine Learning Engineer",
    department: "Engineering",
    location: "Hà Nội / TP. Hồ Chí Minh / Hybrid",
    type: "Full-time",
    experience: "2+ năm kinh nghiệm",
    description:
      "Nghiên cứu và huấn luyện các mô hình Computer Vision & NLP phục vụ nhận diện chất lượng sản phẩm và phát hiện gian lận tự động trên sàn.",
  },
  {
    id: "OP-03",
    title: "Operations & Trust Specialist",
    department: "Operations",
    location: "TP. Hồ Chí Minh",
    type: "Full-time",
    experience: "1+ năm kinh nghiệm",
    description:
      "Thẩm định danh tính người bán, giải quyết khiếu nại tranh chấp đơn hàng và phối hợp cùng các đơn vị vận chuyển GHN tối ưu tỷ lệ giao thành công.",
  },
  {
    id: "PD-04",
    title: "Product Designer (UI/UX)",
    department: "Product",
    location: "TP. Hồ Chí Minh / Hybrid",
    type: "Full-time",
    experience: "2+ năm kinh nghiệm",
    description:
      "Thiết kế luồng trải nghiệm khách hàng (Customer Journey), wireframe, prototype và hoàn thiện hệ thống Design Tokens phong cách Editorial.",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-luxury-ivory text-luxury-ink">
      <section className="relative border-b border-luxury-ink/10 bg-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-luxury-champagne/80" />
            <span className="text-2xs font-bold uppercase tracking-[0.28em] text-neutral-600">
              Cơ Hội Nghề Nghiệp
            </span>
            <span className="h-px w-8 bg-luxury-champagne/80" />
          </div>
          <h1 className="font-droid-serif text-3xl sm:text-5xl font-bold tracking-tight text-luxury-ink leading-tight">
            Kiến Tạo Tương Lai Của Thương Mại Tuần Hoàn
          </h1>
          <p className="mt-6 text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Chúng tôi đang tìm kiếm những người đồng đội tài năng, dám nghĩ khác biệt và khao khát ứng dụng công nghệ để giải quyết các thách thức tiêu dùng thực tế.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-px w-6 bg-luxury-champagne/80" />
            <span className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
              Quyền lợi dành cho bạn
            </span>
            <span className="h-px w-6 bg-luxury-champagne/80" />
          </div>
          <h2 className="font-droid-serif text-2xl sm:text-3xl font-bold text-luxury-ink">
            Môi Trường Nuôi Dưỡng Sự Sáng Tạo
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="rounded-[2px] border border-luxury-ink/10 bg-white p-6 space-y-3"
              >
                <div className="w-10 h-10 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-droid-serif text-base font-bold text-luxury-ink">
                  {b.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {b.desc}
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
                Vị trí mở tuyển
              </span>
              <span className="h-px w-6 bg-luxury-champagne/80" />
            </div>
            <h2 className="font-droid-serif text-2xl sm:text-3xl font-bold text-luxury-ink">
              Gia Nhập Đội Ngũ Eco Market
            </h2>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {JOBS.map((job) => (
              <div
                key={job.id}
                className="rounded-[2px] border border-luxury-ink/10 bg-cream-50/30 p-6 sm:p-8 space-y-4 hover:border-luxury-ink/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-luxury-ink/8 pb-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-[2px] bg-cream-50 text-luxury-ink border border-luxury-ink/10 text-2xs font-bold uppercase tracking-[0.1em] mb-2">
                      {job.department}
                    </span>
                    <h3 className="font-droid-serif text-lg sm:text-xl font-bold text-luxury-ink">
                      {job.title}
                    </h3>
                  </div>
                  <a
                    href={`mailto:careers@ecomarket.io.vn?subject=Ứng tuyển vị trí ${encodeURIComponent(
                      job.title
                    )} - [Họ tên]`}
                    className="self-start sm:self-center inline-flex items-center gap-1.5 rounded-[2px] bg-luxury-ink px-4 py-2 text-2xs font-bold uppercase tracking-[0.14em] text-luxury-ivory hover:bg-charcoal-800 transition-all"
                  >
                    <IconMail className="w-3.5 h-3.5" />
                    Ứng tuyển
                  </a>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-neutral-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <IconMapPin className="w-4 h-4 text-neutral-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <IconClock className="w-4 h-4 text-neutral-400" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <IconBriefcase className="w-4 h-4 text-neutral-400" />
                    <span>{job.experience}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 p-8 rounded-[2px] border border-dashed border-luxury-ink/20 bg-cream-50/50 max-w-2xl mx-auto">
            <h4 className="font-droid-serif text-base font-bold text-luxury-ink">
              Chưa tìm thấy vị trí phù hợp?
            </h4>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Hãy gửi CV và thư giới thiệu về bản thân tới email{" "}
              <a
                href="mailto:careers@ecomarket.io.vn"
                className="font-semibold text-accent underline"
              >
                careers@ecomarket.io.vn
              </a>
              . Chúng tôi luôn sẵn sàng kết nối với nhân tài tiềm năng!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
