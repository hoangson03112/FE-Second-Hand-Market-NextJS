"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { IconMessageCircle, IconLoader2 } from "@tabler/icons-react";
import { useUser } from "@/hooks/useUser";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ChatService } from "@/services/chat.service";
import type { Message, Conversation } from "@/types/chat";
import { useNotificationStore } from "@/store/useNotificationStore";
import { ChatHeader } from "./ChatHeader";
import { ChatConversationList } from "./ChatConversationList";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { buildProductMessage } from "../utils/productMessage";

interface ProductInfo {
  _id: string;
  name: string;
  price: number;
  image?: string;
  slug?: string;
}

interface OpenChatEventDetail {
  userId: string;
  userName: string;
  userAvatar?: string;
  product?: ProductInfo;
}

export default function FloatingChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const { data: account } = useUser();
  const { lastMessage, isConnected } = useWebSocket(account?.accountID);
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

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
    ) => {
      const conversation: Conversation = {
        _id: userId,
        name: userName,
        avatar: userAvatar,
        participants: [userId],
      };

      setIsOpen(true);
      setIsMinimized(false);
      setSelectedConversation(conversation);
      await loadMessages(userId);

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
    [account, loadMessages],
  );

  useEffect(() => {
    const handleOpenChat = (event: Event) => {
      const customEvent = event as CustomEvent<OpenChatEventDetail>;
      const { userId, userName, userAvatar, product } = customEvent.detail;
      openChatWith(userId, userName, userAvatar, product);
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
      setMessages((prev) => [...prev, newMsg]);

      const isConversationOpen =
        isOpen &&
        !isMinimized &&
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
    isMinimized,
    isOpen,
    lastMessage,
    selectedConversation?._id,
  ]);

  useEffect(() => {
    if (!isOpen || isMinimized || !selectedConversation || loading) return;
    if (!shouldAutoScrollRef.current) return;

    const frame = requestAnimationFrame(() => {
      const container = messageListRef.current;
      if (!container) return;
      container.scrollTop = container.scrollHeight;
    });

    return () => cancelAnimationFrame(frame);
  }, [messages, isOpen, isMinimized, loading, selectedConversation]);

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
    setSelectedConversation(conversation);
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
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleBackToList = () => {
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
          className="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-white rounded-full p-6 shadow-lg hover:shadow-xl transition-all z-50 group hover:scale-110"
          aria-label="Open chat"
        >
          <IconMessageCircle className="w-8 h-8" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-sm rounded-full min-w-[28px] h-7 px-2 flex items-center justify-center font-bold shadow-md">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 w-[600px] bg-white rounded-3xl shadow-2xl flex flex-col z-50 border-2 border-primary/20 transition-all duration-300 ${
            isMinimized ? "h-16" : "h-[720px]"
          }`}
        >
          <ChatHeader
            selectedConversation={selectedConversation}
            isConnected={isConnected}
            isMinimized={isMinimized}
            onBack={handleBackToList}
            onToggleMinimize={() => setIsMinimized((prev) => !prev)}
            onClose={() => {
              setIsOpen(false);
              setIsMinimized(false);
              setSelectedConversation(null);
            }}
          />

          {!isConnected && !isMinimized && (
            <div className="bg-yellow-50 text-yellow-800 text-sm px-5 py-2.5 text-center border-b border-yellow-200 flex items-center justify-center gap-2">
              <IconLoader2 className="w-4 h-4 animate-spin" />
              <span>Đang kết nối lại...</span>
            </div>
          )}

          {!isMinimized && (
            <div className="flex-1 overflow-hidden">
              {!selectedConversation ? (
                <div className="h-full overflow-y-auto">
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

                  <ChatInput
                    value={newMessage}
                    sending={sendingMessage}
                    selectedFiles={selectedFiles}
                    onChange={setNewMessage}
                    onFilesChange={(files) => {
                      setSelectedFiles((prev) =>
                        [...prev, ...files].slice(0, 5),
                      );
                    }}
                    onRemoveFile={(index) => {
                      setSelectedFiles((prev) =>
                        prev.filter((_, idx) => idx !== index),
                      );
                    }}
                    onClearFiles={() => setSelectedFiles([])}
                    onSubmit={handleSendMessage}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
