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
    if (account.role === "seller") {
      router.replace("/");
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
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <p className="text-lg text-foreground mb-4">
            Bạn đã là Seller. Bạn có thể đăng sản phẩm và quản lý đơn hàng.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-white btn-primary"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return <BecomeSeller />;
}
