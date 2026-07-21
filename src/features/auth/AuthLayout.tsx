import { Background } from "@/components/shared";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Auth layout: trang dÃ i, form náº±m trong flow; cuá»™n xuá»‘ng má»›i tá»›i footer (kiá»ƒu Shopee).
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Background >
      <div className="flex-1 flex items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-8xl mx-auto">{children}</div>
      </div>
    </Background>
  );
}
