import { IconMessageCircle, IconMinus, IconX } from "@tabler/icons-react";
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
    <div className="bg-gradient-to-r from-primary to-primary/90 text-white px-7 py-5 rounded-t-3xl flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-sm">
          <IconMessageCircle className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-bold text-lg block truncate">
            {selectedConversation ? selectedConversation.name : "Tin nhắn"}
          </span>
          {selectedConversation && isConnected && (
            <span className="text-sm text-white/80 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-primary/70 rounded-full animate-pulse" />
              Đang hoạt động
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {selectedConversation && (
          <button
            onClick={onBack}
            className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full backdrop-blur-sm transition-colors font-medium"
          >
            ← Quay lại
          </button>
        )}

        <button
          onClick={onClose}
          className="hover:bg-white/20 rounded-full p-2.5 transition-colors"
          aria-label="Close"
        >
          <IconX className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
