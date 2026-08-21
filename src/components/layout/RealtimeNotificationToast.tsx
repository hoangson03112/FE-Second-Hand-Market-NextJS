"use client";

import { useEffect, useRef } from "react";
import { useNotificationStore } from "@/store/useNotificationStore";
import type { NotificationType } from "@/store/useNotificationStore";
import { useToast } from "@/components/providers/ToastProvider";

const TYPE_LABELS: Record<NotificationType, string> = {
  order: "Đơn hàng",
  chat: "Tin nhắn",
  product: "Sản phẩm",
  system: "Thông báo",
};

export function RealtimeNotificationToast() {
  const { toast } = useToast();
  const notifications = useNotificationStore((s) => s.notifications);

  const lastSeenId = useRef<string | null>(null);

  useEffect(() => {
    if (notifications.length === 0) {
      lastSeenId.current = null;
      return;
    }

    const newest = notifications[0];
    if (newest.id === lastSeenId.current) return;

    if (lastSeenId.current === null) {
      lastSeenId.current = newest.id;
      return;
    }

    lastSeenId.current = newest.id;

    const typeLabel = TYPE_LABELS[newest.type] ?? "Thông báo";

    toast({
      title: `${typeLabel}: ${newest.title}`,
      description: newest.message,
    });

  }, [notifications, toast]);

  return null;
}
