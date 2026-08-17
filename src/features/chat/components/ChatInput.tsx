import { type ReactNode, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  IconAlertTriangle,
  IconLoader2,
  IconPaperclip,
  IconSend,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  sending: boolean;
  errorMessage?: string | null;
  selectedFiles: File[];
  extraActions?: ReactNode;
  placeholder?: string;
  showAttachment?: boolean;
  onChange: (value: string) => void;
  onFilesChange: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onClearFiles: () => void;
  onSubmit: (event: React.FormEvent) => void;
}

export function ChatInput({
  value,
  sending,
  errorMessage,
  selectedFiles,
  extraActions,
  placeholder = "Nhập tin nhắn…",
  showAttachment = true,
  onChange,
  onFilesChange,
  onRemoveFile,
  onClearFiles,
  onSubmit,
}: ChatInputProps) {
  const hasContent = value.trim().length > 0 || selectedFiles.length > 0;

  const previewItems = useMemo(
    () =>
      selectedFiles.map((file) => ({
        name: file.name,
        isVideo: file.type.startsWith("video/"),
        previewUrl: URL.createObjectURL(file),
      })),
    [selectedFiles],
  );

  useEffect(() => {
    return () => {
      previewItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [previewItems]);

  return (
    <form
      onSubmit={onSubmit}
      className="shrink-0 border-t border-luxury-ink/10 bg-white px-4 py-4"
    >
      {errorMessage ? (
        <div className="mb-3 flex items-start gap-2.5 rounded-[2px] border border-blush-300 bg-blush-50 px-3 py-2.5">
          <IconAlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blush-700" />
          <p className="text-xs leading-relaxed text-blush-800">
            {errorMessage}
          </p>
        </div>
      ) : null}

      {selectedFiles.length > 0 ? (
        <div className="mb-3 rounded-[2px] border border-luxury-ink/10 bg-cream-50/70 p-3">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
              Đã chọn {selectedFiles.length} tệp
            </p>
            <button
              type="button"
              onClick={onClearFiles}
              className="rounded-[2px] p-1 text-neutral-500 transition-colors hover:text-blush-700"
              disabled={sending}
              aria-label="Xóa tệp đã chọn"
            >
              <IconX className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {previewItems.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="relative overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white"
              >
                {item.isVideo ? (
                  <video
                    src={item.previewUrl}
                    className="h-20 w-full object-cover"
                    muted
                  />
                ) : (
                  <Image
                    src={item.previewUrl}
                    alt={item.name}
                    width={160}
                    height={80}
                    unoptimized
                    className="h-20 w-full object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  className="absolute right-1 top-1 rounded-[2px] bg-luxury-ink/75 p-1 text-luxury-ivory transition-colors hover:bg-luxury-ink"
                  disabled={sending}
                  aria-label={`Xóa tệp ${item.name}`}
                >
                  <IconX className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        {showAttachment ? (
          <label
            className={cn(
              "flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[2px] border border-luxury-ink/15 text-luxury-ink transition-all duration-300",
              sending
                ? "cursor-not-allowed opacity-40"
                : "hover:border-luxury-ink hover:bg-luxury-ink hover:text-luxury-ivory",
            )}
            aria-label="Đính kèm ảnh hoặc video"
          >
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              disabled={sending}
              onChange={(event) => {
                const fileList = event.target.files;
                if (!fileList || fileList.length === 0) return;
                onFilesChange(Array.from(fileList));
                event.currentTarget.value = "";
              }}
            />
            <IconPaperclip className="h-4 w-4" />
          </label>
        ) : null}

        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-11 flex-1 rounded-[2px] border border-luxury-ink/15 bg-white px-3.5 text-sm text-luxury-ink outline-none transition-colors duration-200 placeholder:text-neutral-400 focus:border-luxury-ink disabled:cursor-not-allowed disabled:bg-cream-100/60"
          disabled={sending}
        />

        {extraActions ? <div className="shrink-0">{extraActions}</div> : null}

        <button
          type="submit"
          disabled={!hasContent || sending}
          aria-label="Gửi tin nhắn"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[2px] bg-luxury-ink text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800 disabled:cursor-not-allowed disabled:bg-luxury-ink/25"
        >
          {sending ? (
            <IconLoader2 className="h-4 w-4 animate-spin" />
          ) : (
            <IconSend className="h-4 w-4" />
          )}
        </button>
      </div>
    </form>
  );
}
