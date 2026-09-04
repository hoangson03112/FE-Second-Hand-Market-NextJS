import type { Metadata } from "next";
import Link from "next/link";
import {
  IconCompass,
  IconShoppingCart,
  IconBuildingStore,
  IconUser,
  IconHelpCircle,
  IconScale,
} from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Sơ đồ trang web (Sitemap) | Eco Market",
  description:
    "Cấu trúc tổng thể và liên kết nhanh đến toàn bộ các phân hệ, danh mục sản phẩm, tính năng và tài liệu trên Eco Market.",
};

const SITEMAP_SECTIONS = [
  {
    icon: IconShoppingCart,
    title: "Mua sắm & Khám phá",
    links: [
      { name: "Trang chủ", href: "/" },
      { name: "Tìm kiếm sản phẩm", href: "/search" },
      { name: "Tất cả sản phẩm", href: "/products" },
      { name: "Đồ điện tử", href: "/categories/electronics" },
      { name: "Thời trang & Phụ kiện", href: "/categories/fashion" },
      { name: "Nội thất & Gia dụng", href: "/categories/furniture" },
      { name: "Sách & Văn phòng phẩm", href: "/categories/books" },
      { name: "Giỏ hàng của bạn", href: "/cart" },
      { name: "Thanh toán an toàn", href: "/checkout" },
    ],
  },
  {
    icon: IconBuildingStore,
    title: "Bán hàng & Quản lý Seller",
    links: [
      { name: "Đăng bán sản phẩm mới", href: "/sell" },
      { name: "Đăng ký tài khoản Người bán (KYC)", href: "/become-seller" },
      { name: "Quản lý bài đăng của tôi", href: "/my/listings" },
      { name: "Kênh Người bán (Seller Hub)", href: "/seller" },
      { name: "Quản lý đơn hàng bán", href: "/seller/orders" },
      { name: "Tài khoản nhận tiền (Bank)", href: "/profile?tab=bank" },
    ],
  },
  {
    icon: IconUser,
    title: "Tài khoản cá nhân",
    links: [
      { name: "Đăng nhập tài khoản", href: "/login" },
      { name: "Đăng ký thành viên mới", href: "/register" },
      { name: "Quên mật khẩu", href: "/forgot-password" },
      { name: "Hồ sơ cá nhân (Profile)", href: "/profile" },
      { name: "Đơn mua của tôi", href: "/my/orders" },
    ],
  },
  {
    icon: IconHelpCircle,
    title: "Thông tin & Hỗ trợ",
    links: [
      { name: "Về chúng tôi", href: "/about" },
      { name: "Câu chuyện thương hiệu", href: "/story" },
      { name: "Đội ngũ phát triển", href: "/team" },
      { name: "Tuyển dụng & Nghề nghiệp", href: "/careers" },
      { name: "Trung tâm trợ giúp", href: "/help" },
      { name: "Câu hỏi thường gặp (FAQ)", href: "/faq" },
      { name: "Liên hệ ban điều hành", href: "/contact" },
      { name: "Góp ý & Đóng góp ý kiến", href: "/feedback" },
    ],
  },
  {
    icon: IconScale,
    title: "Chính sách & Pháp lý",
    links: [
      { name: "Điều khoản sử dụng", href: "/terms" },
      { name: "Chính sách bảo mật", href: "/privacy" },
      { name: "Chính sách vận chuyển & Giao nhận", href: "/shipping" },
      { name: "Chính sách đổi trả & Hoàn tiền", href: "/return" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-luxury-ivory text-luxury-ink">
      <section className="relative border-b border-luxury-ink/10 bg-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-luxury-champagne/80" />
            <span className="text-2xs font-bold uppercase tracking-[0.28em] text-neutral-600">
              Điều Hướng Toàn Hệ Thống
            </span>
            <span className="h-px w-8 bg-luxury-champagne/80" />
          </div>
          <h1 className="font-droid-serif text-3xl sm:text-5xl font-bold tracking-tight text-luxury-ink leading-tight">
            Sơ Đồ Trang Web (Sitemap)
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Danh mục tổng hợp toàn bộ các trang, phân hệ chức năng và tài liệu hướng dẫn trên nền tảng Eco Market.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SITEMAP_SECTIONS.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div
                key={idx}
                className="rounded-[2px] border border-luxury-ink/10 bg-white p-6 sm:p-8 space-y-4"
              >
                <div className="flex items-center gap-3 border-b border-luxury-ink/8 pb-4">
                  <div className="w-10 h-10 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-droid-serif text-lg font-bold text-luxury-ink">
                    {sec.title}
                  </h2>
                </div>

                <ul className="space-y-2 pt-1">
                  {sec.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link
                        href={link.href}
                        className="text-xs text-neutral-700 hover:text-accent font-medium transition-colors block py-1"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
