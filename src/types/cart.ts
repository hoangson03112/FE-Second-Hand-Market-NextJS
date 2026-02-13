export interface CartProductImage {
  url: string;
  publicId?: string;
  originalName?: string;
  type?: string;
  size?: number;
  uploadedAt?: string;
}

export interface CartProductSeller {
  _id: string;
  fullName: string;
  avatar: string | null;
}

export interface CartProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  avatar: CartProductImage | null;
  stock: number;
  sellerId: CartProductSeller;
}

export interface CartItem {
  productId: CartProduct;
  quantity: number;
}

export interface GetCartResponse {
  status: string;
  cart: CartItem[];
}

export interface PurchaseNowRequest {
  productId: string;
  quantity: number;
}

export interface PurchaseNowResponse {
  status: string;
  message: string;
  order: {
    _id: string;
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
    [key: string]: unknown;
  };
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface AddToCartResponse {
  status: string;
  message: string;
}
