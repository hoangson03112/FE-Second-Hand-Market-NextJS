export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type DashboardSalesDataPoint = {

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
  kpis: {
    totalRevenue: number;
    totalOrders: number;
    completionRate: number;
    totalRefundAmount: number;
    newUsers: number;
    newSellers: number;
  };
  ordersByStatus: {
    pending: number;
    confirmed: number;
    shipping: number;
    delivered: number;
    refund: number;
    refunded: number;
    cancelled: number;
    totalRevenue: number;
  };
  refundsByStatus: {
    pending: number;
    approved: number;
    returned: number;
    processing: number;
    completed: number;
    failed: number;
    totalRefundAmount: number;
  };
  risk: {
    bannedAccounts: number;
    bannedSellers: number;
    pendingReports: number;
  };
}

export type AdminUserRef = {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  avatar?: { url: string };
};

export type AdminOrderSellerRef = {
  _id: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  avatar?: { url: string };
  bankInfo?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  seller?: {
    businessAddress?: string;
    verificationStatus?: string;
  } | null;
};

export type AdminProductRef = {
  name: string;
  price: number;
  images?: Array<Record<string, unknown>>;
  avatar?: { url: string };
  categoryId?: { name: string };
  subcategoryId?: { name: string };
};

export type AdminOrderRefund = {
  _id: string;
  reason: string;
  description: string;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "return_shipping"
    | "returning"
    | "returned"
    | "bank_info_required"
    | "processing"
    | "completed"
    | "failed"
    | "disputed"
    | "cancelled";
  evidence?: {
    images?: Array<{
      url: string;
      publicId?: string;
      originalName?: string;
      type?: string;
      size?: number;
    }>;
    videos?: Array<{
      url: string;
      publicId?: string;
      originalName?: string;
      type?: string;
      size?: number;
    }>;
  };
  refundAmount: number;
  refundMethod?: string;
  sellerResponse?: {
    decision: "approved" | "rejected";
    comment?: string;
    respondedAt: string;
  };
  adminIntervention?: {
    decision: "refund" | "reject";
    comment?: string;
    handledAt: string;
  };
  escalatedToAdmin?: boolean;
  escalatedAt?: string;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export interface AdminOrder {
  _id: string;
  buyerId: AdminUserRef;
  sellerId: AdminOrderSellerRef | null;
  sellerBankInfo?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  } | null;
  products: Array<{
    productId: AdminProductRef | string | null;
    quantity: number;
    price: number;
  }>;
  productAmount?: number;
  shippingFee?: number;
  platformFee?: number;
  totalAmount: number;
  shippingAddress?: Record<string, unknown> | string | null;
  shippingMethod?: string;
  paymentMethod?: string;
  paymentStatus?: "pending" | "paid" | "refunded";
  paymentVerifiedAt?: string;
  payoutStatus?: "pending" | "paid";
  payoutAt?: string;
  status: string;
  statusPayment?: boolean;
  cancelReason?: string;
  ghnOrderCode?: string;
  ghnReturnOrderCode?: string;
  ghnStatus?: string;
  ghnTrackingUrl?: string;
  ghnReturnTrackingUrl?: string;
  transType?: string;
  expectedDeliveryTime?: string;
  statusHistory?: Array<{ status: string; updatedAt: string }>;
  confirmedAt?: string;
  pickedUpAt?: string;
  shippingAt?: string;
  outForDeliveryAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  deliveryFailedAt?: string;
  returnWindowExpiresAt?: string;
  completedAt?: string;
  refundRequestId?: AdminOrderRefund | null;
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
    status?: "active" | "inactive" | "banned";
    role?: string;
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
  reporterId?: { fullName: string; email: string; phoneNumber?: string } | null;
  reporterEmail?: string;
  reporterFullName?: string;
  status?: string;
  reason?: string;
  description?: string;
  images?: { url: string }[];
  createdAt: string;
}

export interface AdminAuditLog {
  _id: string;
  adminId?: {
    _id: string;
    fullName?: string;
    email?: string;
  } | null;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
  ip?: string | null;
  userAgent?: string | null;
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
  startDate?: string;
  endDate?: string;
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

