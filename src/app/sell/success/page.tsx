"use client";

import Link from "next/link";

export default function SellSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-foreground">Đăng sản phẩm thành công</h1>
        <p className="text-sm text-muted-foreground">
          Sản phẩm của bạn đang được kiểm duyệt. Bạn sẽ nhận được thông báo khi sản phẩm được
          duyệt và hiển thị trên trang.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/sell"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-white btn-primary"
          >
            Đăng thêm sản phẩm
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-border bg-background hover:bg-muted"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
