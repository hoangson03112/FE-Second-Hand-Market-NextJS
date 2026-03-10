import {
  IconArrowLeft,
  IconBuildingStore,
  IconCashBanknote,
  IconCircleX,
  IconClock,
  IconPackageExport,
  IconShieldCheck,
} from "@tabler/icons-react";
import Link from "next/link";
import ErrorMessage from "@/features/auth/ErrorMessage";
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
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
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <IconArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          <span className="text-muted-foreground/40 select-none">|</span>
          <span className="text-sm font-medium text-foreground">Đăng ký làm Seller</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <IconBuildingStore className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground mb-1">
              {requiresVerification ? "Xác minh tài khoản Seller" : "Mở gian hàng của bạn"}
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              {requiresVerification
                ? "Hoàn tất xác minh để mở khóa đăng sản phẩm không giới hạn và nhận thanh toán online."
                : "Điền thông tin để trở thành seller trên Eco Market và bắt đầu bán hàng ngay hôm nay."}
            </p>
            <div className="flex flex-wrap gap-3">
              {PERKS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {productLimit && requiresVerification && requestStatus !== "approved" && (
          <div className="rounded-xl border border-primary/20 bg-primary/8 dark:bg-primary/15 px-4 py-3 flex items-start gap-3">
            <IconClock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-primary/90">
              Bạn đã đăng{" "}
              <span className="font-semibold">
                {productLimit.totalProducts}/{productLimit.limit}
              </span>{" "}
              sản phẩm. Xác minh tài khoản để đăng không giới hạn.
            </p>
          </div>
        )}

        {isCheckingStatus ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
          </div>
        ) : hasRequest && requestStatus === "pending" ? (
          <div className="rounded-2xl border border-primary/20 bg-primary/8 dark:bg-primary/15 p-6 flex items-start gap-4">
            <IconClock className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-primary mb-1">
                Hồ sơ đang được xét duyệt
              </h3>
              <p className="text-xs text-primary/80">
                Đội ngũ Eco Market đang kiểm duyệt hồ sơ của bạn trong vòng 24h. Bạn sẽ nhận
                thông báo qua email khi có kết quả.
              </p>
              <Link
                href="/"
                className="mt-3 inline-flex items-center text-xs font-medium text-primary hover:underline"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        ) : hasRequest && requestStatus === "rejected" ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/8 dark:bg-destructive/15 p-6 flex items-start gap-4">
            <IconCircleX className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-destructive mb-1">
                Yêu cầu đã bị từ chối
              </h3>
              <p className="text-xs text-destructive/80">
                {apiError || "Yêu cầu của bạn đã bị từ chối. Vui lòng liên hệ hỗ trợ để được giải đáp."}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorMessage message={apiError} />

            <BankInfoSection values={values} errors={errors} onChange={handleChange} />

            <IdCardSection
              idCardFront={idCardFront}
              idCardBack={idCardBack}
              errors={errors}
              onFileChange={handleFile}
            />

            <TermsSection values={values} errors={errors} onChange={handleChange} />

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="submit"
                disabled={isLoading || (hasRequest && requestStatus === "pending")}
                className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {isLoading
                  ? "Đang gửi hồ sơ..."
                  : requiresVerification
                    ? "Xác minh tài khoản seller"
                    : "Bắt đầu bán hàng"}
              </button>
              <button
                type="button"
                onClick={onBack}
                className="flex-1 h-11 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:bg-muted hover:text-foreground transition-colors"
              >
                Hủy
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground pb-2">
              Hồ sơ sẽ được đội ngũ Eco Market kiểm duyệt trong vòng 24h.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
