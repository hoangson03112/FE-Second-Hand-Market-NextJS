"use client";

import {
  IconArrowLeft,
  IconBell,
  IconCheck,
  IconTrash,
  IconPackage,
  IconMessageCircle,
  IconTag,
  IconChevronRight,
} from "@tabler/icons-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useNotificationStore } from "@/store/useNotificationStore";
import { NotificationService } from "@/services/notification.service";
import { usePagination } from "@/hooks/usePagination";
import { Pagination } from "@/components/shared";
import type { NotificationType } from "@/store/useNotificationStore";
import { formatTimeAgo } from "@/utils/format/date";

const PAGE_SIZE = 20;

function TypeIcon({ type }: { type: NotificationType }) {
  const base = "w-8 h-8 rounded-full flex items-center justify-center shrink-0";
  switch (type) {
    case "order":   return <span className={`${base} bg-secondary text-foreground`}><IconPackage       className="w-4 h-4" /></span>;
    case "chat":    return <span className={`${base} bg-primary/10 text-primary`}><IconMessageCircle className="w-4 h-4" /></span>;
    case "product": return <span className={`${base} bg-primary/10 text-primary`}><IconTag          className="w-4 h-4" /></span>;
    default:        return <span className={`${base} bg-muted text-muted-foreground`}><IconBell            className="w-4 h-4" /></span>;
  }
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const router = useRouter();
  const { data: account, isLoading } = useUser();
  const notifications    = useNotificationStore((s) => s.notifications);
  const unreadCount      = useNotificationStore((s) => s.unreadCount);
  const markAsRead       = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead    = useNotificationStore((s) => s.markAllAsRead);
  const removeNotification = useNotificationStore((s) => s.removeNotification);

  const totalPages = Math.max(1, Math.ceil(notifications.length / PAGE_SIZE));
  const { page, setPage } = usePagination(totalPages);
  const paginatedNotifications = notifications.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (!isLoading && !account) router.push("/login");
  }, [account, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!account) return null;

  function handleMarkAsRead(id: string) {
    markAsRead(id);
    NotificationService.markAsRead(id).catch(() => {});
  }

  function handleMarkAllAsRead() {
    markAllAsRead();
    NotificationService.markAllAsRead().catch(() => {});
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    removeNotification(id);
    NotificationService.deleteNotification(id).catch(() => {});
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto w-full px-4 py-8 sm:px-6">
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
          {unreadCount > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-primary text-primary-foreground rounded-full">
              {unreadCount}
            </span>
          )}
        </h1>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {notifications.length} thông báo • {unreadCount} chưa đọc
          </p>
          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm disabled:opacity-50 hover:bg-muted transition-colors"
          >
            <IconCheck className="w-4 h-4" />
            Đọc tất cả
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-muted/30 rounded-2xl border border-border p-12 text-center">
            <IconBell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">Chưa có thông báo nào</p>
            <p className="text-sm text-muted-foreground">
              Bạn sẽ nhận được thông báo khi có cập nhật về đơn hàng, sản phẩm đã đăng và tin nhắn mới.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {paginatedNotifications.map((item) => (
              <div
                key={item.id}
                className={`group relative rounded-xl border transition-colors duration-200 ${
                  item.read
                    ? "bg-background border-border"
                    : "bg-primary/[0.07] border-primary/20 hover:bg-primary/[0.11]"
                }`}
              >
                <Link
                  href={item.link || "/notifications"}
                  onClick={() => handleMarkAsRead(item.id)}
                  className="flex items-start gap-3 p-4 pr-14"
                >
                  <TypeIcon type={item.type} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-semibold text-foreground text-sm leading-snug ${!item.read ? "font-bold" : ""}`}>
                        {item.title}
                      </p>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-primary mt-1 shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{item.message}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{formatTimeAgo(item.createdAt)}</p>
                  </div>
                  {item.link && (
                    <IconChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>

                {/* Delete button */}
                <button
                  onClick={(e) => handleDelete(e, item.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary opacity-0 group-hover:opacity-100 transition-all"
                  title="Xóa thông báo"
                >
                  <IconTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-4"
          />
        </>
        )}
      </main>
    </div>
  );
}

