import "./globals.css";
import Providers from "./providers";
import { ToastProvider, ConfirmDialogProvider } from "@/components/ui";
import SiteLayout from "@/components/layout/SiteLayout";
import type { Metadata } from "next";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: {
    default: "Eco Marketplace - Sàn thương mại điện tử đồ cũ",
    template: "%s | Eco Marketplace",
  },
  description:
    "Mua bán đồ cũ uy tín, chất lượng. Tiết kiệm chi phí, bảo vệ môi trường. Hàng ngàn sản phẩm từ điện thoại, laptop, đồ gia dụng đến thời trang secondhand.",
  keywords: [
    "mua bán đồ cũ",
    "chợ đồ cũ online",
    "secondhand",
    "điện thoại cũ",
    "laptop cũ",
    "đồ gia dụng cũ",
    "thời trang secondhand",
    "eco marketplace",
  ],
  authors: [{ name: "Eco Marketplace" }],
  creator: "Eco Marketplace",
  publisher: "Eco Marketplace",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://eco-marketplace.vn",
    siteName: "Eco Marketplace",
    title: "Eco Marketplace - Sàn thương mại điện tử đồ cũ",
    description:
      "Mua bán đồ cũ uy tín, chất lượng. Tiết kiệm chi phí, bảo vệ môi trường.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Eco Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eco Marketplace - Sàn thương mại điện tử đồ cũ",
    description:
      "Mua bán đồ cũ uy tín, chất lượng. Tiết kiệm chi phí, bảo vệ môi trường.",
    images: ["/og-image.jpg"],
    creator: "@ecomarketplace",
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://eco-marketplace.vn",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`h-full ${inter.variable}`}>
      <body className={`min-h-screen flex flex-col antialiased ${inter.className}`}>
        <Providers>
          <ToastProvider>
            <ConfirmDialogProvider>
              <SiteLayout>{children}</SiteLayout>
            </ConfirmDialogProvider>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
