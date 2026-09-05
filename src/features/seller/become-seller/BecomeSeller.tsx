"use client";

import {
  IconArrowLeft,
  IconArrowUpRight,
  IconBuildingStore,
  IconCashBanknote,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconPackageExport,
  IconShieldCheck,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/features/auth/hooks/useUser";
import ErrorMessage from "@/features/seller/components/ErrorMessage";
import { BankInfoSection } from "./components/BankInfoSection";
import { IdCardSection } from "./components/IdCardSection";
import { TermsSection } from "./components/TermsSection";
import { useBecomeSeller } from "./hooks/useBecomeSeller";

const PERKS = [
  { icon: IconPackageExport, text: "Đăng sản phẩm không giới hạn" },
  { icon: IconCashBanknote, text: "Nhận thanh toán online an toàn" },
  { icon: IconShieldCheck, text: "Huy hiệu Seller xác minh" },
];

export default function BecomeSeller() {
  const router = useRouter();
  const { data: account, isLoading: isUserLoading } = useUser();

  const {
    values,
    errors,
    apiError,
    isLoading,
    idCardFront,
    idCardBack,
    avatar,
    handleChange,
    handleFile,
    handleSubmit,
    requestStatus,
    isCheckingStatus,
    hasRequest,
    productLimit,
    requiresVerification,
  } = useBecomeSeller();

  useEffect(() => {
    if (isUserLoading) return;
    if (!account) {
      router.replace("/login?redirect=/become-seller");
    }
  }, [account, isUserLoading, router]);

  if (isUserLoading || !account) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-luxury-ivory">
        <div className="h-10 w-10 animate-spin rounded-[2px] border-2 border-luxury-ink border-t-transparent" />
      </div>
    );
  }

  if (account.role === "seller") {
    return (
      <div className="min-h-screen bg-luxury-ivory text-luxury-ink">
        <div className="sticky top-0 z-10 border-b border-luxury-ink/10 bg-white/95 backdrop-blur-xs">
          <div className="mx-auto flex h-14 w-full max-w-9xl items-center gap-3 px-10">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500 transition-colors hover:text-luxury-ink"
            >
              <IconArrowLeft className="h-4 w-4" />
              Quay lại
            </button>
            <span className="select-none text-luxury-ink/20">/</span>
            <span className="text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ink">
              Tài khoản Người bán
            </span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-9xl px-4 py-12 sm:px-6">
          <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-8 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-cream-50">
                <IconCircleCheck className="h-6 w-6 text-emerald-700" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="mb-2 font-droid-serif text-2xl font-bold text-luxury-ink">
                  Bạn đã là Seller chính thức
                </h1>
                <p className="mb-6 text-xs leading-relaxed text-neutral-600">
                  Tài khoản của bạn đã được kích hoạt đầy đủ quyền Người bán. Bạn có thể đăng bán sản phẩm không giới hạn và nhận thanh toán đối soát trực tiếp từ Ban Quản Trị.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/sell"
                    className="inline-flex items-center gap-2 rounded-[2px] bg-luxury-ink px-6 py-2.5 text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ivory transition-colors hover:bg-charcoal-800"
                  >
                    <IconBuildingStore className="h-4 w-4" />
                    Đăng sản phẩm mới
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-[2px] border border-luxury-ink/20 px-6 py-2.5 text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ink transition-colors hover:bg-taupe-50"
                  >
                    Về trang chủ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const showForm =
    !isCheckingStatus &&
    !(hasRequest && requestStatus === "pending") &&
    !(hasRequest && requestStatus === "rejected");

  return (
    <div className="min-h-screen bg-luxury-ivory">
      <div className="sticky top-0 z-10 border-b border-luxury-ink/8 bg-luxury-ivory/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-9xl items-center gap-3 px-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="group flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:text-luxury-ink"
          >
            <IconArrowLeft
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
              strokeWidth={1.75}
            />
            Quay lại
          </button>
          <span className="h-4 w-px bg-luxury-ink/12" aria-hidden />
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-luxury-ink">
            Đăng ký Người bán
          </span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-9xl space-y-6 px-4 py-10 sm:px-6 md:py-14">
        <div
          className="rounded-[2px] relative overflow-hidden bg-luxury-ink px-6 py-8 md:px-10 md:py-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 opacity-[0.16]"
            style={{
              background:
                "radial-gradient(circle, var(--luxury-champagne) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 flex items-start gap-4">
            <div
              className="rounded-[2px] flex h-12 w-12 shrink-0 items-center justify-center border border-luxury-champagne/30 bg-luxury-champagne/10"
            >
              <IconBuildingStore
                className="h-6 w-6 text-luxury-champagne"
                strokeWidth={1.5}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-2xs font-bold uppercase tracking-[0.28em] text-luxury-champagne">
                {requiresVerification
                  ? "Xác minh tài khoản"
                  : "Bắt đầu hành trình"}
              </p>
              <h1
                style={{ fontWeight: 400 }}
                className="font-droid-serif mt-2 text-[clamp(1.4rem,3vw,1.9rem)] leading-tight text-luxury-ivory"
              >
                {requiresVerification
                  ? "Xác minh tài khoản Seller"
                  : "Mở gian hàng của bạn"}
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-luxury-ivory/65">
                {requiresVerification
                  ? "Hoàn tất xác minh để mở khóa đăng sản phẩm không giới hạn và nhận thanh toán online."
                  : "Điền thông tin để trở thành seller trên Eco Market và bắt đầu bán hàng ngay hôm nay."}
              </p>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5">
                {PERKS.map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 text-xs text-luxury-ivory/75"
                  >
                    <Icon
                      className="h-3.5 w-3.5 shrink-0 text-luxury-champagne"
                      strokeWidth={1.75}
                    />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {productLimit &&
          requiresVerification &&
          requestStatus !== "approved" && (
            <div
              className="rounded-[2px] flex items-start gap-3 border border-luxury-champagne/30 bg-luxury-champagne/8 px-4 py-3.5"
            >
              <IconClock
                className="mt-0.5 h-4 w-4 shrink-0 text-taupe-700"
                strokeWidth={1.75}
              />
              <p className="text-xs leading-relaxed text-neutral-700">
                Bạn đã đăng{" "}
                <span className="font-bold text-luxury-ink">
                  {productLimit.totalProducts}/{productLimit.limit}
                </span>{" "}
                sản phẩm. Xác minh tài khoản để đăng không giới hạn.
              </p>
            </div>
          )}

        {isCheckingStatus ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-luxury-ink/15 border-t-luxury-champagne" />
            <p className="text-xs uppercase tracking-[0.18em] text-taupe-400">
              Đang kiểm tra hồ sơ...
            </p>
          </div>
        ) : hasRequest && requestStatus === "pending" ? (
          <StatusCard
            tone="pending"
            icon={IconClock}
            title="Hồ sơ đang được xét duyệt"
            description="Đội ngũ Eco Market đang kiểm duyệt hồ sơ của bạn trong vòng 24h. Bạn sẽ nhận thông báo qua email khi có kết quả."
          >
            <Link
              href="/"
              className="group mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-luxury-ink transition-colors hover:text-accent"
            >
              Về trang chủ
              <IconArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </StatusCard>
        ) : hasRequest && requestStatus === "rejected" ? (
          <StatusCard
            tone="rejected"
            icon={IconCircleX}
            title="Yêu cầu đã bị từ chối"
            description={
              apiError ||
              "Yêu cầu của bạn đã bị từ chối. Vui lòng liên hệ hỗ trợ để được giải đáp."
            }
          />
        ) : null}

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <ErrorMessage message={apiError} />

            <TimelineStep index={1} label="Thông tin ngân hàng" isLast={false}>
              <BankInfoSection
                values={values}
                errors={errors}
                onChange={handleChange}
              />
            </TimelineStep>

            <TimelineStep index={2} label="Ảnh CCCD/CMND" isLast={false}>
              <IdCardSection
                idCardFront={idCardFront}
                idCardBack={idCardBack}
                avatar={avatar}
                errors={errors}
                onFileChange={handleFile}
              />
            </TimelineStep>

            <TimelineStep index={3} label="Điều khoản & chính sách" isLast>
              <TermsSection
                values={values}
                errors={errors}
                onChange={handleChange}
              />
            </TimelineStep>

            <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={
                  isLoading || (hasRequest && requestStatus === "pending")
                }
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-[2px] bg-luxury-ink px-8 py-3.5 text-xs font-bold uppercase tracking-[0.22em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-luxury-ivory/30 border-t-luxury-champagne" />
                    Đang gửi hồ sơ...
                  </>
                ) : (
                  <>
                    {requiresVerification
                      ? "Xác minh tài khoản seller"
                      : "Bắt đầu bán hàng"}
                    <IconArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 rounded-[2px] border border-luxury-ink/15 px-8 py-3.5 text-xs font-bold uppercase tracking-[0.22em] text-neutral-600 transition-all duration-300 hover:border-luxury-ink/30 hover:text-luxury-ink sm:flex-none"
              >
                Hủy
              </button>
            </div>

            <p className="pb-2 text-center text-xs text-taupe-400">
              Hồ sơ sẽ được đội ngũ Eco Market kiểm duyệt trong vòng 24h.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function TimelineStep({
  index,
  label,
  isLast,
  children,
}: {
  index: number;
  label: string;
  isLast: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 md:gap-5">
      <div className="flex shrink-0 flex-col items-center">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-[2px] border border-luxury-champagne/40 bg-cream-50 text-sm italic text-luxury-ink font-droid-serif"
        >
          {String(index).padStart(2, "0")}
        </span>
        {!isLast && (
          <span className="mt-2 w-px flex-1 bg-luxury-ink/10" aria-hidden />
        )}
      </div>
      <div className="min-w-0 flex-1 pb-1">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

function StatusCard({
  tone,
  icon: Icon,
  title,
  description,
  children,
}: {
  tone: "pending" | "rejected";
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  const isPending = tone === "pending";
  return (
    <div
      className={
        isPending
          ? "flex items-start gap-4 rounded-[2px] border border-luxury-champagne/30 bg-cream-50 p-6"
          : "flex items-start gap-4 rounded-[2px] border border-blush-200 bg-blush-50/70 p-6"
      }
    >
      <div
        className={
          isPending
            ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] bg-luxury-ink"
            : "flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] bg-blush-700"
        }
      >
        <Icon
          className={
            isPending ? "h-5 w-5 text-luxury-champagne" : "h-5 w-5 text-white"
          }
          strokeWidth={1.75}
        />
      </div>
      <div className="min-w-0">
        <h3
          className={
            isPending
              ? "font-droid-serif text-base font-normal text-luxury-ink"
              : "font-droid-serif text-base font-normal text-blush-800"
          }
        >
          {title}
        </h3>
        <p
          className={
            isPending
              ? "mt-1.5 text-xs leading-relaxed text-neutral-600"
              : "mt-1.5 text-xs leading-relaxed text-blush-800/80"
          }
        >
          {description}
        </p>
        {children}
      </div>
    </div>
  );
}

