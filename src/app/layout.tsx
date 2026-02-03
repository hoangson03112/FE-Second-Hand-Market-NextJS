import Footer from "@/components/layout/Footer/Footer";
import "./globals.css";
import Providers from "./providers";
import { ToastProvider, ConfirmDialogProvider } from "@/components/ui";
import Header from "@/components/layout/Header/Header";

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
              <Header />
              <main className="flex-1 flex flex-col">
                {children}
              </main>
              <Footer />
            </ConfirmDialogProvider>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
