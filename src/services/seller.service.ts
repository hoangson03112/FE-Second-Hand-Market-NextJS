import axiosClient from "@/lib/axios";
import type {
  RegisterSellerResponse,
  SellerRequestStatusResponse,
  SellerProductLimitResponse,
  SellerInfoResponse,
  UpdateBankInfoPayload,
} from "@/types/seller";


export const SellerService = {
  registerSeller: async (formData: FormData): Promise<RegisterSellerResponse> => {
    const response = await axiosClient.post("/sellers/register", formData);
    return response as unknown as RegisterSellerResponse;
  },


  getRequestStatus: async (): Promise<SellerRequestStatusResponse> => {
    const response = await axiosClient.get("/sellers/request-status");
    return response as unknown as SellerRequestStatusResponse;
  },


  getProductLimit: async (): Promise<SellerProductLimitResponse> => {
    const response = await axiosClient.get("/sellers/product-limit");
    return response as unknown as SellerProductLimitResponse;
  },


  getSellerInfo: async (accountId: string): Promise<SellerInfoResponse> => {
    const response = await axiosClient.get(`/sellers/${accountId}`);
    return response as unknown as SellerInfoResponse;
  },


  updateBankInfo: async (data: UpdateBankInfoPayload): Promise<{ success: boolean; message: string }> => {
    const response = await axiosClient.put("/sellers/me/bank-info", data);
    return response as unknown as { success: boolean; message: string };
  },


  createPersonalDiscount: async (payload: {
    productId: string;
    buyerId: string;
    price: number;
    endDate: string;
  }): Promise<{ deal: unknown; message?: string }> => {
    const response = await axiosClient.post("/sellers/personal-discount", payload);
    return response as unknown as { deal: unknown; message?: string };
  },


  deletePersonalDiscount: async (discountId: string): Promise<{ message?: string }> => {
    const response = await axiosClient.delete(`/sellers/personal-discount/${discountId}`);
    return response as unknown as { message?: string };
  },
};
