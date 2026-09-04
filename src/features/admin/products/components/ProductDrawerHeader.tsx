"use client";

import Image from "next/image";
import Link from "next/link";
import {
  IconX,
  IconExternalLink,
  IconPackage,
  IconEye,
  IconCalendar,
  IconRefresh,
} from "@tabler/icons-react";
import type { IProduct } from "@/types/product";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import { CONDITION_LABEL, STATUS_BADGE } from "../constants";

type ProductDrawerHeaderProps = {
  product: IProduct;
  onClose: () => void;
};

export function ProductDrawerHeader({ product, onClose }: ProductDrawerHeaderProps) {
  const statusInfo = STATUS_BADGE[product.status] ?? {
    label: product.status,
    dot: "bg-neutral-400",
    chip: "bg-cream-50 border-luxury-ink/10 text-neutral-600",
  };
  const ai = product.aiModerationResult;

  return (
    <header className="shrink-0 border-b border-luxury-ink/10 bg-white">
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-luxury-ink/10 bg-cream-50/70">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] border text-2xs font-bold uppercase tracking-wider ${statusInfo.chip}`}
          >
            <span className={`w-1.5 h-1.5 rounded-[1px] ${statusInfo.dot}`} />
            {statusInfo.label}
          </span>
          {ai?.rejectionReason && product.status === "review_requested" && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-2xs font-medium bg-blush-50 text-blush-700 border border-blush-200"
              title={ai.rejectionReason}
            >
              Lý do từ chối:{" "}
              {ai.rejectionReason.length > 35
                ? ai.rejectionReason.slice(0, 35) + "…"
                : ai.rejectionReason}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Link
            href={`/products/${product._id}/${product.slug ?? ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[2px] border border-luxury-ink/20 text-2xs font-bold uppercase tracking-[0.1em] text-luxury-ink hover:bg-taupe-50 transition-colors"
          >
            Xem SP <IconExternalLink className="w-3 h-3" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-[2px] text-neutral-400 hover:text-luxury-ink transition-colors"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-[2px] border border-luxury-ink/10 bg-taupe-50 overflow-hidden shrink-0">
            {product.avatar?.url ? (
              <Image
                src={product.avatar.url}
                alt={product.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <IconPackage className="w-7 h-7 text-neutral-400" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-droid-serif text-base font-bold text-luxury-ink leading-snug mb-2 line-clamp-2">
              {product.name}
            </h2>

            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="font-droid-serif text-base font-bold text-luxury-ink">
                {formatPrice(product.price)}
              </span>
              {product.condition && (
                <span className="px-2 py-0.5 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-2xs text-neutral-600 font-bold uppercase tracking-wider">
                  {CONDITION_LABEL[product.condition] ?? product.condition}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-cream-50 border border-luxury-ink/10 text-2xs text-neutral-600 font-medium">
                <IconPackage className="w-3 h-3" /> {product.stock} tồn kho
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-cream-50 border border-luxury-ink/10 text-2xs text-neutral-600 font-medium">
                <IconEye className="w-3 h-3" /> {product.views ?? 0} lượt xem
              </span>
              {product.category?.name && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-cream-50 border border-luxury-ink/15 text-2xs text-luxury-ink font-bold uppercase tracking-wider">
                  {product.category.name}
                  {product.subcategory?.name &&
                    ` › ${product.subcategory.name}`}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-2xs text-neutral-400 pt-3 border-t border-luxury-ink/10">
          <span className="flex items-center gap-1">
            <IconCalendar className="w-3 h-3" />
            Đăng:{" "}
            <strong className="text-luxury-ink ml-0.5 font-mono">
              {product.createdAt ? format(product.createdAt) : "—"}
            </strong>
          </span>
          {product.updatedAt && (
            <span className="flex items-center gap-1">
              <IconRefresh className="w-3 h-3" />
              Cập nhật:{" "}
              <strong className="text-luxury-ink ml-0.5 font-mono">
                {format(product.updatedAt)}
              </strong>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
