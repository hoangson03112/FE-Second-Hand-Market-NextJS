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
  /** Địa chỉ lấy hàng – Address ref được populate từ backend */
  address?: {
    _id?: string;
    provinceId?: string;
    districtId?: string;
    wardCode?: string;
    specificAddress?: string;
    fullName?: string;
    phoneNumber?: string;
  } | null;

  /** Hình thức giao hàng */
  deliveryOptions?: {
    localPickup?: boolean;
    codShipping?: boolean;
  } | null;

  /**
   * Backend có thể trả thêm field `video` khi lấy chi tiết sản phẩm.
   * Không dùng mọi nơi nên tách riêng type này cho màn hình Sell/Edit.
   */
  video?: {
    url?: string | null;
  } | null;

  /**
   * Một số response có thêm `categoryId` / `subcategoryId`
   * (string hoặc object chỉ chứa `_id`) ngoài field `category` / `subcategory`.
   * Dùng union để không cần `any`.
   */
  categoryId?: string | { _id: string };
  subcategoryId?: string | { _id: string };
}

