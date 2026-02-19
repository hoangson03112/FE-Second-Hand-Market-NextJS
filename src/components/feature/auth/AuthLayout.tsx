import Background from "@/components/ui/Background";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Auth layout: trang dài, form nằm trong flow; cuộn xuống mới tới footer (kiểu Shopee).
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Background >
      <div className="flex-1 flex items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto">{children}</div>
      </div>
    </Background>
  );
}
