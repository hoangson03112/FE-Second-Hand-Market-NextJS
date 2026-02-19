import axiosClient from "@/lib/axios";

export interface CreateProductReviewRequest {
  productId: string;
  orderId: string;
  rating: number;
  comment?: string;
}

export interface ProductReview {
  _id: string;
  productId: string;
  buyerId: {
    _id: string;
    fullName: string;
  };
  orderId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export const ProductReviewService = {
  /**
   * Create a new product review
   */
  create: async (data: CreateProductReviewRequest) => {
    return axiosClient.post("/product-reviews", data);
  },

  /**
   * Get review by order and product
   */
  getByOrderAndProduct: async (orderId: string, productId: string): Promise<{ review: ProductReview | null }> => {
    return axiosClient.get(`/product-reviews/by-order/${orderId}/product/${productId}`);
  },

  /**
   * Get all reviews for a product
   */
  getByProduct: async (productId: string): Promise<{ reviews: ProductReview[] }> => {
    return axiosClient.get(`/product-reviews/product/${productId}`);
  },

  /**
   * Get buyer's reviews
   */
  getMyReviews: async (): Promise<{ reviews: ProductReview[] }> => {
    return axiosClient.get("/product-reviews/my");
  },
};
