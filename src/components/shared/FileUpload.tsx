"use client";

import * as React from "react";
import { File as FileIcon, Upload, X } from "lucide-react";

import { cn } from "@/lib/utils";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export interface FileUploadProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  /** e.g. ".pdf,.docx" or "application/pdf". */
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  disabled?: boolean;
  className?: string;
  hint?: React.ReactNode;
}

/**
 * FileUpload — drag-and-drop / click file picker with a removable file list.
 * Controlled via `value` (File[]) + `onChange`.
 */
export function FileUpload({
  value = [],
  onChange,
  accept,
  multiple = true,
  maxFiles = 10,
  maxSizeMB = 10,
  disabled,
  className,
  hint,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    setError(null);
    const incoming = Array.from(files);
    if (incoming.some((f) => f.size > maxSizeMB * 1024 * 1024)) {
      setError(`Mỗi tệp phải ≤ ${maxSizeMB}MB`);
      return;
    }
    let next = multiple ? [...value, ...incoming] : incoming.slice(0, 1);
    if (multiple && next.length > maxFiles) {
      setError(`Tối đa ${maxFiles} tệp`);
      next = next.slice(0, maxFiles);
    }
    onChange?.(next);
  };

  const removeAt = (index: number) =>
    onChange?.(value.filter((_, i) => i !== index));

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
          Kéo thả hoặc <span className="font-medium text-primary">chọn tệp</span>
        </div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
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

      {value.length > 0 && (
        <ul className="flex flex-col gap-2">
          {value.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2"
            >
              <FileIcon className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label="Xóa tệp"
                className="rounded-full p-1 text-muted-foreground transition-colors hover:text-destructive"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
