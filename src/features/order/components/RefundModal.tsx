"use client";

import { useRef, useState, useEffect } from "react";
import {
  IconPhoto,
  IconVideo,
  IconUpload,
  IconCheck,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
  IconShield,
  IconTrash,
  IconAlertCircle,
  IconBuildingBank,
  IconX,
} from "@tabler/icons-react";
import { BANK_CODE_MAP } from "@/constants";
import {
  REFUND_REASON_OPTIONS,
  REFUND_MAX_IMAGES,
  REFUND_MAX_VIDEOS,
} from "@/constants/refund";
import { formatFileSize } from "@/utils/file";

const REFUND_BANK_OPTIONS = Object.keys(BANK_CODE_MAP);

const STEPS = ["Lý do", "Bằng chứng", "Ngân hàng", "Xác nhận"];

export interface RefundModalProps {
  open: boolean;
  reason: string;
  description: string;
  images: File[];
  videos: File[];
  isSubmitting: boolean;
  onReasonChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onImagesChange: (images: File[]) => void;
  onVideosChange: (videos: File[]) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  bankName: string;
  setBankName: (v: string) => void;
  accountNumber: string;
  setAccountNumber: (v: string) => void;
  accountHolder: string;
  setAccountHolder: (v: string) => void;
}

const inputClass =
  "w-full border border-luxury-ink/15 bg-white px-3.5 py-2.5 text-sm text-luxury-ink placeholder:text-taupe-400/70 outline-none transition-colors duration-300 hover:border-luxury-ink/25 focus:border-luxury-champagne";

export function RefundModal({
  open,
  reason,
  description,
  images,
  videos,
  isSubmitting,
  onReasonChange,
  onDescriptionChange,
  onImagesChange,
  onVideosChange,
  onClose,
  onSubmit,
  bankName,
  setBankName,
  accountNumber,
  setAccountNumber,
  accountHolder,
  setAccountHolder,
}: RefundModalProps) {
  const [step, setStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setStep(1);
  }, [open]);

  if (!open) return null;

  const selectedReason =
    REFUND_REASON_OPTIONS.find((r) => r.value === reason) ?? null;
  const SelectedIcon = selectedReason?.icon ?? null;

  const canProceed =
    step === 1
      ? reason !== ""
      : step === 2
        ? description.trim().length >= 10
        : step === 3
          ? Boolean(
              bankName.trim() && accountNumber.trim() && accountHolder.trim(),
            )
          : true;

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    onImagesChange([...images, ...files].slice(0, REFUND_MAX_IMAGES));
    e.target.value = "";
  };

  const handleVideoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    onVideosChange([...videos, ...files].slice(0, REFUND_MAX_VIDEOS));
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const imgFiles = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    const vidFiles = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("video/"),
    );
    if (imgFiles.length)
      onImagesChange([...images, ...imgFiles].slice(0, REFUND_MAX_IMAGES));
    if (vidFiles.length)
      onVideosChange([...videos, ...vidFiles].slice(0, REFUND_MAX_VIDEOS));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-ink/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden bg-luxury-ivory shadow-2xl"
        style={{ borderRadius: "2px" }}
      >
        {/* ── HEADER ── */}
        <div className="relative flex items-start justify-between border-b border-luxury-ink/8 px-6 py-5">
          <div className="flex items-center gap-3.5">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center border border-luxury-champagne/30 bg-luxury-champagne/10"
              style={{ borderRadius: "2px" }}
            >
              <IconAlertCircle
                className="h-5 w-5 text-luxury-champagne"
                strokeWidth={1.75}
              />
            </span>
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-droid-serif), serif",
                  fontWeight: 400,
                }}
                className="text-lg leading-tight text-luxury-ink"
              >
                Yêu cầu hoàn tiền
              </h2>
              <p className="mt-0.5 text-xs text-neutral-500">
                Vui lòng cung cấp đầy đủ thông tin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-taupe-400 transition-colors hover:text-luxury-ink disabled:opacity-40"
            aria-label="Đóng"
          >
            <IconX className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* ── STEPPER — editorial numbered, nối bằng đường champagne ── */}
        <div className="flex items-center gap-1 border-b border-luxury-ink/8 bg-white/60 px-6 py-4">
          {STEPS.map((label, i) => {
            const stepNum = i + 1;
            const isDone = stepNum < step;
            const isCurrent = stepNum === step;
            return (
              <div
                key={label}
                className="flex flex-1 items-center last:flex-none"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={
                      isCurrent
                        ? "flex h-6 w-6 shrink-0 items-center justify-center bg-luxury-ink text-[11px] font-bold text-luxury-champagne"
                        : isDone
                          ? "flex h-6 w-6 shrink-0 items-center justify-center bg-luxury-champagne text-luxury-ink"
                          : "flex h-6 w-6 shrink-0 items-center justify-center border border-luxury-ink/20 text-[11px] font-bold text-taupe-400"
                    }
                    style={{ borderRadius: "2px" }}
                  >
                    {isDone ? (
                      <IconCheck className="h-3 w-3" strokeWidth={2.5} />
                    ) : (
                      stepNum
                    )}
                  </span>
                  <span
                    className={
                      isCurrent
                        ? "hidden text-[11px] font-bold uppercase tracking-[0.12em] text-luxury-ink sm:inline"
                        : "hidden text-[11px] font-medium uppercase tracking-[0.12em] text-taupe-400 sm:inline"
                    }
                  >
                    {label}
                  </span>
                </div>
                {stepNum < STEPS.length && (
                  <span
                    className={
                      isDone
                        ? "mx-2 h-px flex-1 bg-luxury-champagne"
                        : "mx-2 h-px flex-1 bg-luxury-ink/10"
                    }
                  />
                )}
              </div>
            );
          })}
        </div>

        <form
          onSubmit={onSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-5 px-6 py-6">
              {/* ── STEP 1 — LÝ DO ── */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h4
                      style={{ fontFamily: "var(--font-droid-serif), serif" }}
                      className="text-base text-luxury-ink"
                    >
                      Chọn lý do hoàn tiền
                    </h4>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      Chọn lý do phù hợp nhất với vấn đề của bạn
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {REFUND_REASON_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = reason === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => onReasonChange(opt.value)}
                          className={
                            isSelected
                              ? "relative flex items-start gap-3 border border-luxury-champagne bg-cream-50 p-3.5 text-left transition-all duration-300"
                              : "relative flex items-start gap-3 border border-luxury-ink/12 bg-white/60 p-3.5 text-left transition-all duration-300 hover:border-luxury-ink/25 hover:bg-cream-50/60"
                          }
                          style={{ borderRadius: "2px" }}
                        >
                          <div
                            className={
                              isSelected
                                ? "flex h-9 w-9 shrink-0 items-center justify-center bg-luxury-ink"
                                : "flex h-9 w-9 shrink-0 items-center justify-center bg-luxury-ink/5"
                            }
                            style={{ borderRadius: "2px" }}
                          >
                            <Icon
                              className={
                                isSelected
                                  ? "h-4.5 w-4.5 text-luxury-champagne"
                                  : "h-4.5 w-4.5 text-taupe-400"
                              }
                              strokeWidth={1.5}
                            />
                          </div>
                          <div className="min-w-0 flex-1 pt-0.5">
                            <p
                              className={
                                isSelected
                                  ? "text-sm font-medium leading-tight text-luxury-ink"
                                  : "text-sm font-medium leading-tight text-neutral-700"
                              }
                            >
                              {opt.label}
                            </p>
                            <p className="mt-0.5 text-xs leading-snug text-neutral-400">
                              {opt.desc}
                            </p>
                          </div>
                          {isSelected && (
                            <span
                              className="absolute right-2 top-2 flex h-4.5 w-4.5 items-center justify-center bg-luxury-champagne"
                              style={{ borderRadius: "2px" }}
                            >
                              <IconCheck
                                className="h-2.5 w-2.5 text-luxury-ink"
                                strokeWidth={3}
                              />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div
                    className="flex gap-2.5 border border-luxury-ink/8 bg-white/60 p-3.5"
                    style={{ borderRadius: "2px" }}
                  >
                    <IconAlertCircle
                      className="mt-0.5 h-4 w-4 shrink-0 text-taupe-400"
                      strokeWidth={1.75}
                    />
                    <p className="text-xs leading-relaxed text-neutral-600">
                      Yêu cầu sẽ được xem xét trong vòng{" "}
                      <strong className="text-luxury-ink">24–48 giờ</strong>.
                      Cung cấp thông tin chính xác giúp xử lý nhanh hơn.
                    </p>
                  </div>
                </div>
              )}

              {/* ── STEP 2 — BẰNG CHỨNG ── */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h4
                      style={{ fontFamily: "var(--font-droid-serif), serif" }}
                      className="text-base text-luxury-ink"
                    >
                      Mô tả &amp; Bằng chứng
                    </h4>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      Cung cấp chi tiết và hình ảnh để tăng tốc xử lý
                    </p>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                      Mô tả chi tiết <span className="text-accent">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => onDescriptionChange(e.target.value)}
                      rows={4}
                      maxLength={1000}
                      disabled={isSubmitting}
                      className={`${inputClass} resize-none disabled:opacity-60`}
                      style={{ borderRadius: "2px" }}
                      placeholder="Mô tả chi tiết vấn đề: sản phẩm hỏng ở đâu, sai như thế nào, thiếu gì..."
                    />
                    <div className="mt-1.5 flex items-center justify-between">
                      <p
                        className={
                          description.trim().length < 10 &&
                          description.length > 0
                            ? "text-xs text-red-600/80"
                            : "text-xs text-taupe-400"
                        }
                      >
                        {description.trim().length < 10 &&
                        description.length > 0
                          ? `Cần thêm ${10 - description.trim().length} ký tự`
                          : `${description.length}/1000`}
                      </p>
                      {description.trim().length >= 10 && (
                        <span className="flex items-center gap-1 text-xs font-medium text-luxury-ink">
                          <IconCheck
                            className="h-3.5 w-3.5 text-luxury-champagne"
                            strokeWidth={2.5}
                          />
                          Đủ mô tả
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                        <IconPhoto className="h-3.5 w-3.5" strokeWidth={1.75} />
                        Ảnh bằng chứng
                      </label>
                      <span
                        className="border border-luxury-ink/10 bg-cream-50 px-2 py-0.5 text-[10px] font-medium text-taupe-500"
                        style={{ borderRadius: "2px" }}
                      >
                        {images.length}/{REFUND_MAX_IMAGES}
                      </span>
                    </div>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={
                        isDragging
                          ? "border border-dashed border-luxury-champagne bg-cream-50 transition-all duration-300"
                          : "border border-dashed border-luxury-ink/20 bg-white/50 transition-all duration-300"
                      }
                      style={{ borderRadius: "2px" }}
                    >
                      {images.length === 0 ? (
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          disabled={isSubmitting}
                          className="flex w-full flex-col items-center justify-center gap-2 py-7 transition-colors hover:bg-cream-50/70 disabled:opacity-50"
                          style={{ borderRadius: "2px" }}
                        >
                          <span
                            className="flex h-10 w-10 items-center justify-center border border-luxury-ink/12 bg-cream-50"
                            style={{ borderRadius: "2px" }}
                          >
                            <IconUpload
                              className="h-4.5 w-4.5 text-taupe-400"
                              strokeWidth={1.5}
                            />
                          </span>
                          <p className="text-[13px] font-medium text-neutral-600">
                            {isDragging
                              ? "Thả ảnh vào đây"
                              : "Kéo & thả, hoặc click để chọn"}
                          </p>
                          <p className="text-[11px] text-taupe-400">
                            JPG, PNG, WEBP — tối đa {REFUND_MAX_IMAGES} ảnh
                          </p>
                        </button>
                      ) : (
                        <div className="p-3">
                          <div className="grid grid-cols-5 gap-2">
                            {images.map((file, i) => (
                              <div
                                key={i}
                                className="group relative aspect-square overflow-hidden border border-luxury-ink/10"
                                style={{ borderRadius: "2px" }}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className="h-full w-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    onImagesChange(
                                      images.filter((_, idx) => idx !== i),
                                    )
                                  }
                                  disabled={isSubmitting}
                                  className="absolute inset-0 flex items-center justify-center bg-luxury-ink/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                  <IconTrash
                                    className="h-4 w-4"
                                    strokeWidth={1.75}
                                  />
                                </button>
                              </div>
                            ))}
                            {images.length < REFUND_MAX_IMAGES && (
                              <button
                                type="button"
                                onClick={() => imageInputRef.current?.click()}
                                disabled={isSubmitting}
                                className="flex aspect-square items-center justify-center border border-dashed border-luxury-ink/20 transition-colors hover:border-luxury-champagne hover:bg-cream-50"
                                style={{ borderRadius: "2px" }}
                              >
                                <IconUpload
                                  className="h-4 w-4 text-taupe-400"
                                  strokeWidth={1.5}
                                />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageInput}
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                        <IconVideo className="h-3.5 w-3.5" strokeWidth={1.75} />
                        Video bằng chứng
                      </label>
                      <span
                        className="border border-luxury-ink/10 bg-cream-50 px-2 py-0.5 text-[10px] font-medium text-taupe-500"
                        style={{ borderRadius: "2px" }}
                      >
                        {videos.length}/{REFUND_MAX_VIDEOS}
                      </span>
                    </div>
                    {videos.length > 0 && (
                      <ul className="mb-2 space-y-2">
                        {videos.map((file, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 border border-luxury-ink/10 bg-white/60 px-3 py-2.5"
                            style={{ borderRadius: "2px" }}
                          >
                            <span
                              className="flex h-8 w-8 shrink-0 items-center justify-center bg-luxury-ink/5"
                              style={{ borderRadius: "2px" }}
                            >
                              <IconVideo
                                className="h-4 w-4 text-taupe-500"
                                strokeWidth={1.5}
                              />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-luxury-ink">
                                {file.name}
                              </p>
                              <p className="text-xs text-taupe-400">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                onVideosChange(
                                  videos.filter((_, idx) => idx !== i),
                                )
                              }
                              disabled={isSubmitting}
                              className="p-1.5 text-taupe-400 transition-colors hover:text-luxury-ink disabled:opacity-50"
                            >
                              <IconX className="h-4 w-4" strokeWidth={1.75} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {videos.length < REFUND_MAX_VIDEOS && (
                      <>
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/*"
                          multiple
                          className="hidden"
                          onChange={handleVideoInput}
                        />
                        <button
                          type="button"
                          onClick={() => videoInputRef.current?.click()}
                          disabled={isSubmitting}
                          className="flex w-full items-center justify-center gap-2 border border-dashed border-luxury-ink/20 px-4 py-3 text-sm text-neutral-500 transition-all duration-300 hover:border-luxury-champagne hover:bg-cream-50 disabled:opacity-50"
                          style={{ borderRadius: "2px" }}
                        >
                          <IconUpload className="h-4 w-4" strokeWidth={1.5} />
                          Thêm video
                          {videos.length > 0
                            ? ` (còn ${REFUND_MAX_VIDEOS - videos.length} slot)`
                            : ""}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* ── STEP 3 — NGÂN HÀNG ── */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h4
                      style={{ fontFamily: "var(--font-droid-serif), serif" }}
                      className="text-base text-luxury-ink"
                    >
                      Thông tin ngân hàng
                    </h4>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      Nhập tài khoản ngân hàng để nhận tiền hoàn nếu yêu cầu
                      được chấp thuận.
                    </p>
                  </div>

                  <div
                    className="flex items-start gap-3 border border-luxury-champagne/30 bg-luxury-champagne/8 p-4"
                    style={{ borderRadius: "2px" }}
                  >
                    <IconBuildingBank
                      className="mt-0.5 h-4.5 w-4.5 shrink-0 text-taupe-700"
                      strokeWidth={1.75}
                    />
                    <p className="text-xs leading-relaxed text-neutral-700">
                      Thông tin ngân hàng được mã hóa và chỉ dùng để chuyển
                      khoản hoàn tiền. Bạn sẽ không cần nhập lại sau này.
                    </p>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                      Tên ngân hàng
                    </label>
                    <div className="relative">
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        disabled={isSubmitting}
                        required
                        className={`${inputClass} appearance-none pl-10 pr-9 disabled:opacity-50`}
                        style={{ borderRadius: "2px" }}
                      >
                        <option value="">Chọn ngân hàng</option>
                        {bankName.trim() &&
                          !REFUND_BANK_OPTIONS.includes(bankName) && (
                            <option value={bankName}>{bankName}</option>
                          )}
                        {REFUND_BANK_OPTIONS.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                      <IconBuildingBank
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-taupe-400"
                        strokeWidth={1.75}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                      Số tài khoản
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Nhập số tài khoản..."
                      className={`${inputClass} font-mono disabled:opacity-50`}
                      style={{ borderRadius: "2px" }}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                      Tên chủ tài khoản
                    </label>
                    <input
                      type="text"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Tên đầy đủ (in hoa) trên tài khoản..."
                      className={`${inputClass} uppercase placeholder:normal-case disabled:opacity-50`}
                      style={{ borderRadius: "2px" }}
                    />
                  </div>
                </div>
              )}

              {/* ── STEP 4 — XÁC NHẬN ── */}
              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <h4
                      style={{ fontFamily: "var(--font-droid-serif), serif" }}
                      className="text-base text-luxury-ink"
                    >
                      Xác nhận yêu cầu
                    </h4>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      Kiểm tra lại thông tin trước khi gửi
                    </p>
                  </div>

                  {selectedReason && SelectedIcon && (
                    <div
                      className="flex items-center gap-3 border border-luxury-champagne/40 bg-cream-50 p-4"
                      style={{ borderRadius: "2px" }}
                    >
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center bg-luxury-ink"
                        style={{ borderRadius: "2px" }}
                      >
                        <SelectedIcon
                          className="h-5 w-5 text-luxury-champagne"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-taupe-400">
                          Lý do
                        </p>
                        <p className="text-sm font-medium text-luxury-ink">
                          {selectedReason.label}
                        </p>
                        <p className="mt-0.5 text-xs text-neutral-500">
                          {selectedReason.desc}
                        </p>
                      </div>
                    </div>
                  )}

                  <div
                    className="border border-luxury-ink/8 bg-white/60 p-4"
                    style={{ borderRadius: "2px" }}
                  >
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-taupe-400">
                      Mô tả
                    </p>
                    <p className="text-sm leading-relaxed text-neutral-700">
                      {description}
                    </p>
                  </div>

                  {bankName && accountNumber && accountHolder && (
                    <div
                      className="border border-luxury-ink/8 bg-white/60 p-4"
                      style={{ borderRadius: "2px" }}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <IconBuildingBank
                          className="h-4 w-4 text-luxury-champagne"
                          strokeWidth={1.75}
                        />
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-taupe-400">
                          Ngân hàng nhận hoàn
                        </p>
                      </div>
                      <div className="space-y-0.5 text-sm">
                        <p>
                          <span className="text-neutral-500">Ngân hàng:</span>{" "}
                          <span className="font-medium text-luxury-ink">
                            {bankName}
                          </span>
                        </p>
                        <p>
                          <span className="text-neutral-500">Số TK:</span>{" "}
                          <span className="font-mono font-medium text-luxury-ink">
                            {accountNumber}
                          </span>
                        </p>
                        <p>
                          <span className="text-neutral-500">Chủ TK:</span>{" "}
                          <span className="font-medium text-luxury-ink">
                            {accountHolder}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className="flex items-center gap-3 border border-luxury-ink/8 bg-white/60 p-4"
                      style={{ borderRadius: "2px" }}
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center bg-luxury-ink/5"
                        style={{ borderRadius: "2px" }}
                      >
                        <IconPhoto
                          className="h-4.5 w-4.5 text-taupe-500"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">
                          Ảnh bằng chứng
                        </p>
                        <p className="text-xl font-bold leading-none text-luxury-ink">
                          {images.length}
                          <span className="ml-1 text-sm font-normal text-taupe-400">
                            ảnh
                          </span>
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-3 border border-luxury-ink/8 bg-white/60 p-4"
                      style={{ borderRadius: "2px" }}
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center bg-luxury-ink/5"
                        style={{ borderRadius: "2px" }}
                      >
                        <IconVideo
                          className="h-4.5 w-4.5 text-taupe-500"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">
                          Video bằng chứng
                        </p>
                        <p className="text-xl font-bold leading-none text-luxury-ink">
                          {videos.length}
                          <span className="ml-1 text-sm font-normal text-taupe-400">
                            video
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-5 gap-2">
                      {images.slice(0, 5).map((file, i) => (
                        <div
                          key={i}
                          className="aspect-square overflow-hidden border border-luxury-ink/10"
                          style={{ borderRadius: "2px" }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`img-${i}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                      {images.length > 5 && (
                        <div
                          className="flex aspect-square items-center justify-center border border-luxury-ink/10 bg-cream-50"
                          style={{ borderRadius: "2px" }}
                        >
                          <span className="text-sm font-bold text-taupe-500">
                            +{images.length - 5}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className="flex gap-3 border border-luxury-ink/8 bg-white/60 p-4"
                    style={{ borderRadius: "2px" }}
                  >
                    <IconShield
                      className="mt-0.5 h-5 w-5 shrink-0 text-luxury-champagne"
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="text-sm font-medium text-luxury-ink">
                        Cam kết bảo vệ người mua
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-neutral-600">
                        Yêu cầu được xem xét trong{" "}
                        <strong className="text-luxury-ink">24–48 giờ</strong>.
                        Nếu được chấp thuận, tiền hoàn về trong{" "}
                        <strong className="text-luxury-ink">
                          3–7 ngày làm việc
                        </strong>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div className="border-t border-luxury-ink/8 bg-white/70 px-6 py-4">
            <div className="flex items-center gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 border border-luxury-ink/15 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-600 transition-all duration-300 hover:border-luxury-ink/30 hover:text-luxury-ink disabled:opacity-50"
                  style={{ borderRadius: "2px" }}
                >
                  <IconArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Quay lại
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="border border-luxury-ink/15 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-600 transition-all duration-300 hover:border-luxury-ink/30 hover:text-luxury-ink disabled:opacity-50"
                  style={{ borderRadius: "2px" }}
                >
                  Hủy
                </button>
              )}

              <span className="flex-1" />
              <span className="hidden text-[11px] font-medium uppercase tracking-[0.14em] text-taupe-400 sm:inline">
                Bước {step}/{STEPS.length}
              </span>
              <span className="flex-1" />

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed}
                  className="group flex items-center gap-2 bg-luxury-ink px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800 disabled:cursor-not-allowed disabled:opacity-30"
                  style={{ borderRadius: "2px" }}
                >
                  Tiếp theo
                  <IconArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={1.75}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    void onSubmit({
                      preventDefault: () => {},
                    } as React.FormEvent)
                  }
                  disabled={isSubmitting}
                  className="group flex items-center gap-2 bg-luxury-ink px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ borderRadius: "2px" }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-luxury-ivory/30 border-t-luxury-champagne" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      Gửi yêu cầu
                      <IconArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
