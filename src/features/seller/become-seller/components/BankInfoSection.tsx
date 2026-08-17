import React from "react";
import type { ChangeEvent } from "react";
import type { BecomeSellerFormValues, BecomeSellerErrors } from "../hooks/useBecomeSeller";
import { BANK_CODE_MAP } from "@/constants";

interface BankInfoSectionProps {
  values: BecomeSellerFormValues;
  errors: BecomeSellerErrors;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const BANK_OPTIONS = Object.keys(BANK_CODE_MAP);

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
      {children} {required && <span className="text-accent">*</span>}
    </label>
  );
}

const inputClass =
  "w-full border border-luxury-ink/15 bg-white/70 px-3.5 py-2.5 text-sm text-luxury-ink placeholder:text-taupe-400/70 outline-none transition-colors duration-300 hover:border-luxury-ink/25 focus:border-luxury-champagne focus:bg-white";

export const BankInfoSection: React.FC<BankInfoSectionProps> = ({
  values,
  errors,
  onChange,
}) => {
  return (
    <div className="border border-luxury-ink/8 bg-white/50 p-5 md:p-6" style={{ borderRadius: "2px" }}>
      <div className="space-y-4">
        <div>
          <FieldLabel required>Số điện thoại</FieldLabel>
          <input
            type="tel"
            name="phoneNumber"
            value={values.phoneNumber}
            onChange={onChange}
            placeholder="10-11 chữ số"
            className={inputClass}
            style={{ borderRadius: "2px" }}
          />
          {errors.phoneNumber && <p className="mt-1.5 text-xs text-red-600">{errors.phoneNumber}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel required>Tên ngân hàng</FieldLabel>
            <div className="relative">
              <select
                name="bankName"
                value={values.bankName}
                onChange={onChange}
                className={`${inputClass} appearance-none pr-9`}
                style={{ borderRadius: "2px" }}
              >
                <option value="">Chọn ngân hàng</option>
                {BANK_OPTIONS.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-taupe-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {errors.bankName && <p className="mt-1.5 text-xs text-red-600">{errors.bankName}</p>}
          </div>

          <div>
            <FieldLabel required>Số tài khoản</FieldLabel>
            <input
              type="text"
              name="accountNumber"
              value={values.accountNumber}
              onChange={onChange}
              placeholder="Chỉ nhập số"
              className={inputClass}
              style={{ borderRadius: "2px" }}
            />
            {errors.accountNumber && <p className="mt-1.5 text-xs text-red-600">{errors.accountNumber}</p>}
          </div>
        </div>

        <div>
          <FieldLabel required>Chủ tài khoản</FieldLabel>
          <input
            type="text"
            name="accountHolder"
            value={values.accountHolder}
            onChange={onChange}
            placeholder="Họ tên in trên thẻ"
            className={inputClass}
            style={{ borderRadius: "2px" }}
          />
          {errors.accountHolder && <p className="mt-1.5 text-xs text-red-600">{errors.accountHolder}</p>}
        </div>
      </div>
    </div>
  );
};