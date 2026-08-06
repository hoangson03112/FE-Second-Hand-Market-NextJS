"use client";

import Image from "next/image";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { useProductReviews } from "@/hooks";
import { getAvatarUrl, getUserInitials } from "@/utils";
import { formatDateOnly } from "@/utils/format/date";
import type {
  ProductReview,
  ProductReviewBuyer,
} from "@/services/productReview.service";
import { Button } from "@/components/shared";

function isPopulatedBuyer(
  buyerId: ProductReview["buyerId"],
): buyerId is ProductReviewBuyer {
  return (
    typeof buyerId === "object" && buyerId !== null && "fullName" in buyerId
  );
}

function ReviewCard({ review }: { review: ProductReview }) {
  const buyer = isPopulatedBuyer(review.buyerId) ? review.buyerId : null;
  const name = buyer?.fullName?.trim() || "Người mua";
  const avatarUrl = buyer ? getAvatarUrl(buyer.avatar) : null;
  const initials = getUserInitials(name);

  return (
    <article className="rounded-[2px] border border-luxury-ink/10 bg-white p-4 sm:p-5">
      <div className="flex gap-3">
        {avatarUrl ? (
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[2px] border border-luxury-ink/10">
            <Image
              src={avatarUrl}
              alt=""
              width={36}
              height={36}
              unoptimized
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-taupe-50 text-xs font-bold text-luxury-ink"
            aria-hidden
          >
            {initials || "?"}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 gap-y-1">
            <p className="text-xs font-bold text-luxury-ink">{name}</p>
            <span className="text-[10px] text-taupe-400">
              {formatDateOnly(review.createdAt)}
            </span>
          </div>
          <div className="mt-1 flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) =>
              i <= review.rating ? (
                <IconStarFilled
                  key={i}
                  className="h-3.5 w-3.5 text-luxury-ink"
                />
              ) : (
                <IconStar key={i} className="h-3.5 w-3.5 text-taupe-200" />
              ),
            )}
          </div>
          {review.comment?.trim() ? (
            <p className="mt-2 text-xs leading-relaxed text-taupe-600 whitespace-pre-wrap break-words">
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

export default function ProductReviewsSection({
  productId,
}: ProductReviewsSectionProps) {
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductReviews(productId);

  const reviews = data?.pages.flatMap((p) => p.reviews) ?? [];

  if (isPending) {
    return (
      <section className="pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-luxury-ink">
          Đánh giá từ người mua
        </h2>
        <p className="mt-2 text-sm text-taupe-400">Đang tải đánh giá...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-luxury-ink">
          Đánh giá từ người mua
        </h2>
        <p className="mt-2 text-sm text-blush-600">
          Không tải được đánh giá. Vui lòng thử lại sau.
        </p>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-luxury-ink mb-5">
          Đánh giá từ người mua
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          Chưa có đánh giá nào. Sau khi mua và hoàn thành đơn, bạn có thể đánh
          giá để giúp người mua khác.
        </p>
      </section>
    );
  }

  return (
    <section className="pt-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-luxury-ink mb-5">
          Đánh giá từ người mua
        </h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          {data.pages[0].totalReviews.toLocaleString("vi-VN")} đánh giá đã xác
          minh mua hàng
        </p>
      </div>

      <ul className="space-y-3">
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
            className="rounded-[2px] text-[11px] font-semibold uppercase tracking-[0.2em] px-6 border-luxury-ink/20 text-luxury-ink hover:bg-taupe-50"
          >
            {isFetchingNextPage ? "Đang tải..." : "Xem thêm đánh giá"}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
