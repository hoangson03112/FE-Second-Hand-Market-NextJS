"use client";

import Image from "next/image";
import Link from "next/link";
import { IconX, IconExternalLink, IconLoader2, IconPackage, IconMapPin, IconTag, IconPhoto, IconShoppingBag, IconCircleCheck } from "@tabler/icons-react";
import type { IProduct } from "@/types/product";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import { AddressDetail } from "./components/AddressDetail";
import { AIModerationSection } from "./components/AIModerationSection";
import { SellerSection } from "./components/SellerSection";
import { CONDITION_LABEL, STATUS_BADGE } from "./constants";

export { CONDITION_LABEL, STATUS_BADGE };

/* ─────────────────────────────── helper components ── */

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="p-1.5 rounded-md bg-primary/10">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
        {title}
      </h3>
    </div>
  );
}

/* ─────────────────────────────── main drawer ── */

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
  const statusInfo = STATUS_BADGE[product.status] ?? {
    label: product.status,
    dot: "bg-muted-foreground",
    chip: "bg-muted text-muted-foreground",
  };
  const canModerate =
    product.status === "pending" || product.status === "under_review";
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
        {/* ── Header ── */}
        <header className="shrink-0 border-b border-border">
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.chip}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                {statusInfo.label}
              </span>
              {ai?.humanReviewRequested && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                  👤 Yêu cầu duyệt lại
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Link
                href={`/products/${product._id}/${product.slug ?? ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Xem SP <IconExternalLink className="w-3 h-3" />
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product hero */}
          <div className="px-5 pb-5">
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-2xl border border-border bg-muted overflow-hidden shrink-0 shadow-md">
                {product.avatar?.url ? (
                  <Image
                    src={product.avatar.url}
                    alt={product.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <IconPackage className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <h2 className="text-base font-bold text-foreground leading-snug line-clamp-2 mb-2">
                  {product.name}
                </h2>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <span className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-sm font-bold leading-none">
                    {formatPrice(product.price)}
                  </span>
                  {product.condition && (
                    <span className="px-2 py-0.5 rounded-md border border-border bg-muted text-xs text-muted-foreground font-medium">
                      {CONDITION_LABEL[product.condition] ?? product.condition}
                    </span>
                  )}
                  {product.category?.name && (
                    <span className="text-xs text-muted-foreground">
                      {product.category.name}{product.subcategory?.name ? ` › ${product.subcategory.name}` : ""}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground font-medium">
                    <IconPackage className="w-3 h-3" /> {product.stock} tồn
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 text-xs font-medium">
                    <IconCircleCheck className="w-3 h-3" /> {product.views ?? 0} lượt xem
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground/60 ml-auto">
                    #{product._id.slice(-8)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-6">

            {/* AI Moderation */}
            {ai && (
              <AIModerationSection ai={ai} estimatedWeight={product.estimatedWeight} />
            )}

            {/* Images */}
            {(product.images?.length ?? 0) > 0 && (
              <section>
                <SectionTitle icon={IconPhoto} title={`Ảnh sản phẩm (${product.images.length})`} />
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
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      <span className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-black/50 text-white text-[10px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Description */}
            <section>
              <SectionTitle icon={IconTag} title="Mô tả" />
              <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed line-clamp-6">
                  {product.description?.trim() || "Không có mô tả"}
                </p>
              </div>
            </section>

            {/* Attributes */}
            {(product.attributes?.length ?? 0) > 0 && (
              <section>
                <SectionTitle icon={IconTag} title="Thuộc tính" />
                <div className="flex flex-wrap gap-2">
                  {product.attributes.map((attr) => (
                    <span
                      key={attr._id}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-foreground"
                    >
                      <span className="text-muted-foreground">{attr.key}:</span>
                      <span className="font-medium">{attr.value}</span>
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Pickup address */}
            {product.address && (
              <section>
                <SectionTitle icon={IconMapPin} title="Địa chỉ lấy hàng" />
                <AddressDetail address={product.address} sellerName={product.seller?.account?.fullName ?? product.seller?.fullName} />
              </section>
            )}

            {/* Seller */}
            {product.seller && (
              <SellerSection
                seller={product.seller}
                addressPhone={product.address?.phoneNumber}
              />
            )}

            {/* Timestamps */}
            <section>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                  <span>Tạo: <strong className="text-foreground">{product.createdAt ? format(product.createdAt) : "—"}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>Cập nhật: <strong className="text-foreground">{product.updatedAt ? format(product.updatedAt) : "—"}</strong></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* ── Footer actions ── */}
        {canModerate && (
          <footer className="shrink-0 border-t border-border px-5 py-4">
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => onReject(product)}
                disabled={isUpdating}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:hover:bg-red-900/30 disabled:opacity-50 transition-colors"
              >
                ✕ Từ chối
              </button>
              <button
                type="button"
                onClick={() => onApprove(product)}
                disabled={isUpdating}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-md shadow-primary/20"
              >
                {isUpdating ? <IconLoader2 className="w-4 h-4 animate-spin" /> : (
                  <><IconShoppingBag className="w-4 h-4" /> Duyệt sản phẩm</>
                )}
              </button>
            </div>
          </footer>
        )}
        {!canModerate && (
          <footer className="shrink-0 border-t border-border px-5 py-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Đóng
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}
