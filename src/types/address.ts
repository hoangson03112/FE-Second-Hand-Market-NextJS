export interface Address {
  _id: string;
  fullName: string;
  phoneNumber: string;
  specificAddress?: string;


  provinceId?: string;
  districtId?: string;
  wardCode?: string;

  province?: string;
  district?: string;
  ward?: string;
  address?: string;
  isDefault?: boolean;
  type?: "delivery" | "pickup";
}

export interface CreateAddressRequest {
  fullName: string;
  specificAddress: string;
  phoneNumber: string;
  provinceId?: string;
  wardCode?: string;
  districtId?: string;
  isDefault?: boolean;
  type?: "delivery" | "pickup";
}

export interface AddressResponse {
  status?: string;
  data?: Address[];
}


export interface GHNResponse<T> {
  code: number;
  message: string;
  data: T;
}


export interface Province {
  ProvinceID: number;
  ProvinceName: string;
  CountryID: number;
  Code: string;
  NameExtension: string[];
  IsEnable: number;
  RegionID: number;
  RegionCPN: number;
  UpdatedBy: number;
  CreatedAt: string;
  UpdatedAt: string;
  CanUpdateCOD: boolean;
  Status: number;
  UpdatedEmployee: number;
  UpdatedSource: string;
  UpdatedDate: string;
}


export interface District {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
  Code?: string;
  Type?: number;
  SupportType?: number;
  NameExtension?: string[];
  IsEnable?: number;
  UpdatedBy?: number;
  CreatedAt?: string;
  UpdatedAt?: string;
  CanUpdateCOD?: boolean;
  Status?: number;
}


export interface Ward {
  WardCode: string;
  DistrictID: number;
  WardName: string;
  NameExtension?: string[];
  IsEnable?: number;
  CanUpdateCOD?: boolean;
  UpdatedBy?: number;
  CreatedAt?: string;
  UpdatedAt?: string;
  SupportType?: number;
  PickType?: number;
  DeliverType?: number;
  Status?: number;
}


export interface CalculateShippingFeeRequest {
  from_district_id: number;
  from_ward_code?: string;
  to_district_id: number;
  to_ward_code: string;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  insurance_value?: number;
  service_type_id?: number;
  coupon?: string;
}


export interface ShippingFeeData {
  total: number;
  service_fee: number;
  insurance_fee: number;
  pick_station_fee: number;
  coupon_value: number;
  r2s_fee: number;
  return_again: number;
  document_return: number;
  double_check: number;
  cod_fee: number;
  pick_remote_areas_fee: number;
  deliver_remote_areas_fee: number;
  cod_failed_fee: number;
}


export interface CalculateExpectedDeliveryTimeRequest {
  from_district_id: number;
  from_ward_code: string;
  to_district_id: number;
  to_ward_code: string;
  service_id: number;
}


export interface ExpectedDeliveryTimeData {
  leadtime: number;
  order_date: number;
}


export interface GHNAvailableService {
  service_id: number;
  short_name: string;
  service_type_id: number;
  service_name?: string;
}


export interface ShippingInfo {
  fee: number;
  estimatedDays: number;
  estimatedDate: string;
}


export interface ShippingServiceOption {
  service_id: number;
  service_type_id: number;
  short_name: string;
  service_name?: string;
  fee: number;

  shippingFee?: number;
  insuranceFee?: number;
  codFee?: number;
  totalShippingFee?: number;

  expectedDeliveryTime?: string;
  estimatedDays?: number;
  estimatedDate?: string;
}
