import { IconLoader2, IconMessageCircle } from "@tabler/icons-react";
import Image from "next/image";
import type { Conversation } from "@/types/chat";

interface ChatConversationListProps {
  loading: boolean;
  conversations: Conversation[];
  onSelect: (conversation: Conversation) => void;
}

export function ChatConversationList({
  loading,
  conversations,
  onSelect,
}: ChatConversationListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <IconLoader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-base text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-10">
        <div className="bg-primary/10 p-7 rounded-full mb-5">
          <IconMessageCircle className="w-20 h-20 text-primary" />
        </div>
        <h3 className="font-semibold text-xl text-foreground mb-2">
          Chưa có cuộc trò chuyện
        </h3>
        <p className="text-base text-muted-foreground max-w-md">
          Bắt đầu trò chuyện với người bán bằng cách nhấn “Chat với người bán”
          trên trang sản phẩm
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {conversations.map((conversation) => (
        <button
          key={conversation._id}
          onClick={() => onSelect(conversation)}
          className="w-full p-6 hover:bg-primary/5 transition-all duration-200 text-left flex items-center gap-5 group"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-transparent group-hover:ring-primary/30 transition-all">
              {conversation.avatar ? (
                <Image
                  src={conversation.avatar}
                  alt={conversation.name}
                  width={56}
                  height={56}
                  className="object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-primary">
                  {conversation.name?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
            {conversation.unreadCount && conversation.unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-sm rounded-full min-w-[24px] h-6 px-1.5 flex items-center justify-center font-bold shadow-md">
                {conversation.unreadCount}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-lg truncate text-foreground mb-1">
              {conversation.name}
            </p>
            {conversation.lastMessage && (
              <p className="text-base text-muted-foreground truncate">
                {conversation.lastMessage}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
