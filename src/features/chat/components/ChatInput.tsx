import { type ReactNode, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  IconLoader2,
  IconPaperclip,
  IconSend,
  IconX,
} from "@tabler/icons-react";

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
  placeholder = "Nhập tin nhắn...",
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
      className="border-t-2 border-border bg-white p-6 rounded-b-3xl"
    >
      {errorMessage && (
        <div className="mb-3 rounded-lg border border-destructive/20 bg-destructive/8 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mb-3 rounded-xl border border-border bg-muted/30 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">
              Đã chọn {selectedFiles.length} tệp
            </p>
            <button
              type="button"
              onClick={onClearFiles}
              className="ml-3 text-muted-foreground hover:text-foreground"
              disabled={sending}
              aria-label="Xóa tệp đã chọn"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {previewItems.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="relative rounded-lg overflow-hidden border border-border bg-white"
              >
                {item.isVideo ? (
                  <video
                    src={item.previewUrl}
                    className="w-full h-20 object-cover"
                    muted
                  />
                ) : (
                  <Image
                    src={item.previewUrl}
                    alt={item.name}
                    width={160}
                    height={80}
                    unoptimized
                    className="w-full h-20 object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                  disabled={sending}
                  aria-label={`Xóa tệp ${item.name}`}
                >
                  <IconX className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {showAttachment && (
          <label className="cursor-pointer border-2 border-border px-4 py-3.5 rounded-xl hover:bg-muted/50 transition-all">
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
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <IconPaperclip className="w-5 h-5" />
            </span>
          </label>
        )}

        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="flex-1 px-5 py-3.5 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base transition-all"
          disabled={sending}
        />

        {extraActions && <div className="shrink-0">{extraActions}</div>}

        <button
          type="submit"
          disabled={!hasContent || sending}
          className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-6 py-3.5 rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 font-medium"
        >
          {sending ? (
            <IconLoader2 className="w-6 h-6 animate-spin" />
          ) : (
            <IconSend className="w-6 h-6" />
          )}
        </button>
      </div>
    </form>
  );
}
