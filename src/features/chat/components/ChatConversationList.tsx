import { useMemo, useState } from "react";
import { IconLoader2, IconMessage2 } from "@tabler/icons-react";
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
      className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-300 hover:bg-cream-50"
    >
      <div className="relative">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-luxury-ink/10 bg-cream-100 transition-colors duration-300 group-hover:border-luxury-ink/30">
          {showAvatarImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={conversation.name}
              className="h-full w-full object-cover"
              onError={() => setAvatarLoadFailed(true)}
            />
          ) : (
            <span className="text-sm font-semibold text-luxury-ink">
              {conversation.name?.charAt(0)?.toUpperCase()}
            </span>
          )}
        </div>
        {conversation.unreadCount && conversation.unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 text-2xs font-semibold tabular-nums text-white">
            {conversation.unreadCount}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold text-luxury-ink">
          {conversation.name}
        </p>
        {conversation.lastMessage && (
          <p className="mt-1 truncate text-xs text-neutral-500">
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
        <IconLoader2 className="h-4 w-4 animate-spin text-luxury-ink/40" />
        <p className="text-2xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
          Đang tải
        </p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-white">
          <IconMessage2 className="h-5 w-5 text-luxury-ink" strokeWidth={1.5} />
        </div>
        <h3 className="mt-5 text-lg tracking-tight text-luxury-ink font-droid-serif">
          Chưa có cuộc trò chuyện
        </h3>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-neutral-600">
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
          <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-luxury-ink/8 bg-luxury-ivory/95 px-5 py-2.5 backdrop-blur-sm">
            <span aria-hidden className="h-px w-6 bg-luxury-champagne/70" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-neutral-600">
              {group.label}
            </span>
          </div>
          <div className="divide-y divide-luxury-ink/8">
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
