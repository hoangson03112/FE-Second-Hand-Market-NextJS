"use client";

import { useRef, useState, useEffect } from "react";
import {
  IconPhoto,
  IconVideo,
  IconUpload,
  IconCheck,
  IconArrowLeft,
  IconArrowRight,
  IconShield,
  IconTrash,
  IconAlertCircle,
  IconBuildingBank,
  IconX,
} from "@tabler/icons-react";
import { BANK_CODE_MAP } from "@/constants";
import { REFUND_REASON_OPTIONS, REFUND_MAX_IMAGES, REFUND_MAX_VIDEOS } from "@/constants/refund";
import { formatFileSize } from "@/utils/file";
import { ModalHeader, RefundStepIndicator } from "@/components/shared";

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

  const selectedReason = REFUND_REASON_OPTIONS.find((r) => r.value === reason) ?? null;
  const SelectedIcon = selectedReason?.icon ?? null;

  const canProceed =
    step === 1
      ? reason !== ""
      : step === 2
        ? description.trim().length >= 10
        : step === 3
          ? Boolean(bankName.trim() && accountNumber.trim() && accountHolder.trim())
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
    const imgFiles = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    const vidFiles = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("video/"));
    if (imgFiles.length) onImagesChange([...images, ...imgFiles].slice(0, REFUND_MAX_IMAGES));
    if (vidFiles.length) onVideosChange([...videos, ...vidFiles].slice(0, REFUND_MAX_VIDEOS));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="bg-cream-50 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        <ModalHeader
          icon={<IconAlertCircle className="w-5 h-5 text-neutral-600" />}
          title="Yêu cầu hoàn tiền"
          subtitle="Vui lòng cung cấp đầy đủ thông tin"
          onClose={onClose}
          closeDisabled={isSubmitting}
        />

        <RefundStepIndicator steps={STEPS} currentStep={step} />

        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-5 space-y-5">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Chọn lý do hoàn tiền</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
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
                          className={`relative flex items-start gap-3 p-3.5 rounded-2xl border-2 text-left transition-all
                            ${
                              isSelected
                                ? "bg-primary/8 border-primary shadow-sm"
                                : "bg-cream-100/60 border-neutral-200/80 hover:bg-neutral-100 hover:border-neutral-300"
                            }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                              ${isSelected ? "bg-primary/15" : "bg-neutral-100"}`}
                          >
                            <Icon
                              className={`w-4.5 h-4.5 ${isSelected ? "text-primary" : "text-neutral-500"}`}
                            />
                          </div>
                          <div className="min-w-0 flex-1 pt-0.5">
                            <p
                              className={`text-sm font-semibold leading-tight transition-colors
                              ${isSelected ? "text-neutral-900" : "text-neutral-700"}`}
                            >
                              {opt.label}
                            </p>
                            <p className="text-xs text-neutral-400 mt-0.5 leading-snug">{opt.desc}</p>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-4.5 h-4.5 rounded-full bg-primary flex items-center justify-center">
                              <IconCheck className="w-2.5 h-2.5 text-primary-foreground" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2.5 p-3 rounded-xl bg-neutral-100/80 border border-neutral-200">
                    <IconAlertCircle className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Yêu cầu sẽ được xem xét trong vòng{" "}
                      <strong className="text-neutral-800">24–48 giờ</strong>. Cung cấp thông tin chính
                      xác giúp xử lý nhanh hơn.
                    </p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Mô tả &amp; Bằng chứng</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Cung cấp chi tiết và hình ảnh để tăng tốc xử lý
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wide">
                      Mô tả chi tiết{" "}
                      <span className="text-destructive normal-case tracking-normal">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => onDescriptionChange(e.target.value)}
                      rows={4}
                      maxLength={1000}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200/80 bg-cream-100/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-neutral-900 resize-none disabled:opacity-60 text-sm placeholder:text-neutral-400"
                      placeholder="Mô tả chi tiết vấn đề: sản phẩm hỏng ở đâu, sai như thế nào, thiếu gì..."
                    />
                    <div className="flex items-center justify-between mt-1.5">
                      <p
                        className={`text-xs ${description.trim().length < 10 && description.length > 0 ? "text-destructive/70" : "text-neutral-400"}`}
                      >
                        {description.trim().length < 10 && description.length > 0
                          ? `Cần thêm ${10 - description.trim().length} ký tự`
                          : `${description.length}/1000`}
                      </p>
                      {description.trim().length >= 10 && (
                        <span className="flex items-center gap-1 text-xs text-primary font-medium">
                          <IconCheck className="w-3.5 h-3.5" />
                          Đủ mô tả
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wide flex items-center gap-1.5">
                        <IconPhoto className="w-3.5 h-3.5" />
                        Ảnh bằng chứng
                      </label>
                      <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full font-medium">
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
                      className={`rounded-2xl border-2 border-dashed transition-all
                        ${isDragging ? "border-primary/50 bg-primary/5" : "border-neutral-200/80 bg-cream-100/30"}`}
                    >
                      {images.length === 0 ? (
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          disabled={isSubmitting}
                          className="w-full flex flex-col items-center justify-center py-7 gap-2 hover:bg-neutral-100/50 rounded-2xl transition-colors disabled:opacity-50"
                        >
                          <div className="w-11 h-11 rounded-2xl bg-neutral-100 flex items-center justify-center">
                            <IconUpload className="w-5 h-5 text-neutral-500" />
                          </div>
                          <p className="text-sm font-medium text-neutral-600">
                            {isDragging ? "Thả ảnh vào đây ✓" : "Kéo & thả, hoặc click để chọn"}
                          </p>
                          <p className="text-xs text-neutral-400">
                            JPG, PNG, WEBP — tối đa {REFUND_MAX_IMAGES} ảnh
                          </p>
                        </button>
                      ) : (
                        <div className="p-3">
                          <div className="grid grid-cols-5 gap-2">
                            {images.map((file, i) => (
                              <div
                                key={i}
                                className="relative group aspect-square rounded-xl overflow-hidden border border-neutral-200/80"
                              >
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => onImagesChange(images.filter((_, idx) => idx !== i))}
                                  disabled={isSubmitting}
                                  className="absolute inset-0 bg-neutral-900/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <IconTrash className="w-5 h-5" />
                                </button>
                              </div>
                            ))}
                            {images.length < REFUND_MAX_IMAGES && (
                              <button
                                type="button"
                                onClick={() => imageInputRef.current?.click()}
                                disabled={isSubmitting}
                                className="aspect-square rounded-xl border-2 border-dashed border-neutral-200 flex items-center justify-center hover:border-neutral-300 hover:bg-neutral-100/50 transition-colors"
                              >
                                <IconUpload className="w-5 h-5 text-neutral-400" />
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
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wide flex items-center gap-1.5">
                        <IconVideo className="w-3.5 h-3.5" />
                        Video bằng chứng
                      </label>
                      <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full font-medium">
                        {videos.length}/{REFUND_MAX_VIDEOS}
                      </span>
                    </div>
                    {videos.length > 0 && (
                      <ul className="space-y-2 mb-2">
                        {videos.map((file, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 px-3 py-2.5 bg-neutral-100/70 border border-neutral-200/80 rounded-xl"
                          >
                            <div className="w-8 h-8 rounded-lg bg-neutral-200/80 flex items-center justify-center flex-shrink-0">
                              <IconVideo className="w-4 h-4 text-neutral-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-neutral-800 truncate">{file.name}</p>
                              <p className="text-xs text-neutral-500">{formatFileSize(file.size)}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => onVideosChange(videos.filter((_, idx) => idx !== i))}
                              disabled={isSubmitting}
                              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <IconX className="w-4 h-4" />
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
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-neutral-200/80 rounded-xl text-sm text-neutral-500 hover:border-neutral-300 hover:bg-neutral-100/50 transition-all disabled:opacity-50"
                        >
                          <IconUpload className="w-4 h-4" />
                          Thêm video
                          {videos.length > 0 ? ` (còn ${REFUND_MAX_VIDEOS - videos.length} slot)` : ""}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Thông tin ngân hàng</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Nhập tài khoản ngân hàng để nhận tiền hoàn nếu yêu cầu được chấp thuận.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 flex items-start gap-3">
                    <IconBuildingBank className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Thông tin ngân hàng được mã hóa và chỉ dùng để chuyển khoản hoàn tiền. Bạn sẽ không
                      cần nhập lại sau này.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-1.5">
                      Tên ngân hàng
                    </label>
                    <div className="relative">
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        disabled={isSubmitting}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 appearance-none"
                      >
                        <option value="">Chọn ngân hàng</option>
                        {bankName.trim() && !REFUND_BANK_OPTIONS.includes(bankName) && (
                          <option value={bankName}>{bankName}</option>
                        )}
                        {REFUND_BANK_OPTIONS.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                      <IconBuildingBank className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-1.5">
                      Số tài khoản
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Nhập số tài khoản..."
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-1.5">
                      Tên chủ tài khoản
                    </label>
                    <input
                      type="text"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Tên đầy đủ (in hoa) trên tài khoản..."
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 uppercase placeholder:normal-case"
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Xác nhận yêu cầu</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Kiểm tra lại thông tin trước khi gửi</p>
                  </div>

                  {selectedReason && SelectedIcon && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/8 border-2 border-primary/25">
                      <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                        <SelectedIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-widest">
                          Lý do
                        </p>
                        <p className="text-sm font-bold text-neutral-900">{selectedReason.label}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{selectedReason.desc}</p>
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-neutral-100/70 border border-neutral-200/80">
                    <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-widest mb-2">
                      Mô tả
                    </p>
                    <p className="text-sm text-neutral-800 leading-relaxed">{description}</p>
                  </div>

                  {bankName && accountNumber && accountHolder && (
                    <div className="p-4 rounded-2xl bg-neutral-100/70 border border-neutral-200/80">
                      <div className="flex items-center gap-2 mb-2">
                        <IconBuildingBank className="w-4 h-4 text-primary" />
                        <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-widest">
                          Ngân hàng nhận hoàn
                        </p>
                      </div>
                      <div className="space-y-0.5 text-sm">
                        <p>
                          <span className="text-neutral-500">Ngân hàng:</span>{" "}
                          <span className="font-semibold">{bankName}</span>
                        </p>
                        <p>
                          <span className="text-neutral-500">Số TK:</span>{" "}
                          <span className="font-mono font-semibold">{accountNumber}</span>
                        </p>
                        <p>
                          <span className="text-neutral-500">Chủ TK:</span>{" "}
                          <span className="font-semibold">{accountHolder}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-100/70 border border-neutral-200/80">
                      <div className="w-9 h-9 rounded-xl bg-neutral-200/80 flex items-center justify-center flex-shrink-0">
                        <IconPhoto className="w-5 h-5 text-neutral-600" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">Ảnh bằng chứng</p>
                        <p className="text-xl font-bold text-neutral-900 leading-none">
                          {images.length}
                          <span className="text-sm font-normal text-neutral-400 ml-1">ảnh</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-100/70 border border-neutral-200/80">
                      <div className="w-9 h-9 rounded-xl bg-neutral-200/80 flex items-center justify-center flex-shrink-0">
                        <IconVideo className="w-5 h-5 text-neutral-600" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">Video bằng chứng</p>
                        <p className="text-xl font-bold text-neutral-900 leading-none">
                          {videos.length}
                          <span className="text-sm font-normal text-neutral-400 ml-1">video</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-5 gap-2">
                      {images.slice(0, 5).map((file, i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden border border-neutral-200/80">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`img-${i}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {images.length > 5 && (
                        <div className="aspect-square rounded-xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-center">
                          <span className="text-sm font-bold text-neutral-500">+{images.length - 5}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3 p-4 rounded-2xl bg-neutral-100/70 border border-neutral-200/80">
                    <IconShield className="w-5 h-5 text-neutral-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-neutral-800">Cam kết bảo vệ người mua</p>
                      <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                        Yêu cầu được xem xét trong <strong>24–48 giờ</strong>. Nếu được chấp thuận, tiền
                        hoàn về trong <strong>3–7 ngày làm việc</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-t-2 border-neutral-200/60 bg-cream-50">
            <div className="flex items-center gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 border-2 border-border text-foreground rounded-full font-semibold hover:bg-secondary transition-all disabled:opacity-50 text-sm"
                >
                  <IconArrowLeft className="w-4 h-4" />
                  Quay lại
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 border-2 border-border text-foreground rounded-full font-semibold hover:bg-secondary transition-all disabled:opacity-50 text-sm"
                >
                  Hủy
                </button>
              )}

              <div className="flex-1" />
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all ${
                      step === i + 1
                        ? "w-4 h-2 bg-neutral-800"
                        : i + 1 < step
                          ? "w-2 h-2 bg-primary"
                          : "w-2 h-2 bg-neutral-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex-1" />

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed}
                  className="flex items-center gap-2 px-6 py-2.5 bg-foreground text-background rounded-full font-semibold hover:bg-foreground/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Tiếp theo
                  <IconArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void onSubmit({ preventDefault: () => {} } as React.FormEvent)}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <IconCheck className="w-4 h-4" />
                      Gửi yêu cầu
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
