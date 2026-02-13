"use client";

import Product from "./Product";

export default Product;
export { useProduct, useProductActions } from "./hooks";
export {
  ProductGalleryNew,
  ProductHeader,
  SellerInfoCard,
  ProductPrice,
  ProductSpecifications,
  ProductDescription,
  QuantitySelector,
  ProductActionButtons,
  ProductGuarantees,
} from "./components";
export type { ProductProps } from "./Product.types";
