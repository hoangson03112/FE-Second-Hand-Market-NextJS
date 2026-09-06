"use client";

import {
  IconListDetails,
  IconMapPin,
  IconPhoto,
  IconTag,
} from "@tabler/icons-react";
import Image from "next/image";
import type { IProduct } from "@/types/product";
import { AddressDetail } from "./AddressDetail";
import { AIModerationSection } from "./AIModerationSection";
import { SellerSection } from "./SellerSection";
import { ProductDrawerHeader } from "./ProductDrawerHeader";
import { ProductDrawerFooter } from "./ProductDrawerFooter";
import { SectionTitle } from "./SectionTitle";
import { InfoRow } from "./InfoRow";
import { CONDITION_LABEL, STATUS_BADGE } from "../constants";

export { CONDITION_LABEL, STATUS_BADGE };

type ProductDetailDrawerProps = {
  product: IProduct;
  onClose: () => void;
  onApprove: (p: IProduct) => void;
  onReject: (p: IProduct) => void;
  isUpdating: boolean;
};

export function ProductDetailDrawer({
  product,
  onClose,
  onApprove,
  onReject,
  isUpdating,
}: ProductDetailDrawerProps) {
  const ai = product.aiModerationResult;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-luxury-ink/60 backdrop-blur-xs animate-in fade-in-0 duration-200"
        onClick={onClose}
      />

      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl flex flex-col bg-luxury-ivory border-l border-luxury-ink/15 shadow-xs animate-in slide-in-from-right duration-300">
        <ProductDrawerHeader product={product} onClose={onClose} />

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {ai && (
              <AIModerationSection
                ai={ai}
                estimatedWeight={product.estimatedWeight}
              />
            )}

            <section>
              <SectionTitle icon={IconListDetails} title="Mô tả sản phẩm" />
              <div className="rounded-[2px] border border-luxury-ink/10 bg-white px-4 py-3 shadow-xs">
                <p className="text-xs text-neutral-600 whitespace-pre-wrap leading-relaxed">
                  {product.description?.trim() || (
                    <em className="text-2xs text-neutral-400">Chưa có mô tả chi tiết</em>
                  )}
                </p>
              </div>
            </section>

            {(product.attributes?.length ?? 0) > 0 && (
              <section>
                <SectionTitle
                  icon={IconTag}
                  title="Thông số & Thuộc tính"
                  count={product.attributes.length}
                />
                <div className="rounded-[2px] border border-luxury-ink/10 bg-white px-4 py-3 divide-y divide-luxury-ink/6 shadow-xs">
                  {product.attributes.map((attr) => (
                    <InfoRow
                      key={attr._id}
                      label={attr.key}
                      value={attr.value}
                    />
                  ))}
                </div>
              </section>
            )}

            {(product.images?.length ?? 0) > 0 && (
              <section>
                <SectionTitle
                  icon={IconPhoto}
                  title="Thư viện hình ảnh"
                  count={product.images.length}
                />
                <div className="grid grid-cols-4 gap-2.5">
                  {product.images.map((img, i) => (
                    <a
                      key={img.publicId ?? i}
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative rounded-[2px] border border-luxury-ink/10 overflow-hidden bg-taupe-50 ${
                        i === 0 ? "col-span-2 row-span-2" : ""
                      } aspect-square`}
                    >
                      <Image
                        src={img.url}
                        alt={img.originalName || `Ảnh ${i + 1}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105 duration-300"
                      />
                      <div className="absolute inset-0 bg-luxury-ink/0 group-hover:bg-luxury-ink/15 transition-colors" />
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-[1px] bg-luxury-ink/70 text-white text-2xs font-bold font-mono">
                        {i + 1}
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {product.address && (
              <section>
                <SectionTitle icon={IconMapPin} title="Địa chỉ kho / Lấy hàng" />
                <div className="rounded-[2px] border border-luxury-ink/10 bg-white px-4 py-3 shadow-xs">
                  <AddressDetail
                    address={product.address}
                    sellerName={
                      product.seller?.account?.fullName ??
                      product.seller?.fullName
                    }
                  />
                </div>
              </section>
            )}

            {product.seller && (
              <SellerSection
                seller={product.seller}
                addressPhone={product.address?.phoneNumber}
              />
            )}
          </div>
        </div>

        <ProductDrawerFooter
          product={product}
          onClose={onClose}
          onApprove={onApprove}
          onReject={onReject}
          isUpdating={isUpdating}
        />
      </aside>
    </>
  );
}
