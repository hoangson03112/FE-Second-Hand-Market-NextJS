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
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/80 bg-muted/40">
              <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                Sản phẩm
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/80 hidden sm:table-cell">
                Giá
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/80 hidden md:table-cell">
                Danh mục
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/80 hidden md:table-cell">
                Kho
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/80 hidden lg:table-cell">
                Tình trạng
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/80 hidden md:table-cell">
                Người bán
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                Trạng thái
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                Hiển thị
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/80 hidden lg:table-cell">
                Ngày đăng
              </th>
              <th className="text-right px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const statusInfo = STATUS_TABLE_BADGE[product.status] ?? {
                label: product.status,
                className: "bg-muted text-muted-foreground border-border",
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
                  className="border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors"
                >
                  {/* Tên + ảnh */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl border border-border bg-muted overflow-hidden shrink-0">
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
                            <IconPackage className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-foreground line-clamp-2 max-w-[220px]">
                        {product.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 hidden sm:table-cell font-bold text-foreground tabular-nums">
                    {formatPrice(product.price)}
                  </td>

                  <td className="px-4 py-3.5 hidden md:table-cell text-muted-foreground text-xs">
                    <span className="font-medium text-foreground">
                      {product.category?.name ?? "—"}
                    </span>
                    {product.subcategory?.name && (
                      <span className="block text-[11px] text-muted-foreground">
                        {product.subcategory.name}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 hidden md:table-cell text-muted-foreground tabular-nums font-medium">
                    {product.stock}
                  </td>

                  <td className="px-4 py-3.5 hidden lg:table-cell text-muted-foreground text-xs">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-muted/60 text-foreground font-medium text-[11px]">
                      {product.condition
                        ? (CONDITION_LABEL[product.condition] ?? product.condition)
                        : "—"}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 hidden md:table-cell text-xs">
                    <span className="font-medium text-foreground block">
                      {product.seller?.account?.fullName ?? product.seller?.fullName ?? "—"}
                    </span>
                  </td>

                  {/* Trạng thái */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  </td>

                  {/* Hiển thị */}
                  <td className="px-4 py-3.5">
                    {canToggleVisibility ? (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          isVisible
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        <span
                          className={`inline-block h-1.5 w-1.5 rounded-full ${
                            isVisible ? "bg-emerald-500" : "bg-muted-foreground/50"
                          }`}
                        />
                        {isVisible ? "Hiển thị" : "Ẩn"}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 hidden lg:table-cell text-muted-foreground text-xs">
                    {product.createdAt ? format(product.createdAt) : "—"}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView(product)}
                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
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
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-50 transition-colors"
                            title="Duyệt sản phẩm"
                          >
                            <IconCircleCheck className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onReject(product)}
                            disabled={isUpdating}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 disabled:opacity-50 transition-colors"
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
                          className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
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
