import React from "react";
import Link from "next/link";
import type { ChangeEvent } from "react";
import type { BecomeSellerFormValues, BecomeSellerErrors } from "../hooks/useBecomeSeller";

interface TermsSectionProps {
  values: BecomeSellerFormValues;
  errors: BecomeSellerErrors;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const TermsSection: React.FC<TermsSectionProps> = ({ values, errors, onChange }) => {
  return (
    <div className="rounded-2xl border-2 border-border bg-taupe-50/60 p-3 lg:p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-taupe-900">Điều khoản & chính sách</h3>
        <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">Bước 3</span>
      </div>

      <div className="space-y-2">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={values.agreeTerms}
            onChange={onChange}
            className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
          />
          <span className="text-sm leading-snug text-taupe-700">
            Tôi đồng ý với{" "}
            <Link href="/terms" className="text-primary underline">
              điều khoản sử dụng
            </Link>{" "}
            của Eco Market
          </span>
        </label>
        {errors.agreeTerms && (
          <p className="text-xs text-red-600">{errors.agreeTerms}</p>
        )}

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="agreePolicy"
            checked={values.agreePolicy}
            onChange={onChange}
            className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
          />
          <span className="text-sm leading-snug text-taupe-700">
            Tôi đồng ý với{" "}
            <Link href="/privacy" className="text-primary underline">
              chính sách bảo mật
            </Link>
          </span>
        </label>
        {errors.agreePolicy && (
          <p className="text-xs text-red-600">{errors.agreePolicy}</p>
        )}
      </div>
    </div>
  );
};