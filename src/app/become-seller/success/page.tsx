"use client";

import Link from "next/link";
import { CheckCircle2, Home, ArrowRight } from "lucide-react";

export default function BecomeSellerSuccessPage() {
  return (
    <div className="min-h-screen bg-background py-12 flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Đăng ký Seller đã được gửi!
        </h1>
        <p className="text-muted-foreground mb-6">
          Chúng tôi sẽ xem xét hồ sơ và phản hồi trong vòng 24h. Bạn sẽ nhận thông báo qua email khi được duyệt.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-border text-foreground hover:bg-muted transition-colors"
          >
            <Home className="h-4 w-4" />
            Về trang chủ
          </Link>
          <Link
            href="/categories"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-white btn-primary"
          >
            Mua sắm ngay
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
