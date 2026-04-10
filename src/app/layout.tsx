import "./globals.css";
import Providers from "./providers";
import { ToastProvider } from "@/components/ui/Toast";
import { ConfirmDialogProvider } from "@/components/ui/ConfirmDialog";
import SiteLayout from "@/components/layout/SiteLayout";
import { RealtimeNotificationToast } from "@/components/common/RealtimeNotificationToast";
import { BannedOverlay } from "@/components/common/BannedOverlay";
import type { Metadata } from "next";
import { inter } from "@/lib/fonts";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ecomarket.io.vn";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
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
    url: "https://www.ecomarket.io.vn",
    siteName: "Eco Marketplace",
    title: "Eco Marketplace - Sàn thương mại điện tử đồ cũ",
    description:
      "Mua bán đồ cũ uy tín, chất lượng. Tiết kiệm chi phí, bảo vệ môi trường.",
    images: [
      {
        url: "https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png",
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
    images: ["https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png"],
    creator: "@ecomarketplace",
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://www.ecomarket.io.vn",
  },
  icons: {
    icon: "https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png",
    shortcut: "https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png",
    apple: "https://res.cloudinary.com/dqvtj4uxo/image/upload/v1755696284/logi_ov2gbl.png",
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
            <RealtimeNotificationToast />
            <BannedOverlay />
            <ConfirmDialogProvider>
              <SiteLayout>{children}</SiteLayout>
            </ConfirmDialogProvider>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
