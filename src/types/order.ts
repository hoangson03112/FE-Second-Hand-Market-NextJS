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
  products: Array<{
    productId: {
      _id: string;
      name: string;
      price: number;
      avatar: string;
      [key: string]: unknown;
    };
    quantity: number;
  }>;
  totalAmount: number;
  shippingAddress: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    address: string;
    [key: string]: unknown;
  };
  shippingMethod: string;
  paymentMethod: string;
  status: string;
  statusPayment: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface SellerBankInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  amount: number;
  content: string;
  orderId: string;
}

