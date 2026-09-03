import { useEffect, useState, useCallback } from "react";
import { websocketService, WebSocketMessage } from "@/services/websocket.service";

export function useWebSocket(userId: string | null | undefined) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  useEffect(() => {
    if (!userId) {

      websocketService.disconnect();
      return;
    }


    websocketService.connect(userId);


    const unsubscribe = websocketService.subscribe((message) => {
      setLastMessage(message);
    });


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
