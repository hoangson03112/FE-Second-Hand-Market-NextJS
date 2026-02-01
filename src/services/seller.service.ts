import axiosClient from "@/lib/axios";
import type { RegisterSellerResponse } from "@/types/seller";

/**
 * Gửi đăng ký làm seller (FormData: ảnh CCCD + thông tin).
 * Backend: POST /sellers/register (verifyToken), multipart/form-data.
 */
export const SellerService = {
  registerSeller: async (formData: FormData): Promise<RegisterSellerResponse> => {
    const response = await axiosClient.post("/sellers/register", formData);
    return response as RegisterSellerResponse;
  },
};
