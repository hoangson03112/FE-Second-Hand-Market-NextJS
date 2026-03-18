export interface Media {
  type: "image" | "video" | "audio" | "document";
  url: string;
  publicId?: string;
  name?: string;
  size?: number;
  thumbnail?: string;
  duration?: number;
  width?: number;
  height?: number;
}

export interface Reaction {
  userId: string;
  emoji: string;
  createdAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId?: string;
  type: "text" | "image" | "video" | "product" | "order" | "system";
  text?: string | null;
  productId?: string;
  orderId?: string;
  media?: Media[];
  
  // Status
  isRead?: boolean;
  readAt?: string;
  deliveredAt?: string;
  
  // Edit & Delete
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  isEdited?: boolean;
  editedAt?: string;
  
  // Reply
  replyTo?: string | Message;
  
  // Reactions
  reactions?: Reaction[];
  
  // Metadata
  metadata?: Record<string, unknown>;
  
  // Timestamps
  createdAt: string;
  updatedAt?: string;
  
  // Populated fields
  senderName?: string;
  senderAvatar?: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  order?: {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
  };
}

export interface Conversation {
  _id: string;
  conversationId?: string;
  participants: string[];
  avatar?: string | { url?: string | null } | null;
  name: string;
  lastMessage?: string;
  lastMessageType?: string;
  lastMessageSenderId?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  unread?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatAPIResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ConversationsResponse extends ChatAPIResponse {
  data: Conversation[];
}

export interface MessagesResponse extends ChatAPIResponse {
  data: Message[];
  pagination?: {
    page: number;
    limit: number;
    totalMessages: number;
    hasMore: boolean;
  };
  conversationId?: string;
  partner?: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export interface SendMessageRequest {
  receiverId: string;
  text?: string;
  type?: "text" | "image" | "video" | "product" | "order";
  productId?: string;
  orderId?: string;
  media?: Media[];
}

export interface SendMessageResponse extends ChatAPIResponse {
  data: Message;
}

export interface UploadChatMediaResponse extends ChatAPIResponse {
  data: Media[];
}
