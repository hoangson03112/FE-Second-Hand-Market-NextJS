"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { queryKeys } from "@/lib/query-client";
import { SessionContext } from "@/components/providers/SessionContext";
import {
  SESSION_CHANGED_EVENT,
  SESSION_CHANNEL,
  type SessionSignal,
} from "@/lib/session";

export default function Providers({
  children,
  hasSession: initialHasSession,
}: {
  children: React.ReactNode;
  hasSession: boolean;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const [hasSession, setHasSession] = useState(initialHasSession);

  // router.refresh() sau khi đăng nhập/đăng xuất khiến server layout đọc lại
  // cookie và đẩy giá trị mới xuống đây.
  useEffect(() => setHasSession(initialHasSession), [initialHasSession]);

  useEffect(() => {
    const apply = (signal: SessionSignal) => {
      setHasSession(signal === "signed-in");

      if (signal === "signed-out") {
        // Về trạng thái khách ngay: header, guard, giỏ hàng cùng cập nhật.
        queryClient.setQueryData(queryKeys.users.current(), null);
        queryClient.removeQueries({ queryKey: queryKeys.cart.all });
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.current() });
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      }
    };

    const onLocal = (event: Event) =>
      apply((event as CustomEvent<SessionSignal>).detail);

    window.addEventListener(SESSION_CHANGED_EVENT, onLocal);

    // Đồng bộ giữa các tab: đăng xuất ở tab này thì tab kia cũng thoát.
    const channel =
      "BroadcastChannel" in window ? new BroadcastChannel(SESSION_CHANNEL) : null;
    if (channel) {
      channel.onmessage = (event: MessageEvent<SessionSignal>) =>
        apply(event.data);
    }

    return () => {
      window.removeEventListener(SESSION_CHANGED_EVENT, onLocal);
      channel?.close();
    };
  }, [queryClient]);

  return (
    <SessionContext.Provider value={hasSession}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionContext.Provider>
  );
}
