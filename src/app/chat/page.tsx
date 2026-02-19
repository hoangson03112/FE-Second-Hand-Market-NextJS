"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MessageCircle, Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { ChatService } from "@/services/chat.service";

interface Conversation {
  _id: string;
  conversationId?: string;
  avatar?: string;
  name: string;
  lastMessage?: string;
  unreadCount?: number;
}

function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const partnerId = searchParams.get("partnerId");
  const { data: account, isLoading } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !account) {
      router.push("/login");
      return;
    }
    if (!account) return;

    const fetchConversations = async () => {
      try {
        const res = await ChatService.getConversations();
        setConversations(res.data || []);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [account, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!account) return null;

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <MessageCircle className="w-8 h-8" />
          Tin nhắn
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : conversations.length === 0 && !conversationId ? (
          <div className="bg-cream-50 rounded-2xl border border-border p-12 text-center">
            <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">Chưa có cuộc trò chuyện nào</p>
            <p className="text-sm text-muted-foreground">
              Nhấn &quot;Liên hệ người bán&quot; trên trang sản phẩm để bắt đầu chat
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <Link
                key={conv.conversationId || conv._id}
                href={`/chat/${conv._id}?conversationId=${conv.conversationId || conv._id}`}
                className="block bg-cream-50 rounded-xl border border-border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    {conv.avatar ? (
                      <Image
                        src={conv.avatar}
                        alt={conv.name || "Avatar"}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-primary">
                        {(conv.name || "?").charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {conv.name || "Người dùng"}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {conv.lastMessage || "Chưa có tin nhắn"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {conversationId && partnerId && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              Đã mở cuộc trò chuyện. Tính năng chat real-time đang được phát triển.
              Bạn có thể xem danh sách cuộc trò chuyện phía trên.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}
