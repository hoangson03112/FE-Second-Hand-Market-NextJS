"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { IconMessageCircle, IconLoader2, IconPercentage } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ChatService } from "@/services/chat.service";
import { SellerService } from "@/services/seller.service";
import type { Message, Conversation } from "@/types/chat";
import { useTokenStore } from "@/store/useTokenStore";
import { ChatHeader } from "./ChatHeader";
import { ChatConversationList } from "./ChatConversationList";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { AIProductAssistantPanel } from "./AIProductAssistantPanel";
import SellerDiscountInline from "./SellerDiscountInline";
import { buildProductMessage, buildOrderMessage } from "../utils/productMessage";

interface ProductInfo {
  _id: string;
  name: string;
  price: number;
  image?: string;
  slug?: string;
}

interface OrderInfo {
  _id: string;
  status: string;
  ghnOrderCode?: string;
  products: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
}

interface OpenChatEventDetail {
  userId: string;
  userName: string;
  userAvatar?: string;
  product?: ProductInfo;
  order?: OrderInfo;
}

function lastMessagePreview(msg: Message): string {
  const t = msg.text?.trim();
  if (t) return t;
  if (Array.isArray(msg.media) && msg.media.length > 0) {
    return "Đã gửi tin nhắn đính kèm";
  }
  return "";
}

function conversationTimeMs(c: Conversation): number {
  const raw = c.lastMessageAt ?? c.updatedAt ?? c.createdAt;
  if (!raw) return 0;
  const t = new Date(raw).getTime();
  return Number.isFinite(t) ? t : 0;
}

function sortConversationsByRecent(convs: Conversation[]): Conversation[] {
  return [...convs].sort((a, b) => conversationTimeMs(b) - conversationTimeMs(a));
}

export default function FloatingChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [draftByConversation, setDraftByConversation] = useState<
    Record<string, string>
  >({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDealMode, setIsDealMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const { data: account } = useUser();
  const accessToken = useTokenStore((state) => state.accessToken);
  const { lastMessage, isConnected } = useWebSocket(account?.accountID);

  const { data: productLimit } = useQuery({
    queryKey: ["seller", "product-limit"],
    queryFn: () => SellerService.getProductLimit(),
    enabled: !!accessToken && !!account,
    staleTime: 60000,
  });

  const canCreateDeal = (productLimit?.totalProducts ?? 0) > 0;

  const loadMessages = useCallback(async (partnerId: string) => {
    try {
      setLoading(true);
      const res = await ChatService.getMessages(partnerId);
      setMessages(res.data || []);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ChatService.getConversations();
      setConversations(res.data || []);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const openChatWith = useCallback(
    async (
      userId: string,
      userName: string,
      userAvatar?: string,
      product?: ProductInfo,
      order?: OrderInfo,
    ) => {
      const conversation: Conversation = {
        _id: userId,
        name: userName,
        avatar: userAvatar,
        participants: [userId],
      };

      setIsOpen(true);
      setIsAIChatOpen(false);
      setIsDealMode(false);
      setSelectedConversation(conversation);
      setNewMessage(draftByConversation[userId] || "");
      await loadMessages(userId);

      if (order && account) {
        const orderMessage = buildOrderMessage({
          orderId: order._id,
          status: order.status,
          ghnOrderCode: order.ghnOrderCode,
          products: order.products,
          totalAmount: order.totalAmount,
        });

        try {
          await ChatService.sendMessage(userId, orderMessage);

          const tempMessage: Message = {
            _id: Date.now().toString(),
            conversationId: "",
            senderId: account.accountID,
            receiverId: userId,
            type: "text",
            text: orderMessage,
            createdAt: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, tempMessage]);
        } catch (error) {
          console.error("Error sending order message:", error);
        }
      }

      if (product && account) {
        const productUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}/products/${product._id}/${product.slug || "product"}`
            : "";

        const productMessage = buildProductMessage({
          name: product.name,
          price: product.price,
          image: product.image,
          url: productUrl,
        });

        try {
          await ChatService.sendMessage(userId, productMessage);

          const tempMessage: Message = {
            _id: Date.now().toString(),
            conversationId: "",
            senderId: account.accountID,
            receiverId: userId,
            type: "text",
            text: productMessage,
            createdAt: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, tempMessage]);
        } catch (error) {
          console.error("Error sending product message:", error);
        }
      }
    },
    [account, draftByConversation, loadMessages],
  );

  useEffect(() => {
    const handleOpenChat = (event: Event) => {
      const customEvent = event as CustomEvent<OpenChatEventDetail>;
      const { userId, userName, userAvatar, product, order } = customEvent.detail;
      openChatWith(userId, userName, userAvatar, product, order);
    };

    window.addEventListener("openChat", handleOpenChat);
    return () => {
      window.removeEventListener("openChat", handleOpenChat);
    };
  }, [openChatWith]);

  useEffect(() => {
    if (isOpen && account && !selectedConversation) {
      loadConversations();
    }
  }, [account, isOpen, loadConversations, selectedConversation]);

  useEffect(() => {
    if (
      lastMessage &&
      lastMessage.type === "chat:message" &&
      lastMessage.data
    ) {
      const newMsg = lastMessage.data as Message;
      const myId = account?.accountID;
      if (!myId) return;

      const hasReceiverId =
        typeof newMsg.receiverId === "string" && newMsg.receiverId.length > 0;
      // Fallback: some backend payloads may omit receiverId for room-targeted events.
      const isRelevant =
        newMsg.senderId === myId || (hasReceiverId ? newMsg.receiverId === myId : true);
      if (!isRelevant) return;

      const otherPartyId =
        newMsg.senderId === myId
          ? newMsg.receiverId || selectedConversation?._id
          : newMsg.senderId;
      if (!otherPartyId) return;

      const isCurrentThread =
        !!selectedConversation?._id &&
        selectedConversation._id === otherPartyId;

      if (isCurrentThread) {
        setMessages((prev) => [...prev, newMsg]);
      }

      const preview = lastMessagePreview(newMsg);
      const createdRaw = newMsg.createdAt as string | Date | undefined;
      const lastAt =
        typeof createdRaw === "string"
          ? createdRaw
          : createdRaw
            ? new Date(createdRaw).toISOString()
            : new Date().toISOString();

      setConversations((prev) => {
        const idx = prev.findIndex((c) => c._id === otherPartyId);
        if (idx >= 0) {
          const updated = prev.map((c, i) =>
            i === idx
              ? {
                  ...c,
                  lastMessage: preview,
                  lastMessageAt: lastAt,
                  lastMessageType: newMsg.type,
                  lastMessageSenderId: newMsg.senderId,
                }
              : c,
          );
          return sortConversationsByRecent(updated);
        }

        const isIncoming = newMsg.senderId !== myId;
        const newConv: Conversation = {
          _id: otherPartyId,
          name: isIncoming
            ? newMsg.senderName || "Người dùng"
            : "Người dùng",
          participants: [otherPartyId],
          avatar: isIncoming ? newMsg.senderAvatar : undefined,
          lastMessage: preview,
          lastMessageAt: lastAt,
          lastMessageType: newMsg.type,
          lastMessageSenderId: newMsg.senderId,
        };
        return sortConversationsByRecent([newConv, ...prev]);
      });
    }
  }, [account?.accountID, isOpen, lastMessage, selectedConversation?._id]);

  useEffect(() => {
    if (!isOpen || !selectedConversation || loading) return;
    if (!shouldAutoScrollRef.current) return;

    const frame = requestAnimationFrame(() => {
      const container = messageListRef.current;
      if (!container) return;
      container.scrollTop = container.scrollHeight;
    });

    return () => cancelAnimationFrame(frame);
  }, [messages, isOpen, loading, selectedConversation]);

  const handleMessageScroll = useCallback(() => {
    const container = messageListRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom < 500;
  }, []);

  useEffect(() => {
    shouldAutoScrollRef.current = true;
  }, [selectedConversation?._id]);

  const handleSelectConversation = (conversation: Conversation) => {
    setIsAIChatOpen(false);
    setIsDealMode(false);
    setSelectedConversation(conversation);
    setNewMessage(draftByConversation[conversation._id] || "");
    setChatError(null);
    loadMessages(conversation._id);
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      (!newMessage.trim() && selectedFiles.length === 0) ||
      !selectedConversation ||
      !account
    ) {
      return;
    }

    try {
      setSendingMessage(true);
      setChatError(null);

      let uploadedMedia: Message["media"] = [];
      if (selectedFiles.length > 0) {
        const uploadResponse = await ChatService.uploadMedia(selectedFiles);
        uploadedMedia = uploadResponse.data || [];

        if (uploadedMedia.length === 0) {
          throw new Error("Upload media failed");
        }
      }

      const hasMedia = Array.isArray(uploadedMedia) && uploadedMedia.length > 0;
      const mediaType = hasMedia
        ? uploadedMedia[0]?.type === "video"
          ? "video"
          : "image"
        : "text";

      const messageText = newMessage.trim();

      await ChatService.sendMessage(selectedConversation._id, messageText, {
        type: mediaType,
        media: uploadedMedia,
      });

      const tempMessage: Message = {
        _id: Date.now().toString(),
        conversationId: "",
        senderId: account.accountID,
        receiverId: selectedConversation._id,
        type: mediaType,
        text: messageText || null,
        media: uploadedMedia,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, tempMessage]);
      setNewMessage("");
      setSelectedFiles([]);
      setDraftByConversation((prev) => ({
        ...prev,
        [selectedConversation._id]: "",
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      const fallbackMessage = "Không thể gửi tin nhắn. Vui lòng thử lại.";
      if (error instanceof Error && error.message.includes("Upload")) {
        setChatError(
          "Upload ảnh/video thất bại. Vui lòng kiểm tra file và thử lại.",
        );
      } else {
        setChatError(fallbackMessage);
      }
    } finally {
      setSendingMessage(false);
    }
  };

  const handleBackToList = () => {
    setIsAIChatOpen(false);
    setIsDealMode(false);
    setSelectedConversation(null);
    setMessages([]);
  };

  if (!account) return null;

  const unreadCount = conversations.reduce(
    (sum, conversation) => sum + (conversation.unreadCount || 0),
    0,
  );

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-6 shadow-lg hover:shadow-xl transition-all z-50 group hover:scale-110"
          aria-label="Open chat"
        >
          <IconMessageCircle className="w-8 h-8" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-sm rounded-full min-w-[28px] h-7 px-2 flex items-center justify-center font-bold shadow-md">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {isOpen && (
        <div
          className={
            "fixed bottom-6 right-6 w-[600px] bg-white rounded-3xl shadow-2xl flex flex-col z-50 border-2 border-primary/20 transition-all duration-300 h-[720px]"
          }
        >
          <ChatHeader
            selectedConversation={selectedConversation}
            isConnected={isConnected}
            onBack={handleBackToList}
            onClose={() => {
              setIsOpen(false);
              setIsAIChatOpen(false);
              setIsDealMode(false);
              setSelectedConversation(null);
            }}
          />

          {!isConnected && (
            <div className="bg-primary/8 text-primary/90 text-sm px-5 py-2.5 text-center border-b border-primary/20 flex items-center justify-center gap-2">
              <IconLoader2 className="w-4 h-4 animate-spin" />
              <span>Đang kết nối lại...</span>
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            {isAIChatOpen ? (
              <AIProductAssistantPanel onBackToConversations={handleBackToList} />
            ) : !selectedConversation ? (
              <div className="h-full overflow-y-auto">
                <div className="p-4 border-b border-border/70 bg-primary/5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAIChatOpen(true);
                      setIsDealMode(false);
                      setSelectedConversation(null);
                    }}
                    className="w-full rounded-2xl border border-primary/25 bg-white px-4 py-3.5 text-left hover:border-primary/45 hover:bg-primary/5 transition-colors"
                  >
                    <p className="text-sm font-semibold text-primary">
                      Trợ lý AI tìm sản phẩm
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mô tả nhu cầu để AI gợi ý sản phẩm phù hợp ngay trong chat.
                    </p>
                  </button>
                </div>
                <ChatConversationList
                  loading={loading}
                  conversations={conversations}
                  onSelect={handleSelectConversation}
                />
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div
                  ref={messageListRef}
                  onScroll={handleMessageScroll}
                  className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-cream-50/30 to-transparent"
                >
                  <ChatMessages
                    loading={loading}
                    messages={messages}
                    accountId={account.accountID}
                  />
                </div>

                {isDealMode && canCreateDeal && selectedConversation ? (
                  <SellerDiscountInline
                    buyerId={selectedConversation._id}
                    buyerName={selectedConversation.name}
                    sellerId={account.accountID}
                    onCancel={() => setIsDealMode(false)}
                    onCreated={async ({
                      product,
                      discountedPrice,
                    }: {
                      product: { _id: string; name: string; imageUrl?: string; slug?: string };
                      discountedPrice: number;
                    }) => {
                      try {
                        const productUrl =
                          typeof window !== "undefined"
                            ? `${window.location.origin}/products/${product._id}/${product.slug || "product"}`
                            : "";
                        const productMessage = buildProductMessage({
                          name: `${product.name} (Ưu đãi riêng)`,
                          price: discountedPrice,
                          image: product.imageUrl,
                          url: productUrl,
                        });

                        await ChatService.sendMessage(
                          selectedConversation._id,
                          productMessage,
                        );
                        setMessages((prev) => [
                          ...prev,
                          {
                            _id: Date.now().toString(),
                            conversationId: "",
                            senderId: account.accountID,
                            receiverId: selectedConversation._id,
                            type: "text",
                            text: productMessage,
                            createdAt: new Date().toISOString(),
                          },
                        ]);
                        setIsDealMode(false);
                      } catch (error) {
                        console.error("Error sending discount product message:", error);
                      }
                    }}
                  />
                ) : (
                  <ChatInput
                    value={newMessage}
                    sending={sendingMessage}
                    errorMessage={chatError}
                    selectedFiles={selectedFiles}
                    extraActions={
                      canCreateDeal && selectedConversation ? (
                        <button
                          type="button"
                          onClick={() => setIsDealMode(true)}
                          className="inline-flex h-[52px] items-center gap-1.5 rounded-xl border-2 border-primary/30 bg-primary/8 px-3.5 text-xs font-semibold text-primary transition hover:bg-primary/14"
                        >
                          <IconPercentage className="h-4 w-4" />
                          Deal
                        </button>
                      ) : null
                    }
                    onChange={(value) => {
                      setNewMessage(value);
                      setChatError(null);
                      if (selectedConversation) {
                        setDraftByConversation((prev) => ({
                          ...prev,
                          [selectedConversation._id]: value,
                        }));
                      }
                    }}
                    onFilesChange={(files) => {
                      setSelectedFiles((prev) => [...prev, ...files].slice(0, 5));
                      setChatError(null);
                    }}
                    onRemoveFile={(index) => {
                      setSelectedFiles((prev) =>
                        prev.filter((_, idx) => idx !== index),
                      );
                      setChatError(null);
                    }}
                    onClearFiles={() => {
                      setSelectedFiles([]);
                      setChatError(null);
                    }}
                    onSubmit={handleSendMessage}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
