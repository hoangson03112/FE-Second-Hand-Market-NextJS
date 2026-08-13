/**
 * Cờ phiên đăng nhập phía client.
 *
 * accessToken/refreshToken là cookie httpOnly nên JavaScript không đọc được.
 * Backend set kèm cookie `eco_session=1` (KHÔNG httpOnly, không chứa bí mật)
 * mỗi khi cấp phiên, và xoá nó khi thu hồi phiên. FE chỉ ĐỌC cờ này để:
 *
 *   1. biết có nên gọi /auth/me hay không (khách vãng lai: 0 request),
 *   2. cho middleware chặn sớm route riêng tư.
 *
 * Đây thuần tuý là gợi ý UX. Mọi quyền truy cập thật do accessToken quyết định
 * ở phía server — sửa cờ này trong DevTools không mở được dữ liệu nào.
 */
export const SESSION_HINT_COOKIE = "eco_session";

/** Sự kiện trong CÙNG tab (BroadcastChannel không tự gửi lại cho nơi phát). */
export const SESSION_CHANGED_EVENT = "eco:session-changed";

/** Kênh đồng bộ giữa CÁC tab đang mở. */
export const SESSION_CHANNEL = "eco:session";

export type SessionSignal = "signed-in" | "signed-out";

export function hasSessionHint(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((cookie) => cookie.trim() === `${SESSION_HINT_COOKIE}=1`);
}

/**
 * Xoá cờ ở phía client.
 *
 * Bình thường backend đã xoá cờ trong response (logout, refresh thất bại).
 * Gọi thêm ở client để UI phản ứng tức thì, và để phòng trường hợp request
 * hỏng giữa chừng khiến cờ còn sót — nếu không, middleware sẽ tưởng vẫn còn
 * phiên và chặn người dùng quay lại trang đăng nhập.
 */
export function clearSessionHint(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_HINT_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Báo trạng thái phiên vừa đổi: cho chính tab này (CustomEvent) và cho các tab
 * khác (BroadcastChannel). Nhờ vậy đăng xuất ở một tab thì mọi tab cùng thoát,
 * đăng nhập ở một tab thì mọi tab cùng nhận ra.
 */
export function announceSession(signal: SessionSignal): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<SessionSignal>(SESSION_CHANGED_EVENT, { detail: signal }),
  );

  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel(SESSION_CHANNEL);
    channel.postMessage(signal);
    channel.close();
  }
}

/**
 * Phiên đã mất (refresh thất bại, tài khoản bị khoá).
 *
 * Cố ý KHÔNG điều hướng ở đây — ép `window.location` từ trong interceptor chính
 * là thứ tạo ra vòng lặp redirect với middleware. Route guard tự xử lý dựa trên
 * `useUser()`.
 */
export function notifySessionLost(): void {
  if (typeof window === "undefined") return;
  clearSessionHint();
  announceSession("signed-out");
}
