import axiosClient from "@/lib/axios";
import type {
  DashboardStats,
  AdminOrder,
  AdminAccount,
  AdminSeller,
  AdminReport,
  AdminAuditLog,
  AdminCategory,
  GetAdminSellersParams,
  GetAdminSellersResponse,
  PaginationMeta,
} from "@/types/admin";
import type { RefundRequest, SellerPayout, GHNTrackingData } from "@/types/order";

export const AdminService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await axiosClient.get("/admin/dashboard");
    const body = res as unknown as { success: boolean; data: DashboardStats };
    return body.data;
  },

  getOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    paymentMethod?: "cod" | "bank_transfer" | "all";
    payoutStatus?: "pending" | "paid" | "all";
    startDate?: string;
    endDate?: string;
  }): Promise<{ orders: AdminOrder[]; pagination: PaginationMeta }> => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.status && params.status !== "all") qs.set("status", params.status);
    if (params?.search?.trim()) qs.set("search", params.search.trim());
    if (params?.paymentMethod && params.paymentMethod !== "all") {
      qs.set("paymentMethod", params.paymentMethod);
    }
    if (params?.payoutStatus && params.payoutStatus !== "all") {
      qs.set("payoutStatus", params.payoutStatus);
    }
    if (params?.startDate) qs.set("startDate", params.startDate);
    if (params?.endDate) qs.set("endDate", params.endDate);
    const query = qs.toString();
    const res = await axiosClient.get(`/orders/admin/all${query ? `?${query}` : ""}`);
    return res as unknown as { orders: AdminOrder[]; pagination: PaginationMeta };
  },

  getAccounts: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: "active" | "inactive" | "banned";
    role?: "buyer" | "seller" | "admin" | "";
    startDate?: string;
    endDate?: string;
  }): Promise<{ accounts: AdminAccount[]; pagination: PaginationMeta }> => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.search?.trim()) qs.set("search", params.search.trim());
    if (params?.status) qs.set("status", params.status);
    if (params?.role) qs.set("role", params.role);
    if (params?.startDate) qs.set("startDate", params.startDate);
    if (params?.endDate) qs.set("endDate", params.endDate);
    const res = await axiosClient.get(`/accounts/admin/list?${qs.toString()}`);
    return res as unknown as { accounts: AdminAccount[]; pagination: PaginationMeta };
  },

  updateAccountStatus: async (
    accountId: string,
    status: "active" | "banned",
    reason?: string
  ): Promise<{ message: string; account: AdminAccount }> => {
    const res = await axiosClient.put(`/accounts/admin/${accountId}/status`, {
      status,
      reason,
    });
    return res as unknown as { message: string; account: AdminAccount };
  },

  getSellers: async (params?: GetAdminSellersParams): Promise<GetAdminSellersResponse> => {
    const search = new URLSearchParams();
    if (params?.status) search.set("status", params.status);
    if (params?.page) search.set("page", String(params.page));
    if (params?.limit) search.set("limit", String(params.limit));
    if (params?.startDate) search.set("startDate", params.startDate);
    if (params?.endDate) search.set("endDate", params.endDate);
    const res = await axiosClient.get(`/sellers/admin/all?${search.toString()}`);
    return res as unknown as GetAdminSellersResponse;
  },

  updateSellerStatus: async (
    sellerId: string,
    status: "approved" | "rejected" | "banned",
    rejectedReason?: string
  ) => {
    return axiosClient.put(`/sellers/admin/${sellerId}/status`, {
      status,
      rejectedReason,
    });
  },

  getReports: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ reports?: AdminReport[]; pagination?: PaginationMeta }> => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.status) qs.set("status", params.status);
    if (params?.startDate) qs.set("startDate", params.startDate);
    if (params?.endDate) qs.set("endDate", params.endDate);
    const res = await axiosClient.get(`/reports?${qs.toString()}`);
    return res as unknown as { reports?: AdminReport[]; pagination?: PaginationMeta };
  },

  getAuditLogs: async (params?: {
    page?: number;
    limit?: number;
    action?: string;
    targetType?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ data: AdminAuditLog[]; pagination: PaginationMeta }> => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.action && params.action !== "all") qs.set("action", params.action);
    if (params?.targetType && params.targetType !== "all") qs.set("targetType", params.targetType);
    if (params?.startDate) qs.set("startDate", params.startDate);
    if (params?.endDate) qs.set("endDate", params.endDate);
    const query = qs.toString();
    const res = await axiosClient.get(`/admin/audit-logs${query ? `?${query}` : ""}`);
    return res as unknown as { data: AdminAuditLog[]; pagination: PaginationMeta };
  },

  getCategories: async (): Promise<{ data: AdminCategory[] }> => {
    const res = await axiosClient.get("/categories");
    return res as unknown as { data: AdminCategory[] };
  },

  createCategory: async (payload: {
    name: string;
    status?: "active" | "inactive";
  }) => {
    return axiosClient.post("/categories", payload);
  },

  updateCategory: async (
    categoryId: string,
    data: { name: string; status?: "active" | "inactive" }
  ) => {
    return axiosClient.put(
      "/categories/update",
      { data },
      {
        params: { categoryID: categoryId },
      }
    );
  },

  createSubCategory: async (
    parentCategoryId: string,
    payload: { name: string; status?: "active" | "inactive" }
  ) => {
    return axiosClient.post(`/categories/sub/${parentCategoryId}`, payload);
  },

  updateSubCategory: async (params: {
    subcategoryId: string;
    parentCategoryId: string;
    name: string;
    status?: "active" | "inactive";
  }) => {
    const { subcategoryId, parentCategoryId, name, status = "active" } = params;
    return axiosClient.put("/categories/sub/update", {
      subcategory: {
        _id: subcategoryId,
        name,
        status,
      },
      parentCategoryId,
    });
  },

  deleteSubCategory: async (categoryId: string, subcategoryId: string) => {
    return axiosClient.delete(`/categories/${categoryId}/sub/${subcategoryId}`);
  },

  getModerationStats: async () => {
    return axiosClient.get("/admin/moderation/stats");
  },

  getModerationHealth: async () => {
    return axiosClient.get("/admin/admin/moderation/health");
  },

  toggleModerationMode: async (mode: "strict" | "balanced") => {
    return axiosClient.put("/admin/admin/moderation/toggle-mode", { mode });
  },

  // ── Refund Management ────────────────────────────────────────────
  /** Get all refunds (admin view) — from the refund module */
  getRefunds: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ refunds: RefundRequest[]; pagination?: PaginationMeta }> => {
    const res = await axiosClient.get("/refunds/admin/all", { params });
    return res as unknown as { refunds: RefundRequest[]; pagination?: PaginationMeta };
  },

  /** Get refund detail (admin/buyer/seller) — full info including evidence, order */
  getRefundDetail: async (refundId: string): Promise<{ success: boolean; refund: RefundRequest }> => {
    const res = await axiosClient.get(`/refunds/${refundId}`);
    return res as unknown as { success: boolean; refund: RefundRequest };
  },

  /**
   * Admin finalizes a refund: deducts seller wallet & marks order refunded.
   * POST /orders/:orderId/complete-refund
   */
  approveRefund: async (
    orderId: string,
    adminNote?: string
  ): Promise<{ message: string }> => {
    return axiosClient.post(`/orders/${orderId}/complete-refund`, { adminNote });
  },

  /**
   * Admin approves a disputed refund (sides with buyer).
   * PUT /refunds/:refundId/admin-handle  (only when status === "disputed")
   */
  approveDispute: async (
    refundId: string,
    comment?: string
  ): Promise<{ message: string }> => {
    return axiosClient.put(`/refunds/${refundId}/admin-handle`, {
      decision: "refund",
      comment: comment ?? "",
    });
  },

  /**
   * Admin rejects a disputed refund (sides with seller).
   * PUT /refunds/:refundId/admin-handle  (only when status === "disputed")
   */
  rejectRefund: async (
    refundId: string,
    adminNote: string
  ): Promise<{ message: string }> => {
    return axiosClient.put(`/refunds/${refundId}/admin-handle`, {
      decision: "reject",
      comment: adminNote,
    });
  },

  // ── Seller Payout Management ─────────────────────────────────────
  /** List orders completed but payout not yet released */
  getPayouts: async (): Promise<{ data: SellerPayout[] }> => {
    const res = await axiosClient.get("/orders/admin/pending-payouts");
    return res as unknown as { data: SellerPayout[] };
  },

  /** Admin manually triggers payout for a completed order */
  triggerPayout: async (
    orderId: string
  ): Promise<{ message: string }> => {
    return axiosClient.post(`/orders/${orderId}/payout`);
  },

  /**
   * Admin confirms a bank transfer payment by a buyer.
   * POST /orders/:orderId/confirm-bank-transfer
   */
  confirmBankTransfer: async (
    orderId: string
  ): Promise<{ message: string }> => {
    return axiosClient.post(`/orders/${orderId}/confirm-bank-transfer`);
  },

  // ── GHN Tracking ─────────────────────────────────────────────────
  getOrderTracking: async (
    orderId: string
  ): Promise<{ tracking: GHNTrackingData }> => {
    const res = await axiosClient.get(`/orders/${orderId}/tracking`);
    return res as unknown as { tracking: GHNTrackingData };
  },

  // ── Admin Order Status Update ─────────────────────────────────────
  updateOrderStatus: async (
    orderId: string,
    status: string,
    reason?: string
  ): Promise<{ message: string }> => {
    return axiosClient.patch(`/orders/admin/update-status/${orderId}`, { status, reason });
  },

  broadcastSystemNotification: async (payload: {
    title: string;
    message: string;
    link?: string;
    targetRoles?: Array<"buyer" | "seller" | "admin">;
  }): Promise<{ success: boolean; message: string; sentCount: number }> => {
    const res = await axiosClient.post("/notifications/admin/broadcast", payload);
    return res as unknown as { success: boolean; message: string; sentCount: number };
  },

  getBroadcastHistory: async (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    success: boolean;
    data: Array<{
      _id: string;
      title: string;
      message: string;
      link?: string;
      targetRoles: string[];
      sentCount: number;
      createdAt: string;
      createdBy?: { fullName?: string; email?: string };
    }>;
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.startDate) qs.set("startDate", params.startDate);
    if (params?.endDate) qs.set("endDate", params.endDate);
    const query = qs.toString();
    const res = await axiosClient.get(
      `/notifications/admin/broadcast-history${query ? `?${query}` : ""}`,
    );
    return res as unknown as {
      success: boolean;
      data: Array<{
        _id: string;
        title: string;
        message: string;
        link?: string;
        targetRoles: string[];
        sentCount: number;
        createdAt: string;
        createdBy?: { fullName?: string; email?: string };
      }>;
      pagination: { page: number; limit: number; total: number; totalPages: number };
    };
  },
};

export type {
  DashboardStats,
  AdminOrder,
  AdminAccount,
  AdminSeller,
  AdminReport,
  AdminAuditLog,
  AdminCategory,
  GetAdminSellersParams,
  GetAdminSellersResponse,
};
export type { RefundRequest, SellerPayout, GHNTrackingData };
