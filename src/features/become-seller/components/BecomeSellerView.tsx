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
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="sticky top-0 z-10 border-b-2 border-border bg-cream-50/95 backdrop-blur-md">
        <div className="max-w-8xl mx-auto w-full px-4 sm:px-6 h-14 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-taupe-500 hover:text-taupe-900 transition-colors"
          >
            <IconArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          <span className="text-taupe-300 select-none">|</span>
          <span className="text-sm font-medium text-taupe-900">
            Đăng ký làm Seller
          </span>
        </div>
      </div>

      <div className="max-w-8xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        <div className="rounded-2xl border-2 border-border bg-gradient-to-br from-cream-50 to-white p-6 flex items-start gap-4 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <IconBuildingStore className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-taupe-900 mb-1">
              {requiresVerification
                ? "Xác minh tài khoản Seller"
                : "Mở gian hàng của bạn"}
            </h1>
            <p className="text-sm text-taupe-500 mb-4">
              {requiresVerification
                ? "Hoàn tất xác minh để mở khóa đăng sản phẩm không giới hạn và nhận thanh toán online."
                : "Điền thông tin để trở thành seller trên Eco Market và bắt đầu bán hàng ngay hôm nay."}
            </p>
            <div className="flex flex-wrap gap-3">
              {PERKS.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-1.5 text-xs text-taupe-500"
                >
                  <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {productLimit &&
          requiresVerification &&
          requestStatus !== "approved" && (
            <div className="rounded-xl border-2 border-primary/20 bg-primary/5 px-4 py-3 flex items-start gap-3">
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
          <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 flex items-start gap-4 shadow-md">
            <IconClock className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-primary mb-1">
                Hồ sơ đang được xét duyệt
              </h3>
              <p className="text-xs text-primary/80">
                Đội ngũ Eco Market đang kiểm duyệt hồ sơ của bạn trong vòng 24h.
                Bạn sẽ nhận thông báo qua email khi có kết quả.
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
          <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 flex items-start gap-4 shadow-md">
            <IconCircleX className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-700 mb-1">
                Yêu cầu đã bị từ chối
              </h3>
              <p className="text-xs text-red-700/80">
                {apiError ||
                  "Yêu cầu của bạn đã bị từ chối. Vui lòng liên hệ hỗ trợ để được giải đáp."}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorMessage message={apiError} />

            <BankInfoSection
              values={values}
              errors={errors}
              onChange={handleChange}
            />

            <IdCardSection
              idCardFront={idCardFront}
              idCardBack={idCardBack}
              errors={errors}
              onFileChange={handleFile}
            />

            <TermsSection
              values={values}
              errors={errors}
              onChange={handleChange}
            />

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="submit"
                disabled={
                  isLoading || (hasRequest && requestStatus === "pending")
                }
                className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-bold text-sm tracking-wide hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
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
                className="flex-1 h-11 rounded-xl border-2 border-taupe-300/80 text-taupe-700 text-sm font-semibold hover:bg-taupe-50 hover:border-taupe-500/70 transition-all duration-200"
              >
                Hủy
              </button>
            </div>

            <p className="text-center text-xs text-taupe-500 pb-2">
              Hồ sơ sẽ được đội ngũ Eco Market kiểm duyệt trong vòng 24h.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
