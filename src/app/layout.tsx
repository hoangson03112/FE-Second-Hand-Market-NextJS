import "./globals.css";
import { cookies } from "next/headers";
import Providers from "./providers";
import { SESSION_COOKIE } from "@/lib/session";
import { ConfirmDialogProvider } from "@/components/ui";
import SiteLayout from "@/components/layout/SiteLayout";
import { RealtimeNotificationToast } from "@/components/layout/RealtimeNotificationToast";
import { BannedOverlay } from "@/components/layout/BannedOverlay";
import type { Metadata } from "next";
import { geist } from "@/lib/fonts";
import localFont from "next/font/local";
import { ToastProvider } from "@/components/providers/ToastProvider";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.ecomarket.io.vn";

const droidSerifWGL = localFont({
  src: "./fonts/DroidSerif.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-droid-serif",
  display: "swap",
});
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
        url: "https://res.cloudinary.com/dqvtj4uxo/image/upload/v1786062984/FullLogo_x8qtac.jpg",
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
    images: [
      "https://res.cloudinary.com/dqvtj4uxo/image/upload/v1786062984/FullLogo_x8qtac.jpg",
    ],
    creator: "@ecomarketplace",
  },
  verification: { google: "your-google-verification-code" },
  alternates: { canonical: "https://www.ecomarket.io.vn" },
  icons: {
    icon: "https://res.cloudinary.com/dqvtj4uxo/image/upload/v1786062984/FullLogo_x8qtac.jpg",
    shortcut:
      "https://res.cloudinary.com/dqvtj4uxo/image/upload/v1786062984/FullLogo_x8qtac.jpg",
    apple:
      "https://res.cloudinary.com/dqvtj4uxo/image/upload/v1786062984/FullLogo_x8qtac.jpg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const hasSession = (await cookies()).has(SESSION_COOKIE);

  return (
    <html
      lang="vi"
      className={`h-full ${geist.variable}`}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={`h-full overflow-hidden bg-luxury-ivory text-foreground antialiased ${droidSerifWGL.variable}`}
      >
        <Providers hasSession={hasSession}>
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
