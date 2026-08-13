import {
  IconArrowLeft,
  IconArrowUpRight,
  IconBuildingStore,
  IconCashBanknote,
  IconCircleX,
  IconClock,
  IconPackageExport,
  IconShieldCheck,
} from "@tabler/icons-react";
import Link from "next/link";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { BankInfoSection } from "./BankInfoSection";
import { IdCardSection } from "./IdCardSection";
import { TermsSection } from "./TermsSection";
import type {
  BecomeSellerErrors,
  BecomeSellerFormValues,
} from "../hooks/useBecomeSeller";

const PERKS = [
  { icon: IconPackageExport, text: "Đăng sản phẩm không giới hạn" },
  { icon: IconCashBanknote, text: "Nhận thanh toán online an toàn" },
  { icon: IconShieldCheck, text: "Huy hiệu Seller xác minh" },
];

interface BecomeSellerViewProps {
  values: BecomeSellerFormValues;
  errors: BecomeSellerErrors;
  apiError: string;
  isLoading: boolean;
  idCardFront: File | null;
  idCardBack: File | null;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  handleFile: (
    field: "idCardFront" | "idCardBack" | "avatar",
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  requestStatus: string | null;
  isCheckingStatus: boolean;
  hasRequest: boolean;
  productLimit: { totalProducts: number; limit: number } | null;
  requiresVerification: boolean;
  onBack: () => void;
}

export function BecomeSellerView({
  values,
  errors,
  apiError,
  isLoading,
  idCardFront,
  idCardBack,
  handleChange,
  handleFile,
  handleSubmit,
  requestStatus,
  isCheckingStatus,
  hasRequest,
  productLimit,
  requiresVerification,
  onBack,
}: BecomeSellerViewProps) {
  const showForm =
    !isCheckingStatus &&
    !(hasRequest && requestStatus === "pending") &&
    !(hasRequest && requestStatus === "rejected");

  return (
    <div className="min-h-screen bg-luxury-ivory">
      {/* ── STICKY HEADER ── */}
      <div className="sticky top-0 z-10 border-b border-luxury-ink/8 bg-luxury-ivory/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-4xl items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="group flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:text-luxury-ink"
          >
            <IconArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.75} />
            Quay lại
          </button>
          <span className="h-4 w-px bg-luxury-ink/12" aria-hidden />
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-luxury-ink">
            Đăng ký Người bán
          </span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6 md:py-14">
        {/* ── HERO — luxury-ink card, đồng bộ LuxuryCtaSection ── */}
        <div className="relative overflow-hidden bg-luxury-ink px-6 py-8 md:px-10 md:py-10" style={{ borderRadius: "2px" }}>
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
              background: "radial-gradient(circle, var(--luxury-champagne) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center border border-luxury-champagne/30 bg-luxury-champagne/10"
              style={{ borderRadius: "2px" }}
            >
              <IconBuildingStore className="h-6 w-6 text-luxury-champagne" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-luxury-champagne">
                {requiresVerification ? "Xác minh tài khoản" : "Bắt đầu hành trình"}
              </p>
              <h1
                style={{ fontFamily: "var(--font-droid-serif), serif", fontWeight: 400 }}
                className="mt-2 text-[clamp(1.4rem,3vw,1.9rem)] leading-tight text-luxury-ivory"
              >
                {requiresVerification ? "Xác minh tài khoản Seller" : "Mở gian hàng của bạn"}
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-luxury-ivory/65">
                {requiresVerification
                  ? "Hoàn tất xác minh để mở khóa đăng sản phẩm không giới hạn và nhận thanh toán online."
                  : "Điền thông tin để trở thành seller trên Eco Market và bắt đầu bán hàng ngay hôm nay."}
              </p>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5">
                {PERKS.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-luxury-ivory/75">
                    <Icon className="h-3.5 w-3.5 shrink-0 text-luxury-champagne" strokeWidth={1.75} />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── PRODUCT LIMIT NOTICE ── */}
        {productLimit && requiresVerification && requestStatus !== "approved" && (
          <div
            className="flex items-start gap-3 border border-luxury-champagne/30 bg-luxury-champagne/8 px-4 py-3.5"
            style={{ borderRadius: "2px" }}
          >
            <IconClock className="mt-0.5 h-4 w-4 shrink-0 text-taupe-700" strokeWidth={1.75} />
            <p className="text-xs leading-relaxed text-neutral-700">
              Bạn đã đăng{" "}
              <span className="font-semibold text-luxury-ink">
                {productLimit.totalProducts}/{productLimit.limit}
              </span>{" "}
              sản phẩm. Xác minh tài khoản để đăng không giới hạn.
            </p>
          </div>
        )}

        {/* ── STATES ── */}
        {isCheckingStatus ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-luxury-ink/15 border-t-luxury-champagne" />
            <p className="text-[11px] uppercase tracking-[0.18em] text-taupe-400">Đang kiểm tra hồ sơ...</p>
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
              className="group mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-luxury-ink transition-colors hover:text-accent"
            >
              Về trang chủ
              <IconArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </StatusCard>
        ) : hasRequest && requestStatus === "rejected" ? (
          <StatusCard
            tone="rejected"
            icon={IconCircleX}
            title="Yêu cầu đã bị từ chối"
            description={apiError || "Yêu cầu của bạn đã bị từ chối. Vui lòng liên hệ hỗ trợ để được giải đáp."}
          />
        ) : null}

        {/* ── FORM — timeline 3 bước ── */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <ErrorMessage message={apiError} />

            <TimelineStep index={1} label="Thông tin ngân hàng" isLast={false}>
              <BankInfoSection values={values} errors={errors} onChange={handleChange} />
            </TimelineStep>

            <TimelineStep index={2} label="Ảnh CCCD/CMND" isLast={false}>
              <IdCardSection
                idCardFront={idCardFront}
                idCardBack={idCardBack}
                errors={errors}
                onFileChange={handleFile}
              />
            </TimelineStep>

            <TimelineStep index={3} label="Điều khoản & chính sách" isLast>
              <TermsSection values={values} errors={errors} onChange={handleChange} />
            </TimelineStep>

            <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={isLoading || (hasRequest && requestStatus === "pending")}
                className="group inline-flex flex-1 items-center justify-center gap-2 bg-luxury-ink px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ borderRadius: "2px" }}
              >
                {isLoading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-luxury-ivory/30 border-t-luxury-champagne" />
                    Đang gửi hồ sơ...
                  </>
                ) : (
                  <>
                    {requiresVerification ? "Xác minh tài khoản seller" : "Bắt đầu bán hàng"}
                    <IconArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onBack}
                className="flex-1 border border-luxury-ink/15 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-600 transition-all duration-300 hover:border-luxury-ink/30 hover:text-luxury-ink sm:flex-none"
                style={{ borderRadius: "2px" }}
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

/* ── Timeline step wrapper — số thứ tự editorial nối bằng đường dọc champagne ── */
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
          className="font-ny flex h-9 w-9 items-center justify-center border border-luxury-champagne/40 bg-cream-50 text-sm italic text-luxury-ink"
          style={{ borderRadius: "2px" }}
        >
          {String(index).padStart(2, "0")}
        </span>
        {!isLast && <span className="mt-2 w-px flex-1 bg-luxury-ink/10" aria-hidden />}
      </div>
      <div className="min-w-0 flex-1 pb-1">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

/* ── Status card — pending / rejected ── */
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
          ? "flex items-start gap-4 border border-luxury-champagne/30 bg-cream-50 p-6"
          : "flex items-start gap-4 border border-red-200 bg-red-50/60 p-6"
      }
      style={{ borderRadius: "2px" }}
    >
      <div
        className={
          isPending
            ? "flex h-10 w-10 shrink-0 items-center justify-center bg-luxury-ink"
            : "flex h-10 w-10 shrink-0 items-center justify-center bg-red-600"
        }
        style={{ borderRadius: "2px" }}
      >
        <Icon className={isPending ? "h-5 w-5 text-luxury-champagne" : "h-5 w-5 text-white"} strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <h3
          style={{ fontFamily: "var(--font-droid-serif), serif" }}
          className={isPending ? "text-base font-normal text-luxury-ink" : "text-base font-normal text-red-700"}
        >
          {title}
        </h3>
        <p className={isPending ? "mt-1.5 text-xs leading-relaxed text-neutral-600" : "mt-1.5 text-xs leading-relaxed text-red-700/80"}>
          {description}
        </p>
        {children}
      </div>
    </div>
  );
}