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
  provinceId?: string;
  districtId?: string;
  wardCode?: string;
  specificAddress?: string;
  fullName?: string;
  phoneNumber?: string;
  addressId?: string;
  deliveryOptions: { localPickup?: boolean; codShipping?: boolean };
}

export interface UpdateProductPayload extends CreateProductPayload {
  // Để giữ lại ảnh/video cũ khi update
  existingImages?: Array<{
    url: string;
    publicId: string;
    originalName?: string;
    type?: string;
    size?: number;
  }>;
  existingVideoUrl?: string;
  removeVideo?: boolean;
}
