import axiosClient from "@/lib/axios";
import type {
  RegisterSellerResponse,
  SellerRequestStatusResponse,
  SellerProductLimitResponse,
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
};
