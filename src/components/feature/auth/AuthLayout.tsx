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
      <div className="flex-1 flex items-center justify-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl mx-auto">{children}</div>
      </div>
    </Background>
  );
}
