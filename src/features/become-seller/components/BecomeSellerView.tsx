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
  { icon: IconPackageExport, text: "ÄÄƒng sáº£n pháº©m khÃ´ng giá»›i háº¡n" },
  { icon: IconCashBanknote, text: "Nháº­n thanh toÃ¡n online an toÃ n" },
  { icon: IconShieldCheck, text: "Huy hiá»‡u Seller xÃ¡c minh" },
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
        <div className="max-w-8xl mx-auto w-full px-4 sm:px-6 h-14 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <IconArrowLeft className="w-4 h-4" />
            Quay láº¡i
          </button>
          <span className="text-muted-foreground/40 select-none">|</span>
          <span className="text-sm font-medium text-foreground">ÄÄƒng kÃ½ lÃ m Seller</span>
        </div>
      </div>

      <div className="max-w-8xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <IconBuildingStore className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground mb-1">
              {requiresVerification ? "XÃ¡c minh tÃ i khoáº£n Seller" : "Má»Ÿ gian hÃ ng cá»§a báº¡n"}
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              {requiresVerification
                ? "HoÃ n táº¥t xÃ¡c minh Ä‘á»ƒ má»Ÿ khÃ³a Ä‘Äƒng sáº£n pháº©m khÃ´ng giá»›i háº¡n vÃ  nháº­n thanh toÃ¡n online."
                : "Äiá»n thÃ´ng tin Ä‘á»ƒ trá»Ÿ thÃ nh seller trÃªn Eco Market vÃ  báº¯t Ä‘áº§u bÃ¡n hÃ ng ngay hÃ´m nay."}
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
          <div className="rounded-xl border border-primary/20 bg-primary/8 px-4 py-3 flex items-start gap-3">
            <IconClock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-primary/90">
              Báº¡n Ä‘Ã£ Ä‘Äƒng{" "}
              <span className="font-semibold">
                {productLimit.totalProducts}/{productLimit.limit}
              </span>{" "}
              sáº£n pháº©m. XÃ¡c minh tÃ i khoáº£n Ä‘á»ƒ Ä‘Äƒng khÃ´ng giá»›i háº¡n.
            </p>
          </div>
        )}

        {isCheckingStatus ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
          </div>
        ) : hasRequest && requestStatus === "pending" ? (
          <div className="rounded-2xl border border-primary/20 bg-primary/8 p-6 flex items-start gap-4">
            <IconClock className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-primary mb-1">
                Há»“ sÆ¡ Ä‘ang Ä‘Æ°á»£c xÃ©t duyá»‡t
              </h3>
              <p className="text-xs text-primary/80">
                Äá»™i ngÅ© Eco Market Ä‘ang kiá»ƒm duyá»‡t há»“ sÆ¡ cá»§a báº¡n trong vÃ²ng 24h. Báº¡n sáº½ nháº­n
                thÃ´ng bÃ¡o qua email khi cÃ³ káº¿t quáº£.
              </p>
              <Link
                href="/"
                className="mt-3 inline-flex items-center text-xs font-medium text-primary hover:underline"
              >
                Vá» trang chá»§
              </Link>
            </div>
          </div>
        ) : hasRequest && requestStatus === "rejected" ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/8 p-6 flex items-start gap-4">
            <IconCircleX className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-destructive mb-1">
                YÃªu cáº§u Ä‘Ã£ bá»‹ tá»« chá»‘i
              </h3>
              <p className="text-xs text-destructive/80">
                {apiError || "YÃªu cáº§u cá»§a báº¡n Ä‘Ã£ bá»‹ tá»« chá»‘i. Vui lÃ²ng liÃªn há»‡ há»— trá»£ Ä‘á»ƒ Ä‘Æ°á»£c giáº£i Ä‘Ã¡p."}
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
                  ? "Äang gá»­i há»“ sÆ¡..."
                  : requiresVerification
                    ? "XÃ¡c minh tÃ i khoáº£n seller"
                    : "Báº¯t Ä‘áº§u bÃ¡n hÃ ng"}
              </button>
              <button
                type="button"
                onClick={onBack}
                className="flex-1 h-11 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:bg-muted hover:text-foreground transition-colors"
              >
                Há»§y
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground pb-2">
              Há»“ sÆ¡ sáº½ Ä‘Æ°á»£c Ä‘á»™i ngÅ© Eco Market kiá»ƒm duyá»‡t trong vÃ²ng 24h.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
