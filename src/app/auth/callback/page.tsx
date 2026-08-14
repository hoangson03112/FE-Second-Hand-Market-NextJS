import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE } from "@/lib/session";
import GoogleCallbackClient from "./GoogleCallbackClient";

/**
 * Kiểm tra cookie phiên phải làm ở server: cookie là httpOnly nên client không
 * đọc được. Không có cookie ⇒ backend không cấp được phiên (trình duyệt chặn
 * cookie, sai COOKIE_DOMAIN...) ⇒ quay lại đăng nhập kèm thông báo rõ ràng
 * thay vì để người dùng kẹt ở màn hình loading.
 */
export default async function GoogleCallbackPage() {
  const hasSession = (await cookies()).has(SESSION_COOKIE);

  if (!hasSession) {
    redirect("/login?error=google_failed");
  }

  return <GoogleCallbackClient />;
}
