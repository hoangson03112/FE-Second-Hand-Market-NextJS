import axiosClient from "@/lib/axios";

export const SellerReviewService = {
  create: async (data: {
    sellerId: string;
    orderId: string;
    rating: number;
    comment?: string;
  }) => {
    return axiosClient.post("/seller-reviews", data);
  },
  getByOrder: async (orderId: string) => {
    return axiosClient.get(`/seller-reviews/by-order/${orderId}`);
  },
  update: async (reviewId: string, data: { rating: number; comment?: string }) => {
    return axiosClient.put(`/seller-reviews/${reviewId}`, data);
  },
};
