"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";
import { useUser } from "@/hooks/useUser";

export default function NotificationsPage() {
  const router = useRouter();
  const { data: account, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !account) {
      router.push("/login");
    }
  }, [account, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!account) return null;

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Bell className="w-8 h-8" />
          Thông báo
        </h1>

        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">
            Chưa có thông báo nào
          </p>
          <p className="text-sm text-muted-foreground">
            Bạn sẽ nhận được thông báo khi có cập nhật về đơn hàng, sản phẩm đã đăng và tin nhắn mới.
          </p>
        </div>
      </main>
    </div>
  );
}
