"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import { FloatingChatBox } from "@/features/chat";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      <Header />

      <main
        id="main-scroll-container"
        className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden"
      >
        <div className="flex  flex-col justify-between">
          <div className="w-full">{children}</div>

          <Footer />
        </div>
      </main>

      <FloatingChatBox />
    </div>
  );
}
