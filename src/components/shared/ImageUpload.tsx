"use client";

import * as React from "react";
import { Upload, X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ImageUploadProps {
  /** Newly-selected files (controlled). */
  value?: File[];
  onChange?: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  disabled?: boolean;
  className?: string;
  /** URLs of already-uploaded images to display alongside new selections. */
  previews?: string[];
  onRemovePreview?: (url: string) => void;
}

/**
 * ImageUpload — drag-and-drop / click image picker with thumbnail previews.
 * Controlled via `value` (File[]) + `onChange`; existing images can be shown
 * via `previews`.
 */
export function ImageUpload({
  value = [],
  onChange,
  multiple = true,
  maxFiles = 6,
  maxSizeMB = 5,
  disabled,
  className,
  previews = [],
  onRemovePreview,
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const objectUrls = React.useMemo(
    () => value.map((file) => URL.createObjectURL(file)),
    [value]
  );
  React.useEffect(
    () => () => objectUrls.forEach((url) => URL.revokeObjectURL(url)),
    [objectUrls]
  );

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    setError(null);
    const incoming = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (incoming.some((f) => f.size > maxSizeMB * 1024 * 1024)) {
      setError(`Mỗi ảnh phải ≤ ${maxSizeMB}MB`);
      return;
    }
    let next = multiple ? [...value, ...incoming] : incoming.slice(0, 1);
    if (multiple && previews.length + next.length > maxFiles) {
      setError(`Tối đa ${maxFiles} ảnh`);
      next = next.slice(0, Math.max(0, maxFiles - previews.length));
    }
    onChange?.(next);
  };

  const removeAt = (index: number) =>
    onChange?.(value.filter((_, i) => i !== index));

  const total = previews.length + value.length;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!disabled) addFiles(e.dataTransfer.files);
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-input bg-input/40 px-6 py-8 text-center transition-colors hover:border-primary/50",
          dragOver && "border-primary bg-primary/5",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <Upload className="size-6 text-muted-foreground" />
        <div className="text-sm text-muted-foreground">
          Kéo thả hoặc <span className="font-medium text-primary">chọn ảnh</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Tối đa {maxFiles} ảnh, mỗi ảnh ≤ {maxSizeMB}MB
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          hidden
          disabled={disabled}
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {total > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {previews.map((url) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Ảnh đã tải lên" className="size-full object-cover" />
              {onRemovePreview && (
                <button
                  type="button"
                  onClick={() => onRemovePreview(url)}
                  aria-label="Xóa ảnh"
                  className="absolute right-1 top-1 rounded-full bg-background/80 p-1 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          ))}
          {objectUrls.map((url, index) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Ảnh xem trước" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label="Xóa ảnh"
                className="absolute right-1 top-1 rounded-full bg-background/80 p-1 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
