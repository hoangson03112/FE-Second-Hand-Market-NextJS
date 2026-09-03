import axiosClient from "@/lib/axios";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  Order,
  OrderStatus,
  PaymentProof,
  ReturnInspectionCondition,
  SellerBankInfo,
  GHNTrackingData,
} from "@/types/order";

export const OrderService = {

  create: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    return axiosClient.post("/orders", data);
  },


  getById: async (id: string): Promise<{ order: Order }> => {
    return axiosClient.get(`/orders/order-details/${id}`);
  },


  getMyOrders: async (): Promise<{ orders: Order[] }> => {
    return axiosClient.get("/orders/my-orders");
  },


  updateStatus: async (
    orderId: string,
    status: string,
    reason?: string
  ): Promise<{ orders: Order[]; message: string }> => {
    return axiosClient.patch("/orders/update", { orderId, status, reason });
  },


  getSellerBankInfo: async (
    orderId: string
  ): Promise<SellerBankInfo> => {
    return axiosClient.get(`/orders/${orderId}/seller-bank-info`);
  },


  confirmPayment: async (
    orderId: string
  ): Promise<{ message: string; order: Order }> => {
    return axiosClient.patch("/orders/update-payment-status", { orderId });
  },


  getPaymentProof: async (
    orderId: string
  ): Promise<{ bankInfo: PaymentProof }> => {
    return axiosClient.get(`/bank-info/${orderId}`);
  },


  verifyPaymentProof: async (
    orderId: string,
    status: "verified" | "rejected",
    rejectReason?: string
  ): Promise<{ bankInfo: PaymentProof }> => {
    return axiosClient.patch(`/bank-info/verify/${orderId}`, {
      status,
      rejectReason,
    });
  },


  getSellerOrders: async (): Promise<{ orders: Order[] }> => {
    const res = await axiosClient.get<{ orders: Order[] }>("/orders/seller/my");
    const data = res as { orders?: Order[] };
    return { orders: data.orders || [] };
  },


  updateSellerOrder: async (
    orderId: string,
    status: string,
    reason?: string
  ): Promise<{ order: Order }> => {
    const res = await axiosClient.patch<{ order: Order }>(
      `/orders/seller/update/${orderId}`,
      { status, reason }
    );
    const data = res as { order?: Order };
    return { order: data.order || {} as Order };
  },


  confirmReceived: async (orderId: string): Promise<{ message: string; order: Order }> => {
    return axiosClient.patch(`/orders/${orderId}/confirm-received`);
  },


  requestRefund: async (
    orderId: string,
    reason: string,
    description?: string,
    images?: File[],
    videos?: File[],
    bankName?: string,
    accountNumber?: string,
    accountHolder?: string,
  ): Promise<{ message: string; order: Order }> => {
    const hasFiles = (images && images.length > 0) || (videos && videos.length > 0);
    if (hasFiles) {
      const form = new FormData();
      form.append("reason", reason);
      if (description) form.append("description", description);
      images?.forEach((f) => form.append("images", f));
      videos?.forEach((f) => form.append("videos", f));
      if (bankName)      form.append("bankName",      bankName);
      if (accountNumber) form.append("accountNumber", accountNumber);
      if (accountHolder) form.append("accountHolder", accountHolder);
      return axiosClient.post(`/orders/${orderId}/request-refund`, form);
    }
    return axiosClient.post(`/orders/${orderId}/request-refund`, {
      reason,
      description,
      ...(bankName      && { bankName }),
      ...(accountNumber && { accountNumber }),
      ...(accountHolder && { accountHolder }),
    });
  },


  cancelOrder: async (
    orderId: string,
    reason: string
  ): Promise<{ message: string; order: Order }> => {
    return axiosClient.post(`/orders/${orderId}/cancel`, { reason });
  },


  approveRefund: async (
    orderId: string,
    note?: string
  ): Promise<{ message: string }> => {
    return axiosClient.post(`/orders/${orderId}/approve-refund`, { note });
  },


  rejectRefund: async (
    orderId: string,
    reason: string
  ): Promise<{ message: string }> => {
    return axiosClient.post(`/orders/${orderId}/reject-refund`, { reason });
  },


  confirmReturnReceived: async (
    orderId: string,
    inspection?: {
      condition?: ReturnInspectionCondition;
      inspectionComment?: string;
      images?: File[];
    },
  ): Promise<{ message: string }> => {
    const { condition = "intact", inspectionComment, images } = inspection ?? {};

    if (images?.length) {
      const form = new FormData();
      form.append("condition", condition);
      if (inspectionComment) form.append("inspectionComment", inspectionComment);
      images.forEach((f) => form.append("images", f));
      return axiosClient.post(`/orders/${orderId}/confirm-return-received`, form);
    }

    return axiosClient.post(`/orders/${orderId}/confirm-return-received`, {
      condition,
      inspectionComment,
    });
  },


  submitRefundBankInfo: async (
    orderId: string,
    data: { bankName: string; accountNumber: string; accountHolder: string }
  ): Promise<{ message: string; data: Order }> => {
    return axiosClient.post(`/orders/${orderId}/refund-bank-info`, data);
  },


  getSellerPayouts: async (params?: {
    page?: number;
    limit?: number;
    payoutStatus?: string;
  }): Promise<{ data: Order[]; total: number; page: number; totalPages: number }> => {
    const search = new URLSearchParams();
    if (params?.page) search.set("page", String(params.page));
    if (params?.limit) search.set("limit", String(params.limit));
    if (params?.payoutStatus) search.set("payoutStatus", params.payoutStatus);
    const res = await axiosClient.get(`/orders/seller/payouts?${search.toString()}`);
    return res as unknown as { data: Order[]; total: number; page: number; totalPages: number };
  },


  getSellerWallet: async (): Promise<{
    balance: number;
    pendingBalance: number;
    totalEarned: number;
    totalWithdrawn: number;
  }> => {
    const res = await axiosClient.get("/orders/seller/wallet");
    return res as unknown as {
      balance: number;
      pendingBalance: number;
      totalEarned: number;
      totalWithdrawn: number;
    };
  },


  getTracking: async (orderId: string): Promise<{ tracking: GHNTrackingData }> => {
    return axiosClient.get(`/orders/${orderId}/tracking`);
  },


  getMyOrdersByStatus: async (status?: OrderStatus): Promise<{ orders: Order[] }> => {
    const params = status ? `?status=${status}` : "";
    return axiosClient.get(`/orders/my-orders${params}`);
  },
};

