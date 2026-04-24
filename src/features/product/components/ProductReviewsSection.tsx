"use client";

import Image from "next/image";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { useProductReviews } from "@/hooks";
import { getAvatarUrl, getUserInitials } from "@/utils";
import { formatDateOnly } from "@/utils/format/date";
import type { ProductReview, ProductReviewBuyer } from "@/services/productReview.service";
import { Button } from "@/components/shared";

function isPopulatedBuyer(
  buyerId: ProductReview["buyerId"],
): buyerId is ProductReviewBuyer {
  return typeof buyerId === "object" && buyerId !== null && "fullName" in buyerId;
}

function ReviewCard({ review }: { review: ProductReview }) {
  const buyer = isPopulatedBuyer(review.buyerId) ? review.buyerId : null;
  const name = buyer?.fullName?.trim() || "Người mua";
  const avatarUrl = buyer ? getAvatarUrl(buyer.avatar) : null;
  const initials = getUserInitials(name);

  return (
    <article className="rounded-2xl border border-taupe-200/80 bg-white/80 p-4 sm:p-5 shadow-sm">
      <div className="flex gap-3">
        {avatarUrl ? (
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-taupe-200">
            <Image
              src={avatarUrl}
              alt=""
              width={40}
              height={40}
              unoptimized
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
            aria-hidden
          >
            {initials || "?"}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 gap-y-1">
            <p className="text-sm font-semibold text-taupe-900">{name}</p>
            <span className="text-xs text-taupe-500">{formatDateOnly(review.createdAt)}</span>
          </div>
          <div className="mt-1 flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) =>
              i <= review.rating ? (
                <IconStarFilled key={i} className="h-4 w-4 text-amber-400" />
              ) : (
                <IconStar key={i} className="h-4 w-4 text-taupe-200" />
              ),
            )}
          </div>
          {review.comment?.trim() ? (
            <p className="mt-2 text-sm leading-relaxed text-taupe-700 whitespace-pre-wrap break-words">
              {review.comment.trim()}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

interface ProductReviewsSectionProps {
  productId: string;
}

export default function ProductReviewsSection({ productId }: ProductReviewsSectionProps) {
  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductReviews(productId);

  const reviews = data?.pages.flatMap((p) => p.reviews) ?? [];

  if (isPending) {
    return (
      <section className="mt-10 rounded-3xl border border-taupe-200 bg-cream-50/50 p-6 md:p-8">
        <h2 className="text-lg font-bold text-taupe-900">Đánh giá từ người mua</h2>
        <p className="mt-4 text-sm text-taupe-500">Đang tải đánh giá...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mt-10 rounded-3xl border border-taupe-200 bg-cream-50/50 p-6 md:p-8">
        <h2 className="text-lg font-bold text-taupe-900">Đánh giá từ người mua</h2>
        <p className="mt-4 text-sm text-destructive">Không tải được đánh giá. Vui lòng thử lại sau.</p>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="mt-10 rounded-3xl border border-taupe-200 bg-cream-50/50 p-6 md:p-8">
        <h2 className="text-lg font-bold text-taupe-900">Đánh giá từ người mua</h2>
        <p className="mt-4 text-sm text-taupe-600">
          Chưa có đánh giá nào. Sau khi mua và hoàn thành đơn, bạn có thể đánh giá để giúp người mua khác.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10 rounded-3xl border border-taupe-200 bg-cream-50/50 p-6 md:p-8">
      <h2 className="text-lg font-bold text-taupe-900">Đánh giá từ người mua</h2>
      <p className="mt-1 text-sm text-taupe-600">
        {data.pages[0].totalReviews.toLocaleString("vi-VN")} đánh giá đã xác minh mua hàng
      </p>
      <ul className="mt-6 space-y-4">
        {reviews.map((r) => (
          <li key={r._id}>
            <ReviewCard review={r} />
          </li>
        ))}
      </ul>
      {hasNextPage ? (
        <div className="mt-6 flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-full"
          >
            {isFetchingNextPage ? "Đang tải..." : "Xem thêm đánh giá"}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
