import axiosClient from "@/lib/axios";
import type { GetCartResponse } from "@/types/cart";

export interface PurchaseNowRequest {
  productId: string;
  quantity: number;
}

export interface PurchaseNowResponse {
  status: string;
  message: string;
  order: {
    _id: string;
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
    [key: string]: unknown;
  };
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface AddToCartResponse {
  status: string;
  message: string;
}

export const CartService = {
  /**
   * Get current user's cart with populated product details
   */
  getCart: async (): Promise<GetCartResponse> => {
    return axiosClient.get("/cart");
  },

  /**
   * Purchase now - Create order immediately
   * This creates a temporary order that needs to be completed with shipping info
   */
  purchaseNow: async (
    data: PurchaseNowRequest
  ): Promise<PurchaseNowResponse> => {
    return axiosClient.post("/cart/purchase-now", data);
  },

  /**
   * Add product to cart
   */
  addToCart: async (data: AddToCartRequest): Promise<AddToCartResponse> => {
    return axiosClient.post("/cart/add", data);
  },

  /**
   * Update cart item quantity
   */
  updateQuantity: async (
    productId: string,
    quantity: number
  ): Promise<{ status: string; message: string }> => {
    return axiosClient.put("/cart/update-quantity", { productId, quantity });
  },

  /**
   * Remove items from cart
   */
  deleteItems: async (
    productIds: string[]
  ): Promise<{ status: string; message: string }> => {
    return axiosClient.delete("/cart/delete-item", { data: { productIds } });
  },

  /**
   * Clear entire cart
   */
  clearCart: async (): Promise<{ message: string }> => {
    return axiosClient.delete("/cart/clear");
  },
};

