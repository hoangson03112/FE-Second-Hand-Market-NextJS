import type { ProductStatusFilter } from "./product";

export type MyProductStatus = ProductStatusFilter;
export type { ProductStatusFilter };

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
  aiModerationResult?: {
    rejectionReason?: string | null;
    humanReviewRequested?: boolean;
  };
};

export type MyListingsResponse = {
  success: boolean;
  data: MyListingProduct[];
  message?: string;
};

