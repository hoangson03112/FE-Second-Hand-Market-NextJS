import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight, IconBrandLinkedin, IconBrandGithub } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Đội ngũ phát triển | Eco Market",
  description:
    "Gặp gỡ ban điều hành và những kỹ sư, nhà thiết kế đằng sau nền tảng thương mại điện tử tuần hoàn Eco Market.",
};

const LEADERS = [
  {
    name: "Hoàng Sơn",
    role: "Founder & Chief Executive Officer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    bio: "Định hình tầm nhìn chiến lược kinh tế tuần hoàn và cấu trúc trải nghiệm người dùng cao cấp cho Eco Market.",
  },
  {
    name: "Minh Quân",
    role: "Co-Founder & Chief Technology Officer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    bio: "Kiến trúc sư hệ thống ký quỹ Escrow thời gian thực và mô hình kiểm duyệt thị giác AI tự động.",
  },
  {
    name: "Thu Trang",
    role: "Head of Product & Experience",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    bio: "Chịu trách nhiệm thiết kế giao diện Quiet Luxury và tối ưu hóa hành trình giao dịch của người mua và người bán.",
  },
  {
    name: "Đức Anh",
    role: "Head of Operations & Trust",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    bio: "Quản lý quy trình thẩm định CCCD người bán, giám sát an toàn giao dịch và giải quyết khiếu nại 3 bên.",
  },
];

const DEPARTMENTS = [
  {
    name: "Kỹ thuật & Công nghệ (Engineering)",
    count: "12 Kỹ sư",
    desc: "Xây dựng hạ tầng Next.js, kiến trúc Microservices phân tán, cổng thanh toán PayOS & hệ thống AI Guard.",
  },
  {
    name: "Vận hành & Kiểm duyệt (Operations & Trust)",
    count: "8 Chuyên viên",
    desc: "Xác thực danh tính seller, thẩm định khiếu nại hoàn tiền và theo dõi chu trình logistics GHN toàn quốc.",
  },
  {
    name: "Chăm sóc khách hàng (Customer Excellence)",
    count: "10 Tư vấn viên",
    desc: "Hỗ trợ 24/7 qua livechat, giải đáp thắc mắc và đồng hành cùng người dùng trong từng đơn hàng.",
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-luxury-ivory text-luxury-ink">
      <section className="relative border-b border-luxury-ink/10 bg-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-luxury-champagne/80" />
            <span className="text-2xs font-bold uppercase tracking-[0.28em] text-neutral-600">
              Đội Ngũ Sáng Lập
            </span>
            <span className="h-px w-8 bg-luxury-champagne/80" />
          </div>
          <h1 className="font-droid-serif text-3xl sm:text-5xl font-bold tracking-tight text-luxury-ink leading-tight">
            Những Con Người Đằng Sau Sứ Mệnh Eco Market
          </h1>
          <p className="mt-6 text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Tập hợp những chuyên gia công nghệ, nhà thiết kế và nhân sự vận hành nhiệt huyết cùng chung khát vọng xây dựng một thị trường trao đổi đồ cũ chuẩn mực tại Việt Nam.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LEADERS.map((member, idx) => (
            <div
              key={idx}
              className="rounded-[2px] border border-luxury-ink/10 bg-white overflow-hidden p-5 flex flex-col justify-between space-y-4 hover:border-luxury-ink/30 transition-all"
            >
              <div className="space-y-4">
                <div className="aspect-square w-full rounded-[2px] overflow-hidden bg-cream-50 border border-luxury-ink/10 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale contrast-105 hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div>
                  <h3 className="font-droid-serif text-lg font-bold text-luxury-ink">
                    {member.name}
                  </h3>
                  <p className="text-2xs font-bold uppercase tracking-[0.12em] text-neutral-500 mt-1">
                    {member.role}
                  </p>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-luxury-ink/10 bg-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-px w-6 bg-luxury-champagne/80" />
              <span className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                Các khối chuyên môn
              </span>
              <span className="h-px w-6 bg-luxury-champagne/80" />
            </div>
            <h2 className="font-droid-serif text-2xl sm:text-3xl font-bold text-luxury-ink">
              Quy Mô Vận Hành & Phát Triển
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEPARTMENTS.map((dept, i) => (
              <div
                key={i}
                className="rounded-[2px] border border-luxury-ink/10 bg-cream-50/40 p-6 sm:p-8 space-y-3"
              >
                <span className="text-2xs font-bold uppercase tracking-[0.15em] text-accent block">
                  {dept.count}
                </span>
                <h3 className="font-droid-serif text-base font-bold text-luxury-ink">
                  {dept.name}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {dept.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-luxury-ink/10 bg-luxury-ink text-luxury-ivory py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-droid-serif text-2xl sm:text-3xl font-bold">
            Muốn Gia Nhập Đội Ngũ Của Chúng Tôi?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Chúng tôi luôn tìm kiếm những tài năng đam mê công nghệ và mong muốn tạo ra giá trị bền vững cho xã hội.
          </p>
          <div className="pt-2">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 rounded-[2px] bg-luxury-ivory text-luxury-ink px-6 py-3 text-2xs font-bold uppercase tracking-[0.14em] hover:bg-cream-100 transition-all"
            >
              Xem các vị trí đang tuyển
              <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
