export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type DashboardSalesDataPoint = {
  /** Backend shape may vary by chart implementation */
  day?: string;
  date?: string;
  revenue?: number;
  value?: number;
};

export type DashboardCategoryDataPoint = {
  _id: string;
  value: number;
};

export type DashboardUserActivityDataPoint = {
  day: string;
  visits: number;
  listings: number;
  purchases: number;
};

export interface DashboardStats {
  totalRevenue: number;
  soldProducts: number;
  newUsers: number;
  completionRate: number;
  salesData: DashboardSalesDataPoint[];
  categoryData: DashboardCategoryDataPoint[];
  userActivityData: DashboardUserActivityDataPoint[];
}

export type AdminUserRef = {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
};

export type AdminProductRef = {
  name: string;
  price: number;
  images?: Array<Record<string, unknown>>;
  avatar?: { url: string };
  categoryId?: { name: string };
  subcategoryId?: { name: string };
};

export interface AdminOrder {
  _id: string;
  buyerId: AdminUserRef;
  sellerId: string | Record<string, unknown> | null;
  products: Array<{
    productId: AdminProductRef | string | null;
    quantity: number;
  }>;
  totalAmount: number;
  shippingAddress?: Record<string, unknown> | string | null;
  status: string;
  statusPayment?: boolean;
  ghnOrderCode?: string;
  ghnReturnOrderCode?: string;
  refundBankInfo?: {
    buyerBankName?: string;
    buyerAccountNumber?: string;
    buyerAccountHolder?: string;
    submittedAt?: string;
    type?: string;
  } | null;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminAccount {
  _id: string;
  fullName?: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  status?: "active" | "inactive" | "banned";
  createdAt?: string;
  avatar?: { url: string };
}

export type SellerVerificationStatus = "pending" | "approved" | "rejected" | "banned";

export interface AdminSeller {
  _id: string;
  accountId: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    createdAt?: string;
    avatar?: { url: string };
  };
  verificationStatus: SellerVerificationStatus;
  businessAddress?: string;
  province?: string;
  district?: string;
  ward?: string;
  idCardFront?: { url: string; publicId?: string; originalName?: string; size?: number; uploadedAt?: string };
  idCardBack?: { url: string; publicId?: string; originalName?: string; size?: number; uploadedAt?: string };
  bankInfo?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    bankBin?: string;
  };
  stats?: {
    totalProductsActive: number;
    totalSold: number;
    avgRating: number;
    totalReviews: number;
  };
  approvedBy?: { _id: string; fullName: string; email: string };
  rejectedReason?: string;
  approvedDate?: string;
  agreeTerms?: boolean;
  agreePolicy?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminReport {
  _id: string;
  type: string;
  targetId?: string | Record<string, unknown>;
  reporterId?: { fullName: string; email: string; phoneNumber?: string };
  status?: string;
  reason?: string;
  description?: string;
  images?: { url: string }[];
  createdAt: string;
}

export interface AdminCategory {
  _id: string;
  name: string;
  slug: string;
  status?: "active" | "inactive";
  subCategories: {
    _id: string;
    name: string;
    slug: string;
    status?: "active" | "inactive";
  }[];
}

export type GetAdminSellersParams = {
  status?: SellerVerificationStatus;
  page?: number;
  limit?: number;
};

export type GetAdminSellersResponse = {
  success: boolean;
  data: AdminSeller[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  statistics: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    banned?: number;
  };
};

