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
