export interface PickupAddressPayload {
  provinceId: string;
  districtId: string;
  wardCode: string;
  businessAddress: string;
}

export interface CreateProductPayload {
  name: string;
  price: number;
  stock: number;
  description?: string;
  categoryId: string;
  subcategoryId: string;
  condition?: "new" | "like_new" | "good" | "fair" | "poor";
  attributes?: Array<{ key: string; value: string | number }>;
  images?: File[];
  video?: File | null;
  pickupAddress?: PickupAddressPayload;
}

export type UpdateProductPayload = CreateProductPayload; // pickupAddress optional

