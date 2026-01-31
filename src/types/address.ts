export interface Address {
  _id: string;
  fullName: string;
  phoneNumber: string;
  specificAddress?: string;
  
  // Raw IDs from backend
  provinceId?: string;
  districtId?: string;
  wardCode?: string;
  
  province?: string;
  district?: string;
  ward?: string;
  address?: string; 
  isDefault?: boolean;
}

// ========== GHN API Types ==========

/**
 * GHN API Response Wrapper
 */
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

/**
 * GHN District (Quận/Huyện)
 */
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

/**
 * GHN Ward (Phường/Xã)
 */
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

// ========== GHN SHIPPING FEE & TIME ==========

/**
 * GHN Calculate Shipping Fee Request
 */
export interface CalculateShippingFeeRequest {
  from_district_id: number;
  from_ward_code?: string;
  to_district_id: number;
  to_ward_code: string;
  weight: number; // grams
  length?: number; // cm
  width?: number; // cm
  height?: number; // cm
  insurance_value?: number; // VND
  service_type_id?: number; // 2 = Express, 5 = Standard
  coupon?: string;
}

/**
 * GHN Shipping Fee Response
 */
export interface ShippingFeeData {
  total: number; // Total shipping fee
  service_fee: number; // Base service fee
  insurance_fee: number; // Insurance fee
  pick_station_fee: number; // Pick station fee
  coupon_value: number; // Discount from coupon
  r2s_fee: number; // Return to sender fee
  return_again: number; // Return again fee
  document_return: number; // Document return fee
  double_check: number; // Double check fee
  cod_fee: number; // COD fee
  pick_remote_areas_fee: number; // Remote area pickup fee
  deliver_remote_areas_fee: number; // Remote area delivery fee
  cod_failed_fee: number; // COD failed fee
}

/**
 * GHN Expected Delivery Time Request
 */
export interface CalculateExpectedDeliveryTimeRequest {
  from_district_id: number;
  from_ward_code: string; // Required: Ward Code pick up parcel
  to_district_id: number;
  to_ward_code: string; // Required: Ward Code drop off parcels
  service_id: number;
}

/**
 * GHN Expected Delivery Time Response
 */
export interface ExpectedDeliveryTimeData {
  leadtime: number; // Estimated delivery time in seconds
  order_date: number; // Order timestamp
}

/**
 * Combined Shipping Info (for frontend use)
 */
export interface ShippingInfo {
  fee: number;
  estimatedDays: number;
  estimatedDate: string;
}

/**
 * Shipping Service Option with pricing (for user selection)
 */
export interface ShippingServiceOption {
  service_id: number;
  service_type_id: number;
  short_name: string; // e.g., "Express", "Standard"
  service_name?: string; // Full name from GHN
  fee: number;
  // Fee breakdown from GHN (optional but useful for order creation)
  shippingFee?: number; // base service fee
  insuranceFee?: number;
  codFee?: number;
  totalShippingFee?: number; // usually equals fee
  // Raw expected delivery time (ISO) for saving to DB
  expectedDeliveryTime?: string;
  estimatedDays: number;
  estimatedDate: string;
}
