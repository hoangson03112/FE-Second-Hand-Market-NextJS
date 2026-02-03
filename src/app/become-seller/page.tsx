"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useTokenStore } from "@/store/useTokenStore";
import BecomeSeller from "@/components/feature/become-seller";
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
    // Allow access even if already seller - they might want to update info
    // The component will handle showing appropriate message
  }, [accessToken, account, isLoading, router]);

  if (isLoading || !accessToken || !account) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // If already seller, show info but still allow access
  if (account.role === "seller") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <div className="text-center max-w-md space-y-4">
          <div className="rounded-xl border border-green-500/50 bg-green-50/50 p-4">
            <p className="text-lg font-semibold text-green-800 mb-2">
              Bạn đã là Seller
            </p>
            <p className="text-sm text-green-700 mb-4">
              Bạn có thể đăng sản phẩm và quản lý đơn hàng. Nếu cần cập nhật thông tin ngân hàng
              hoặc địa chỉ, vui lòng liên hệ hỗ trợ.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/sell"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-white btn-primary"
              >
                Đăng sản phẩm
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
      </div>
    );
  }

  return <BecomeSeller />;
}
