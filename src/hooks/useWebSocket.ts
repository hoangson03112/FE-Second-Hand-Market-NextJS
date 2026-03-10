import { useEffect, useState, useCallback } from "react";
import { websocketService, WebSocketMessage } from "@/services/websocket.service";

export function useWebSocket(userId: string | null | undefined) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  useEffect(() => {
    if (!userId) {
      // userId became null → user logged out → disconnect socket
      websocketService.disconnect();
      return;
    }

    // Connect (no-op if already connected)
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
      // Do NOT disconnect here — other components share the same singleton socket.
      // The socket is only disconnected when userId becomes null (logout).
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
