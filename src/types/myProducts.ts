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

/**
 * Các tab trên màn "Tin đăng của tôi". Server nhận đúng những key này và tự
 * map sang status thật (approved gộp cả active, under_review gộp cả
 * review_requested).
 */
export type MyListingTabKey =
  | "all"
  | "pending"
  | "approved"
  | "under_review"
  | "rejected"
  | "sold";

/** Số tin đăng theo từng tab, đếm trên toàn bộ tin của seller. */
export type MyListingStatusCounts = Record<MyListingTabKey, number>;

export type MyListingsParams = {
  page?: number;
  limit?: number;
  status?: MyListingTabKey;
};

export type MyListingsResponse = {
  success: boolean;
  data: MyListingProduct[];
  message?: string;
  pagination?: PaginationMeta;
  statusCounts?: MyListingStatusCounts;
};

