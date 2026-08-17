import React from "react";
import Link from "next/link";
import type { ChangeEvent } from "react";
import { IconCheck } from "@tabler/icons-react";
import type { BecomeSellerFormValues, BecomeSellerErrors } from "../hooks/useBecomeSeller";

interface TermsSectionProps {
  values: BecomeSellerFormValues;
  errors: BecomeSellerErrors;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function TermRow({
  name,
  checked,
  onChange,
  error,
  children,
}: {
  name: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="group flex cursor-pointer items-start gap-3 py-1">
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only" />
        <span
          className={
            checked
              ? "mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center border border-luxury-ink bg-luxury-ink transition-all duration-200"
              : "mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center border border-luxury-ink/25 bg-white transition-all duration-200 group-hover:border-luxury-ink/50"
          }
          style={{ borderRadius: "2px" }}
        >
          {checked && <IconCheck className="h-3 w-3 text-luxury-champagne" strokeWidth={3} />}
        </span>
        <span className="text-sm leading-relaxed text-neutral-700">{children}</span>
      </label>
      {error && <p className="ml-8 mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export const TermsSection: React.FC<TermsSectionProps> = ({ values, errors, onChange }) => {
  return (
    <div className="border border-luxury-ink/8 bg-white/50 p-5 md:p-6" style={{ borderRadius: "2px" }}>
      <div className="space-y-3">
        <TermRow name="agreeTerms" checked={values.agreeTerms} onChange={onChange} error={errors.agreeTerms}>
          Tôi đồng ý với{" "}
          <Link href="/terms" className="font-medium text-luxury-ink underline decoration-luxury-champagne underline-offset-2 hover:text-accent">
            điều khoản sử dụng
          </Link>{" "}
          của Eco Market
        </TermRow>

        <TermRow name="agreePolicy" checked={values.agreePolicy} onChange={onChange} error={errors.agreePolicy}>
          Tôi đồng ý với{" "}
          <Link href="/privacy" className="font-medium text-luxury-ink underline decoration-luxury-champagne underline-offset-2 hover:text-accent">
            chính sách bảo mật
          </Link>
        </TermRow>
      </div>
    </div>
  );
};