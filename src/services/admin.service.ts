import axiosClient from "@/lib/axios";

export interface DashboardStats {
  totalRevenue: number;
  soldProducts: number;
  newUsers: number;
  completionRate: number;
  salesData: unknown[];
  categoryData: { _id: string; value: number }[];
  userActivityData: {
    day: string;
    visits: number;
    listings: number;
    purchases: number;
  }[];
}

export interface AdminOrder {
  _id: string;
  buyerId: { _id: string; fullName: string; email: string; phoneNumber?: string };
  sellerId: unknown;
  products: Array<{
    productId: { name: string; price: number; images?: unknown[]; avatar?: { url: string };
      categoryId?: { name: string }; subcategoryId?: { name: string } };
    quantity: number;
  }>;
  totalAmount: number;
  shippingAddress?: unknown;
  status: string;
  statusPayment?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminAccount {
  _id: string;
  fullName?: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  createdAt?: string;
  avatar?: { url: string };
}

export interface AdminSeller {
  _id: string;
  accountId: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    createdAt?: string;
    avatar?: { url: string };
  };
  verificationStatus: "pending" | "approved" | "rejected" | "banned";
  businessAddress?: string;
  province?: string;
  district?: string;
  ward?: string;
  createdAt?: string;
}

export interface AdminReport {
  _id: string;
  type: string;
  targetId?: unknown;
  reporterId?: { fullName: string; email: string; phoneNumber?: string };
  status?: string;
  reason?: string;
  description?: string;
  images?: { url: string }[];
  createdAt: string;
}

export interface AdminCategory {
  _id: string;
  name: string;
  slug: string;
  status?: "active" | "inactive";
  subCategories: {
    _id: string;
    name: string;
    slug: string;
    status?: "active" | "inactive";
  }[];
}

export const AdminService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await axiosClient.get("/admin/dashboard");
    return res as unknown as DashboardStats;
  },

  getOrders: async (): Promise<{ orders: AdminOrder[] }> => {
    const res = await axiosClient.get("/orders/admin/all");
    return res as unknown as { orders: AdminOrder[] };
  },

  getAccounts: async (): Promise<{ accounts: AdminAccount[] }> => {
    const res = await axiosClient.get("/accounts/admin/list");
    return res as unknown as { accounts: AdminAccount[] };
  },

  getSellers: async (params?: {
    status?: "pending" | "approved" | "rejected";
    page?: number;
    limit?: number;
  }) => {
    const search = new URLSearchParams();
    if (params?.status) search.set("status", params.status);
    if (params?.page) search.set("page", String(params.page));
    if (params?.limit) search.set("limit", String(params.limit));
    const res = await axiosClient.get(`/sellers/admin/all?${search.toString()}`);
    return res as {
      success: boolean;
      data: AdminSeller[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
      };
      statistics: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
      };
    };
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

  getReports: async (): Promise<{ reports?: AdminReport[] }> => {
    const res = await axiosClient.get("/reports");
    return res as unknown as { reports?: AdminReport[] };
  },

  getCategories: async (): Promise<{ data: AdminCategory[] }> => {
    const res = await axiosClient.get("/categories");
    return res as unknown as { data: AdminCategory[] };
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
};
