
import React from "react";
import Link from "next/link";

const FooterSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div>
    <h3 className="text-xs font-bold uppercase text-gray-600 mb-4">
      {title}
    </h3>
    <ul className="space-y-2">{children}</ul>
  </div>
);

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <li>
    <Link
      href={href}
      className="text-xs text-gray-500 hover:text-emerald-600 transition-colors"
    >
      {children}
    </Link>
  </li>
);

const SocialLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <li>
    <Link
      href={href}
      className="flex items-center gap-2 text-xs text-gray-500 hover:text-emerald-600 transition-colors"
    >
      {children}
    </Link>
  </li>
);

const Footer = React.forwardRef<HTMLDivElement>(function Footer(props, ref) {
  return (
    <footer
      ref={ref}
      className="bg-gray-50 border-t border-gray-200"
      {...props}
    >
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <FooterSection title="Chăm sóc khách hàng">
            <FooterLink href="#">Trung Tâm Trợ Giúp</FooterLink>
            <FooterLink href="#">Hướng Dẫn Mua Hàng</FooterLink>
            <FooterLink href="#">Hướng Dẫn Bán Hàng</FooterLink>
            <FooterLink href="#">Chính Sách Vận Chuyển</FooterLink>
            <FooterLink href="#">Trả Hàng & Hoàn Tiền</FooterLink>
          </FooterSection>

          <FooterSection title="Về EcoMarket">
            <FooterLink href="#">Giới Thiệu</FooterLink>
            <FooterLink href="#">Tuyển Dụng</FooterLink>
            <FooterLink href="#">Điều Khoản</FooterLink>
            <FooterLink href="#">Chính Sách Bảo Mật</FooterLink>
            <FooterLink href="#">Kênh Người Bán</FooterLink>
          </FooterSection>

          <FooterSection title="Thanh toán">
            {/* Replace with actual payment logos */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-200 h-8 rounded-md"></div>
              <div className="bg-gray-200 h-8 rounded-md"></div>
              <div className="bg-gray-200 h-8 rounded-md"></div>
              <div className="bg-gray-200 h-8 rounded-md"></div>
            </div>
          </FooterSection>

          <FooterSection title="Theo dõi chúng tôi">
            <SocialLink href="#">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
              </svg>
              Facebook
            </SocialLink>
            <SocialLink href="#">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.7 2 8.2 2.02 7.1 2.07c-1.1.05-1.8.2-2.4.47-.65.27-1.2.63-1.74 1.17-.55.54-.9 1.1-1.17 1.74-.27.6-.42 1.3-.47 2.4C2.02 8.2 2 8.7 2 12s.02 3.8.07 4.9c.05 1.1.2 1.8.47 2.4.27.65.63 1.2 1.17 1.74.54.55 1.1.9 1.74 1.17.6.27 1.3.42 2.4.47 1.1.05 1.6.07 4.9.07s3.8-.02 4.9-.07c1.1-.05 1.8-.2 2.4-.47.65-.27 1.2-.63 1.74-1.17.55-.54.9-1.1 1.17-1.74.27-.6.42-1.3.47-2.4.05-1.1.07-1.6.07-4.9s-.02-3.8-.07-4.9c-.05-1.1-.2-1.8-.47-2.4-.27-.65-.63-1.2-1.17-1.74-.54-.55-1.1-.9-1.74-1.17-.6-.27-1.3-.42-2.4-.47C15.8 2.02 15.3 2 12 2zm0 3c3.2 0 3.58.01 4.85.07 1.02.05 1.5.2 1.75.3.32.13.54.3.75.5s.38.43.5.75c.1.25.25.73.3 1.75.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.02-.2 1.5-.3 1.75-.13.32-.3.54-.5.75s-.43.38-.75.5c-.25.1-.73.25-1.75.3-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.02-.05-1.5-.2-1.75-.3-.32-.13-.54-.3-.75-.5s-.38-.43-.5-.75c-.1-.25-.25-.73-.3-1.75C3.01 15.58 3 15.2 3 12s.01-3.58.07-4.85c.05-1.02.2-1.5.3-1.75.13-.32.3-.54.5-.75s.43-.38.75-.5c.25-.1.73-.25 1.75-.3C8.42 3.01 8.8 3 12 3zm0 3.75c-2.35 0-4.25 1.9-4.25 4.25s1.9 4.25 4.25 4.25 4.25-1.9 4.25-4.25S14.35 6.75 12 6.75zM12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm4.75-7.5c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25S17.44 7.5 16.75 7.5z" />
              </svg>
              Instagram
            </SocialLink>
          </FooterSection>

          <div className="col-span-2 lg:col-span-1">
            <FooterSection title="Tải ứng dụng EcoMarket">
              <div className="flex gap-2">
                <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                  QR Code
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-8 bg-gray-200 rounded-md w-28"></div>
                  <div className="h-8 bg-gray-200 rounded-md w-28"></div>
                  <div className="h-8 bg-gray-200 rounded-md w-28"></div>
                </div>
              </div>
            </FooterSection>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} EcoMarket. Tất cả các quyền được
            bảo lưu.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-emerald-600">
              Quốc gia: Việt Nam
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
