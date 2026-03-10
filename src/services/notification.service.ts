import axiosClient from "@/lib/axios";
import type { AppNotification } from "@/store/useNotificationStore";

interface FetchNotificationsResponse {
  notifications: Array<{
    _id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    read: boolean;
    metadata?: Record<string, unknown>;
    createdAt: string;
  }>;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  unreadCount: number;
}

export const NotificationService = {
  getMyNotifications: async (page = 1, limit = 20): Promise<FetchNotificationsResponse> => {
    return axiosClient.get(`/notifications?page=${page}&limit=${limit}`);
  },

  markAsRead: async (id: string): Promise<void> => {
    return axiosClient.patch(`/notifications/read/${id}`);
  },

  markAllAsRead: async (): Promise<void> => {
    return axiosClient.patch("/notifications/read-all");
  },

  deleteNotification: async (id: string): Promise<void> => {
    return axiosClient.delete(`/notifications/${id}`);
  },

  /** Chuyển đổi từ DB format sang AppNotification format */
  toAppNotification: (n: FetchNotificationsResponse["notifications"][number]): AppNotification => ({
    id: n._id,
    type: n.type as AppNotification["type"],
    title: n.title,
    message: n.message,
    link: n.link,
    createdAt: n.createdAt,
    read: n.read,
    dedupeKey: `db-${n._id}`,
    metadata: n.metadata,
  }),
};
