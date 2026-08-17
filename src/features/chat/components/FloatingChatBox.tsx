"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  IconMessageCircle,
  IconLoader2,
  IconPercentage,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/features/auth/hooks/useUser";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ChatService } from "@/services/chat.service";
import { SellerService } from "@/services/seller.service";
import type { Message, Conversation } from "@/types/chat";
import { useNotificationStore } from "@/store/useNotificationStore";
import { ChatHeader } from "./ChatHeader";
import { ChatConversationList } from "./ChatConversationList";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { AIProductAssistantPanel } from "./AIProductAssistantPanel";
import SellerDiscountInline from "./SellerDiscountInline";
import {
  buildProductMessage,
  buildOrderMessage,
} from "../utils/productMessage";

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
  const { lastMessage, isConnected } = useWebSocket(account?.accountID);
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const { data: productLimit } = useQuery({
    queryKey: ["seller", "product-limit"],
    queryFn: () => SellerService.getProductLimit(),
    enabled: !!account,
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
      const { userId, userName, userAvatar, product, order } =
        customEvent.detail;
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

      // Safety: ignore messages not addressed to / sent by current user
      // (prevents cross-user leakage if socket routing misbehaves)
      const isRelevant = newMsg.senderId === myId || newMsg.receiverId === myId;
      if (!isRelevant) return;

      const otherPartyId =
        newMsg.senderId === myId ? newMsg.receiverId : newMsg.senderId;
      const isCurrentThread =
        !!selectedConversation?._id &&
        selectedConversation._id === otherPartyId;

      if (isCurrentThread) {
        setMessages((prev) => [...prev, newMsg]);
      }

      const isConversationOpen =
        isOpen &&
        selectedConversation?._id &&
        selectedConversation._id === newMsg.senderId;

      if (!isConversationOpen && newMsg.senderId !== account?.accountID) {
        addNotification({
          type: "chat",
          title: newMsg.senderName
            ? `Tin nhắn mới từ ${newMsg.senderName}`
            : "Bạn có tin nhắn mới",
          message: newMsg.text || "Bạn nhận được một tin nhắn mới",
          link: "/chat",
          dedupeKey: `chat:${newMsg._id}`,
          metadata: {
            conversationId: newMsg.conversationId,
            senderId: newMsg.senderId,
            senderName: newMsg.senderName,
            senderAvatar: newMsg.senderAvatar,
          },
        });
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === newMsg.senderId || conv._id === newMsg.receiverId
            ? { ...conv, lastMessage: newMsg.text || "" }
            : conv,
        ),
      );
    }
  }, [
    account?.accountID,
    addNotification,
    isOpen,
    lastMessage,
    selectedConversation?._id,
  ]);

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
          className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-luxury-ink text-luxury-ivory shadow-[0_10px_28px_color-mix(in_srgb,var(--luxury-ink)_28%,transparent)] transition-all duration-300 hover:bg-charcoal-800"
          aria-label="Open chat"
        >
          <IconMessageCircle className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-semibold tabular-nums text-white">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {isOpen && (
        <div
          className={
            "fixed bottom-6 right-6 z-50 flex h-[min(680px,calc(100vh-3rem))] w-[min(420px,calc(100vw-3rem))] flex-col overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white shadow-[0_24px_64px_color-mix(in_srgb,var(--luxury-ink)_22%,transparent)]"
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
            <div className="flex shrink-0 items-center justify-center gap-2 border-b border-luxury-champagne/30 bg-cream-100/80 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
              <IconLoader2 className="h-3 w-3 animate-spin" />
              <span>Đang kết nối lại...</span>
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            {isAIChatOpen ? (
              <AIProductAssistantPanel
                onBackToConversations={handleBackToList}
              />
            ) : !selectedConversation ? (
              <div className="h-full overflow-y-auto">
                <div className="border-b border-luxury-ink/8 bg-cream-50/60 p-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAIChatOpen(true);
                      setIsDealMode(false);
                      setSelectedConversation(null);
                    }}
                    className="group w-full rounded-[2px] border border-luxury-ink/12 bg-white px-4 py-3.5 text-left transition-all duration-300 hover:border-luxury-ink/35"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-luxury-champagne">
                      Trợ lý AI tìm sản phẩm
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                      Mô tả nhu cầu để AI gợi ý sản phẩm phù hợp ngay trong
                      chat.
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
                  className="flex-1 space-y-3 overflow-y-auto bg-luxury-ivory/40 px-4 py-5"
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
                      product: {
                        _id: string;
                        name: string;
                        imageUrl?: string;
                        slug?: string;
                      };
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
                        console.error(
                          "Error sending discount product message:",
                          error,
                        );
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
                          className="inline-flex h-11 items-center gap-1.5 rounded-[2px] border border-luxury-ink/15 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-luxury-ink transition-all duration-300 hover:border-luxury-ink hover:bg-luxury-ink hover:text-luxury-ivory"
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
                      setSelectedFiles((prev) =>
                        [...prev, ...files].slice(0, 5),
                      );
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
