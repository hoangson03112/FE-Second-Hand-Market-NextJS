"use client";

import { IconArrowLeft, IconCircleCheck, IconBuildingStore } from "@tabler/icons-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useTokenStore } from "@/store/useTokenStore";
import BecomeSeller from "@/components/feature/become-seller/BecomeSeller";
import Link from "next/link";

export default function BecomeSellerPage() {
  const router = useRouter();
  const accessToken = useTokenStore((s) => s.accessToken);
  const { data: account, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;
    if (!accessToken || !account) {
      router.replace("/login?redirect=/become-seller");
      return;
    }
  }, [accessToken, account, isLoading, router]);

  if (isLoading || !accessToken || !account) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (account.role === "seller") {
    return (
      <div className="min-h-screen bg-background">
        {/* Top bar */}
        <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <IconArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
            <span className="text-muted-foreground/40 select-none">|</span>
            <span className="text-sm font-medium text-foreground">Tài khoản Seller</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="rounded-2xl border border-green-400/50 bg-green-50/50 dark:bg-green-950/20 p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
              <IconCircleCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-green-800 dark:text-green-300 mb-1">
                Bạn đã là Seller
              </h1>
              <p className="text-sm text-green-700 dark:text-green-400 mb-4">
                Tài khoản của bạn đã được xác minh. Bạn có thể đăng sản phẩm và quản lý đơn hàng.
                Để cập nhật thông tin ngân hàng hoặc địa chỉ, vui lòng liên hệ hỗ trợ.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/sell"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <IconBuildingStore className="w-3.5 h-3.5" />
                  Đăng sản phẩm
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  Về trang chủ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <BecomeSeller />;
}
