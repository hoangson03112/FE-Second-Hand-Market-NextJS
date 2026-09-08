import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { IconCheck, IconPhoto, IconUpload } from "@tabler/icons-react";
import type { BecomeSellerErrors } from "../hooks/useBecomeSeller";
import Image from "next/image";

interface IdCardSectionProps {
  idCardFront: File | null;
  idCardBack: File | null;
  avatar: File | null;
  errors: BecomeSellerErrors;
  onFileChange: (
    field: "idCardFront" | "idCardBack" | "avatar",
  ) => (e: ChangeEvent<HTMLInputElement>) => void;
}

function FileDropzone({
  file,
  label,
  required,
  error,
  onChange,
  inputId,
  variant = "document",
}: {
  file: File | null;
  label: string;
  required?: boolean;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputId: string;
  variant?: "document" | "avatar";
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

  if (variant === "avatar") {
    return (
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.08em] text-neutral-500">
          {label} {required && <span className="text-blush-600">*</span>}
        </label>

        <div className="flex items-center gap-3">
          <label
            htmlFor={inputId}
            className="group relative flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-luxury-ink/20 bg-white/60 transition-all duration-300 hover:border-luxury-champagne hover:bg-cream-50"
          >
            {previewUrl ? (
              <>
                <Image
                  src={previewUrl}
                  alt={label}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <IconUpload
                    className="h-4 w-4 text-white"
                    strokeWidth={1.75}
                  />
                </div>
              </>
            ) : (
              <IconPhoto
                className="h-5 w-5 text-blush-700 transition-colors duration-300 group-hover:text-luxury-champagne"
                strokeWidth={1.5}
              />
            )}
          </label>

          <div className="min-w-0">
            <p className="text-xs text-neutral-600">Nhấn để tải ảnh lên</p>
            <p className="text-2xs text-charcoal-600">JPG, PNG — tối đa 5MB</p>
            {file && !error && (
              <p className="mt-0.5 truncate text-xs text-neutral-500">
                {file.name}
              </p>
            )}
          </div>
        </div>

        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={onChange}
          className="sr-only"
        />

        {error && <p className="mt-1.5 text-xs text-blush-600">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.08em] text-neutral-500">
        {label} {required && <span className="text-blush-600">*</span>}
      </label>

      <label
        htmlFor={inputId}
        className="rounded-[2px] group relative flex aspect-[16/10] w-full max-w-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden border border-dashed border-luxury-ink/20 bg-white/60 transition-all duration-300 hover:border-luxury-champagne hover:bg-cream-50"
      >
        {previewUrl ? (
          <>
            <Image src={previewUrl} alt={label} fill className="object-cover" />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="flex items-center gap-1.5 text-2xs font-medium text-white">
                <IconUpload className="h-3 w-3" strokeWidth={1.75} />
                Đổi ảnh khác
              </p>
            </div>
            <div className="rounded-[2px] absolute right-1.5 top-1.5 flex items-center gap-1 bg-luxury-ink/85 px-1.5 py-0.5 text-2xs font-bold text-luxury-champagne backdrop-blur-sm">
              <IconCheck className="h-3 w-3" strokeWidth={2.5} />
              Đã tải lên
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 px-3 text-center">
            <span className="rounded-[2px] flex h-7 w-7 items-center justify-center border border-luxury-ink/15 bg-cream-50 text-taupe-400 transition-colors duration-300 group-hover:border-luxury-champagne/50 group-hover:text-luxury-champagne">
              <IconPhoto className="h-3.5 w-3.5" strokeWidth={1.5} />
            </span>
            <p className="text-xs font-medium text-neutral-600">
              Nhấn để tải ảnh lên
            </p>
            <p className="text-2xs text-charcoal-600">JPG, PNG — tối đa 5MB</p>
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
        <p className="mt-1.5 max-w-[220px] truncate text-xs text-neutral-500">
          {file.name}
        </p>
      )}
      {error && <p className="mt-1.5 text-xs text-blush-600">{error}</p>}
    </div>
  );
}

export const IdCardSection: React.FC<IdCardSectionProps> = ({
  idCardFront,
  idCardBack,
  avatar,
  errors,
  onFileChange,
}) => {
  return (
    <div className="rounded-[2px] border border-luxury-ink/8 bg-white/50 p-5 md:p-6">
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
          file={avatar}
          onChange={onFileChange("avatar")}
          variant="avatar"
        />
        <p className="mt-2 text-xs leading-relaxed text-charcoal-600">
          Ảnh đại diện giúp người mua dễ nhận diện gian hàng của bạn hơn.
        </p>
      </div>
    </div>
  );
};
