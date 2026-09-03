"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-client";
import { announceSession } from "@/lib/session";


const POST_LOGIN_REDIRECT_KEY = "eco:post-login-redirect";

function safeRedirect(target: string | null): string {
  if (!target || !target.startsWith("/") || target.startsWith("//")) return "/";
  return target;
}


export default function GoogleCallbackClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const stored = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
    sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);

    queryClient.invalidateQueries({ queryKey: queryKeys.users.current() });
    announceSession("signed-in");

    router.replace(safeRedirect(stored));
    router.refresh();
  }, [router, queryClient]);

  return (
    <div className="flex min-h-[60svh] flex-col items-center justify-center gap-4 bg-luxury-ivory">
      <div className="h-10 w-10 animate-spin rounded-full border border-luxury-ink/15 border-t-luxury-ink" />
      <p className="text-2xs font-medium uppercase tracking-[0.15em] text-neutral-500">
        Đang hoàn tất đăng nhập
      </p>
    </div>
  );
}
