"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    about: [
      { name: "Về chúng tôi", href: "/about" },
      { name: "Câu chuyện", href: "/story" },
      { name: "Đội ngũ", href: "/team" },
      { name: "Tuyển dụng", href: "/careers" },
    ],
    support: [
      { name: "Trung tâm trợ giúp", href: "/help" },
      { name: "Câu hỏi thường gặp", href: "/faq" },
      { name: "Liên hệ", href: "/contact" },
      { name: "Phản hồi", href: "/feedback" },
    ],
    legal: [
      { name: "Điều khoản sử dụng", href: "/terms" },
      { name: "Chính sách bảo mật", href: "/privacy" },
      { name: "Chính sách vận chuyển", href: "/shipping" },
      { name: "Chính sách đổi trả", href: "/return" },
    ],
    categories: [
      { name: "Đồ điện tử", href: "/categories/electronics" },
      { name: "Thời trang", href: "/categories/fashion" },
      { name: "Nội thất", href: "/categories/furniture" },
      { name: "Sách & Văn phòng", href: "/categories/books" },
    ],
  };

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: <IconBrandFacebook className="w-4 h-4" />,
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: <IconBrandInstagram className="w-4 h-4" />,
    },
    {
      name: "Twitter",
      href: "https://twitter.com",
      icon: <IconBrandTwitter className="w-4 h-4" />,
    },
    {
      name: "YouTube",
      href: "https://youtube.com",
      icon: <IconBrandYoutube className="w-4 h-4" />,
    },
  ];
  return (
    <footer className="bg-taupe-900 border-t-2 border-taupe-800 relative shrink-0">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="max-w-9xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-16">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6 group">
              <Image
                src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1784993079/Gemini_Generated_Image_rg4xa9rg4xa9rg4x_1_mtjahn.png"
                alt="Eco Market Logo"
                width={320}
                height={320}
                className="h-30 w-auto brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity duration-200"
                priority
              />
            </Link>
            <p className="text-sm text-taupe-300 leading-relaxed max-w-sm mb-10 font-medium">
              Nền tảng mua bán đồ cũ thông minh, kết nối người mua và người bán
              một cách an toàn, tiện lợi và thân thiện với môi trường.
            </p>

            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center border-2 border-taupe-600 text-taupe-300 hover:border-primary hover:text-primary hover:bg-taupe-800 transition-all duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xs font-black tracking-[0.4em] uppercase text-taupe-300 mb-6">
              Về Chúng Tôi
            </h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-taupe-200 hover:text-cream-100 transition-colors duration-200 font-bold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xs font-black tracking-[0.4em] uppercase text-taupe-300 mb-6">
              Hỗ Trợ
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-taupe-200 hover:text-cream-100 transition-colors duration-200 font-bold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xs font-black tracking-[0.4em] uppercase text-taupe-300 mb-6">
              CHÍNH SÁCH
            </h3>
            <ul className="space-y-3 mb-10">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-taupe-200 hover:text-cream-100 transition-colors duration-200 font-bold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-2xs font-black tracking-[0.4em] uppercase text-taupe-300 mb-6">
              DANH MỤC
            </h3>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-taupe-200 hover:text-cream-100 transition-colors duration-200 font-bold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-taupe-800 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-taupe-300 font-medium">
            © {currentYear} Chợ Đồ Cũ Thông Minh. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-8">
            {["Điều khoản", "Bảo mật", "Sitemap"].map((label, i) => (
              <Link
                key={i}
                href={`/${label.toLowerCase().replace(/\s/g, "-")}`}
                className="text-xs text-taupe-300 hover:text-cream-100 transition-colors duration-200 font-bold uppercase tracking-wider"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
