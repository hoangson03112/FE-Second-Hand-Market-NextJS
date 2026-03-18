import type { ProductStatusFilter } from "./product";

export type MyProductStatus = ProductStatusFilter;
export type { ProductStatusFilter };

/** Ưu đãi cá nhân đính kèm sản phẩm (từ seller) */
export type PersonalDiscountItem = {
  _id: string;
  price: number;
  endDate: string;
  buyerId?: { _id: string; fullName?: string };
};

/** Minimal shape for `/products/my/listings` response items */
export type MyListingProduct = {
  _id: string;
  name: string;
  slug?: string;
  price: number;
  stock: number;
  status: MyProductStatus;
  avatar?: { url?: string | null } | null;
  categoryId?: { _id: string; name: string };
  subcategoryId?: { _id: string; name: string };
  createdAt?: string;
  personalDiscounts?: PersonalDiscountItem[];
  aiModerationResult?: {
    rejectionReason?: string | null;
    humanReviewRequested?: boolean;
  };
};

export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type MyListingsResponse = {
  success: boolean;
  data: MyListingProduct[];
  message?: string;
  pagination?: PaginationMeta;
};

