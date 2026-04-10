"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { createQueryClient } from "@/lib/query-client";
import { useUser } from "@/hooks/useUser";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useBannedStore } from "@/store/useBannedStore";
import { useTokenStore } from "@/store/useTokenStore";
import { NotificationService } from "@/services/notification.service";
// import { Analytics } from '@vercel/analytics/react';

/** Listens for realtime socket messages and adds to store */
function NotificationListener() {
  const { data: account } = useUser();
  const { lastMessage } = useWebSocket(account?.accountID ?? null);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const hydrate        = useNotificationStore((s) => s.hydrate);
  const reset          = useNotificationStore((s) => s.reset);
  const hydratedFor    = useRef<string | null>(null);

  // Hydrate from DB once per user login
  useEffect(() => {
    if (!account?.accountID) {
      hydratedFor.current = null;
      return;
    }
    if (hydratedFor.current === account.accountID) return;
    hydratedFor.current = account.accountID;

    NotificationService.getMyNotifications(1, 50)
      .then((res) => {
        const mapped = res.notifications.map(NotificationService.toAppNotification);
        hydrate(mapped);
      })
      .catch(() => {});
  }, [account?.accountID, hydrate]);

  // Reset store on logout
  useEffect(() => {
    if (!account) {
      hydratedFor.current = null;
      reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  // Handle realtime socket messages
  useEffect(() => {
    if (!lastMessage) return;
    const data = lastMessage.data as Record<string, unknown>;

    if (lastMessage.type === "order:notification") {
      if (!data?.title || !data?.message) return;
      addNotification({
        id: data._id ? String(data._id) : undefined,
        type: "order",
        title: String(data.title),
        message: String(data.message),
        link: data.link ? String(data.link) : undefined,
        dedupeKey: data._id ? `db-${data._id}` : (data.orderId ? `order-${data.orderId}-${data.title}` : undefined),
        metadata: data.orderId ? { orderId: String(data.orderId) } : undefined,
      });
    } else if (lastMessage.type === "product:notification") {
      if (!data?.title || !data?.message) return;
      addNotification({
        type: "product",
        title: String(data.title),
        message: String(data.message),
        link: data.link ? String(data.link) : undefined,
        dedupeKey: data.productId ? `product-${data.productId}-${data.title}` : undefined,
        metadata: data.productId ? { productId: String(data.productId) } : undefined,
      });
    } else if (lastMessage.type === "system:notification") {
      if (!data?.title || !data?.message) return;
      addNotification({
        id: data._id ? String(data._id) : undefined,
        type: "system",
        title: String(data.title),
        message: String(data.message),
        link: data.link ? String(data.link) : undefined,
        dedupeKey: data._id ? `db-${data._id}` : `system-${data.title}`,
      });
    } else if (lastMessage.type === "account:banned") {
      useBannedStore.getState().setBanned(true);
      useTokenStore.getState().clearAuth();
    }
  }, [lastMessage, addNotification]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationListener />
      {children}
      {/* <Analytics /> */}
    </QueryClientProvider>
  );
}

