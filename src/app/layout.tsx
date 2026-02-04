import "./globals.css";
import Providers from "./providers";
import { ToastProvider, ConfirmDialogProvider } from "@/components/ui";
import SiteLayout from "@/components/layout/SiteLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-screen flex flex-col font-sans antialiased">
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
