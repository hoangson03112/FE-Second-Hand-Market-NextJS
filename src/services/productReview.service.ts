import axiosClient from "@/lib/axios";

export interface CreateProductReviewRequest {
  productId: string;
  orderId: string;
  rating: number;
  comment?: string;
}

/** buyerId khi populate từ API */
export interface ProductReviewBuyer {
  _id: string;
  fullName: string;
  avatar?: string | { url?: string } | null;
}

export interface ProductReview {
  _id: string;
  productId: string;
  buyerId: string | ProductReviewBuyer;
  orderId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReviewsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductReviewsResponse {
  success: boolean;
  reviews: ProductReview[];
  pagination: ProductReviewsPagination;
  avgRating: number;
  totalReviews: number;
}

export const ProductReviewService = {
  create: async (data: CreateProductReviewRequest) => {
    return axiosClient.post("/product-reviews", data);
  },

  getByOrderAndProduct: async (
    orderId: string,
    productId: string,
  ): Promise<{ review: ProductReview | null }> => {
    return axiosClient.get(`/product-reviews/by-order/${orderId}/product/${productId}`);
  },

  /**
   * Đánh giá theo sản phẩm (public) — có phân trang, avgRating/totalReviews toàn cục.
   */
  getByProduct: async (
    productId: string,
    params?: { page?: number; limit?: number },
  ): Promise<ProductReviewsResponse> => {
    const search = new URLSearchParams();
    if (params?.page != null) search.set("page", String(params.page));
    if (params?.limit != null) search.set("limit", String(params.limit));
    const q = search.toString();
    return axiosClient.get(
      `/product-reviews/product/${productId}${q ? `?${q}` : ""}`,
    );
  },

  getMyReviews: async (): Promise<{ reviews: ProductReview[] }> => {
    return axiosClient.get("/product-reviews/my");
  },
};
