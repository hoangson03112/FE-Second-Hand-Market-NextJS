import { ICategory, ISubCategory } from "./category";

export interface IProduct {
  _id: string;
  name: string;
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
  confidence: number; // 0 → 1
}
export interface IAccount {
  _id: string;
  fullName: string;
}
export interface ISeller {
  _id: string;
  accountId: string;
  businessAddress: string;
  province: string;
  district: string;
  ward: string;
  account: IAccount;
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
  category?: string;
  subCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  sortBy?: "newest" | "oldest" | "price_low" | "price_high" | "popular";
  search?: string;
  page?: number;
  limit?: number;
}
