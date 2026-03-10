"use client";

import {
  IconArrowLeft,
  IconCircleCheck,
  IconClock,
  IconBuildingStore,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BecomeSellerSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <IconArrowLeft className="w-4 h-4" />
            Về trang chủ
          </button>
          <span className="text-muted-foreground/40 select-none">|</span>
          <span className="text-sm font-medium text-foreground">Đăng ký Seller</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {/* Success card */}
        <div className="rounded-2xl border border-border bg-card p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <IconCircleCheck className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-foreground mb-1">
              Hồ sơ đã được gửi thành công!
            </h1>
            <p className="text-sm text-muted-foreground">
              Chúng tôi sẽ xem xét hồ sơ của bạn và phản hồi trong vòng 24h. Bạn sẽ nhận
              thông báo qua email khi có kết quả.
            </p>
          </div>
        </div>

        {/* Pending notice */}
        <div className="rounded-xl border border-primary/20 bg-primary/8 dark:bg-primary/15 px-4 py-3 flex items-start gap-3">
          <IconClock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-primary/90">
            Đội ngũ Eco Market đang kiểm duyệt hồ sơ của bạn. Thông thường mất dưới{" "}
            <span className="font-semibold">24 giờ</span> để xem xét.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Link
            href="/sell"
            className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <IconBuildingStore className="w-4 h-4" />
            Khám phá tính năng Seller
          </Link>
          <Link
            href="/"
            className="flex-1 h-11 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:bg-muted hover:text-foreground transition-colors flex items-center justify-center"
          >
            Về trang chủ
          </Link>
        </div>

        <p className="text-center text-xs text-muted-foreground pb-2">
          Hồ sơ sẽ được đội ngũ Eco Market kiểm duyệt trong vòng 24h.
        </p>
      </div>
    </div>
  );
}
