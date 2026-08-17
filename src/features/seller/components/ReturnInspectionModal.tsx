"use client";

import { useState } from "react";
import { IconX, IconPhoto, IconTrash } from "@tabler/icons-react";
import type { ReturnInspectionCondition } from "@/types/order";

const MAX_IMAGES = 10;

const CONDITIONS: Array<{
  value: ReturnInspectionCondition;
  label: string;
  hint: string;
}> = [
  {
    value: "intact",
    label: "Còn nguyên vẹn",
    hint: "Hàng về đúng như lúc gửi đi. Bạn sẽ hoàn tiền cho người mua.",
  },
  {
    value: "damaged",
    label: "Bị hư hỏng",
    hint: "Hàng về trong tình trạng hỏng, vỡ hoặc trầy xước.",
  },
  {
    value: "missing_parts",
    label: "Thiếu phụ kiện",
    hint: "Thiếu bộ phận, phụ kiện hoặc quà kèm theo.",
  },
  {
    value: "wrong_item",
    label: "Sai món hàng",
    hint: "Món nhận lại không phải món bạn đã gửi.",
  },
];

export interface ReturnInspectionPayload {
  condition: ReturnInspectionCondition;
  inspectionComment?: string;
  images?: File[];
}

interface ReturnInspectionModalProps {
  isOpen: boolean;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: ReturnInspectionPayload) => void | Promise<void>;
}

/**
 * Seller opens the returned parcel and records what they found.
 *
 * This is the gate on the refund: money only goes back when the goods come
 * back intact. Reporting any other condition hands the case to an admin
 * instead of obliging the seller to transfer.
 */
export function ReturnInspectionModal({
  isOpen,
  submitting = false,
  onClose,
  onSubmit,
}: ReturnInspectionModalProps) {
  const [condition, setCondition] = useState<ReturnInspectionCondition>("intact");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isIntact = condition === "intact";

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    setImages((prev) => [...prev, ...Array.from(fileList)].slice(0, MAX_IMAGES));
  };

  const handleSubmit = async () => {
    // The backend enforces this too — mirrored here so the seller finds out
    // before the upload rather than after it.
    if (!isIntact && !comment.trim()) {
      setError("Vui lòng mô tả tình trạng hàng khi báo hàng không nguyên vẹn.");
      return;
    }
    setError(null);
    await onSubmit({
      condition,
      inspectionComment: comment.trim() || undefined,
      images: images.length ? images : undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={submitting ? undefined : onClose}
    >
      <div className="absolute inset-0 bg-taupe-900/40 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full sm:max-w-lg bg-cream-50 rounded-t-2xl sm:rounded-[2px] border border-luxury-ink/10 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b-2 border-luxury-ink/10 bg-cream-50 rounded-t-2xl">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Kiểm hàng hoàn
            </p>
            <h2 className="mt-1 font-serif text-lg text-luxury-ink">
              Bạn nhận lại được gì?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-500 hover:bg-taupe-50 hover:text-luxury-ink transition-colors disabled:opacity-40"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <p className="text-xs leading-relaxed text-neutral-600">
            Mở kiện hàng và kiểm tra trước khi xác nhận. Chỉ khi hàng còn nguyên
            vẹn bạn mới cần hoàn tiền — nếu không, yêu cầu sẽ được chuyển cho
            quản trị viên phân xử.
          </p>

          <fieldset className="space-y-2">
            <legend className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
              Tình trạng hàng
            </legend>
            {CONDITIONS.map((option) => {
              const selected = condition === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer gap-3 rounded-[2px] border p-3 transition-colors ${
                    selected
                      ? "border-luxury-ink bg-white"
                      : "border-luxury-ink/15 bg-white/60 hover:border-luxury-ink/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="return-condition"
                    value={option.value}
                    checked={selected}
                    onChange={() => {
                      setCondition(option.value);
                      setError(null);
                    }}
                    className="mt-0.5 h-4 w-4 accent-luxury-ink"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-luxury-ink">
                      {option.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-neutral-500">
                      {option.hint}
                    </span>
                  </span>
                </label>
              );
            })}
          </fieldset>

          <div>
            <label
              htmlFor="inspection-comment"
              className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600"
            >
              Mô tả {isIntact ? "(không bắt buộc)" : "(bắt buộc)"}
            </label>
            <textarea
              id="inspection-comment"
              rows={3}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setError(null);
              }}
              maxLength={1000}
              placeholder={
                isIntact
                  ? "Ghi chú thêm nếu cần."
                  : "Mô tả rõ chỗ hỏng, phần thiếu hoặc món nhận được."
              }
              className="w-full rounded-[2px] border border-luxury-ink/15 bg-white px-3 py-2.5 text-sm text-luxury-ink outline-none transition-colors duration-200 placeholder:text-neutral-400 focus:border-luxury-ink"
            />
          </div>

          <div>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
              Ảnh chụp lúc mở kiện {!isIntact && "— nên có để làm bằng chứng"}
            </span>

            {images.length > 0 && (
              <ul className="mb-2 space-y-1">
                {images.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-2 rounded-[2px] border border-luxury-ink/10 bg-white px-3 py-2"
                  >
                    <span className="truncate text-xs text-neutral-600">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setImages((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="shrink-0 text-neutral-400 transition-colors hover:text-blush-700"
                      aria-label={`Bỏ ảnh ${file.name}`}
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {images.length < MAX_IMAGES && (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-[2px] border border-dashed border-luxury-ink/25 bg-white/60 px-4 py-3 text-xs text-neutral-600 transition-colors hover:border-luxury-ink/50">
                <IconPhoto className="h-4 w-4" />
                Chọn ảnh ({images.length}/{MAX_IMAGES})
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
          </div>

          {error && (
            <p className="text-xs leading-relaxed text-blush-700">{error}</p>
          )}
        </div>

        <div className="sticky bottom-0 flex gap-3 border-t-2 border-luxury-ink/10 bg-cream-50 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 rounded-[2px] border border-luxury-ink/20 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-luxury-ink transition-colors hover:bg-taupe-50 disabled:opacity-40"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 rounded-[2px] bg-luxury-ink px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream-50 transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {submitting
              ? "Đang gửi..."
              : isIntact
                ? "Xác nhận nguyên vẹn"
                : "Báo cáo & chuyển admin"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReturnInspectionModal;
