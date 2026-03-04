import axiosClient from "@/lib/axios";
import type {
  ConversationsResponse,
  MessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
  UploadChatMediaResponse,
} from "@/types/chat";

export interface FindOrCreateWithProductResponse {
  success: boolean;
  data: { conversationId: string };
  partner: { _id: string; name: string; avatar: string | null };
}

export const ChatService = {
  findOrCreateWithProduct: async (
    productId: string,
    sellerId: string
  ): Promise<FindOrCreateWithProductResponse> => {
    return axiosClient.post("/chat/conversations/findOrCreateWithProduct", {
      productId,
      sellerId,
    });
  },

  getConversations: async (): Promise<ConversationsResponse> => {
    return axiosClient.get("/chat/conversations");
  },

  getMessages: async (partnerId: string): Promise<MessagesResponse> => {
    return axiosClient.get(`/chat/optimized/messages/${partnerId}`);
  },

  sendMessage: async (
    receiverId: string,
    text: string,
    options?: Partial<SendMessageRequest>
  ): Promise<SendMessageResponse> => {
    return axiosClient.post("/chat/optimized/send", {
      receiverId,
      text,
      type: options?.type || "text",
      ...options,
    });
  },

  uploadMedia: async (files: File[]): Promise<UploadChatMediaResponse> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("media", file));

    return axiosClient.post("/chat/upload", formData);
  },

  markAsRead: async (conversationId: string) => {
    return axiosClient.post(`/chat/conversations/${conversationId}/mark-read`);
  },

  deleteMessage: async (messageId: string) => {
    return axiosClient.delete(`/chat/messages/${messageId}`);
  },
};
