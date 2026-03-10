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

type Props = {
  product: IProduct;
  onClose: () => void;
};

export function ProductDrawerHeader({ product, onClose }: Props) {
  const statusInfo = STATUS_BADGE[product.status] ?? {
    label: product.status,
    dot: "bg-muted-foreground",
    chip: "bg-muted text-muted-foreground",
  };
  const ai = product.aiModerationResult;

  return (
    <header className="shrink-0 border-b border-border bg-card">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.chip}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
            {statusInfo.label}
          </span>
          {ai?.rejectionReason && product.status === "review_requested" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-destructive/10 text-destructive dark:bg-destructive/20" title={ai.rejectionReason}>
              Lý do từ chối trước: {ai.rejectionReason.length > 40 ? ai.rejectionReason.slice(0, 40) + "…" : ai.rejectionReason}
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
      <div className="px-5 py-4">
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="w-20 h-20 rounded-xl border border-border bg-muted overflow-hidden shrink-0">
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
                <IconPackage className="w-7 h-7 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-foreground leading-snug mb-2 line-clamp-2">
              {product.name}
            </h2>

            {/* Price + condition */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-sm font-bold leading-none">
                {formatPrice(product.price)}
              </span>
              {product.condition && (
                <span className="px-2 py-0.5 rounded-md border border-border bg-muted text-xs text-muted-foreground font-medium">
                  {CONDITION_LABEL[product.condition] ?? product.condition}
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground font-medium">
                <IconPackage className="w-3 h-3" /> {product.stock} tồn kho
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground font-medium">
                <IconEye className="w-3 h-3" /> {product.views ?? 0} lượt xem
              </span>
              {product.category?.name && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/5 border border-primary/15 text-xs text-primary/80 font-medium">
                  {product.category.name}
                  {product.subcategory?.name && ` › ${product.subcategory.name}`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground pt-3 border-t border-border/40">
          <span className="flex items-center gap-1">
            <IconCalendar className="w-3 h-3" />
            Đăng:{" "}
            <strong className="text-foreground ml-0.5">
              {product.createdAt ? format(product.createdAt) : "—"}
            </strong>
          </span>
          {product.updatedAt && (
            <span className="flex items-center gap-1">
              <IconRefresh className="w-3 h-3" />
              Cập nhật:{" "}
              <strong className="text-foreground ml-0.5">
                {format(product.updatedAt)}
              </strong>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
