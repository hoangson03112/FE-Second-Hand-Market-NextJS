import axiosClient from "@/lib/axios";
import type {
  RegisterSellerResponse,
  SellerRequestStatusResponse,
  SellerProductLimitResponse,
  SellerInfoResponse,
  UpdateBankInfoPayload,
} from "@/types/seller";

/**
 * Gửi đăng ký làm seller (FormData: ảnh CCCD + thông tin).
 * Backend: POST /sellers/register (verifyToken), multipart/form-data.
 */
export const SellerService = {
  registerSeller: async (formData: FormData): Promise<RegisterSellerResponse> => {
    const response = await axiosClient.post("/sellers/register", formData);
    return response as unknown as RegisterSellerResponse;
  },

  /**
   * Kiểm tra trạng thái yêu cầu trở thành seller của user hiện tại.
   * Backend: GET /sellers/request-status (verifyToken)
   */
  getRequestStatus: async (): Promise<SellerRequestStatusResponse> => {
    const response = await axiosClient.get("/sellers/request-status");
    return response as unknown as SellerRequestStatusResponse;
  },

  /**
   * Kiểm tra số lượng sản phẩm đã đăng và giới hạn của user hiện tại.
   * Backend: GET /sellers/product-limit (verifyToken)
   */
  getProductLimit: async (): Promise<SellerProductLimitResponse> => {
    const response = await axiosClient.get("/sellers/product-limit");
    return response as unknown as SellerProductLimitResponse;
  },

  /**
   * Lấy thông tin seller theo accountId (dùng cho profile seller).
   * Backend: GET /sellers/:accountId (verifyToken)
   */
  getSellerInfo: async (accountId: string): Promise<SellerInfoResponse> => {
    const response = await axiosClient.get(`/sellers/${accountId}`);
    return response as unknown as SellerInfoResponse;
  },

  /**
   * Seller cập nhật thông tin ngân hàng nhận tiền.
   * Backend: PUT /sellers/me/bank-info (verifyToken)
   */
  updateBankInfo: async (data: UpdateBankInfoPayload): Promise<{ success: boolean; message: string }> => {
    const response = await axiosClient.put("/sellers/me/bank-info", data);
    return response as unknown as { success: boolean; message: string };
  },

  /** Tạo ưu đãi cá nhân cho buyer. Backend: POST /sellers/personal-discount */
  createPersonalDiscount: async (payload: {
    productId: string;
    buyerId: string;
    price: number;
    endDate: string;
  }): Promise<{ deal: unknown; message?: string }> => {
    const response = await axiosClient.post("/sellers/personal-discount", payload);
    return response as unknown as { deal: unknown; message?: string };
  },

  /** Xóa ưu đãi cá nhân. Backend: DELETE /sellers/personal-discount/:id */
  deletePersonalDiscount: async (discountId: string): Promise<{ message?: string }> => {
    const response = await axiosClient.delete(`/sellers/personal-discount/${discountId}`);
    return response as unknown as { message?: string };
  },
};
