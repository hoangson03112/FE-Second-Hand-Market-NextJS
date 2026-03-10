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
import { SectionTitle, InfoRow } from "./DrawerHelpers";
import { CONDITION_LABEL, STATUS_BADGE } from "../constants";

export { CONDITION_LABEL, STATUS_BADGE };

type Props = {
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
}: Props) {
  const ai = product.aiModerationResult;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl flex flex-col bg-card border-l border-border shadow-2xl">
        <ProductDrawerHeader product={product} onClose={onClose} />

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-6">

            {/* ① AI Moderation */}
            {ai && (
              <AIModerationSection ai={ai} estimatedWeight={product.estimatedWeight} />
            )}

            {/* ② Description */}
            <section>
              <SectionTitle icon={IconListDetails} title="Mô tả sản phẩm" />
              <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {product.description?.trim() || <em className="text-xs">Không có mô tả</em>}
                </p>
              </div>
            </section>

            {/* ③ Attributes */}
            {(product.attributes?.length ?? 0) > 0 && (
              <section>
                <SectionTitle icon={IconTag} title="Thuộc tính" count={product.attributes.length} />
                <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3 divide-y divide-border/40">
                  {product.attributes.map((attr) => (
                    <InfoRow key={attr._id} label={attr.key} value={attr.value} />
                  ))}
                </div>
              </section>
            )}

            {/* ④ Images */}
            {(product.images?.length ?? 0) > 0 && (
              <section>
                <SectionTitle icon={IconPhoto} title="Ảnh sản phẩm" count={product.images.length} />
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, i) => (
                    <a
                      key={img.publicId ?? i}
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative rounded-xl border border-border overflow-hidden bg-muted ${
                        i === 0 ? "col-span-2 row-span-2" : ""
                      } aspect-square`}
                    >
                      <Image
                        src={img.url}
                        alt={img.originalName || `Ảnh ${i + 1}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                      <span className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-black/50 text-white text-[10px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* ⑤ Pickup address */}
            {product.address && (
              <section>
                <SectionTitle icon={IconMapPin} title="Địa chỉ lấy hàng" />
                <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
                  <AddressDetail
                    address={product.address}
                    sellerName={product.seller?.account?.fullName ?? product.seller?.fullName}
                  />
                </div>
              </section>
            )}

            {/* ⑥ Seller info */}
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