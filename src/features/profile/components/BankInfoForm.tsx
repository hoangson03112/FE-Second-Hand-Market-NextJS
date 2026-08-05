import {
  IconLoader2,
  IconBuildingBank,
  IconCreditCard,
  IconUser,
  IconCircleCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { BANK_CODE_MAP } from "@/constants";
import type { BankFormData } from "../types";

const BANK_OPTIONS = Object.keys(BANK_CODE_MAP);

interface BankInfoFormProps {
  formData: BankFormData;
  isSubmitting: boolean;
  isLoading?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function BankInfoForm({
  formData,
  isSubmitting,
  isLoading,
  onSubmit,
  onChange,
}: BankInfoFormProps) {
  if (isLoading) {
    return (
      <div className="p-12 flex items-center justify-center">
        <IconLoader2 className="w-8 h-8 animate-spin text-luxury-ink" />
      </div>
    );
  }

  return (
    <div>
      <div className="px-6 py-6 border-b border-luxury-ink/10">
        <h2 className="text-2xl text-luxury-ink flex items-center gap-2" style={{ fontFamily: "var(--font-droid-serif), serif" }}>
          <IconBuildingBank className="w-6 h-6 text-luxury-ink" />
          Thông tin ngân hàng
        </h2>
        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-taupe-500 mt-2">
          Tài khoản nhận tiền khi bán hàng. Chỉ hiển thị và chỉnh sửa được với tài khoản Seller.
        </p>
      </div>

      <div className="p-6 lg:p-8">
        <div className="p-4 rounded-[2px] bg-taupe-50/50 border border-luxury-ink/10 mb-6">
          <div className="flex gap-3">
            <IconAlertCircle className="w-5 h-5 text-luxury-ink shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-wide font-semibold text-luxury-ink">Lưu ý</h4>
              <p className="text-xs text-luxury-ink/80 mt-1">
                Thông tin ngân hàng dùng để nhận thanh toán từ người mua. Đảm bảo nhập chính xác để tránh sai lệch.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
          <div>
            <label className="block text-[11px] uppercase tracking-wide font-semibold text-luxury-ink mb-2">
              Tên ngân hàng <span className="text-blush-600">*</span>
            </label>
            <div className="relative">
              <select
                name="bankName"
                value={formData.bankName}
                onChange={onChange}
                className="w-full h-11 pl-10 pr-4 rounded-[2px] border border-luxury-ink/20 bg-transparent text-sm outline-none focus:border-luxury-ink focus:ring-1 focus:ring-luxury-ink transition-all appearance-none"
                required
              >
                <option value="">Chọn ngân hàng</option>
                {BANK_OPTIONS.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              <IconBuildingBank className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wide font-semibold text-luxury-ink mb-2">
              Số tài khoản <span className="text-blush-600">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={onChange}
                className="w-full h-11 pl-10 pr-4 rounded-[2px] border border-luxury-ink/20 bg-transparent text-sm outline-none focus:border-luxury-ink focus:ring-1 focus:ring-luxury-ink transition-all font-mono"
                placeholder="Chỉ nhập số"
                required
              />
              <IconCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wide font-semibold text-luxury-ink mb-2">
              Chủ tài khoản <span className="text-blush-600">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="accountHolder"
                value={formData.accountHolder}
                onChange={onChange}
                className="w-full h-11 pl-10 pr-4 rounded-[2px] border border-luxury-ink/20 bg-transparent text-sm outline-none focus:border-luxury-ink focus:ring-1 focus:ring-luxury-ink transition-all"
                placeholder="Họ tên in trên thẻ"
                required
              />
              <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe-400 pointer-events-none" />
            </div>
          </div>

          <div className="border-t border-luxury-ink/10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              <span className="text-blush-600">*</span> Bắt buộc
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-8 rounded-[2px] bg-luxury-ink text-white uppercase tracking-[0.2em] text-[11px] font-semibold hover:bg-luxury-ink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2 shrink-0"
            >
              {isSubmitting ? (
                <>
                  <IconLoader2 className="w-4 h-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <IconCircleCheck className="w-4 h-4" />
                  Lưu thông tin
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
