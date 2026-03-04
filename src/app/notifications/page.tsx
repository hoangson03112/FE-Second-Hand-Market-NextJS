"use client";

import { IconArrowLeft, IconBell, IconCheck, IconTrash } from "@tabler/icons-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useNotificationStore } from "@/store/useNotificationStore";

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Vừa xong";
  if (diff < hour) return `${Math.floor(diff / minute)} phút trước`;
  if (diff < day) return `${Math.floor(diff / hour)} giờ trước`;
  return `${Math.floor(diff / day)} ngày trước`;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { data: account, isLoading } = useUser();
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const clearNotifications = useNotificationStore((state) => state.clearNotifications);

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
          <IconArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <IconBell className="w-8 h-8" />
          Thông báo
        </h1>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {notifications.length} thông báo • {unreadCount} chưa đọc
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm disabled:opacity-50"
            >
              <IconCheck className="w-4 h-4" />
              Đọc tất cả
            </button>
            <button
              onClick={clearNotifications}
              disabled={notifications.length === 0}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm disabled:opacity-50"
            >
              <IconTrash className="w-4 h-4" />
              Xóa tất cả
            </button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-cream-50 rounded-2xl border border-border p-12 text-center">
            <IconBell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">Chưa có thông báo nào</p>
            <p className="text-sm text-muted-foreground">
              Bạn sẽ nhận được thông báo khi có cập nhật về đơn hàng, sản phẩm đã đăng và tin nhắn mới.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => (
              <Link
                key={item.id}
                href={item.link || "/notifications"}
                onClick={() => markAsRead(item.id)}
                className={`block rounded-xl border p-4 transition-colors ${
                  item.read
                    ? "bg-background border-border"
                    : "bg-cream-50 border-primary/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 break-words">{item.message}</p>
                  </div>
                  {!item.read && (
                    <span className="w-2.5 h-2.5 rounded-full bg-primary mt-1 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{formatTimeAgo(item.createdAt)}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
