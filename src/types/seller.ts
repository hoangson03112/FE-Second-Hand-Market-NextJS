export interface RegisterSellerRequest {
  address: string;
  province: string;
  district: string;
  ward: string;
  from_district_id: string;
  from_ward_code: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  agreeTerms: boolean;
  agreePolicy: boolean;
}

export interface RegisterSellerResponse {
  success: boolean;
  message: string;
}

export type SellerRequestStatus = "pending" | "approved" | "rejected" | null;

export interface SellerRequestStatusResponse {
  hasRequest: boolean;
  status: SellerRequestStatus;
  message?: string;
}

export interface SellerProductLimitResponse {
  totalProducts: number;
  pendingProducts: number;
  approvedProducts: number;
  limit: number;
  requiresVerification: boolean;
}

export interface SellerBankInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  bankBin?: string | null;
}

export interface SellerInfoResponse {
  success: boolean;
  data: {
    _id: string;
    accountId: string;
    bankInfo: SellerBankInfo;
    verificationStatus: string;
    [key: string]: unknown;
  };
}

export interface UpdateBankInfoPayload {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  bankBin?: string;
}
