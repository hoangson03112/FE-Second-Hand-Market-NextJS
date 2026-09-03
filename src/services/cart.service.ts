import axiosClient from "@/lib/axios";
import type {
  GetCartResponse,
  PurchaseNowRequest,
  PurchaseNowResponse,
  AddToCartRequest,
  AddToCartResponse,
} from "@/types/cart";

export const CartService = {

  getCart: async (): Promise<GetCartResponse> => {
    return axiosClient.get("/cart");
  },


  purchaseNow: async (
    data: PurchaseNowRequest
  ): Promise<PurchaseNowResponse> => {
    return axiosClient.post("/cart/purchase-now", data);
  },


  addToCart: async (data: AddToCartRequest): Promise<AddToCartResponse> => {
    return axiosClient.post("/cart/add", data);
  },


  updateQuantity: async (
    productId: string,
    quantity: number
  ): Promise<{ status: string; message: string }> => {
    return axiosClient.put("/cart/update-quantity", { productId, quantity });
  },


  deleteItems: async (
    productIds: string[]
  ): Promise<{ status: string; message: string }> => {
    return axiosClient.delete("/cart/delete-item", { data: { productIds } });
  },


  clearCart: async (): Promise<{ message: string }> => {
    return axiosClient.delete("/cart/clear");
  },
};

