import axiosClient from "@/lib/axios";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  Order,
  SellerBankInfo,
} from "@/types/order";

export const OrderService = {
  /**
   * Create a complete order with all required information
   */
  create: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    return axiosClient.post("/orders", data);
  },

  /**
   * Get order by ID
   */
  getById: async (id: string): Promise<{ order: Order }> => {
    return axiosClient.get(`/orders/order-details/${id}`);
  },

  /**
   * Get all orders for current user
   */
  getMyOrders: async (): Promise<{ orders: Order[] }> => {
    return axiosClient.get("/orders/my-orders");
  },

  /**
   * Update order status
   */
  updateStatus: async (
    orderId: string,
    status: string,
    reason?: string
  ): Promise<{ orders: Order[]; message: string }> => {
    return axiosClient.patch("/orders/update", { orderId, status, reason });
  },

  /**
   * Get seller bank info for order payment
   */
  getSellerBankInfo: async (
    orderId: string
  ): Promise<SellerBankInfo> => {
    return axiosClient.get(`/orders/${orderId}/seller-bank-info`);
  },

  /**
   * Confirm payment status
   */
  confirmPayment: async (
    orderId: string
  ): Promise<{ message: string; order: Order }> => {
    return axiosClient.patch("/orders/update-payment-status", { orderId });
  },

  /**
   * Get orders for seller (orders where current user is seller)
   */
  getSellerOrders: async (): Promise<{ orders: Order[] }> => {
    const res = await axiosClient.get("/orders/seller/my");
    return { orders: res.orders || res.data || [] };
  },

  /**
   * Update order by seller (status: delivered, cancelled, etc.)
   */
  updateSellerOrder: async (
    orderId: string,
    status: string,
    reason?: string
  ): Promise<{ order: Order }> => {
    const res = await axiosClient.patch(
      `/orders/seller/update/${orderId}`,
      { status, reason }
    );
    return { order: res.order || res };
  },
};


