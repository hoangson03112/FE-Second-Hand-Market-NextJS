import axiosClient from "@/lib/axios";

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

  getConversations: async () => {
    return axiosClient.get("/chat/conversations");
  },

  getMessages: async (partnerId: string) => {
    return axiosClient.get(`/chat/optimized/messages/${partnerId}`);
  },

  sendMessage: async (receiverId: string, text: string) => {
    return axiosClient.post("/chat/optimized/send", { receiverId, text });
  },
};
