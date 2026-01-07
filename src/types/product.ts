import { ICategory, ISubCategory } from "./category";

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  avatar: IImage;
  stock: number;
  description: string;
  category: ICategory;
  subcategory: ISubCategory;
  attributes: IAttribute[];
  images: IImage[];
  status: "pending" | "approved" | "rejected";
  condition?: string; // "new" | "like_new" | "good" | "fair" | "poor"
  estimatedWeight?: IEstimatedWeight;
  createdAt: string;
  updatedAt?: string;
  seller: ISeller;
  location?: string;
  views?: number;
  likes?: number;
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
  fullName: string;
  avatar: string | null;
  province: string;
  from_district_id: string;
  from_ward_code: string;
  createdAt: string;
  businessAddress: string;
  phoneNumber: string;
  totalReviews: number;
  avgRating: number;
  totalProducts:number
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
  totalPages: number;
}
