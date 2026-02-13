import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Calendar,
  Edit,
  Trash2,
  AlertCircle,
  Eye,
  Tag,
} from "lucide-react";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import { cn } from "@/lib/utils";
import { PRODUCT_STATUS_CONFIG } from "@/constants";
import type { MyListingProduct } from "@/types/myProducts";
import type { ProductStatusFilter } from "@/types/product";

interface ProductCardProps {
  product: MyListingProduct;
  onDelete: (productId: string, productName: string) => void;
  isDeleting: boolean;
  viewMode?: "list" | "grid";
}

export function ProductCard({ product, onDelete, isDeleting, viewMode = "list" }: ProductCardProps) {
  const statusCfg =
    PRODUCT_STATUS_CONFIG[product.status as ProductStatusFilter] ??
    PRODUCT_STATUS_CONFIG.pending;
    
  const isVisibleOnSite =
    product.status === "approved" ||
    product.status === "active" ||
    product.status === "sold";

  const canEdit =
    product.status === "rejected" ||
    product.status === "approved" ||
    product.status === "active";

  if (viewMode === "grid") {
    return (
      <div
        className={cn(
          "group relative rounded-xl bg-white border border-gray-100",
          "overflow-hidden transition-all hover:border-gray-200"
        )}
      >
        {/* Image */}
        <div className="relative w-full aspect-square bg-gray-50">
          {product.avatar?.url ? (
            <Image
              src={product.avatar.url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-300" />
            </div>
          )}
          
          {/* Status badge - subtle pill */}
          <div className="absolute top-3 right-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                "bg-white/90 backdrop-blur-sm border",
                statusCfg.text
              )}
              style={{
                borderColor: `${statusCfg.color}30`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: statusCfg.color }}
              />
              {statusCfg.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-medium text-gray-900 line-clamp-2 text-sm leading-snug mb-1.5">
              {product.name}
            </h3>
            
            {product.categoryId?.name && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Tag className="w-3 h-3" />
                <span className="line-clamp-1">
                  {product.categoryId.name}
                </span>
              </div>
            )}
          </div>

          {/* Rejection reason */}
          {product.status === "rejected" && product.aiModerationResult?.rejectionReason && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-100">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700 line-clamp-2">
                  {product.aiModerationResult.rejectionReason}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <span className="text-lg font-semibold text-gray-900 tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.createdAt && (
              <span className="text-xs text-gray-400">
                {format(product.createdAt)}
              </span>
            )}
          </div>

          {/* Actions - minimal */}
          <div className="flex gap-1.5 pt-2">
            {canEdit && (
              <Link
                href={`/sell?edit=${product._id}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                Sửa
              </Link>
            )}

            {isVisibleOnSite && product.slug && (
              <Link
                href={`/products/${product._id}/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Xem
              </Link>
            )}

            <button
              type="button"
              onClick={() => onDelete(product._id, product.name)}
              disabled={isDeleting}
              className="px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List view - clean horizontal card
  return (
    <div
      className={cn(
        "group relative rounded-xl bg-white border border-gray-100",
        "overflow-hidden transition-all hover:border-gray-200",
        "flex flex-col sm:flex-row"
      )}
    >
      {/* Thumbnail */}
      <div className="relative w-full sm:w-24 aspect-square sm:aspect-auto sm:h-24 bg-gray-50 shrink-0">
        {product.avatar?.url ? (
          <Image
            src={product.avatar.url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-300" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 p-4 min-w-0">
        <div className="flex-1 min-w-0 space-y-1.5">
          <div>
            <h3 className="font-medium text-gray-900 line-clamp-2 text-sm mb-1">
              {product.name}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
              {product.categoryId?.name && (
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {product.categoryId.name}
                </span>
              )}
              {product.createdAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(product.createdAt)}
                </span>
              )}
            </div>
          </div>
          
          {/* Rejection reason */}
          {product.status === "rejected" && product.aiModerationResult?.rejectionReason && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-100">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">
                  {product.aiModerationResult.rejectionReason}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold text-gray-900 tabular-nums">
              {formatPrice(product.price)}
            </span>

            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                statusCfg.text
              )}
              style={{
                backgroundColor: `${statusCfg.color}10`,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: `${statusCfg.color}30`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: statusCfg.color }}
              />
              {statusCfg.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {canEdit && (
              <Link
                href={`/sell?edit=${product._id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                Sửa
              </Link>
            )}

            {isVisibleOnSite && product.slug && (
              <Link
                href={`/products/${product._id}/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Xem
              </Link>
            )}

            <button
              type="button"
              onClick={() => onDelete(product._id, product.name)}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isDeleting ? "..." : "Xóa"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
