export type OrderStatus =
  | "pending"
  | "confirmed"
  | "picked_up"
  | "shipping"
  | "out_for_delivery"
  | "delivered"
  | "completed"
  | "cancelled"
  | "delivery_failed"
  | "returning"
  | "return_shipping"
  | "returned"
  | "refund_requested"
  | "refund_approved"
  | "refunded";

export interface CreateOrderRequest {
  products: Array<{
    productId: string;
    quantity: number;
  }>;
  totalAmount: number;
  shippingAddress: string; // Address ID
  shippingMethod: string;
  sellerId: string;
  paymentMethod: string;
  // Optional extra info (Order model already supports these)
  shippingFee?: number;
  insuranceFee?: number;
  codFee?: number;
  totalShippingFee?: number;
  expectedDeliveryTime?: string; // ISO string
}

export interface CreateOrderResponse {
  order: {
    _id: string;
    buyerId: string;
    sellerId: string;
    products: Array<{
      productId: string;
      quantity: number;
    }>;
    totalAmount: number;
    shippingAddress: string;
    shippingMethod: string;
    paymentMethod: string;
    status: string;
    statusPayment: boolean;
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown;
  };
}

export interface Order {
  _id: string;
  buyerId: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  sellerId: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  ghnOrderCode?: string;
  ghnReturnOrderCode?: string;
  ghnReturnTrackingUrl?: string;
  products: Array<{
    productId: {
      _id: string;
      name: string;
      price: number;
      avatar: {
        url: string;
        alt?: string;
      } | string;
      images?: Array<{
        url: string;
        alt?: string;
      }>;
      condition?: string;
      stock?: number;
    };
    quantity: number;
    price: number;
  }>;
  productAmount?: number;
  shippingFee?: number;
  insuranceFee?: number;
  codFee?: number;
  totalShippingFee?: number;
  totalAmount: number;
  shippingAddress: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    province?: string;
    district?: string;
    ward?: string;
    specificAddress: string;
  };
  shippingMethod: string;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "refunded";
  payoutStatus: "pending" | "paid";
  status: OrderStatus;
  statusPayment: boolean;
  expectedDeliveryTime?: string;
  refundReason?: string;
  cancelReason?: string;
  refundRequestedAt?: string;
  refundApprovedAt?: string;
  refundedAt?: string;
  refundRequestId?: {
    _id: string;
    reason: string;
    description: string;
    status: "pending" | "approved" | "rejected" | "completed" | "disputed" | "cancelled";
    evidence?: {
      images?: Array<{ url: string; publicId?: string; originalName?: string; type?: string; size?: number }>;
      videos?: Array<{ url: string; publicId?: string; originalName?: string; type?: string; size?: number }>;
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
  refundBankInfo?: {
    buyerBankName: string;
    buyerAccountNumber: string;
    buyerAccountHolder: string;
    submittedAt?: string;
  } | null;
  returnWindowExpiresAt?: string;
  buyerConfirmedAt?: string;
  sellerReceivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RefundRequest {
  _id: string;
  orderId: {
    _id: string;
    totalAmount: number;
    createdAt: string;
    products: Order["products"];
    buyerId: Order["buyerId"];
    sellerId: Order["sellerId"];
  };
  buyerId: Order["buyerId"];
  sellerId: Order["sellerId"];
  reason: string;
  description?: string;
  refundAmount: number;
  status: "pending" | "approved" | "rejected" | "disputed" | "completed";
  adminNote?: string;
  sellerResponse?: {
    decision: string;
    comment?: string;
    respondedAt: string;
  };
  adminIntervention?: {
    decision: string;
    comment?: string;
    handledBy: string;
    handledAt: string;
  };
  escalatedToAdmin?: boolean;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SellerPayout {
  _id: string;
  sellerId: { _id: string; fullName?: string; email?: string; businessName?: string };
  buyerId?: { _id: string; fullName: string; email: string };
  productAmount: number;
  platformFee: number;
  totalAmount: number;
  paymentMethod: string;
  payoutStatus: "pending" | "paid";
  completedAt?: string;
  payoutAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GHNTrackingEvent {
  status: string;
  status_text: string;
  time: string;
  location?: string;
  note?: string;
}

export interface GHNTrackingData {
  order_code: string;
  status: string;
  status_text: string;
  updated_date: string;
  log?: GHNTrackingEvent[];
  to_name?: string;
  to_address?: string;
  to_phone?: string;
  estimate_deliver_time?: string;
}

export interface SellerBankInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  amount: number;
  content: string;
  orderId: string;
}

