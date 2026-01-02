import Footer from "@/components/layout/Footer/Footer";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/layout/Header/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body className="h-full flex flex-col font-sans antialiased">
        <Providers>
          <Header />
          <div className="flex-1 overflow-y-auto">
            {children}
            <Footer/>
          </div>
        </Providers>
      </body>
    </html>
  );
}
