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
        <IconLoader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <IconBuildingBank className="w-6 h-6 text-primary" />
          Thông tin ngân hàng
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Tài khoản nhận tiền khi bán hàng. Chỉ hiển thị và chỉnh sửa được với tài khoản Seller.
        </p>
      </div>

      <div className="p-6">
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mb-6">
          <div className="flex gap-3">
            <IconAlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">Lưu ý</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Thông tin ngân hàng dùng để nhận thanh toán từ người mua. Đảm bảo nhập chính xác để tránh sai lệch.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tên ngân hàng <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <select
                name="bankName"
                value={formData.bankName}
                onChange={onChange}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none"
                required
              >
                <option value="">Chọn ngân hàng</option>
                {BANK_OPTIONS.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              <IconBuildingBank className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Số tài khoản <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={onChange}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-mono"
                placeholder="Chỉ nhập số"
                required
              />
              <IconCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Chủ tài khoản <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="accountHolder"
                value={formData.accountHolder}
                onChange={onChange}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                placeholder="Họ tên in trên thẻ"
                required
              />
              <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              <span className="text-destructive">*</span> Bắt buộc
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2 shrink-0"
            >
              {isSubmitting ? (
                <>
                  <IconLoader2 className="w-4 h-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <IconCircleCheck className="w-4 h-4" />
                  Lưu thông tin ngân hàng
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
