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

export const BankInfoSection: React.FC<BankInfoSectionProps> = ({
  values,
  errors,
  onChange,
}) => {
  return (
    <div className="rounded-2xl border-2 border-border bg-taupe-50/60 p-3 lg:p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-taupe-900">
          Thông tin liên lạc &amp; ngân hàng
        </h3>
        <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">Bước 1</span>
      </div>

      <div>
        <label className="block text-xs font-medium text-taupe-700 mb-1">
          Số điện thoại <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phoneNumber"
          value={values.phoneNumber}
          onChange={onChange}
          placeholder="10-11 chữ số"
          className="w-full rounded-lg border border-border bg-white text-taupe-900 placeholder:text-taupe-400 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-taupe-700 mb-1">
            Tên ngân hàng <span className="text-red-500">*</span>
          </label>
          <select
            name="bankName"
            value={values.bankName}
            onChange={onChange}
            className="w-full rounded-lg border border-border bg-white text-taupe-900 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
          >
            <option value="">Chọn ngân hàng</option>
            {BANK_OPTIONS.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
          {errors.bankName && (
            <p className="mt-1 text-xs text-red-600">{errors.bankName}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-taupe-700 mb-1">
            Số tài khoản <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="accountNumber"
            value={values.accountNumber}
            onChange={onChange}
            placeholder="Chỉ nhập số"
            className="w-full rounded-lg border border-border bg-white text-taupe-900 placeholder:text-taupe-400 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
          />
          {errors.accountNumber && (
            <p className="mt-1 text-xs text-red-600">{errors.accountNumber}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-taupe-700 mb-1">
          Chủ tài khoản <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="accountHolder"
          value={values.accountHolder}
          onChange={onChange}
          placeholder="Họ tên in trên thẻ"
          className="w-full rounded-lg border border-border bg-white text-taupe-900 placeholder:text-taupe-400 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
        />
        {errors.accountHolder && (
          <p className="mt-1 text-xs text-red-600">{errors.accountHolder}</p>
        )}
      </div>
    </div>
  );
};