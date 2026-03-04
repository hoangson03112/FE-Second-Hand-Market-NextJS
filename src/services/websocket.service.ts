import { logger } from "@/infrastructure/monitoring/logger";
import { io, Socket } from "socket.io-client";

export interface WebSocketMessage {
  type: string;
  userId?: string;
  data?: unknown;
  timestamp?: string;
}

export type MessageHandler = (message: WebSocketMessage) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private messageHandlers: Set<MessageHandler> = new Set();
  private userId: string | null = null;
  private isConnecting = false;

  private resolveSocketUrl() {
    const explicitUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (explicitUrl) return explicitUrl;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000/eco-market";
    try {
      return new URL(apiUrl).origin;
    } catch {
      return apiUrl.replace(/\/eco-market\/?$/, "");
    }
  }

  connect(userId: string) {
    if (this.isConnecting || (this.socket && this.socket.connected)) {
      return;
    }

    this.isConnecting = true;
    this.userId = userId;

    const socketUrl = this.resolveSocketUrl();
    
    try {
      this.socket = io(socketUrl, {
        transports: ["websocket", "polling"],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
      });

      this.socket.on("connect", () => {
        this.isConnecting = false;
        this.socket?.emit("join-room", userId);
        logger.info("Socket connected", { userId });
      });

      this.socket.on("receive-message", (data: unknown) => {
        const message: WebSocketMessage = {
          type: "chat:message",
          userId,
          data,
          timestamp: new Date().toISOString(),
        };
        this.messageHandlers.forEach((handler) => handler(message));
      });

      this.socket.on("message-error", (error: unknown) => {
        logger.error("Socket message error", new Error(String(error)));
      });

      this.socket.on("connect_error", (error: Error) => {
        logger.error("Socket connection error", error);
      });

      this.socket.on("disconnect", () => {
        this.isConnecting = false;
        this.socket = null;
        logger.info("Socket disconnected");
      });
    } catch (error) {
      this.isConnecting = false;
      logger.error("Failed to create socket connection", error as Error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.isConnecting = false;
  }

  send(message: unknown) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("send-message", message);
    } else {
      logger.warn("Socket not connected, cannot send message");
    }
  }

  subscribe(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  isConnected(): boolean {
    return this.socket !== null && this.socket.connected;
  }
}

export const websocketService = new WebSocketService();
