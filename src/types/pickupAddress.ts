/**
 * Địa chỉ lấy hàng (user chưa verify seller) - dùng cho GHN khi tạo đơn.
 */
export interface PickupAddressData {
  _id?: string;
  accountId: string;
  province: string;
  district: string;
  ward: string;
  from_district_id: string;
  from_ward_code: string;
  businessAddress: string;
}

export interface GetPickupAddressResponse {
  hasAddress: boolean;
  data: PickupAddressData | null;
}

export interface UpsertPickupAddressPayload {
  province: string;
  district: string;
  ward: string;
  from_district_id: string;
  from_ward_code: string;
  businessAddress: string;
}

export interface UpsertPickupAddressResponse {
  success: boolean;
  message: string;
  data?: PickupAddressData;
}
