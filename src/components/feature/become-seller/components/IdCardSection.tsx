import React from "react";
import type { ChangeEvent } from "react";
import type { BecomeSellerErrors } from "../hooks/useBecomeSeller";

interface IdCardSectionProps {
  idCardFront: File | null;
  idCardBack: File | null;
  errors: BecomeSellerErrors;
  onFileChange: (field: "idCardFront" | "idCardBack" | "avatar") => (e: ChangeEvent<HTMLInputElement>) => void;
}

export const IdCardSection: React.FC<IdCardSectionProps> = ({
  idCardFront,
  idCardBack,
  errors,
  onFileChange,
}) => {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-3 lg:p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">
          Ảnh CCCD/CMND <span className="text-red-500">*</span>
        </h3>
        <span className="text-[11px] font-medium text-primary">Bước 3</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1">Mặt trước</label>
          <div className="rounded-lg border border-dashed border-border bg-background px-3 py-2">
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange("idCardFront")}
              className="w-full text-xs text-muted-foreground file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-primary file:text-white"
            />
            {idCardFront && (
              <p className="mt-1 text-[11px] text-green-600 truncate">
                {idCardFront.name}
              </p>
            )}
            {errors.idCardFront && (
              <p className="mt-1 text-xs text-red-500">{errors.idCardFront}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Mặt sau</label>
          <div className="rounded-lg border border-dashed border-border bg-background px-3 py-2">
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange("idCardBack")}
              className="w-full text-xs text-muted-foreground file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-primary file:text-white"
            />
            {idCardBack && (
              <p className="mt-1 text-[11px] text-green-600 truncate">
                {idCardBack.name}
              </p>
            )}
            {errors.idCardBack && (
              <p className="mt-1 text-xs text-red-500">{errors.idCardBack}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">
          Ảnh đại diện (tùy chọn)
        </label>
        <div className="rounded-lg border border-dashed border-border bg-background px-3 py-2">
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange("avatar")}
            className="w-full text-xs text-muted-foreground file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-primary file:text-white"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Ảnh đại diện giúp người mua dễ nhận diện gian hàng của bạn hơn.
          </p>
        </div>
      </div>
    </div>
  );
};

