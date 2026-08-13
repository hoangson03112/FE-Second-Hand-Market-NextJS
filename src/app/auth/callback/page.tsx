"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-client";
import { announceSession, hasSessionHint } from "@/lib/session";

/** Nơi cất đích đến trước khi rời sang Google. Khớp với useLogin. */
const POST_LOGIN_REDIRECT_KEY = "eco:post-login-redirect";

function safeRedirect(target: string | null): string {
  if (!target || !target.startsWith("/") || target.startsWith("//")) return "/";
  return target;
}

/**
 * Điểm hạ cánh sau khi đăng nhập Google.
 *
 * Backend đã set cookie phiên trước khi redirect tới đây, nên trang này không
 * nhận và không lưu token nào trên URL — chỉ nạp lại user rồi đưa người dùng
 * về đúng chỗ họ đang dở.
 */
function GoogleCallback() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const stored = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
    sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);

    if (!hasSessionHint()) {
      // Không có cookie phiên ⇒ backend không cấp được (bị chặn cookie, sai
      // cấu hình domain...). Quay lại trang đăng nhập kèm thông báo rõ ràng.
      router.replace("/login?error=google_failed");
      return;
    }

    queryClient.invalidateQueries({ queryKey: queryKeys.users.current() });
    announceSession("signed-in");

    router.replace(safeRedirect(stored));
    router.refresh();
  }, [router, queryClient]);

  return (
    <div className="flex min-h-[60svh] flex-col items-center justify-center gap-4 bg-luxury-ivory">
      <div className="h-10 w-10 animate-spin rounded-full border border-luxury-ink/15 border-t-luxury-ink" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
        Đang hoàn tất đăng nhập
      </p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60svh] items-center justify-center bg-luxury-ivory">
          <div className="h-10 w-10 animate-spin rounded-full border border-luxury-ink/15 border-t-luxury-ink" />
        </div>
      }
    >
      <GoogleCallback />
    </Suspense>
  );
}
