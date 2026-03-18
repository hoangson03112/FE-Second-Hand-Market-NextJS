import { useMemo, useState } from "react";
import { IconLoader2, IconMessageCircle } from "@tabler/icons-react";
import type { Conversation } from "@/types/chat";

interface ChatConversationListProps {
  loading: boolean;
  conversations: Conversation[];
  onSelect: (conversation: Conversation) => void;
}

function getDateLabel(dateStr?: string): string {
  if (!dateStr) return "Cũ hơn";
  const date = new Date(dateStr);
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOf7DaysAgo = new Date(startOfToday);
  startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 6);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  if (date >= startOfToday) return "Hôm nay";
  if (date >= startOfYesterday) return "Hôm qua";
  if (date >= startOf7DaysAgo) return "7 ngày trước";
  if (date >= startOfMonth) return "Tháng này";

  return date.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
}

function groupConversationsByDate(
  conversations: Conversation[],
): { label: string; items: Conversation[] }[] {
  const ORDER = ["Hôm nay", "Hôm qua", "7 ngày trước", "Tháng này"];
  const map = new Map<string, Conversation[]>();

  for (const conv of conversations) {
    const dateStr = conv.lastMessageAt ?? conv.updatedAt ?? conv.createdAt;
    const label = getDateLabel(dateStr);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(conv);
  }

  const groups: { label: string; items: Conversation[] }[] = [];
  for (const label of ORDER) {
    if (map.has(label)) {
      groups.push({ label, items: map.get(label)! });
      map.delete(label);
    }
  }
  const remaining = [...map.entries()].sort(([a], [b]) => {
    const parse = (l: string) => new Date(Date.parse(l));
    return parse(b).getTime() - parse(a).getTime();
  });
  for (const [label, items] of remaining) {
    groups.push({ label, items });
  }

  return groups;
}

function ConversationItem({
  conversation,
  onSelect,
}: {
  conversation: Conversation;
  onSelect: (c: Conversation) => void;
}) {
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const avatarUrl = useMemo(() => {
    if (!conversation.avatar) return "";
    if (typeof conversation.avatar === "string") return conversation.avatar;
    if (typeof conversation.avatar === "object" && conversation.avatar?.url) {
      return conversation.avatar.url;
    }
    return "";
  }, [conversation.avatar]);

  const showAvatarImage = Boolean(avatarUrl) && !avatarLoadFailed;

  return (
    <button
      onClick={() => onSelect(conversation)}
      className="w-full p-6 hover:bg-primary/5 transition-all duration-200 text-left flex items-center gap-5 group"
    >
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-transparent group-hover:ring-primary/30 transition-all">
          {showAvatarImage ? (
            <img
              src={avatarUrl}
              alt={conversation.name}
              className="h-full w-full object-cover"
              onError={() => setAvatarLoadFailed(true)}
            />
          ) : (
            <span className="text-lg font-bold text-primary">
              {conversation.name?.charAt(0)?.toUpperCase()}
            </span>
          )}
        </div>
        {conversation.unreadCount && conversation.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-sm rounded-full min-w-[24px] h-6 px-1.5 flex items-center justify-center font-bold shadow-md">
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
  );
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
          Bắt đầu trò chuyện với người bán bằng cách nhấn &quot;Chat với người
          bán&quot; trên trang sản phẩm
        </p>
      </div>
    );
  }

  const groups = groupConversationsByDate(conversations);

  return (
    <div>
      {groups.map((group) => (
        <div key={group.label}>
          <div className="sticky top-0 z-10 px-6 py-2 bg-muted/80 backdrop-blur-sm border-y border-border">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </span>
          </div>
          <div className="divide-y divide-border">
            {group.items.map((conversation) => (
              <ConversationItem
                key={conversation._id}
                conversation={conversation}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
