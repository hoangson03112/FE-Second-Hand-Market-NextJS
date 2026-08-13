import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { IconCheck, IconPhoto, IconUpload } from "@tabler/icons-react";
import type { BecomeSellerErrors } from "../hooks/useBecomeSeller";

interface IdCardSectionProps {
  idCardFront: File | null;
  idCardBack: File | null;
  errors: BecomeSellerErrors;
  onFileChange: (field: "idCardFront" | "idCardBack" | "avatar") => (e: ChangeEvent<HTMLInputElement>) => void;
}

/* ── Dropzone card với preview ảnh — thay input file mặc định khó dùng ── */
function FileDropzone({
  file,
  label,
  required,
  error,
  onChange,
  inputId,
}: {
  file: File | null;
  label: string;
  required?: boolean;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputId: string;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
        {label} {required && <span className="text-accent">*</span>}
      </label>

      <label
        htmlFor={inputId}
        className="group relative flex aspect-[16/10] w-full cursor-pointer flex-col items-center justify-center overflow-hidden border border-dashed border-luxury-ink/20 bg-white/60 transition-all duration-300 hover:border-luxury-champagne hover:bg-cream-50"
        style={{ borderRadius: "2px" }}
      >
        {previewUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt={label} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="flex items-center gap-1.5 text-[11px] font-medium text-white">
                <IconUpload className="h-3.5 w-3.5" strokeWidth={1.75} />
                Đổi ảnh khác
              </p>
            </div>
            <div
              className="absolute right-2 top-2 flex items-center gap-1 bg-luxury-ink/85 px-2 py-1 text-[10px] font-semibold text-luxury-champagne backdrop-blur-sm"
              style={{ borderRadius: "2px" }}
            >
              <IconCheck className="h-3 w-3" strokeWidth={2.5} />
              Đã tải lên
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <span
              className="flex h-9 w-9 items-center justify-center border border-luxury-ink/15 bg-cream-50 text-taupe-400 transition-colors duration-300 group-hover:border-luxury-champagne/50 group-hover:text-luxury-champagne"
              style={{ borderRadius: "2px" }}
            >
              <IconPhoto className="h-4 w-4" strokeWidth={1.5} />
            </span>
            <p className="text-[12px] font-medium text-neutral-600">
              Nhấn để tải ảnh lên
            </p>
            <p className="text-[10px] text-taupe-400">JPG, PNG — tối đa 5MB</p>
          </div>
        )}
      </label>

      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="sr-only"
      />

      {file && !error && (
        <p className="mt-1.5 truncate text-[11px] text-neutral-500">{file.name}</p>
      )}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export const IdCardSection: React.FC<IdCardSectionProps> = ({
  idCardFront,
  idCardBack,
  errors,
  onFileChange,
}) => {
  return (
    <div className="border border-luxury-ink/8 bg-white/50 p-5 md:p-6" style={{ borderRadius: "2px" }}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FileDropzone
          inputId="idCardFront"
          label="Mặt trước CCCD/CMND"
          required
          file={idCardFront}
          error={errors.idCardFront}
          onChange={onFileChange("idCardFront")}
        />
        <FileDropzone
          inputId="idCardBack"
          label="Mặt sau CCCD/CMND"
          required
          file={idCardBack}
          error={errors.idCardBack}
          onChange={onFileChange("idCardBack")}
        />
      </div>

      <div className="mt-4 border-t border-luxury-ink/6 pt-4">
        <FileDropzone
          inputId="avatar"
          label="Ảnh đại diện (tùy chọn)"
          file={null}
          onChange={onFileChange("avatar")}
        />
        <p className="mt-2 text-[11px] leading-relaxed text-taupe-400">
          Ảnh đại diện giúp người mua dễ nhận diện gian hàng của bạn hơn.
        </p>
      </div>
    </div>
  );
};