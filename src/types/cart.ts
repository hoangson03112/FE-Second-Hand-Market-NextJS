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
