"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useToast } from "@/components/ui/Toast";
import type { NotificationType } from "@/store/useNotificationStore";

const TYPE_LABELS: Record<NotificationType, string> = {
  order:   "Đơn hàng",
  chat:    "Tin nhắn",
  product: "Sản phẩm",
  system:  "Thông báo",
};

/**
 * Sits inside ToastProvider. Watches the notification store for new unread
 * notifications and shows a clickable toast popup.
 */
export function RealtimeNotificationToast() {
  const toast         = useToast();
  const router        = useRouter();
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead    = useNotificationStore((s) => s.markAsRead);

  const lastSeenId = useRef<string | null>(null);

  useEffect(() => {
    if (notifications.length === 0) return;

    const newest = notifications[0];
    if (newest.read) return;
    if (newest.id === lastSeenId.current) return;

    lastSeenId.current = newest.id;

    const typeLabel = TYPE_LABELS[newest.type] ?? "Thông báo";

    toast.notification({
      title:   `${typeLabel}: ${newest.title}`,
      message: newest.message,
      type:    newest.type,
      onClick: newest.link
        ? () => {
            markAsRead(newest.id);
            router.push(newest.link!);
          }
        : undefined,
    });

    setTimeout(() => markAsRead(newest.id), 6000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  return null;
}

