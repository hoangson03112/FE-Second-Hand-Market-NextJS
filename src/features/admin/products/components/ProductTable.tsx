"use client";

import Image from "next/image";
import {
  IconPackage,
  IconCircleCheck,
  IconCircleX,
  IconEye,
  IconRefresh,
} from "@tabler/icons-react";
import type { IProduct } from "@/types/product";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import { CONDITION_LABEL, STATUS_TABLE_BADGE } from "../constants";

type ProductTableProps = {
  products: IProduct[];
  isUpdating: boolean;
  onView: (product: IProduct) => void;
  onApprove: (product: IProduct) => void;
  onReject: (product: IProduct) => void;
  onToggleVisibility: (product: IProduct) => void;
};

export function ProductTable({
  products,
  isUpdating,
  onView,
  onApprove,
  onReject,
  onToggleVisibility,
}: ProductTableProps) {
  return (
    <div className="rounded-[2px] border border-luxury-ink/10 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-luxury-ink/10 bg-cream-50/70">
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                Sản phẩm
              </th>
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 hidden sm:table-cell">
                Giá
              </th>
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 hidden md:table-cell">
                Danh mục
              </th>
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 hidden md:table-cell">
                Kho
              </th>
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 hidden lg:table-cell">
                Tình trạng
              </th>
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 hidden md:table-cell">
                Người bán
              </th>
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                Trạng thái
              </th>
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                Hiển thị
              </th>
              <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 hidden lg:table-cell">
                Ngày đăng
              </th>
              <th className="text-right px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const statusInfo = STATUS_TABLE_BADGE[product.status] ?? {
                label: product.status,
                className: "bg-cream-50 text-neutral-600 border-luxury-ink/10",
              };
              const canModerate =
                product.status === "pending" ||
                product.status === "under_review" ||
                product.status === "review_requested";
              const isVisible =
                product.status === "approved" || product.status === "active";
              const canToggleVisibility =
                product.status === "approved" ||
                product.status === "active" ||
                product.status === "inactive";

              return (
                <tr
                  key={product._id}
                  className="border-b border-luxury-ink/6 last:border-0 hover:bg-taupe-50/40 transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-[2px] border border-luxury-ink/10 bg-cream-50 overflow-hidden shrink-0">
                        {product.avatar?.url ? (
                          <Image
                            src={product.avatar.url}
                            alt={product.name}
                            width={44}
                            height={44}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <IconPackage className="w-5 h-5 text-neutral-400" />
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-luxury-ink line-clamp-2 max-w-[220px] text-xs">
                        {product.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 hidden sm:table-cell font-droid-serif font-bold text-luxury-ink tabular-nums text-sm">
                    {formatPrice(product.price)}
                  </td>

                  <td className="px-4 py-3.5 hidden md:table-cell text-neutral-500 text-xs">
                    <span className="font-medium text-luxury-ink">
                      {product.category?.name ?? "—"}
                    </span>
                    {product.subcategory?.name && (
                      <span className="block text-xs text-neutral-400">
                        {product.subcategory.name}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 hidden md:table-cell text-neutral-600 tabular-nums font-medium text-xs">
                    {product.stock}
                  </td>

                  <td className="px-4 py-3.5 hidden lg:table-cell text-neutral-500 text-xs">
                    <span className="inline-block px-2 py-0.5 rounded-[2px] bg-cream-50 text-luxury-ink border border-luxury-ink/8 font-medium text-xs">
                      {product.condition
                        ? (CONDITION_LABEL[product.condition] ?? product.condition)
                        : "—"}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 hidden md:table-cell text-xs">
                    <span className="font-medium text-luxury-ink block">
                      {product.seller?.account?.fullName ?? product.seller?.fullName ?? "—"}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-[2px] text-2xs font-bold uppercase tracking-[0.1em] border ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    {canToggleVisibility ? (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-[2px] border px-2 py-0.5 text-2xs font-bold uppercase tracking-[0.1em] ${
                          isVisible
                            ? "bg-cream-50 text-accent border-accent/30"
                            : "bg-white text-neutral-400 border-luxury-ink/10"
                        }`}
                      >
                        <span
                          className={`inline-block h-1.5 w-1.5 rounded-full ${
                            isVisible ? "bg-accent" : "bg-neutral-300"
                          }`}
                        />
                        {isVisible ? "Hiển thị" : "Ẩn"}
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-400">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 hidden lg:table-cell text-neutral-500 text-xs">
                    {product.createdAt ? format(product.createdAt) : "—"}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView(product)}
                        className="p-1.5 rounded-[2px] border border-luxury-ink/15 text-luxury-ink hover:bg-taupe-50 transition-colors"
                        title="Xem chi tiết"
                      >
                        <IconEye className="w-4 h-4" />
                      </button>
                      {canModerate && (
                        <>
                          <button
                            type="button"
                            onClick={() => onApprove(product)}
                            disabled={isUpdating}
                            className="p-1.5 rounded-[2px] bg-accent text-white border border-accent hover:opacity-90 disabled:opacity-50 transition-all"
                            title="Duyệt sản phẩm"
                          >
                            <IconCircleCheck className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onReject(product)}
                            disabled={isUpdating}
                            className="p-1.5 rounded-[2px] bg-blush-50 text-blush-700 border border-blush-200 hover:bg-blush-100 disabled:opacity-50 transition-all"
                            title="Từ chối sản phẩm"
                          >
                            <IconCircleX className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {canToggleVisibility && (
                        <button
                          type="button"
                          onClick={() => onToggleVisibility(product)}
                          disabled={isUpdating}
                          className="inline-flex items-center gap-1 rounded-[2px] border border-luxury-ink/15 px-2 py-1 text-2xs font-bold uppercase tracking-[0.12em] text-luxury-ink hover:bg-taupe-50 disabled:opacity-50 transition-colors"
                          title={isVisible ? "Ẩn sản phẩm" : "Hiển thị sản phẩm"}
                        >
                          <IconRefresh className="h-3.5 w-3.5" />
                          {isVisible ? "Ẩn" : "Hiện"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
