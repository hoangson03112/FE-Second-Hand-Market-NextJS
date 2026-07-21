"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    about: [
      { name: "Vá» chÃºng tÃ´i", href: "/about" },
      { name: "CÃ¢u chuyá»‡n", href: "/story" },
      { name: "Äá»™i ngÅ©", href: "/team" },
      { name: "Tuyá»ƒn dá»¥ng", href: "/careers" },
    ],
    support: [
      { name: "Trung tÃ¢m trá»£ giÃºp", href: "/help" },
      { name: "CÃ¢u há»i thÆ°á»ng gáº·p", href: "/faq" },
      { name: "LiÃªn há»‡", href: "/contact" },
      { name: "Pháº£n há»“i", href: "/feedback" },
    ],
    legal: [
      { name: "Äiá»u khoáº£n sá»­ dá»¥ng", href: "/terms" },
      { name: "ChÃ­nh sÃ¡ch báº£o máº­t", href: "/privacy" },
      { name: "ChÃ­nh sÃ¡ch váº­n chuyá»ƒn", href: "/shipping" },
      { name: "ChÃ­nh sÃ¡ch Ä‘á»•i tráº£", href: "/return" },
    ],
    categories: [
      { name: "Äá»“ Ä‘iá»‡n tá»­", href: "/categories/electronics" },
      { name: "Thá»i trang", href: "/categories/fashion" },
      { name: "Ná»™i tháº¥t", href: "/categories/furniture" },
      { name: "SÃ¡ch & VÄƒn phÃ²ng", href: "/categories/books" },
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
    <footer className="bg-taupe-900 border-t-2 border-taupe-800 relative">
      {/* Top accent line with gradient */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="max-w-8xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Main content */}
        <div className="py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6 group">
              <Image
                src="https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png"
                alt="Eco Market Logo"
                width={120}
                height={120}
                className="h-16 w-auto brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity duration-200"
                priority
              />
            </Link>
            <p className="text-sm text-taupe-300 leading-relaxed max-w-sm mb-10 font-medium">
              Ná»n táº£ng mua bÃ¡n Ä‘á»“ cÅ© thÃ´ng minh, káº¿t ná»‘i ngÆ°á»i
              mua vÃ  ngÆ°á»i bÃ¡n má»™t cÃ¡ch an toÃ n, tiá»‡n lá»£i vÃ  thÃ¢n
              thiá»‡n vá»›i mÃ´i trÆ°á»ng.
            </p>

            {/* Social links */}
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

          {/* About */}
          <div>
            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-taupe-300 mb-6">
              Vá»€ CHÃšNG TÃ”I
            </h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-taupe-200 hover:text-cream-100 transition-colors duration-200 font-semibold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-taupe-300 mb-6">
              Há»– TRá»¢
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-taupe-200 hover:text-cream-100 transition-colors duration-200 font-semibold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Categories */}
          <div>
            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-taupe-300 mb-6">
              CHÃNH SÃCH
            </h3>
            <ul className="space-y-3 mb-10">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-taupe-200 hover:text-cream-100 transition-colors duration-200 font-semibold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-taupe-300 mb-6">
              DANH Má»¤C
            </h3>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-taupe-200 hover:text-cream-100 transition-colors duration-200 font-semibold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t-2 border-taupe-800 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-taupe-300 font-medium">
            Â© {currentYear} Chá»£ Äá»“ CÅ© ThÃ´ng Minh. Táº¥t cáº£ quyá»n
            Ä‘Æ°á»£c báº£o lÆ°u.
          </p>
          <div className="flex items-center gap-8">
            {["Äiá»u khoáº£n", "Báº£o máº­t", "Sitemap"].map((label, i) => (
              <Link
                key={i}
                href={`/${label.toLowerCase().replace(/\s/g, "-")}`}
                className="text-xs text-taupe-300 hover:text-cream-100 transition-colors duration-200 font-semibold uppercase tracking-[0.08em]"
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
