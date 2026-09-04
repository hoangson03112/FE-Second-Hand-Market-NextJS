import axiosClient from "@/lib/axios";

export interface BankInfoData {
  _id?: string;
  accountId?: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BankInfoResponse {
  success: boolean;
  data: BankInfoData | null;
  message?: string;
}

export interface UpdateBankInfoPayload {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export const BankService = {
  getMyBankInfo: async (): Promise<BankInfoResponse> => {
    const res = await axiosClient.get("/bank-info");
    return res as unknown as BankInfoResponse;
  },

  updateMyBankInfo: async (
    data: UpdateBankInfoPayload
  ): Promise<{ success: boolean; message?: string; data?: BankInfoData }> => {
    const res = await axiosClient.put("/bank-info", data);
    return res as unknown as { success: boolean; message?: string; data?: BankInfoData };
  },
};
