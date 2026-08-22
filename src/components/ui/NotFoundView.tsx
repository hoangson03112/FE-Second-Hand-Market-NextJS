"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconArrowLeft, IconArrowUpRight } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

export interface NotFoundLink {
  href: string;
  label: string;
}

export interface NotFoundViewProps {
  /** Watermark + kicker code. Pass an empty string to drop the watermark. */
  code?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Filled call to action. */
  primaryAction?: NotFoundLink;
  /** Outlined call to action — pass `null` to render only the back button. */
  secondaryAction?: NotFoundLink | null;
  /** Client-side "go back", shown next to the two link actions. */
  showBackButton?: boolean;
  /** Hairline strip of shortcuts under the actions. */
  suggestions?: NotFoundLink[];
  className?: string;
}

const DEFAULT_SUGGESTIONS: NotFoundLink[] = [
  { href: "/products", label: "Tất cả sản phẩm" },
  { href: "/search", label: "Tìm kiếm" },
  { href: "/cart", label: "Giỏ hàng" },
  { href: "/orders", label: "Đơn hàng của tôi" },
];

/**
 * The project-wide "route does not exist" screen. Used by `app/not-found.tsx`
 * and by any segment-level `not-found.tsx` that wants its own wording.
 */
export function NotFoundView({
  code = "404",
  eyebrow = "Không tìm thấy trang",
  title = "Trang bạn tìm không tồn tại.",
  description = "Đường dẫn có thể đã thay đổi, bị xóa hoặc bạn nhập sai địa chỉ. Hãy thử quay lại hoặc bắt đầu từ trang chủ.",
  primaryAction = { href: "/", label: "Về trang chủ" },
  secondaryAction = { href: "/products", label: "Xem sản phẩm" },
  showBackButton = true,
  suggestions = DEFAULT_SUGGESTIONS,
  className,
}: NotFoundViewProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-luxury-ivory px-4 py-20",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-charcoal-100 opacity-50 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-charcoal-100 opacity-50 blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl text-center">
        {code ? (
          <p
            aria-hidden
            className="font-droid-serif select-none text-[clamp(4.5rem,16vw,8rem)] font-normal leading-[0.85] tracking-[0.08em] text-luxury-ink/8"
          >
            {code}
          </p>
        ) : null}

        <div className={cn("flex items-center justify-center gap-3", code && "-mt-4")}>
          <span aria-hidden className="h-px w-8 bg-luxury-champagne/80" />
          <p className="text-2xs font-semibold uppercase tracking-[0.2em] text-neutral-600">
            {eyebrow}
          </p>
          <span aria-hidden className="h-px w-8 bg-luxury-champagne/80" />
        </div>

        <h1 className="font-droid-serif mt-6 text-[clamp(1.75rem,4vw,2.5rem)] font-normal leading-tight tracking-tight text-luxury-ink">
          {title}
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
          {description}
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={primaryAction.href}
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-[2px] bg-luxury-ink px-7 text-2xs font-semibold uppercase tracking-[0.2em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800 sm:w-auto"
          >
            {primaryAction.label}
            <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>

          {secondaryAction ? (
            <Link
              href={secondaryAction.href}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[2px] border border-luxury-ink/15 px-7 text-2xs font-semibold uppercase tracking-[0.2em] text-luxury-ink transition-all duration-300 hover:border-luxury-ink hover:bg-luxury-ink hover:text-luxury-ivory sm:w-auto"
            >
              {secondaryAction.label}
            </Link>
          ) : null}

          {showBackButton ? (
            <button
              type="button"
              onClick={() => router.back()}
              className="group inline-flex h-12 w-full items-center justify-center gap-2 px-3 text-2xs font-semibold uppercase tracking-[0.2em] text-neutral-600 transition-colors duration-300 hover:text-luxury-ink sm:w-auto"
            >
              <IconArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              Quay lại
            </button>
          ) : null}
        </div>

        {suggestions.length > 0 ? (
          <div className="mt-12 border-t border-luxury-ink/10 pt-6">
            <p className="text-2xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Có thể bạn cần
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {suggestions.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center rounded-[2px] border border-luxury-ink/10 bg-white px-3 py-1.5 text-xs font-medium text-charcoal-700 transition-colors hover:border-luxury-ink/25 hover:bg-charcoal-50"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
