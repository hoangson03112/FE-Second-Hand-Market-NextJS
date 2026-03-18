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

type Props = {
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
}: Props) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-foreground">Sản phẩm</th>
              <th className="text-left px-4 py-3 font-medium text-foreground hidden sm:table-cell">Giá</th>
              <th className="text-left px-4 py-3 font-medium text-foreground hidden md:table-cell">Danh mục</th>
              <th className="text-left px-4 py-3 font-medium text-foreground hidden md:table-cell">SL</th>
              <th className="text-left px-4 py-3 font-medium text-foreground hidden lg:table-cell">Tình trạng</th>
              <th className="text-left px-4 py-3 font-medium text-foreground hidden md:table-cell">Người đăng</th>
              <th className="text-left px-4 py-3 font-medium text-foreground">Trạng thái</th>
              <th className="text-left px-4 py-3 font-medium text-foreground">Hiển thị</th>
              <th className="text-left px-4 py-3 font-medium text-foreground hidden lg:table-cell">Ngày tạo</th>
              <th className="text-right px-4 py-3 font-medium text-foreground">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const statusInfo = STATUS_TABLE_BADGE[product.status] ?? {
                label: product.status,
                className: "bg-muted text-muted-foreground",
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
                  className="border-b border-border last:border-0 hover:bg-muted/30"
                >
                  {/* Tên + ảnh */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg border border-border bg-muted overflow-hidden shrink-0">
                        {product.avatar?.url ? (
                          <Image
                            src={product.avatar.url}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <IconPackage className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-foreground line-clamp-2">
                        {product.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                    {formatPrice(product.price)}
                  </td>

                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                    {product.category?.name ?? "—"}
                    {product.subcategory?.name ? ` / ${product.subcategory.name}` : ""}
                  </td>

                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground tabular-nums">
                    {product.stock}
                  </td>

                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                    {product.condition
                      ? (CONDITION_LABEL[product.condition] ?? product.condition)
                      : "—"}
                  </td>

                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                    {product.seller?.account?.fullName ?? product.seller?.fullName ?? "—"}
                  </td>

                  {/* Trạng thái */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusInfo.className}`}>
                      {statusInfo.label}
                    </span>
                  </td>

                  {/* Hiển thị */}
                  <td className="px-4 py-3">
                    {canToggleVisibility ? (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium ${
                          isVisible ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        <span
                          className={`inline-block h-1.5 w-1.5 rounded-full ${
                            isVisible ? "bg-emerald-500" : "bg-muted-foreground/50"
                          }`}
                        />
                        {isVisible ? "Đang hiển thị" : "Đang ẩn"}
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">Chưa hiển thị</span>
                    )}
                  </td>

                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                    {product.createdAt ? format(product.createdAt) : "—"}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView(product)}
                        className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
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
                            className="p-2 rounded-lg text-primary hover:bg-primary/10 disabled:opacity-50"
                            title="Duyệt"
                          >
                            <IconCircleCheck className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onReject(product)}
                            disabled={isUpdating}
                            className="p-2 rounded-lg text-destructive hover:bg-destructive/5 disabled:opacity-50"
                            title="Từ chối"
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
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2 py-1 text-[11px] font-medium text-foreground hover:bg-muted disabled:opacity-50"
                          title={isVisible ? "Ẩn sản phẩm" : "Hiển thị sản phẩm"}
                        >
                          <IconRefresh className="h-3.5 w-3.5" />
                          Cập nhật trạng thái
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
