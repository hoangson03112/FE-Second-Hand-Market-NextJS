import type { IProduct } from "./product";

export type ProductAttribute = {
  key: string;
  value: string;
};

export type SellFormValues = {
  name: string;
  price: string;
  stock: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
  condition: "new" | "like_new" | "good" | "fair" | "poor";
  images: File[];
  video: File | null;
  attributes: ProductAttribute[];
};

export type DeliveryOptions = {
  localPickup: boolean;
  codShipping: boolean;
};

/** Địa chỉ lấy hàng (cho user chưa verify seller) */
export type PickupFormValues = {
  provinceId: string;
  districtId: string;
  wardCode: string;
  specificAddress: string;
  phoneNumber: string;
};

export interface IProductWithMediaAndIds extends IProduct {
  address?: {
    _id?: string;
    provinceId?: string;
    districtId?: string;
    wardCode?: string;
    specificAddress?: string;
    fullName?: string;
    phoneNumber?: string;
  } | null;

  video?: {
    url?: string | null;
  } | null;

  categoryId?: string | { _id: string };
  subcategoryId?: string | { _id: string };
}
