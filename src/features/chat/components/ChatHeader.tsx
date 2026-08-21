import { IconArrowLeft, IconMessageCircle, IconX } from "@tabler/icons-react";
import type { Conversation } from "@/types/chat";

interface ChatHeaderProps {
  selectedConversation: Conversation | null;
  isConnected: boolean;
  onBack: () => void;
  onClose: () => void;
}

export function ChatHeader({
  selectedConversation,
  isConnected,
  onBack,
  onClose,
}: ChatHeaderProps) {
  return (
    <header className="flex shrink-0 items-center gap-4 bg-luxury-ink px-5 py-4 text-luxury-ivory">
      {selectedConversation ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Quay lại danh sách"
          className="-ml-2 shrink-0 rounded-[2px] p-2 text-luxury-ivory/70 transition-colors hover:bg-luxury-ivory/10 hover:text-luxury-ivory"
        >
          <IconArrowLeft className="h-4 w-4" />
        </button>
      ) : (
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] border border-luxury-ivory/20 bg-luxury-ivory/5"
        >
          <IconMessageCircle className="h-4 w-4" />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold tracking-tight">
          {selectedConversation ? selectedConversation.name : "Tin nhắn"}
        </p>
        {selectedConversation ? (
          <p className="mt-1 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-luxury-ivory/50">
            <span
              aria-hidden
              className={`h-1 w-1 rounded-full ${
                isConnected ? "bg-accent" : "bg-luxury-ivory/40"
              }`}
            />
            {isConnected ? "Đang hoạt động" : "Ngoại tuyến"}
          </p>
        ) : (
          <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-luxury-champagne">
            Hộp thư
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Đóng"
        className="-mr-2 shrink-0 rounded-[2px] p-2 text-luxury-ivory/70 transition-colors hover:bg-luxury-ivory/10 hover:text-luxury-ivory"
      >
        <IconX className="h-4 w-4" />
      </button>
    </header>
  );
}
