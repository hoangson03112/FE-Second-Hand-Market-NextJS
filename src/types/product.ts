import { ICategory, ISubCategory } from "./category";

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number; // Giá gốc (nếu có personal discount)
  hasPersonalDiscount?: boolean; // Flag để biết có discount không
  personalDiscountId?: string; // ID của discount (để mark as used khi order)
  avatar: IImage;
  stock: number;
  description: string;
  category: ICategory;
  subcategory: ISubCategory;
  attributes: IAttribute[];
  images: IImage[];
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "under_review"
    | "review_requested"
    | "active"
    | "inactive"
    | "sold";
  condition?: string;
  estimatedWeight?: IEstimatedWeight;
  createdAt: string;
  updatedAt?: string;
  seller: ISeller;
  location?: string;
  views?: number;
  likes?: number;
  avgRating?: number;
  totalReviews?: number;
  address?: {
    _id?: string;
    provinceId?: string;
    districtId?: string;
    wardCode?: string;
    specificAddress?: string;
    fullName?: string;
    phoneNumber?: string;
  } | null;
  aiModerationResult?: {
    approved?: boolean | null;
    confidence?: number;
    reasons?: string[];
    reviewedAt?: string | null;
    processingStarted?: string | null;
    humanReviewRequested?: boolean;
    humanReviewRequestedAt?: string | null;
    humanReviewRequestedBy?: string;
    bypassAI?: boolean;
    rejectionReason?: string | null;
    rejectedBy?: string;
    rejectedAt?: string | null;
  };
}

export interface IAttribute {
  _id: string;
  key: string;
  value: string;
}
export interface IEstimatedWeight {
  value: number;
  confidence: number;
}
export interface IAccount {
  _id: string;
  fullName: string;
}
export interface ISeller {
  _id: string;
  fullName?: string;
  avatar?: string | null;
  role?: string;
  province?: string;
  from_province_id?: string | null;
  from_district_id?: string;
  from_ward_code?: string;
  createdAt?: string;
  businessAddress?: string;
  phoneNumber?: string;
  totalReviews?: number;
  avgRating?: number;
  totalProducts?: number;
  stats?: {
    avgRating?: number;
    totalReviews?: number;
    totalProductsActive?: number;
  };
  accountId?: string;
  account?: {
    _id: string;
    fullName?: string;
    username?: string;
    email?: string;
    phoneNumber?: string;
    role?: string;
  };
}

export interface IImage {
  url: string;
  publicId: string;
  originalName: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface IProductFilters {
  categorySlug?: string;
  subCategorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  sortBy?: "newest" | "oldest" | "price_low" | "price_high" | "popular";
  search?: string;
  page?: number;
  limit?: number;
}

export interface IProductListResponse {
  success: boolean;
  data: IProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

/** Admin: danh sách sản phẩm (GET /products với verifyAdmin) */
export type ProductStatusFilter =
  | "pending"
  | "approved"
  | "rejected"
  | "under_review"
  | "review_requested"
  | "active"
  | "inactive"
  | "sold";

export interface AdminProductListParams {
  status?: ProductStatusFilter;
  page?: number;
  limit?: number;
}

export interface AdminProductListResponse {
  success: boolean;
  data: IProduct[];
  total: number;
  page: number;
  limit: number;
}
