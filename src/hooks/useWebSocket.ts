import { useEffect, useState, useCallback } from "react";
import { websocketService, WebSocketMessage } from "@/services/websocket.service";

export function useWebSocket(userId: string | null | undefined) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Connect to WebSocket
    websocketService.connect(userId);

    // Subscribe to messages
    const unsubscribe = websocketService.subscribe((message) => {
      setLastMessage(message);
    });

    // Check connection status periodically
    const interval = setInterval(() => {
      setIsConnected(websocketService.isConnected());
    }, 1000);

    return () => {
      clearInterval(interval);
      unsubscribe();
      websocketService.disconnect();
    };
  }, [userId]);

  const sendMessage = useCallback((message: unknown) => {
    websocketService.send(message);
  }, []);

  return {
    isConnected,
    lastMessage,
    sendMessage,
  };
}
