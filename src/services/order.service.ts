import axiosClient from "@/lib/axios";

export interface CreateOrderRequest {
  products: Array<{
    productId: string;
    quantity: number;
  }>;
  totalAmount: number;
  shippingAddress: string; // Address ID
  shippingMethod: string;
  sellerId: string;
  paymentMethod: string;
}

export interface CreateOrderResponse {
  order: {
    _id: string;
    buyerId: string;
    sellerId: string;
    products: Array<{
      productId: string;
      quantity: number;
    }>;
    totalAmount: number;
    shippingAddress: string;
    shippingMethod: string;
    paymentMethod: string;
    status: string;
    statusPayment: boolean;
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown;
  };
}

export interface Order {
  _id: string;
  buyerId: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  sellerId: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  products: Array<{
    productId: {
      _id: string;
      name: string;
      price: number;
      avatar: string;
      [key: string]: unknown;
    };
    quantity: number;
  }>;
  totalAmount: number;
  shippingAddress: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    address: string;
    [key: string]: unknown;
  };
  shippingMethod: string;
  paymentMethod: string;
  status: string;
  statusPayment: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

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
};


