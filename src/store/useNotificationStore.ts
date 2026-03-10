import { createClientStore } from "@/lib/state";

export type NotificationType = "chat" | "order" | "product" | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  createdAt: string;
  read: boolean;
  dedupeKey?: string;
  metadata?: Record<string, unknown>;
}

interface AddNotificationInput {
  id?: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  dedupeKey?: string;
  metadata?: Record<string, unknown>;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notification: AddNotificationInput) => void;
  /** Bulk-load from API. Existing notifications with matching dedupeKey are skipped. */
  hydrate: (notifications: AppNotification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  /** Clear store — call on logout */
  reset: () => void;
}

const MAX_NOTIFICATIONS = 100;

function calculateUnreadCount(notifications: AppNotification[]) {
  return notifications.reduce((count, item) => count + (item.read ? 0 : 1), 0);
}

export const useNotificationStore = createClientStore<NotificationState>(
  (set, get) => ({
    notifications: [],
    unreadCount: 0,

    addNotification: (notification) => {
      const current = get().notifications;
      const dedupeKey = notification.dedupeKey;

      if (dedupeKey && current.some((item) => item.dedupeKey === dedupeKey)) {
        return;
      }

      const next: AppNotification = {
        id:
          notification.id ||
          `noti_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        link: notification.link,
        createdAt: new Date().toISOString(),
        read: false,
        dedupeKey,
        metadata: notification.metadata,
      };

      const notifications = [next, ...current].slice(0, MAX_NOTIFICATIONS);
      set({
        notifications,
        unreadCount: calculateUnreadCount(notifications),
      });
    },

    hydrate: (incoming) => {
      const current = get().notifications;
      const existingKeys = new Set(current.map((n) => n.dedupeKey).filter(Boolean));
      const newOnes = incoming.filter((n) => !n.dedupeKey || !existingKeys.has(n.dedupeKey));
      if (newOnes.length === 0) return;
      const merged = [...current, ...newOnes]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, MAX_NOTIFICATIONS);
      set({ notifications: merged, unreadCount: calculateUnreadCount(merged) });
    },

    markAsRead: (id) => {
      const notifications = get().notifications.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      );
      set({
        notifications,
        unreadCount: calculateUnreadCount(notifications),
      });
    },

    markAllAsRead: () => {
      const notifications = get().notifications.map((item) => ({
        ...item,
        read: true,
      }));
      set({ notifications, unreadCount: 0 });
    },

    removeNotification: (id) => {
      const notifications = get().notifications.filter(
        (item) => item.id !== id,
      );
      set({
        notifications,
        unreadCount: calculateUnreadCount(notifications),
      });
    },

    clearNotifications: () => {
      set({ notifications: [], unreadCount: 0 });
    },

    reset: () => {
      set({ notifications: [], unreadCount: 0 });
    },
  }),
  {
    name: "notification-store",
    persist: true,
  },
);
