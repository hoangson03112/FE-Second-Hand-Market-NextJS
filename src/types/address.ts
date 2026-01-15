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
