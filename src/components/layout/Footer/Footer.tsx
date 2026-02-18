"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

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
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "https://twitter.com",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://youtube.com",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-taupe-900 border-t border-taupe-800">
      {/* Top accent line */}
      <div className="h-[2px] bg-primary w-full" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main content */}
        <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-5">
              <Image
                src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png"
                alt="Eco Market Logo"
                width={120}
                height={120}
                className="h-14 w-auto brightness-0 invert opacity-90"
                priority
              />
            </Link>
            <p className="text-sm text-taupe-400 leading-relaxed max-w-sm mb-8">
              Nền tảng mua bán đồ cũ thông minh, kết nối người mua và người bán
              một cách an toàn, tiện lợi và thân thiện với môi trường.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center border border-taupe-700 text-taupe-500 hover:border-primary hover:text-primary transition-colors duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.32em] uppercase text-taupe-500 mb-5">
              VỀ CHÚNG TÔI
            </h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-taupe-400 hover:text-cream-100 transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.32em] uppercase text-taupe-500 mb-5">
              HỖ TRỢ
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-taupe-400 hover:text-cream-100 transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Categories */}
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.32em] uppercase text-taupe-500 mb-5">
              CHÍNH SÁCH
            </h3>
            <ul className="space-y-3 mb-8">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-taupe-400 hover:text-cream-100 transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-[11px] font-bold tracking-[0.32em] uppercase text-taupe-500 mb-5">
              DANH MỤC
            </h3>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-taupe-400 hover:text-cream-100 transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-taupe-800 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-taupe-600">
            © {currentYear} Chợ Đồ Cũ Thông Minh. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-6">
            {["Điều khoản", "Bảo mật", "Sitemap"].map((label, i) => (
              <Link
                key={i}
                href={`/${label.toLowerCase().replace(/\s/g, "-")}`}
                className="text-xs text-taupe-600 hover:text-taupe-300 transition-colors duration-200"
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
